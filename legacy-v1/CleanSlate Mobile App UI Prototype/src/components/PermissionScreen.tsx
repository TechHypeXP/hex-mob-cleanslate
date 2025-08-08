import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Image, Lock, CheckCircle } from 'lucide-react';

interface PermissionScreenProps {
  onGrantPermissions: () => void;
}

const permissions = [
  {
    icon: Image,
    title: 'Photo Library Access',
    description: 'View and organize your photos',
    required: true,
  },
  {
    icon: Shield,
    title: 'Delete Photos',
    description: 'Remove unwanted photos safely',
    required: true,
  },
  {
    icon: Lock,
    title: 'Private Storage',
    description: 'Secure storage for private photos',
    required: true,
  },
];

const PermissionScreen: React.FC<PermissionScreenProps> = ({ onGrantPermissions }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <motion.div 
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CleanSlate</h1>
          <p className="text-gray-600">We need a few permissions to help you organize your photos</p>
        </div>

        <div className="space-y-4 mb-8">
          {permissions.map((permission, index) => {
            const Icon = permission.icon;
            return (
              <motion.div
                key={permission.title}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{permission.title}</h3>
                  <p className="text-sm text-gray-600">{permission.description}</p>
                  {permission.required && (
                    <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Required
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          onClick={onGrantPermissions}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Grant Permissions</span>
          </div>
        </motion.button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your privacy is important to us. We only access photos to help you organize them.
        </p>
      </motion.div>
    </div>
  );
};

export default PermissionScreen;