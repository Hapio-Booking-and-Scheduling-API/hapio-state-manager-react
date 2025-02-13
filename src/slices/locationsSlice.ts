import { StateCreator } from 'zustand';
import {
    LocationsState,
    HapioBookingState,
    Dependencies,
    BasicData,
} from '../types';

export const createLocationsSlice =
    (
        dependencies: Dependencies
    ): StateCreator<HapioBookingState, [], [], LocationsState> =>
    (set) => ({
        locations: [],
        locationsLoading: false,
        locationsError: null,
        selectedLocation: null,
        singleLocation: false,

        fetchLocations: async () => {
            set({ locationsLoading: true, locationsError: null });
            try {
                const data = await dependencies.getData<{ data: BasicData[] }>(
                    '/locations'
                );
                const locations = data.data;

                // If there is only one location, select it by default
                if (locations.length === 1) {
                    set({
                        singleLocation: true,
                        selectedLocation: locations[0],
                    });
                }

                set({
                    locations: locations,
                    locationsLoading: false,
                });
            } catch (error: any) {
                console.error('Failed to fetch locations:', error);
                set({
                    locationsLoading: false,
                    locationsError:
                        error.message || 'Failed to fetch locations',
                });
            }
        },

        setSelectedLocation: (location) => set({ selectedLocation: location }),
    });
