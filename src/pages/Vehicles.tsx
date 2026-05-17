import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useVehicles } from '../hooks/useVehicles';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { SkeletonCard } from '../components/ui/Badge';
import type { Vehicle, VehicleType } from '../types';
import { VEHICLE_TYPE_CONFIG } from '../types';

const emptyForm = (): { brand: string; model: string; year: number; registration_number: string; vehicle_type: VehicleType } => ({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  registration_number: '',
  vehicle_type: 'car',
});

const Vehicles: React.FC = () => {
  const {
    vehicles,
    loading,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicles();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<Vehicle | null>(null);

  const [form, setForm] = useState(emptyForm());

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditTarget(vehicle);

    setForm({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      registration_number: vehicle.registration_number,
      vehicle_type: vehicle.vehicle_type || 'car',
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSave = async () => {
    if (
      !form.brand ||
      !form.model ||
      !form.registration_number
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);

    try {
      if (editTarget) {
        await updateVehicle(editTarget.id, form);

        toast.success('Vehicle updated successfully');
      } else {
        await addVehicle(form);

        toast.success('Vehicle added successfully');
      }

      closeModal();
    } catch (error) {
      toast.error('Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVehicle(id);

      toast.success('Vehicle deleted successfully');

      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete vehicle');
    }
  };
  console.log("vehicles",vehicles)
  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-zinc-50">
            My Vehicles
          </h1>

          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            {vehicles?.length} vehicle
            {vehicles?.length !== 1 ? 's' : ''} registered
          </p>
        </div>

        <Button onClick={openAdd}>
          Add Vehicle
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : vehicles?.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
          <div className="text-5xl mb-4">🚗</div>

          <h2 className="font-semibold text-lg text-gray-700 dark:text-zinc-200 mb-2">
            No vehicles added yet
          </h2>

          <p className="text-gray-400 dark:text-zinc-500 text-sm mb-6">
            Add your vehicles to start booking services
          </p>

          <Button onClick={openAdd}>
            Add Your First Vehicle
          </Button>
        </div>
      ) : (
        /* Vehicle Cards */
        <div className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {vehicles?.map((vehicle) => (
              <motion.div
                key={vehicle?.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-card hover:shadow-card-hover transition-all overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-400/10 flex items-center justify-center text-3xl flex-shrink-0">
                      {VEHICLE_TYPE_CONFIG[vehicle.vehicle_type]?.icon ?? '🚗'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-zinc-100">
                        {vehicle?.brand} {vehicle?.model}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-zinc-400">
                        {vehicle?.year}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 px-3 py-2 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mb-0.5">
                      Registration Number
                    </p>

                    <p className="font-mono font-medium text-sm text-gray-900 dark:text-zinc-100 tracking-widest">
                      {vehicle?.registration_number}
                    </p>
                  </div>
                </div>

                <div className="flex border-t border-gray-100 dark:border-zinc-800">
                  <button
                    onClick={() => openEdit(vehicle)}
                    className="flex-1 py-3 text-xs font-medium text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-400/10 transition-colors"
                  >
                    Edit
                  </button>

                  <div className="w-px bg-gray-100 dark:bg-zinc-800" />

                  <button
                    onClick={() => setDeleteModal(Number(vehicle?.id))}
                    className="flex-1 py-3 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Vehicle' : 'Add Vehicle'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>

            <Button onClick={handleSave} loading={saving}>
              {editTarget ? 'Save Changes' : 'Add Vehicle'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2 mb-2">
            {(Object.keys(VEHICLE_TYPE_CONFIG) as VehicleType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, vehicle_type: type })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  form.vehicle_type === type
                    ? 'border-brand-400 bg-brand-50 dark:bg-brand-400/10 text-brand-400'
                    : 'border-gray-100 dark:border-zinc-800 text-gray-400'
                }`}
              >
                <span className="text-xl mb-1">{VEHICLE_TYPE_CONFIG[type].icon}</span>
                <span className="text-[10px] font-semibold uppercase">{VEHICLE_TYPE_CONFIG[type].label}</span>
              </button>
            ))}
          </div>

          <Input
            label="Brand *"
            placeholder="Royal Enfield"
            value={form.brand}
            onChange={(e) =>
              setForm({
                ...form,
                brand: e.target.value,
              })
            }
          />

          <Input
            label="Model *"
            placeholder="Meteor 350"
            value={form.model}
            onChange={(e) =>
              setForm({
                ...form,
                model: e.target.value,
              })
            }
          />

          <Input
            label="Year *"
            type="number"
            value={form.year}
            onChange={(e) =>
              setForm({
                ...form,
                year: parseInt(e.target.value),
              })
            }
          />

          <Input
            label="Registration Number *"
            placeholder="OR34J8868"
            value={form.registration_number}
            onChange={(e) =>
              setForm({
                ...form,
                registration_number:
                  e.target.value.toUpperCase(),
              })
            }
            className="font-mono tracking-wider"
          />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Vehicle"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal(null)}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={() =>
                deleteModal && handleDelete(deleteModal)
              }
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600 dark:text-zinc-300">
          Are you sure you want to delete this vehicle?
        </p>
      </Modal>
    </div>
  );
};

export default Vehicles;