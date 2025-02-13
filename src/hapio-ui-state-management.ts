import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createServicesSlice } from './slices/servicesSlice';
import { createLocationsSlice } from './slices/locationsSlice';
import { createResourcesSlice } from './slices/resourcesSlice';
import { createDateSlice } from './slices/dateSlice';
import { createTimeslotsSlice } from './slices/timeslotsSlice';
import { createBookingSlice } from './slices/bookingSlice';
import { getData, postData } from './helpers/Api';
import { Dependencies, HapioBookingState, FullConfig } from './types';
import merge from 'lodash.merge';

const dependencies: Dependencies = { getData, postData };

const useHapioBookingStore = create<HapioBookingState>()(
    devtools(
        persist(
            (set, get, store) => {
                return {
                    ...createServicesSlice(dependencies)(set, get, store),
                    ...createLocationsSlice(dependencies)(set, get, store),
                    ...createResourcesSlice(dependencies)(set, get, store),
                    ...createDateSlice(dependencies)(set, get, store),
                    ...createTimeslotsSlice(dependencies)(set, get, store),
                    ...createBookingSlice(dependencies)(set, get, store),
                    timestamp: Date.now(),
                    bookingCompleteTimestamp: null,
                    config: {} as FullConfig,
                    setConfig: (customConfig: Partial<FullConfig>) => {
                        set((state) => {
                            const mergedConfig = merge(
                                {},
                                state.config,
                                customConfig
                            );
                            return { config: mergedConfig };
                        });
                    },
                    resetStepData: (stepName: string) => {
                        set((_state) => {
                            switch (stepName) {
                                case 'location':
                                    return { selectedLocation: null };
                                case 'service':
                                    return { selectedService: null };
                                case 'resource':
                                    return { selectedResource: null };
                                case 'calendar':
                                    return { selectedDate: null };
                                case 'timeSlot':
                                    return { selectedTimeSlot: null };
                                case 'metaDataForm':
                                    return { bookingResult: null };
                                default:
                                    return {};
                            }
                        });
                    },
                };
            },
            {
                name: 'hapio-storage',
                partialize: (state: HapioBookingState) => {
                    const { hapioApiToken, ...restConfig } = state.config;
                    return {
                        selectedService: state.selectedService,
                        selectedLocation: state.selectedLocation,
                        selectedResource: state.selectedResource,
                        selectedDate: state.selectedDate,
                        selectedTimeSlot: state.selectedTimeSlot,
                        bookingResult: state.bookingResult,
                        timestamp: state.timestamp,
                        bookingCompleteTimestamp:
                            state.bookingCompleteTimestamp,
                        config: restConfig,
                    };
                },
                merge: (
                    persistedState: unknown,
                    currentState: HapioBookingState
                ): HapioBookingState => {
                    const state = persistedState as Partial<HapioBookingState>;
                    const currentTime = Date.now();

                    const baseConfig: FullConfig = {} as FullConfig;
                    const persistedConfig = state.config || {};
                    const customConfig = merge({}, baseConfig, persistedConfig);

                    const defaultStoreExpireTime =
                        customConfig.settings.storeExpireTime;
                    const defaultAfterBookingExpireTime =
                        customConfig.settings.afterBookingExipreTime;

                    // Clear booking state if booking is older than expireTime
                    if (
                        state?.timestamp &&
                        defaultStoreExpireTime &&
                        currentTime - state.timestamp > defaultStoreExpireTime
                    ) {
                        return {
                            ...currentState,
                            selectedService: null,
                            selectedLocation: null,
                            selectedResource: null,
                            selectedDate: null,
                            selectedTimeSlot: null,
                            bookingResult: null,
                            bookingCompleteTimestamp: null,
                            timestamp: currentTime,
                        };
                    }

                    // Clear booking state if booking is older than afterBookingExpireTime
                    if (
                        state?.bookingCompleteTimestamp &&
                        defaultAfterBookingExpireTime &&
                        currentTime - state.bookingCompleteTimestamp >
                            defaultAfterBookingExpireTime
                    ) {
                        return {
                            ...currentState,
                            selectedService: null,
                            selectedLocation: null,
                            selectedResource: null,
                            selectedDate: null,
                            selectedTimeSlot: null,
                            bookingResult: null,
                            bookingCompleteTimestamp: null,
                            timestamp: currentTime,
                        };
                    }

                    // Merge persisted config with current default config so that customizations persist
                    const mergedConfig = state.config
                        ? merge({}, currentState.config, state.config)
                        : currentState.config;

                    return {
                        ...currentState,
                        ...state,
                        config: mergedConfig,
                    };
                },
            }
        ),
        {
            name: 'hapio-booking-store',
        }
    )
);

export { useHapioBookingStore };
