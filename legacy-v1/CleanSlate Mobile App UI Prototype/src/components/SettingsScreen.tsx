import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Shield, Bell, HardDrive, Smartphone, Info, ChevronRight, ToggleLeft as Toggle, Palette, Zap, Lock } from 'lucide-react';

const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoDelete, setAutoDelete] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    action, 
    color = 'gray' 
  }: any) => (
    <motion.div
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </motion.div>
  );

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <motion.button
      onClick={onChange}
      className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full shadow-sm"
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Customize your CleanSlate experience</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Appearance */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
          <div className="space-y-3">
            <SettingItem
              icon={darkMode ? Moon : Sun}
              title="Dark Mode"
              subtitle="Switch between light and dark themes"
              color="purple"
              action={<Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            />
            <SettingItem
              icon={Palette}
              title="Theme Color"
              subtitle="Customize accent colors"
              color="pink"
              action={<ChevronRight className="w-5 h-5 text-gray-400" />}
            />
          </div>
        </section>

        {/* Behavior */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Behavior</h2>
          <div className="space-y-3">
            <SettingItem
              icon={Zap}
              title="Auto-Delete"
              subtitle="Automatically delete photos after 30 days"
              color="red"
              action={<Toggle enabled={autoDelete} onChange={() => setAutoDelete(!autoDelete)} />}
            />
            <SettingItem
              icon={Smartphone}
              title="Haptic Feedback"
              subtitle="Feel vibrations when swiping"
              color="blue"
              action={<Toggle enabled={hapticFeedback} onChange={() => setHapticFeedback(!hapticFeedback)} />}
            />
            <SettingItem
              icon={Bell}
              title="Notifications"
              subtitle="Get reminders to clean your photos"
              color="green"
              action={<Toggle enabled={notifications} onChange={() => setNotifications(!notifications)} />}
            />
          </div>
        </section>

        {/* Privacy & Security */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h2>
          <div className="space-y-3">
            <SettingItem
              icon={Lock}
              title="Private Storage"
              subtitle="Manage your private photo vault"
              color="purple"
              action={<ChevronRight className="w-5 h-5 text-gray-400" />}
            />
            <SettingItem
              icon={Shield}
              title="App Lock"
              subtitle="Require Face ID to open app"
              color="blue"
              action={<ChevronRight className="w-5 h-5 text-gray-400" />}
            />
          </div>
        </section>

        {/* Storage */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage</h2>
          <div className="space-y-3">
            <SettingItem
              icon={HardDrive}
              title="Storage Management"
              subtitle="View and manage app storage"
              color="orange"
              action={<ChevronRight className="w-5 h-5 text-gray-400" />}
            />
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
          <div className="space-y-3">
            <SettingItem
              icon={Info}
              title="About CleanSlate"
              subtitle="Version 1.0.0"
              color="gray"
              action={<ChevronRight className="w-5 h-5 text-gray-400" />}
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <motion.button
            className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 font-medium hover:bg-red-100 transition-colors duration-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Reset All Settings
          </motion.button>
        </section>
      </div>
    </div>
  );
};

export default SettingsScreen;