import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import paymentService from '../api/paymentService';

import { useAppSelector } from '../hooks/useAppDispatch';

import { Button } from '../components/ui/Button';

import { SERVICE_CATALOG } from '../types';

import type { Booking } from '../types';

const PAY_METHODS = [
  {
    id: 'upi',
    label: 'UPI',
    sub: 'GPay, PhonePe, Paytm, BHIM',
    icon: '💳',
  },
  {
    id: 'netbank',
    label: 'Net Banking',
    sub: 'All major banks supported',
    icon: '🏦',
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    sub: 'Visa, Mastercard, RuPay',
    icon: '💳',
  },
  {
    id: 'cod',
    label: 'Pay at Service',
    sub: 'Pay cash after job done',
    icon: '💵',
  },
];

const TAX_RATE = 0.18;
const PLATFORM_FEE = 49;

const Payment: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();

  // Booking from router state
  const bookingFromState = location.state?.booking as
    | Booking
    | undefined;

  // Booking from redux fallback
  const currentBooking = useAppSelector(
    (s) => s.bookings.currentBooking
  );

  // Final booking object
  const booking: any =
    bookingFromState || currentBooking;
    console.log('Booking details:', booking); // Debug log

  const [method, setMethod] = useState('upi');

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [upiId, setUpiId] = useState('');

  // No booking
  if (!booking) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">⚠️</div>

        <p className="text-gray-500 dark:text-zinc-400 mb-4">
          No booking data found.
        </p>

        <Button onClick={() => navigate('/book')}>
          Go Back
        </Button>
      </div>
    );
  }

  // Backend + frontend compatibility
  const serviceType =
    booking.serviceType || booking.service_type;

  const scheduledDate =
    booking.scheduledDate || booking.service_date;

  const scheduledSlot =
    booking.scheduledSlot || booking.service_time;

  const paymentStatus =
    booking.paymentStatus || booking.payment_status;

  // Service
  const service = SERVICE_CATALOG.find(
    (s) => s.key === serviceType
  );

  // Pricing
  const basePrice =
    booking.price ?? booking.amount ?? service?.price ?? 0;

  const tax = Math.round(basePrice * TAX_RATE);

  const total = basePrice + PLATFORM_FEE + tax;

  // Vehicle
  const vehicle =
    booking.vehicleId ||
    (booking.brand
      ? {
          brand: booking.brand,
          model: booking.model,
          registration_number:
            booking.registration_number,
        }
      : null);

  // Payment handler
  const handlePay = async () => {
    setLoading(true);

    try {
      // Create order
      const order = await paymentService.createOrder({
        bookingId: booking.id,
        amount: total,
      });

      // COD
      if (method === 'cod') {
        await paymentService.verifyPayment({
          bookingId: booking.id,
          orderId: order.orderId,
          paymentId: 'COD',
          signature: 'COD',
        });

        setSuccess(true);

        return;
      }

      // Simulated payment
      await new Promise((r) => setTimeout(r, 1500));

      await paymentService.verifyPayment({
        bookingId: booking.id,
        orderId: order.orderId,
        paymentId: `pay_${Date.now()}`,
        signature: 'simulated_sig',
      });

      setSuccess(true);
    } catch {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="p-5 sm:p-8 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-4xl mx-auto mb-6">
            ✅
          </div>

          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-zinc-50 mb-2">
            Booking Confirmed!
          </h1>

          <p className="text-gray-500 dark:text-zinc-400 mb-2">
            Your service has been scheduled successfully.
          </p>

          <p className="text-sm font-mono text-brand-400 bg-brand-50 dark:bg-brand-400/10 px-4 py-2 rounded-xl inline-block mb-8">
            Booking #
            {String(booking.id)
              .slice(-8)
              .toUpperCase()}
          </p>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 mb-8 text-left w-full">
            {[
              {
                l: 'Service',
                v: service?.label ?? serviceType,
              },
              {
                l: 'Date',
                v: scheduledDate
                  ? new Date(
                      scheduledDate
                    ).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })
                  : 'No Date',
              },
              {
                l: 'Time',
                v: scheduledSlot,
              },
              {
                l: 'Amount Paid',
                v: `₹${total.toLocaleString()}`,
              },
              {
                l: 'Payment',
                v:
                  method === 'cod'
                    ? 'Pay at Service'
                    : 'Online',
              },
            ].map((row) => (
              <div
                key={row.l}
                className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0"
              >
                <span className="text-sm text-gray-500 dark:text-zinc-400">
                  {row.l}
                </span>

                <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                  {row.v}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/bookings')}
            >
              View Bookings
            </Button>

            <Button
              fullWidth
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-zinc-50 mb-1">
          Complete Payment
        </h1>

        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Secure checkout powered by Razorpay
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left */}
        <div className="lg:col-span-3 space-y-3">
          <h2 className="font-semibold text-sm text-gray-700 dark:text-zinc-300 mb-3">
            Select Payment Method
          </h2>

          {PAY_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                method === m.id
                  ? 'border-brand-300 bg-brand-50 dark:bg-brand-400/10 dark:border-brand-400/40'
                  : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-600'
              }`}
            >
              <span className="text-2xl">
                {m.icon}
              </span>

              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900 dark:text-zinc-100">
                  {m.label}
                </p>

                <p className="text-xs text-gray-400 dark:text-zinc-500">
                  {m.sub}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-card overflow-hidden sticky top-6">
            <div className="px-5 py-4 bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-zinc-100">
                Order Summary
              </h3>
            </div>

            <div className="p-5 space-y-3">
              {/* Vehicle */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-400/10 flex items-center justify-center text-xl">
                  🚗
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                    {vehicle
                      ? `${vehicle.brand} ${vehicle.model}`
                      : 'Your Vehicle'}
                  </p>

                  <p className="text-xs font-mono text-gray-400 dark:text-zinc-500">
                    {vehicle?.registration_number}
                  </p>
                </div>
              </div>

              {[
                {
                  l: 'Service',
                  v: service?.label ?? serviceType,
                },
                {
                  l: 'Date',
                  v: scheduledDate
                    ? new Date(
                        scheduledDate
                      ).toLocaleDateString('en-IN')
                    : 'No Date',
                },
                {
                  l: 'Time',
                  v: scheduledSlot,
                },
              ].map((row) => (
                <div
                  key={row.l}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-500 dark:text-zinc-400">
                    {row.l}
                  </span>

                  <span className="text-gray-900 dark:text-zinc-100">
                    {row.v}
                  </span>
                </div>
              ))}

              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 space-y-2">
                {[
                  {
                    l: 'Service fee',
                    v: `₹${basePrice.toLocaleString()}`,
                  },
                  {
                    l: 'Platform fee',
                    v: `₹${PLATFORM_FEE}`,
                  },
                  {
                    l: 'GST (18%)',
                    v: `₹${tax.toLocaleString()}`,
                  },
                ].map((row) => (
                  <div
                    key={row.l}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-500 dark:text-zinc-400">
                      {row.l}
                    </span>

                    <span className="text-gray-700 dark:text-zinc-300">
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-zinc-700 pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                  Total
                </span>

                <span className="text-xl font-bold text-brand-400">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <Button
                fullWidth
                size="lg"
                loading={loading}
                onClick={handlePay}
                className="mt-2"
              >
                {method === 'cod'
                  ? '✓ Confirm Booking'
                  : `Pay ₹${total.toLocaleString()}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;