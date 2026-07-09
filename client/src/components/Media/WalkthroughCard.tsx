import React from "react";
import walkthroughImg from "../../assets/Media/walkthrough.jpg";

interface WalkthroughCardProps {
  onClick: () => void;
}

const WalkthroughCard: React.FC<WalkthroughCardProps> = ({ onClick }) => {
  return (
    <div 
      className="flex-1 relative group cursor-pointer overflow-hidden transition-transform duration-500 hover:-translate-y-[60px]"
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${walkthroughImg})` }}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity duration-500" />
      
      {/* Design-specific light brown overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-0" 
        style={{ background: 'linear-gradient(180deg, rgba(205, 174, 127, 0.50) 0.06%, rgba(29, 27, 27, 0.15) 50.11%)' }} 
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
      <div className="relative h-full flex flex-col items-center justify-start py-12 z-20 text-center">
        <h2 className="text-[24px] font-light tracking-wide drop-shadow-md">Walk-through</h2>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] font-light tracking-wide lowercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">click</p>
      </div>
    </div>
  );
};

export default WalkthroughCard;