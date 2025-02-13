import { StateCreator } from 'zustand';
import { formatISO, startOfDay, endOfDay } from 'date-fns';
import {
    TimeslotsState,
    HapioBookingState,
    Dependencies,
    Timeslot,
} from '../types';

export const createTimeslotsSlice =
    (
        dependencies: Dependencies
    ): StateCreator<HapioBookingState, [], [], TimeslotsState> =>
    (set, get) => ({
        timeslots: [],
        timeslotsLoading: false,
        timeslotsError: null,
        selectedTimeSlot: null,

        fetchTimeslots: async () => {
            const {
                selectedService,
                selectedLocation,
                selectedResource,
                selectedDate,
            } = get();

            if (
                selectedService &&
                selectedLocation &&
                selectedResource &&
                selectedDate
            ) {
                set({ timeslotsLoading: true, timeslotsError: null });

                const fromDate = startOfDay(new Date(selectedDate));
                const toDate = endOfDay(new Date(selectedDate));

                const encodedFromDate = encodeURIComponent(formatISO(fromDate));
                const encodedToDate = encodeURIComponent(formatISO(toDate));

                try {
                    const data = await dependencies.getData<{
                        data: Timeslot[];
                    }>(
                        `/services/${selectedService.id}/bookable-slots?from=${encodedFromDate}&to=${encodedToDate}&location=${selectedLocation.id}&resource=${selectedResource.id}`
                    );

                    const parsedTimeslots: Timeslot[] = data.data.map(
                        (ts: Timeslot) => ({
                            starts_at: ts.starts_at || null,
                            ends_at: ts.ends_at || null,
                        })
                    );

                    set({
                        timeslots: parsedTimeslots,
                        timeslotsLoading: false,
                    });
                } catch (error: any) {
                    console.error('Failed to fetch timeslots:', error);
                    set({
                        timeslots: [],
                        timeslotsLoading: false,
                        timeslotsError:
                            error.message || 'Failed to fetch timeslots',
                    });
                }
            } else {
                set({
                    timeslots: [],
                    timeslotsLoading: false,
                    timeslotsError: null,
                });
            }
        },

        setSelectedTimeSlot: (timeslot) => set({ selectedTimeSlot: timeslot }),
    });
