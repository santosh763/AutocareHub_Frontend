import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { SERVICE_CATALOG } from '../types';

const stats = [
  { n: '50K+', l: 'Happy Customers' },
  { n: '200+', l: 'Certified Mechanics' },
  { n: '4.9★', l: 'Average Rating' },
  { n: '48hr', l: 'Service Guarantee' },
];

const steps = [
  { n: '1', title: 'Add Your Vehicle', desc: 'Enter make, model and licence plate' },
  { n: '2', title: 'Pick a Service', desc: 'From oil change to full service' },
  { n: '3', title: 'Choose a Slot', desc: 'Flexible time-slots, 7 days a week' },
  { n: '4', title: 'We Come to You', desc: 'Certified mechanic at your doorstep' },
];

const testimonials = [
  { name: 'Rahul S.', city: 'Mumbai', text: 'Booked a full service in under 2 minutes. Mechanic was on time and transparent.', rating: 5 },
  { name: 'Priya K.', city: 'Bangalore', text: 'AC stopped working on a Friday. Fixed by Saturday morning. Outstanding service!', rating: 5 },
  { name: 'Aakash M.', city: 'Delhi', text: 'Finally a car service app that doesn\'t feel like a scam. Fair pricing, great work.', rating: 5 },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-200 flex items-center justify-center text-sm">🔧</div>
            <span className="font-display font-bold text-gray-900 dark:text-zinc-100">AutoCare Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
            <Button size="sm" onClick={() => navigate('/register')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-50 dark:bg-brand-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-100/40 dark:bg-brand-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-400/10 text-brand-400 dark:text-brand-200 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-brand-100 dark:border-brand-400/20">
              <span className="w-1.5 h-1.5 bg-brand-300 rounded-full animate-pulse" />
              Now available in 20+ cities across India
            </div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-gray-900 dark:text-zinc-50 leading-tight mb-6">
              Your car.<br />
              <span className="text-brand-400">Our expertise.</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Book certified vehicle service at your doorstep. No waiting rooms, no surprise bills — just honest, fast service from verified mechanics.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate('/register')} rightIcon={<span>→</span>}>
                Book a Service
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {stats.map((s) => (
              <div key={s.n} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 shadow-card">
                <div className="text-2xl font-bold text-brand-400">{s.n}</div>
                <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-zinc-50 mb-4">Every service, one platform</h2>
            <p className="text-gray-500 dark:text-zinc-400 max-w-xl mx-auto">From routine oil changes to complex repairs — our certified mechanics handle it all.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SERVICE_CATALOG.map((svc, i) => (
              <motion.div
                key={svc.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-5 hover:border-brand-200 dark:hover:border-brand-400/30 hover:shadow-card-hover transition-all cursor-pointer group"
                onClick={() => navigate('/register')}
              >
                <div className="text-3xl mb-3">{svc.icon}</div>
                <div className="font-semibold text-sm text-gray-900 dark:text-zinc-100 mb-1">{svc.label}</div>
                <div className="text-xs text-gray-500 dark:text-zinc-400 mb-3">{svc.description}</div>
                <div className="text-sm font-semibold text-brand-400">From ₹{svc.price.toLocaleString()}</div>
                <div className="text-xs text-gray-400 dark:text-zinc-500">{svc.duration}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-zinc-50 mb-4">How it works</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-400 text-white font-display font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-400/25">
                  {step.n}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-zinc-100 mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-zinc-50 mb-4">What customers say</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-300 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-400/20 flex items-center justify-center text-brand-400 text-sm font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-zinc-100">{t.name}</div>
                    <div className="text-xs text-gray-400 dark:text-zinc-500">{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-brand-400 to-brand-300 rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_60%)]" />
            <h2 className="font-display font-bold text-3xl mb-4 relative">Ready to roll?</h2>
            <p className="text-brand-100 mb-8 relative">Join 50,000+ vehicle owners who trust AutoCare Hub.</p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/register')}
              className="relative"
            >
              Book Your First Service — It's Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-gray-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-400 to-brand-200 flex items-center justify-center text-white text-xs">🔧</div>
            <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">AutoCare Hub</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500">© 2026 AutoCare Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
