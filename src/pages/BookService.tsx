import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { useVehicles } from '../hooks/useVehicles';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { createBookingThunk } from '../store/slices/bookingsSlice';

import { Button } from '../components/ui/Button';

import { SERVICE_CATALOG } from '../types';

import type {
  ServiceType,
  CreateBookingPayload,
} from '../types';

const STEPS = [
  'Vehicle',
  'Service',
  'Date & Time',
  'Summary',
];

interface BookingDraft {
  vehicleId: string | number;
  serviceType: ServiceType | null;
  date: string;
  slot: string;
  notes: string;
}

const TIME_SLOTS = [
  '10-11',
  '11-12',
  '12-1',
  '2-4',
  '4-6',
];

const TIME_SLOT_DISPLAY_MAP: Record<string, string> = {
  '10-11': '10:00 AM – 11:00 AM',
  '11-12': '11:00 AM – 12:00 PM',
  '12-1': '12:00 PM – 1:00 PM',
  '2-4': '2:00 PM – 4:00 PM',
  '4-6': '4:00 PM – 6:00 PM',
};

const BookService: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    vehicles,
    fetchVehicles,
    loading: vLoad,
  } = useVehicles();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState<BookingDraft>({
    vehicleId: '',
    serviceType: null,
    date: '',
    slot: '',
    notes: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (vehicles.length > 0 && !draft.vehicleId) {
      setDraft((d) => ({
        ...d,
        vehicleId: vehicles[0].id,
      }));
    }
  }, [vehicles]);

  const selectedVehicle = vehicles.find(
    (v) => v.id === draft.vehicleId
  );

  const selectedService = SERVICE_CATALOG.find(
    (s) => s.key === draft.serviceType
  );

  const canProceed = [
    !!draft.vehicleId,
    !!draft.serviceType,
    !!draft.date && !!draft.slot,
    true,
  ][step];

  const handleConfirm = async () => {
    if (
      !draft.vehicleId ||
      !draft.serviceType ||
      !draft.date ||
      !draft.slot
    ) {
      toast.error('Please complete all steps');
      return;
    }

    setSaving(true);

    try {
      const payload: CreateBookingPayload = {
        vehicleId: draft.vehicleId,
        serviceDate: draft.date,
        serviceType: draft.serviceType,
        serviceTime: draft.slot,
        amount: selectedService?.price ?? 0,
        notes: draft.notes,
      };

      console.log('Booking Payload Sent:', payload);

      const result = await dispatch(
        createBookingThunk(payload)
      );

      console.log('Redux Result:', result);

      if (createBookingThunk.fulfilled.match(result)) {
        const bookingData = result.payload;

        console.log(
          'Booking Payload Received:',
          bookingData
        );

        if (!bookingData) {
          toast.error('Booking data missing');
          return;
        }

        toast.success(
          'Booking created! Proceeding to payment…'
        );

        navigate('/payment', {
          state: {
            booking: bookingData,
          },
        });
      } else {
        toast.error('Booking failed');
      }
    } catch (error) {
      console.error(error);

      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const minDate = new Date();

  minDate.setDate(minDate.getDate() + 1);

  const minDateStr = minDate
    .toISOString()
    .split('T')[0];

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-zinc-50 mb-1">
          Book a Service
        </h1>

        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Complete the steps below to schedule your
          service
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-card overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {/* STEP 0 */}
            {step === 0 && (
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-zinc-100 mb-4">
                  Select your vehicle
                </h2>

                {vLoad ? (
                  <p className="text-sm text-gray-400">
                    Loading vehicles…
                  </p>
                ) : vehicles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-zinc-400 text-sm mb-4">
                      No vehicles found. Add one first.
                    </p>

                    <Button
                      onClick={() =>
                        navigate('/vehicles')
                      }
                    >
                      Add Vehicle
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {vehicles.map((v) => (
                      <label
                        key={v.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          draft.vehicleId === v.id
                            ? 'border-brand-300 bg-brand-50 dark:bg-brand-400/10 dark:border-brand-400/40'
                            : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="vehicle"
                          checked={
                            draft.vehicleId === v.id
                          }
                          onChange={() =>
                            setDraft({
                              ...draft,
                              vehicleId: v.id,
                            })
                          }
                        />

                        <div>
                          <p className="font-medium text-sm">
                            {v.brand} {v.model} (
                            {v.year})
                          </p>

                          <p className="text-xs">
                            {v.registration_number}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h2 className="font-semibold mb-4">
                  Choose a service
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  {SERVICE_CATALOG.map((svc) => (
                    <button
                      key={svc.key}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          serviceType: svc.key,
                        })
                      }
                      className={`text-left p-4 rounded-xl border ${
                        draft.serviceType === svc.key
                          ? 'border-brand-300 bg-brand-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {svc.icon}
                      </div>

                      <div className="font-medium text-sm">
                        {svc.label}
                      </div>

                      <div className="text-sm text-brand-400">
                        ₹
                        {svc.price.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h2 className="font-semibold mb-4">
                  Pick Date & Time
                </h2>

                <input
                  type="date"
                  min={minDateStr}
                  value={draft.date}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      date: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3 mb-4"
                />

                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          slot,
                        })
                      }
                      className={`p-3 rounded-xl border ${
                        draft.slot === slot
                          ? 'border-brand-300 bg-brand-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {TIME_SLOT_DISPLAY_MAP[slot]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 &&
              selectedVehicle &&
              selectedService && (
                <div>
                  <h2 className="font-semibold mb-4">
                    Booking Summary
                  </h2>

                  <div className="space-y-3">
                    <div>
                      Vehicle:{' '}
                      {selectedVehicle.brand}{' '}
                      {selectedVehicle.model}
                    </div>

                    <div>
                      Service:{' '}
                      {selectedService.label}
                    </div>

                    <div>Date: {draft.date}</div>

                    <div>
                      Time:{' '}
                      {
                        TIME_SLOT_DISPLAY_MAP[
                          draft.slot
                        ]
                      }
                    </div>

                    <div>
                      Amount: ₹
                      {selectedService.price}
                    </div>
                  </div>
                </div>
              )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 px-6 pb-6">
          {step > 0 && (
            <Button
              variant="secondary"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              ← Back
            </Button>
          )}

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="flex-1"
            >
              Next →
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              loading={saving}
              disabled={!canProceed}
              className="flex-1"
            >
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookService;