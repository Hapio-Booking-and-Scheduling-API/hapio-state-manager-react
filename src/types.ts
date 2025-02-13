export interface BasicData {
    id: string;
    name: string;
}

export interface Timeslot {
    starts_at: string | null;
    ends_at: string | null;
}

export interface Metadata {
    [key: string]: string;
}

export interface BookingData {
    resource_id: string;
    service_id: string;
    location_id: string;
    metadata: Metadata;
    starts_at: string;
    ends_at: string;
}

export interface BookingResult {
    success: boolean;
    error?: string;
    data?: any;
    finalized_at?: string;
}

export interface Dependencies {
    getData: <T>(endpoint: string) => Promise<T>;
    postData: <T>(endpoint: string, data: any) => Promise<T>;
}

// Slice State Interfaces
export interface ServicesState {
    services: BasicData[];
    servicesLoading: boolean;
    servicesError: string | null;
    selectedService: BasicData | null;
    singleService: boolean;
    fetchServices: () => Promise<void>;
    setSelectedService: (service: BasicData | null) => void;
}

export interface LocationsState {
    locations: BasicData[];
    locationsLoading: boolean;
    locationsError: string | null;
    selectedLocation: BasicData | null;
    singleLocation: boolean;
    fetchLocations: () => Promise<void>;
    setSelectedLocation: (location: BasicData | null) => void;
}

export interface ResourcesState {
    resources: BasicData[];
    resourcesLoading: boolean;
    resourcesError: string | null;
    selectedResource: BasicData | null;
    singleResource: boolean;
    fetchResources: () => Promise<void>;
    setSelectedResource: (resource: BasicData | null) => void;
}

export interface DateState {
    selectedDate: Date | string | null;
    availableDates: Timeslot[];
    fetchDates: (currentMonth?: Date) => Promise<void>;
    setSelectedDate: (date: Date | null) => void;
}

export interface TimeslotsState {
    timeslots: Timeslot[];
    timeslotsLoading: boolean;
    timeslotsError: string | null;
    selectedTimeSlot: Timeslot | null;
    fetchTimeslots: () => Promise<void>;
    setSelectedTimeSlot: (timeslot: Timeslot | null) => void;
}

export interface BookingState {
    bookingResult: BookingResult | null;
    makeBooking: (bookingData: BookingData) => Promise<void>;
}

// Combined HapioBookingState Interface
export interface HapioBookingState
    extends ServicesState,
        LocationsState,
        ResourcesState,
        DateState,
        TimeslotsState,
        BookingState {
    timestamp: number | null;
    bookingCompleteTimestamp: number | null;
    resetStepData: (stepName: string) => void;
    config: FullConfig;
    setConfig: (config: FullConfig) => void;
}

// Configuration Types
export interface MetaDataField {
    required: boolean;
    type: string;
    size: string;
    label: string;
    placeholder: string;
}

export type MetaDataFields = {
    [key: string]: MetaDataField;
};

export interface Settings {
    locale?: string;
    storeExpireTime?: number;
    afterBookingExipreTime?: number;
    metaDataFields: MetaDataFields;
}

export interface Theme {
    palette: {
        primary: string;
        secondary: string;
        title: string;
        data: string;
        text: string;
        input: string;
        confirm: string;
        dark: string;
        light: string;
        disabled: string;
        background: string;
        background2: string;
        error: string;
    };
    fonts: {
        families: {
            primary: string;
            secondary: string;
        };
        sizes: {
            h2: string;
            h3: string;
            h4: string;
            h5: string;
            h6: string;
            body1: string;
            body2: string;
        };
    };
}

export interface Content {
    backButton: string;
    stepText: string;
    locationTitle: string;
    serviceTitle: string;
    resourceTitle: string;
    dateTitle: string;
    timeSlotTitle: string;
    timeSlotErrorTextMissingData: string;
    timeSlotErrorTextNoResults: string;
    metaDataFormTitle: string;
    metaDataLocationLabel: string;
    metaDataServiceLabel: string;
    metaDataResourceLabel: string;
    metaDataDateLabel: string;
    metaDataTimeLabel: string;
    metaDataFieldsLabel: string;
    metaDataSubmitButton: string;
    completedTitle: string;
    completedMessage: string;
}

export interface FullConfig {
    hapioApiToken: string;
    hapioBaseURL?: string;
    settings: Settings;
    theme: Theme;
    content: Content;
}

export type UserConfig = {
    hapioApiToken: string;
};
