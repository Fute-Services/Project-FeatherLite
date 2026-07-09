import React from "react";
import rainLines from "../../assets/Media/rain_lines.png";

interface BrochureCardProps {
  onClick: () => void;
}

const BrochureCard: React.FC<BrochureCardProps> = ({ onClick }) => {
  return (
    <div
      className="flex-1 relative group cursor-pointer overflow-hidden border-r border-white/20 transition-transform duration-500 hover:-translate-y-[60px] bg-[#060c11]"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#002C44] to-[#04121a] transition-transform duration-700 group-hover:scale-110" />

      <div
        className="absolute inset-0 mix-blend-overlay transition-transform duration-700 group-hover:scale-110 opacity-80"
        style={{
          backgroundImage: `url(${rainLines})`,
          backgroundSize: 'cover',
        }}
      />

      {/* Design-specific blue/cyan overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-0"
        style={{ background: 'linear-gradient(120deg, rgba(0, 180, 255, 0.30) 0.06%, rgba(200, 220, 255, 0.10) 50.11%)' }}
      />

      <div className="absolute inset-0 " />

      <div className="relative h-full flex flex-col items-center justify-between py-3 sm:py-6 md:py-12 px-3 md:px-6 text-center z-20">
        <h2 className="text-[15px] sm:text-[18px] md:text-[24px] font-light tracking-wide">Brochure</h2>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[13px] sm:text-[16px] md:text-[20px] font-light tracking-wide lowercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">click</p>
        <div className="mb-1 sm:mb-3 md:mb-8 text-[#a3b3bd] flex flex-col gap-1">
          <p className="text-[10px] sm:text-[13px] md:text-[16px] font-bold tracking-wide">Work. Play. Live.</p>
          <p className="text-[10px] sm:text-[13px] md:text-[16px] font-bold tracking-wide">Better.</p>
        </div>
      </div>
    </div>
  );
};

export default BrochureCard;