import { StateCreator } from 'zustand';
import {
    ResourcesState,
    HapioBookingState,
    Dependencies,
    BasicData,
} from '../types';

export const createResourcesSlice =
    (
        dependencies: Dependencies
    ): StateCreator<HapioBookingState, [], [], ResourcesState> =>
    (set, get) => ({
        resources: [],
        resourcesLoading: false,
        resourcesError: null,
        selectedResource: null,
        singleResource: false,

        fetchResources: async () => {
            set({ resourcesLoading: true, resourcesError: null });
            try {
                const selectedService = get().selectedService;

                if (selectedService) {
                    const serviceData = await dependencies.getData<any[]>(
                        `/services/${selectedService.id}/resources`
                    );

                    const connectedResources = await Promise.all(
                        serviceData.map(
                            async (item: { resource_id: string }) => {
                                const resourceDetail =
                                    await dependencies.getData<any>(
                                        `/resources/${item.resource_id}`
                                    );
                                return resourceDetail;
                            }
                        )
                    );

                    set({
                        resources: connectedResources,
                        resourcesLoading: false,
                    });
                } else {
                    const data = await dependencies.getData<{
                        data: BasicData[];
                    }>('/resources');
                    const resources = data.data;

                    // If there is only one resource, select it by default
                    if (resources.length === 1) {
                        set({
                            singleResource: true,
                            selectedResource: resources[0],
                        });
                    }

                    set({
                        resources: resources,
                        resourcesLoading: false,
                    });
                }
            } catch (error: any) {
                console.error('Failed to fetch resources:', error);
                set({
                    resourcesLoading: false,
                    resourcesError:
                        error.message || 'Failed to fetch resources',
                });
            }
        },

        setSelectedResource: (resource) => set({ selectedResource: resource }),
    });
