import { StateCreator } from 'zustand';
import {
    ServicesState,
    HapioBookingState,
    Dependencies,
    BasicData,
} from '../types';

export const createServicesSlice =
    (
        dependencies: Dependencies
    ): StateCreator<HapioBookingState, [], [], ServicesState> =>
    (set) => ({
        services: [],
        servicesLoading: false,
        servicesError: null,
        selectedService: null,
        singleService: false,

        fetchServices: async () => {
            set({ servicesLoading: true, servicesError: null });
            try {
                const data = await dependencies.getData<{ data: BasicData[] }>(
                    '/services'
                );
                const services = data.data;

                // If there is only one service, select it by default
                if (services.length === 1) {
                    set({
                        singleService: true,
                        selectedService: services[0],
                    });
                }

                set({
                    services: services,
                    servicesLoading: false,
                });
            } catch (error: any) {
                console.error('Failed to fetch services:', error);
                set({
                    servicesLoading: false,
                    servicesError: error.message || 'Failed to fetch services',
                });
            }
        },

        setSelectedService: (service) => set({ selectedService: service }),
    });
