import React from "react";
import galleryImg from "../../assets/Media/gallery.jpeg";

interface GalleryCardProps {
  onClick: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ onClick }) => {
  return (
    <div 
      className="flex-1 relative group cursor-pointer overflow-hidden border-r border-white/20 transition-transform duration-500 hover:-translate-y-[60px]"
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${galleryImg})` }}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity duration-500" />
      
      {/* Design-specific light brown overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-0" 
        style={{ background: 'linear-gradient(180deg, rgba(205, 174, 127, 0.50) 0.06%, rgba(29, 27, 27, 0.15) 50.11%)' }} 
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
      <div className="relative h-full flex flex-col items-center justify-start py-3 sm:py-6 md:py-12 z-20 text-center">
        <h2 className="text-[15px] sm:text-[18px] md:text-[24px] font-light tracking-wide drop-shadow-md">Gallery</h2>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[13px] sm:text-[16px] md:text-[20px] font-light tracking-wide lowercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">click</p>
      </div>
    </div>
  );
};

export default GalleryCard;