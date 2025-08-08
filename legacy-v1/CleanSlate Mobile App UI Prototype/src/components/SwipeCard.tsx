import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Share2, Lock, Check, X, Heart, Trash2 } from 'lucide-react';

interface SwipeCardProps {
  image: {
    id: number;
    url: string;
    date: string;
  };
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
  isAnimating: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ image, onSwipe, isAnimating }) => {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateZ = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform([x, y], ([x, y]) => {
    const distance = Math.sqrt(x * x + y * y);
    return Math.max(0.4, 1 - distance / 300);
  });

  const scale = useTransform([x, y], ([x, y]) => {
    const distance = Math.sqrt(x * x + y * y);
    return Math.max(0.8, 1 - distance / 500);
  });

  // Icon opacity based on swipe direction
  const deleteOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const keepOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);
  const shareOpacity = useTransform(y, [-150, -50, 0], [1, 0.5, 0]);
  const privateOpacity = useTransform(y, [0, 50, 150], [0, 0.5, 1]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const { offset, velocity } = info;
    const swipeThreshold = 100;
    const velocityThreshold = 500;

    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
        onSwipe('right'); // Keep
      } else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
        onSwipe('left'); // Delete
      }
    } else {
      // Vertical swipe
      if (offset.y < -swipeThreshold || velocity.y < -velocityThreshold) {
        onSwipe('up'); // Share
      } else if (offset.y > swipeThreshold || velocity.y > velocityThreshold) {
        onSwipe('down'); // Private
      }
    }
  };

  return (
    <div className="relative w-80 h-96 mx-auto">
      <motion.div
        className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          x,
          y,
          rotateZ,
          opacity,
          scale,
        }}
        drag={!isAnimating}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.95 }}
        animate={isAnimating ? { x: 0, y: 0, scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <img 
          src={image.url} 
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Swipe Direction Overlays */}
        {isDragging && (
          <>
            {/* Delete (Left) */}
            <motion.div 
              className="absolute inset-0 bg-red-500/80 flex items-center justify-center"
              style={{ opacity: deleteOpacity }}
            >
              <div className="bg-white rounded-full p-6 shadow-2xl">
                <Trash2 className="w-12 h-12 text-red-600" />
              </div>
            </motion.div>

            {/* Keep (Right) */}
            <motion.div 
              className="absolute inset-0 bg-green-500/80 flex items-center justify-center"
              style={{ opacity: keepOpacity }}
            >
              <div className="bg-white rounded-full p-6 shadow-2xl">
                <Heart className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>

            {/* Share (Up) */}
            <motion.div 
              className="absolute inset-0 bg-blue-500/80 flex items-center justify-center"
              style={{ opacity: shareOpacity }}
            >
              <div className="bg-white rounded-full p-6 shadow-2xl">
                <Share2 className="w-12 h-12 text-blue-600" />
              </div>
            </motion.div>

            {/* Private (Down) */}
            <motion.div 
              className="absolute inset-0 bg-purple-500/80 flex items-center justify-center"
              style={{ opacity: privateOpacity }}
            >
              <div className="bg-white rounded-full p-6 shadow-2xl">
                <Lock className="w-12 h-12 text-purple-600" />
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SwipeCard;