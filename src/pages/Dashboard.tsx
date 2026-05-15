import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useVehicles } from '../hooks/useVehicles';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchBookingsThunk } from '../store/slices/bookingsSlice';
import { StatCard } from '../components/ui/Card';
import { StatusBadge, SkeletonCard, SkeletonRow } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SERVICE_CATALOG } from '../types';

const VEHICLE_ICONS: Record<string, string> = {
  car: '🚗', bike: '🏍️', suv: '🚙', truck: '🚛',
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user }   = useAuth();
  const dispatch   = useAppDispatch();
  const { vehicles, loading: vLoad, fetchVehicles } = useVehicles();
  const { items: bookings, loading: bLoad } = useAppSelector((s) => s.bookings);

  useEffect(() => {
    fetchVehicles();
    dispatch(fetchBookingsThunk());
  }, []);

  const activeBookings    = bookings?.filter((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status)) || [];
  const completedBookings = bookings?.filter((b) => b.status === 'completed') || [];
  const recentBookings    = [...(bookings || [])].slice(0, 5);

  const getServiceLabel = (key: string) => SERVICE_CATALOG.find((s) => s.key === key)?.label ?? key;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-5 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-zinc-50">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button onClick={() => navigate('/book')} size="sm" rightIcon={<span>→</span>}>
          Book Service
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Bookings"
          value={bookings?.length}
          delta={`${bookings?.length} lifetime`}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
        />
        <StatCard
          label="Active"
          value={activeBookings?.length}
          color="text-blue-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>}
        />
        <StatCard
          label="Completed"
          value={completedBookings.length}
          color="text-green-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
        />
        <StatCard
          label="Vehicles"
          value={vehicles?.length}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h-1V5a1 1 0 00-1-1H3zm11 3a1 1 0 00-1 1v1h-1a1 1 0 000 2h1v1a1 1 0 001 1h2l1.5-3L17 8h-3z" /></svg>}
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Vehicles */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="font-semibold text-sm text-gray-900 dark:text-zinc-100">My Vehicles</h2>
              <button onClick={() => navigate('/vehicles')} className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Manage →
              </button>
            </div>
            <div className="p-3 space-y-2">
              {vLoad ? (
                [1, 2]?.map((i) => <SkeletonCard key={i} />)
              ) : vehicles?.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">🚗</div>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mb-3">No vehicles added yet</p>
                  <Button size="sm" onClick={() => navigate('/vehicles')}>Add Vehicle</Button>
                </div>
              ) : (
                vehicles?.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer" onClick={() => navigate('/vehicles')}>
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-400/10 flex items-center justify-center text-xl flex-shrink-0">
                      {VEHICLE_ICONS[v.model] ?? '🚗'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">{v.year} {v.model}</p>
                      <p className="text-xs font-mono text-gray-400 dark:text-zinc-500">{v.registration_number}</p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{v.year}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="font-semibold text-sm text-gray-900 dark:text-zinc-100">Recent Bookings</h2>
              <button onClick={() => navigate('/bookings')} className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
                View All →
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {bLoad ? (
                [1, 2, 3]?.map((i) => <div key={i} className="px-5"><SkeletonRow /></div>)
              ) : recentBookings.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mb-3">No bookings yet</p>
                  <Button size="sm" onClick={() => navigate('/book')}>Book Now</Button>
                </div>
              ) : (
                recentBookings?.map((booking) => (
                  <div key={booking.id}> {/* Ensure each booking has a unique key */}
                    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer" onClick={() => navigate('/bookings')}>
                      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-base flex-shrink-0">
                        {SERVICE_CATALOG.find((s) => s.key === booking.serviceType)?.icon ?? '🔧'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">{getServiceLabel(booking.serviceType)}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">
                          {typeof booking.vehicleId === 'object' ? `${booking.vehicleId.year} ${booking.vehicleId.model}` : ''} · {new Date(booking.scheduledDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <StatusBadge status={booking.status} />
                        <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 mt-1">₹{booking.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Book Service', icon: '🔧', to: '/book', color: 'from-brand-400 to-brand-300' },
          { label: 'Add Vehicle', icon: '🚗', to: '/vehicles', color: 'from-blue-500 to-blue-400' },
          { label: 'Booking History', icon: '📋', to: '/bookings', color: 'from-purple-500 to-purple-400' },
          { label: 'My Profile', icon: '👤', to: '/profile', color: 'from-amber-500 to-amber-400' },
        ].map((a) => (
          <motion.button
            key={a.to}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(a.to)}
            className={`bg-gradient-to-br ${a.color} text-white rounded-2xl p-4 text-left shadow-card hover:shadow-card-hover transition-all`}
          >
            <span className="text-2xl block mb-2">{a.icon}</span>
            <span className="text-sm font-semibold">{a.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
