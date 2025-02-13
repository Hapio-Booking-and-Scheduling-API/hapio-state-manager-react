import { StateCreator } from 'zustand';
import {
    BookingState,
    HapioBookingState,
    Dependencies,
    BookingResult,
    BookingData,
} from '../types';

export const createBookingSlice =
    (
        dependencies: Dependencies
    ): StateCreator<HapioBookingState, [], [], BookingState> =>
    (set) => ({
        bookingResult: null,
        bookingCompleteTimestamp: null,

        makeBooking: async (bookingData: BookingData) => {
            set({ bookingResult: null });
            try {
                const result = await dependencies.postData<BookingResult>(
                    '/bookings',
                    bookingData
                );
                set({
                    bookingResult: result,
                    bookingCompleteTimestamp: Date.now(),
                });
            } catch (error: any) {
                console.error('Booking failed:', error);
                set({
                    bookingResult: {
                        success: false,
                        error:
                            error.message ||
                            'Booking failed due to an unknown error.',
                    },
                });
            }
        },
    });
