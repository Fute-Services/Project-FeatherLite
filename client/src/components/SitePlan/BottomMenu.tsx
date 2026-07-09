import React, { useState } from 'react';
import { Eye, EyeOff, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomMenuProps {
  isViewActive: boolean;
  onToggleView: () => void;
  currentLevel: 'ground' | 'terrace';
  onChangeLevel: (level: 'ground' | 'terrace') => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({
  isViewActive,
  onToggleView,
  currentLevel,
  onChangeLevel
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleSubMenu = (menu: string) => {
    setActiveMenu(prev => prev === menu ? null : menu);
  };

  return (
    <>
      {/* Center Navigation Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-24 left-1/2 xl:left-[20%] -translate-x-1/2 z-30 flex flex-col items-center gap-4 pointer-events-none w-full max-w-[96vw] lg:max-w-4xl"
      >
        {/* Top Row: Sub-nav */}
        <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4 pointer-events-auto w-full">
          {/* View/Hide Button */}
          <button
            onClick={onToggleView}
            className="flex items-center gap-2 lg:gap-3 px-4 lg:px-8 py-2 text-sm lg:text-base bg-[#FF0000] hover:bg-red-700 text-white rounded-full font-medium transition-colors shadow-lg active:scale-95"
          >
            <span>{isViewActive ? 'Hide' : 'View'}</span>
            <div className="border border-white/40 rounded-full p-1 flex items-center justify-center">
              {isViewActive ? (
                <EyeOff size={16} strokeWidth={2.5} />
              ) : (
                <Eye size={16} strokeWidth={2.5} />
              )}
            </div>
          </button>

          {/* Levels Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleSubMenu('levels')}
              className="flex items-center gap-2 lg:gap-3 px-4 lg:px-8 py-2 text-sm lg:text-base bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-full font-medium hover:bg-black/60 transition-colors shadow-lg"
            >
              <span>Levels</span>
              <div className="bg-[#FF0000] rounded-full p-1 flex items-center justify-center">
                <ChevronUp size={16} strokeWidth={3} className={`transition-transform duration-300 ${activeMenu === 'levels' ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {activeMenu === 'levels' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-[calc(100%+12px)]  -translate-x-1/2 flex flex-col gap-3 min-w-[140px] items-stretch"
                >
                  <button
                    onClick={() => {
                      onChangeLevel('ground');
                      setActiveMenu(null);
                    }}
                    className={`w-full px-5 py-2 rounded-full text-sm font-medium shadow-lg transition-colors whitespace-nowrap ${currentLevel === 'ground'
                      ? 'bg-[#FF0000] text-white'
                      : 'bg-black/60 hover:bg-red-700/80 border border-white/10 text-white/80'
                      }`}
                  >
                    Site plan
                  </button>
                  <button
                    onClick={() => {
                      onChangeLevel('terrace');
                      setActiveMenu(null);
                    }}
                    className={`w-full px-5 py-2 rounded-full text-sm font-medium shadow-lg transition-colors whitespace-nowrap ${currentLevel === 'terrace'
                      ? 'bg-[#FF0000] text-white'
                      : 'bg-black/60 hover:bg-red-700/80 border border-white/10 text-white/80'
                      }`}
                  >
                    Terrace Plan
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => navigate('/virtualtour')}
            className="px-4 lg:px-8 py-2 text-sm lg:text-base bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-full font-medium hover:bg-black/60 transition-all duration-300 shadow-lg whitespace-nowrap"
          >
            Virtual Tour
          </button>

          <button
            onClick={() => navigate('/circulation')}
            className="px-4 lg:px-8 py-2 text-sm lg:text-base bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-full font-medium hover:bg-black/60 transition-all duration-300 shadow-lg whitespace-nowrap"
          >
            Circulation
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default BottomMenu;
