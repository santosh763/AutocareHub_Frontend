import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import adminService from '../../api/adminService';
import { StatusBadge, SkeletonRow } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/Card';
import { SERVICE_CATALOG } from '../../types';
import type { Booking, BookingStatus } from '../../types';

const STATUS_OPTIONS: BookingStatus[] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending:     'Pending',
  confirmed:   'Confirmed',
  in_progress: 'In Progress',
  completed:   'Completed',
  cancelled:   'Cancelled',
};

const FILTER_OPTIONS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All',         value: 'all' },
  { label: 'Pending',     value: 'pending' },
  { label: 'Confirmed',   value: 'confirmed' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',  value: 'completed' },
  { label: 'Cancelled',  value: 'cancelled' },
];

const AdminDashboard: React.FC = () => {
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<BookingStatus | 'all'>('all');
  const [search, setSearch]       = useState('');
  const [updating, setUpdating]   = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleStatusUpdate = async (id: string, status: BookingStatus) => {
    // Optimistic update
    setBookings((prev) => prev.map((b) => String(b.id) === id ? { ...b, status } : b));
    setUpdating(id);
    try {
      await adminService.updateBookingStatus(id, status);
      toast.success(`Status updated to ${STATUS_LABELS[status]}`);
    } catch {
      // Rollback on failure
      toast.error('Failed to update status');
      fetchAll();
    } finally {
      setUpdating(null);
    }
  };

  const handleBookingDelete = async (id: string) => {
    setUpdating(id);
    try {
      await adminService.deleteBooking(id);
      toast.success('Booking deleted successfully');
      setBookings((prev) => prev.filter((b) => String(b.id) !== id));
    } catch {
      toast.error('Failed to delete booking');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = bookings
  ?.filter((b) => filter === 'all' || b.status === filter)
  .filter((b) => {
    if (!search) return true;

    const q = search.toLowerCase();

    return (
      b.brand?.toLowerCase().includes(q) ||
      b.model?.toLowerCase().includes(q) ||
      b.registration_number?.toLowerCase().includes(q) ||
      b.service_type?.toLowerCase().includes(q) ||
      b.user_name?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total:     bookings?.length,
    pending:   bookings?.filter((b) => b.status === 'pending').length,
    active:    bookings?.filter((b) => ['confirmed', 'in_progress'].includes(b.status)).length,
    completed: bookings?.filter((b) => b.status === 'completed').length,
    revenue:   bookings?.filter((b) => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.price ?? 0), 0),
  };

  const getServiceInfo = (key: string) => SERVICE_CATALOG.find((s) => s.key === key);
  console.log('Bookings:', bookings);
  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-400 to-brand-200 flex items-center justify-center text-white text-xs">🛡</div>
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Admin Panel</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-zinc-50">All Bookings</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{bookings?.length} total bookings across all users</p>
        </div>
        <button
          onClick={fetchAll}
          className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-400 dark:text-zinc-500"
          title="Refresh"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Bookings" value={stats?.total}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
        />
        <StatCard label="Pending" value={stats.pending} color="text-amber-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>}
        />
        <StatCard label="Active" value={stats.active} color="text-blue-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>}
        />
        <StatCard label="Completed" value={stats.completed} color="text-green-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
        />
        <StatCard label="Revenue" value={`₹${(stats.revenue / 1000).toFixed(1)}K`} color="text-brand-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" /></svg>}
        />
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filter === f.value
                  ? 'bg-brand-400 text-white border-brand-400'
                  : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:border-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto">
          <input
            type="text"
            placeholder="Search vehicle, service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-card overflow-hidden">
        {/* Desktop table */}
        {/* Desktop table */}
<div className="hidden md:block overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
      <tr>
        {[
          'Booking',
          'Vehicle',
          'Service',
          'Date',
          'Amount',
          'Payment',
          'Status',
        ].map((h) => (
          <th
            key={h}
            className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
      {loading ? (
        [1, 2, 3, 4, 5].map((i) => (
          <tr key={i}>
            <td colSpan={7} className="px-5">
              <SkeletonRow />
            </td>
          </tr>
        ))
      ) : filtered?.length === 0 ? (
        <tr>
          <td
            colSpan={7}
            className="text-center py-12 text-gray-400 dark:text-zinc-500"
          >
            No bookings found
          </td>
        </tr>
      ) : (
        filtered.map((booking) => {
          const svc = getServiceInfo(booking.service_type);

          return (
            <motion.tr
              key={booking.id}
              layout
              className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {/* Booking ID */}
              <td className="px-5 py-4">
                <span className="text-xs font-mono text-gray-400 dark:text-zinc-500">
                  #{String(booking.id).padStart(4, '0')}
                </span>
              </td>

              {/* Vehicle */}
              <td className="px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                    {booking.brand} {booking.model}
                  </p>

                  <p className="text-xs font-mono text-gray-400 dark:text-zinc-500">
                    {booking.registration_number}
                  </p>
                </div>
              </td>

              {/* Service */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">{svc?.icon ?? '🔧'}</span>

                  <span className="text-sm text-gray-700 dark:text-zinc-200">
                    {svc?.label ?? booking.service_type}
                  </span>
                </div>
              </td>

              {/* Date */}
              <td className="px-5 py-4 text-sm text-gray-600 dark:text-zinc-300">
                {new Date(booking.service_date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}

                <br />

                <span className="text-xs text-gray-400 dark:text-zinc-500">
                  {booking.service_time}
                </span>
              </td>

              {/* Amount */}
              <td className="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-zinc-200">
                ₹
                {booking.price?.toLocaleString() ??
                  svc?.price?.toLocaleString() ??
                  '0'}
              </td>

              {/* Payment */}
              <td className="px-5 py-4">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    booking.paymentStatus === 'paid'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : booking.paymentStatus === 'failed'
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}
                >
                  {booking.paymentStatus ?? 'pending'}
                </span>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <StatusBadge status={booking.status} />

                  <select
                    value={booking.status}
                    onChange={(e) => {
                      if (e.target.value === 'delete') {
                        if (window.confirm('Are you sure you want to permanently delete this booking?')) {
                           handleBookingDelete(String(booking.id));
                        }
                        return;
                      }
                      handleStatusUpdate(
                        String(booking.id),
                        e.target.value as BookingStatus
                      )
                    }}
                    disabled={updating === String(booking.id)}
                    className="text-xs border border-gray-200 dark:border-zinc-700 rounded-lg px-2 py-1 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand-200 disabled:opacity-50 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                    <option value="delete" className="text-red-500 font-bold">🗑 Delete (Permanent)</option>
                  </select>

                  {updating === String(booking.id) && (
                    <svg
                      className="animate-spin h-3 w-3 text-brand-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}
                </div>
              </td>
            </motion.tr>
          );
        })
      )}
    </tbody>
  </table>
</div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100 dark:divide-zinc-800">
          {loading ? (
            [1, 2, 3].map((i) => <div key={i} className="px-4"><SkeletonRow /></div>)
          ) : filtered.map((booking) => {
            const svc     = getServiceInfo(booking.service_type);
            return (
              <div key={booking.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{svc?.icon ?? '🔧'}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{svc?.label ?? booking.service_type}</p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500">{booking.brand} {booking.model}</p>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">₹{booking.price?.toLocaleString()}</span>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(String(booking.id), e.target.value as BookingStatus)}
                    disabled={updating === String(booking.id)}
                    className="text-xs border border-gray-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer count */}
        {!loading && (
          <div className="px-5 py-3 bg-gray-50 dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700">
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Showing {filtered.length} of {bookings?.length} bookings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
