import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive, Image, Trash2, Heart, Share2, Lock, TrendingUp, Clock, Zap } from 'lucide-react';

const StatsScreen: React.FC = () => {
  const stats = {
    storage: {
      total: '128 GB',
      used: '89.2 GB',
      photos: '45.6 GB',
      available: '38.8 GB',
      percentage: 70,
    },
    photos: {
      total: 12847,
      cleaned: 3421,
      deleted: 1205,
      shared: 892,
      private: 324,
    },
    usage: {
      sessionsThisWeek: 12,
      lastSession: '2 hours ago',
      avgSessionTime: '8 min',
      totalTimeSaved: '4.2 hours',
    },
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }: any) => (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 font-medium">{title}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-600 mt-1">Your photo management insights</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Storage Overview */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Storage</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <HardDrive className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Storage Usage</h3>
                  <p className="text-sm text-gray-600">{stats.storage.used} of {stats.storage.total} used</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.storage.percentage}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.storage.percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Photos</p>
                <p className="font-semibold text-gray-900">{stats.storage.photos}</p>
              </div>
              <div>
                <p className="text-gray-600">Available</p>
                <p className="font-semibold text-green-600">{stats.storage.available}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Stats */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Photo Management</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Image}
              title="Total Photos"
              value={stats.photos.total.toLocaleString()}
              color="blue"
            />
            <StatCard
              icon={Zap}
              title="Photos Cleaned"
              value={stats.photos.cleaned.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={Trash2}
              title="Photos Deleted"
              value={stats.photos.deleted.toLocaleString()}
              color="red"
            />
            <StatCard
              icon={Heart}
              title="Photos Kept"
              value={(stats.photos.cleaned - stats.photos.deleted).toLocaleString()}
              color="pink"
            />
          </div>
        </section>

        {/* Actions Breakdown */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Taken</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Shared</span>
                </div>
                <span className="font-bold text-gray-900">{stats.photos.shared}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Made Private</span>
                </div>
                <span className="font-bold text-gray-900">{stats.photos.private}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Stats */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">App Usage</h2>
          <div className="grid grid-cols-1 gap-4">
            <StatCard
              icon={TrendingUp}
              title="Sessions This Week"
              value={stats.usage.sessionsThisWeek}
              subtitle="Keep up the great work!"
              color="green"
            />
            <StatCard
              icon={Clock}
              title="Time Saved"
              value={stats.usage.totalTimeSaved}
              subtitle="By using CleanSlate efficiently"
              color="blue"
            />
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Session</p>
                <p className="font-semibold text-gray-900">{stats.usage.lastSession}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Session</p>
                <p className="font-semibold text-gray-900">{stats.usage.avgSessionTime}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatsScreen;