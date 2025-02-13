import { StateCreator } from 'zustand';
import { DateState, HapioBookingState, Dependencies, Timeslot } from '../types';
import { startOfDay, endOfDay, endOfMonth, format } from 'date-fns';

export const createDateSlice =
    (
        dependencies: Dependencies
    ): StateCreator<HapioBookingState, [], [], DateState> =>
    (set, get) => ({
        availableDates: [],
        selectedDate: null,

        fetchDates: async (currentMonth?: Date) => {
            set({ resourcesLoading: true, resourcesError: null });
            try {
                const selectedLocation = get().selectedLocation;
                const selectedService = get().selectedService;

                if (!selectedLocation) {
                    throw new Error('No location selected.');
                }

                if (!selectedService) {
                    throw new Error('No service selected.');
                }

                const locationId: string = selectedLocation.id;
                const serviceId: string = selectedService.id;

                const baseDate = currentMonth
                    ? startOfDay(currentMonth)
                    : startOfDay(new Date());

                const from =
                    format(baseDate, "yyyy-MM-dd'T'HH:mm:ss") + '-01:00';

                const toDate = endOfMonth(baseDate);
                const to =
                    format(endOfDay(toDate), "yyyy-MM-dd'T'HH:mm:ss") +
                    '-01:00';

                let page = 1;
                let allDates: Timeslot[] = [];
                let lastPage = 1;

                do {
                    const response = await dependencies.getData<{
                        data: Timeslot[];
                        meta: { last_page: number };
                    }>(
                        `/services/${serviceId}/bookable-slots?from=${from}&to=${to}&location=${locationId}&page=${page}`
                    );

                    allDates.push(...response.data);
                    set((state) => ({
                        availableDates: [
                            ...state.availableDates,
                            ...response.data,
                        ],
                    }));

                    lastPage = response.meta.last_page;
                    page++;
                } while (page <= lastPage);
            } catch (error: any) {
                console.error('Failed to fetch dates:', error);
                set({
                    resourcesLoading: false,
                    resourcesError: error.message || 'Failed to fetch dates',
                });
            }
        },

        setSelectedDate: (date: Date | null) => set({ selectedDate: date }),
    });
