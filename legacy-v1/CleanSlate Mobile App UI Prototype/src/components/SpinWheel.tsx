import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface SpinWheelProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ options, selectedOption, onSelect, onClose }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const segmentAngle = 360 / options.length;
  
  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Bias towards "Random" (50% chance)
    const randomIndex = Math.random() < 0.5 && options.includes('Random') 
      ? options.indexOf('Random')
      : Math.floor(Math.random() * options.length);
    
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = rotation + (spins * 360) + (randomIndex * segmentAngle);
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      onSelect(options[randomIndex]);
    }, 3000);
  };

  const handleManualSelect = (option: string, index: number) => {
    if (isSpinning) return;
    
    const targetRotation = rotation + (index * segmentAngle) - (rotation % 360);
    setRotation(targetRotation);
    
    setTimeout(() => {
      onSelect(option);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 mx-6 w-full max-w-sm">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Sort Photos</h3>
          <p className="text-gray-600">Choose your sorting preference</p>
        </div>
        
        {/* Wheel Container */}
        <div className="relative mb-8">
          <div className="w-64 h-64 mx-auto relative">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-blue-600"></div>
            </div>
            
            {/* Wheel */}
            <motion.div 
              className="w-full h-full rounded-full border-4 border-gray-200 relative overflow-hidden shadow-2xl"
              animate={{ rotate: rotation }}
              transition={{ 
                duration: isSpinning ? 3 : 0.5, 
                ease: isSpinning ? "easeOut" : "easeInOut" 
              }}
            >
              {options.map((option, index) => {
                const angle = index * segmentAngle;
                const isSelected = option === selectedOption;
                
                return (
                  <button
                    key={option}
                    onClick={() => handleManualSelect(option, index)}
                    disabled={isSpinning}
                    className={`absolute w-full h-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 hover:from-blue-50 hover:to-blue-100'
                    }`}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - segmentAngle/2) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - segmentAngle/2) * Math.PI / 180)}%, ${50 + 50 * Math.cos((angle + segmentAngle/2) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle + segmentAngle/2) * Math.PI / 180)}%)`,
                      transformOrigin: '50% 50%'
                    }}
                  >
                    <span 
                      className="font-bold text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm"
                      style={{ transform: `rotate(${-angle}deg)` }}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </motion.div>
            
            {/* Center Circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 bg-blue-600 rounded-full shadow-lg border-4 border-white"></div>
            </div>
          </div>
        </div>
        
        {/* Feeling Lucky Button */}
        <motion.button 
          onClick={handleSpin}
          disabled={isSpinning}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg mb-4 transition-all duration-200 ${
            isSpinning 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
          }`}
          whileHover={!isSpinning ? { scale: 1.02 } : {}}
          whileTap={!isSpinning ? { scale: 0.98 } : {}}
        >
          <div className="flex items-center justify-center space-x-2">
            <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Spinning...' : 'Feeling Lucky?'}</span>
          </div>
        </motion.button>
        
        <button 
          onClick={onClose}
          disabled={isSpinning}
          className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SpinWheel;