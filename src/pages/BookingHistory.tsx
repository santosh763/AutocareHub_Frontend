import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchBookingsThunk } from '../store/slices/bookingsSlice';
import { SkeletonRow } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SERVICE_CATALOG } from '../types';
import type { Booking, BookingStatus } from '../types';

const FILTERS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const BookingHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items: bookings, loading } = useAppSelector(
    (s) => s.bookings
  );

  const [filter, setFilter] =
    useState<BookingStatus | 'all'>('all');

  const [expanded, setExpanded] =
    useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBookingsThunk());
  }, [dispatch]);

  const filtered =
    filter === 'all'
      ? bookings || []
      : bookings?.filter((b) => b?.status === filter) || [];

  const getServiceInfo = (key: string) =>
    SERVICE_CATALOG.find((s) => s.key === key);

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-zinc-50 mb-1">
          My Bookings
        </h1>

        <p className="text-sm text-gray-500 dark:text-zinc-400">
          {bookings?.length || 0} total booking
          {bookings?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => {
          const count =
            f.value === 'all'
              ? bookings?.length || 0
              : bookings?.filter((b) => b?.status === f.value)
                  .length || 0;

          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filter === f.value
                  ? 'bg-brand-400 text-white border-brand-400'
                  : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
              }`}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 divide-y divide-gray-100 dark:divide-zinc-800 overflow-hidden shadow-card">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-5">
              <SkeletonRow />
            </div>
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-card text-center py-16">
          <div className="text-4xl mb-3">📋</div>

          <p className="font-semibold text-gray-700 dark:text-zinc-200 mb-1">
            No bookings found
          </p>

          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-5">
            {filter === 'all'
              ? "You haven't made any bookings yet."
              : `No ${filter} bookings.`}
          </p>

          {filter !== 'all' ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilter('all')}
            >
              Clear Filter
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => window.location.assign('/book')}
            >
              Book a Service
            </Button>
          )}
        </div>
      ) : (
        /* Booking List */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-card overflow-hidden divide-y divide-gray-100 dark:divide-zinc-800">
          <AnimatePresence initial={false}>
            {filtered?.map((booking: any) => {
              const svc = getServiceInfo(
                booking?.serviceType || booking?.service_type
              );

              const vehicle =
                booking?.vehicleId || {
                  brand: booking?.brand,
                  model: booking?.model,
                  registration_number:
                    booking?.registration_number,
                };

              const bookingDate =
                booking?.scheduledDate ||
                booking?.service_date;

              const bookingSlot =
                booking?.scheduledSlot ||
                booking?.service_time;

              const paymentStatus =
                booking?.paymentStatus ||
                booking?.payment_status;

              const isOpen =
                expanded === String(booking?.id);

              return (
                <motion.div
                  key={booking?.id}
                  layout
                >
                  {/* Row */}
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left"
                    onClick={() =>
                      setExpanded(
                        isOpen
                          ? null
                          : String(booking?.id)
                      )
                    }
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xl flex-shrink-0">
                      {svc?.icon ?? '🔧'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">
                        {svc?.label ??
                          booking?.serviceType ??
                          booking?.service_type}
                      </p>

                      <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">
                        {vehicle?.brand} {vehicle?.model} ·{' '}
                        {bookingDate
                          ? new Date(
                              bookingDate
                            ).toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )
                          : 'No Date'}
                      </p>
                    </div>
                  </button>

                  {/* Expanded */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-700">
                          <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            {/* Left */}
                            <div className="space-y-2">
                              {[
                                {
                                  l: 'Booking ID',
                                  v: `#${String(
                                    booking.id
                                  )
                                    .slice(-8)
                                    .toUpperCase()}`,
                                },
                                {
                                  l: 'Service',
                                  v:
                                    svc?.label ??
                                    booking.serviceType ??
                                    booking.service_type,
                                },
                                {
                                  l: 'Date',
                                  v: bookingDate
                                    ? new Date(
                                        bookingDate
                                      ).toLocaleDateString(
                                        'en-IN',
                                        {
                                          weekday: 'long',
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                        }
                                      )
                                    : 'No Date',
                                },
                                {
                                  l: 'Time Slot',
                                  v: bookingSlot,
                                },
                              ].map((r) => (
                                <div
                                  key={r.l}
                                  className="flex gap-2 text-sm"
                                >
                                  <span className="text-gray-400 dark:text-zinc-500 w-24 flex-shrink-0">
                                    {r.l}
                                  </span>

                                  <span className="text-gray-700 dark:text-zinc-200 font-medium">
                                    {r.v}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Right */}
                            <div className="space-y-2">
                              {[
                                {
                                  l: 'Vehicle',
                                  v: `${vehicle?.brand} ${vehicle?.model}`,
                                },
                                {
                                  l: 'Plate',
                                  v:
                                    vehicle?.registration_number ??
                                    '—',
                                },
                                {
                                  l: 'Amount',
                                  v: `₹${
                                    booking.price?.toLocaleString() ??
                                    svc?.price ??
                                    0
                                  }`,
                                },
                                {
                                  l: 'Payment',
                                  v:
                                    paymentStatus === 'paid' || paymentStatus === 'success'
                                      ? '✅ Paid'
                                      : '⏳ Pending',
                                },
                              ].map((r) => (
                                <div
                                  key={r.l}
                                  className="flex gap-2 text-sm"
                                >
                                  <span className="text-gray-400 dark:text-zinc-500 w-24 flex-shrink-0">
                                    {r.l}
                                  </span>

                                  <span className="text-gray-700 dark:text-zinc-200 font-medium">
                                    {r.v}
                                  </span>
                                </div>
                              ))}

                              {booking.status === 'pending' && (paymentStatus === 'pending' || paymentStatus === 'failed') && (
                                <Button
                                  size="sm"
                                  className="w-full mt-4"
                                  onClick={() => navigate('/payment', { state: { booking } })}
                                >
                                  Pay Now
                                </Button>
                              )}

                              {booking.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full mt-2 text-red-500 hover:bg-red-50"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                                      try {
                                        await dispatch(fetchBookingsThunk()); // Refresh list
                                        const bookingService = (await import('../api/bookingService')).default;
                                        await bookingService.cancel(String(booking.id));
                                        toast.success('Booking cancelled');
                                        dispatch(fetchBookingsThunk());
                                      } catch (err) {
                                        toast.error('Failed to cancel booking');
                                      }
                                    }
                                  }}
                                >
                                  Cancel Booking
                                </Button>
                              )}
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="mt-3 text-sm text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3">
                              <span className="font-medium text-gray-700 dark:text-zinc-300">
                                Notes:{' '}
                              </span>

                              {booking.notes}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;