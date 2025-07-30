import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Share2 } from 'lucide-react';

// Components
import SwipeCard from './components/SwipeCard';
import SpinWheel from './components/SpinWheel';
import TabNavigation from './components/TabNavigation';
import PermissionScreen from './components/PermissionScreen';
import StatsScreen from './components/StatsScreen';
import SettingsScreen from './components/SettingsScreen';

// Sample image data
const sampleImages = [
  { id: 1, url: 'https://images.pexels.com/photos/1804099/pexels-photo-1804099.jpeg?auto=compress&cs=tinysrgb&w=400', date: '2024-01-15' },
  { id: 2, url: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=400', date: '2024-01-14' },
  { id: 3, url: 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=400', date: '2024-01-13' },
  { id: 4, url: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=400', date: '2024-01-12' },
  { id: 5, url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400', date: '2024-01-11' },
  { id: 6, url: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=400', date: '2024-01-10' },
  { id: 7, url: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400', date: '2024-01-09' },
  { id: 8, url: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400', date: '2024-01-08' },
];

const sortOptions = ['Oldest First', 'Newest First', 'Random', 'By Location'];

function App() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [activeTab, setActiveTab] = useState('clean');
  const [currentScreen, setCurrentScreen] = useState('management');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cleanedCount, setCleanedCount] = useState(0);
  const [sortOrder, setSortOrder] = useState('Oldest First');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentImage = sampleImages[currentImageIndex];
  const totalImages = sampleImages.length;

  const handleSwipeAction = (direction: 'left' | 'right' | 'up' | 'down') => {
    setIsAnimating(true);
    
    setTimeout(() => {
      if (direction === 'left' || direction === 'right') {
        setCleanedCount(prev => prev + 1);
      }
      setCurrentImageIndex(prev => (prev + 1) % totalImages);
      setIsAnimating(false);
    }, 800);
  };

  const handleSortSelect = (option: string) => {
    setSortOrder(option);
    setShowSortModal(false);
  };

  const togglePhotoSelection = (photoId: number) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  const getSelectionNumber = (photoId: number) => {
    return selectedPhotos.indexOf(photoId) + 1;
  };

  // Permission screen
  if (!hasPermissions) {
    return <PermissionScreen onGrantPermissions={() => setHasPermissions(true)} />;
  }

  // Tab-based navigation
  if (activeTab === 'stats') {
    return (
      <div className="relative">
        <StatsScreen />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  if (activeTab === 'settings') {
    return (
      <div className="relative">
        <SettingsScreen />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  // Gallery screen
  if (activeTab === 'gallery' || currentScreen === 'shared') {
    return (
      <div className="min-h-screen bg-gray-50 font-system pb-20">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            {currentScreen === 'shared' && (
              <button 
                onClick={() => setCurrentScreen('management')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <ChevronLeft className="w-6 h-6 text-blue-600" />
              </button>
            )}
            <span className="text-lg font-medium text-gray-900">
              Total Images ({selectedPhotos.length} Selected)
            </span>
          </div>
          <button 
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              selectedPhotos.length > 0 
                ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={selectedPhotos.length === 0}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Photo Grid */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {sampleImages.map((image) => {
              const isSelected = selectedPhotos.includes(image.id);
              const selectionNumber = getSelectionNumber(image.id);
              
              return (
                <motion.div 
                  key={image.id}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => togglePhotoSelection(image.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img 
                    src={image.url} 
                    alt=""
                    className={`w-full h-full object-cover transition-all duration-200 ${
                      isSelected ? 'scale-110 brightness-75' : 'hover:brightness-90'
                    }`}
                  />
                  {isSelected && (
                    <motion.div 
                      className="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {selectionNumber}
                    </motion.div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  // Main Clean screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-system relative overflow-hidden pb-20">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-medium text-gray-900">
          Total ({cleanedCount} Cleaned)
        </div>
        <motion.button 
          onClick={() => setShowSortModal(true)}
          className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 font-medium text-gray-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sortOrder}
        </motion.button>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center px-8 py-8">
        <AnimatePresence mode="wait">
          <SwipeCard
            key={currentImage.id}
            image={currentImage}
            onSwipe={handleSwipeAction}
            isAnimating={isAnimating}
          />
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="px-8 pb-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-bold text-gray-900">
              {currentImageIndex + 1} / {totalImages}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentImageIndex + 1) / totalImages) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Sort Modal */}
      <AnimatePresence>
        {showSortModal && (
          <SpinWheel
            options={sortOptions}
            selectedOption={sortOrder}
            onSelect={handleSortSelect}
            onClose={() => setShowSortModal(false)}
          />
        )}
      </AnimatePresence>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;