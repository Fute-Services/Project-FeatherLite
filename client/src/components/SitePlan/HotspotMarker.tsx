import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HotspotMarkerProps {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  scale?: number;
  isVisible: boolean;
}

const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  title,
  x,
  y,
  isVisible,
}) => {
  // SVG coordinates: x and y are the exact pixel centers.
  // Set to a comfortable size (width 120, height 36) so it is highly readable on all screens.
  const width = 120;
  const height = 36;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.foreignObject
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          x={x - width / 2}
          y={y - height / 2}
          width={width}
          height={height}
          className="pointer-events-auto overflow-visible"
        >
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-[#FF0000]/20 rounded-full blur-xl animate-pulse pointer-events-none" />
            <div className="relative bg-red-900/60 backdrop-blur-sm text-white px-10 py-8 text-[30px] font-medium tracking-wide whitespace-nowrap cursor-pointer hover:bg-red-800 transition-colors shadow-md rounded-full">
              {title}
            </div>
          </div>
        </motion.foreignObject>
      )}
    </AnimatePresence>
  );
};

export default HotspotMarker;
