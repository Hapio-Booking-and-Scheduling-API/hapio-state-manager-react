import { useHapioBookingStore } from '../hapio-ui-state-management';

export const formatDate = (
    dateString: string,
    options: Intl.DateTimeFormatOptions = {}
): string => {
    const { config } = useHapioBookingStore.getState();
    const locale = config.settings.locale;
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    return new Intl.DateTimeFormat(locale, options).format(date);
};
