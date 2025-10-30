import { StateCreator } from 'zustand';
import { startOfDay, endOfDay } from 'date-fns';
import {
    TimeslotsState,
    HapioBookingState,
    Dependencies,
    Timeslot,
} from '../types';
import { formatDateForAPI, buildApiUrl } from '../helpers/apiDateFormat';

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

                const from = formatDateForAPI(fromDate);
                const to = formatDateForAPI(toDate);

                try {
                    const url = buildApiUrl(
                        `/services/${selectedService.id}/bookable-slots`,
                        {
                            from,
                            to,
                            location: selectedLocation.id,
                            resource: selectedResource.id,
                        }
                    );

                    const data = await dependencies.getData<{
                        data: Timeslot[];
                    }>(url);

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
