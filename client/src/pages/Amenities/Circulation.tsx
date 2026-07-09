import { useNavigate } from "react-router-dom";
// @ts-ignore
import circulationVideo from "../../assets/Cerculation/circulation .mp4";

export default function Circulation() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#072945] flex flex-col items-center justify-between px-4 sm:px-8 md:px-16 py-6 md:py-10">
      
      {/* Top Heading (Outside the container) */}
      <h1 className="text-2xl md:text-3xl font-light tracking-[0.25em] text-white text-center uppercase select-none drop-shadow-lg mt-2">
        Circulation
      </h1>

      {/* Main Video Container */}
      <div className="w-full max-w-4xl flex-1 flex items-center justify-center my-4">
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
          <video
            src={circulationVideo}
            className="w-full h-full object-cover"
            autoPlay
            loop={true}
            muted
            playsInline
            controls
            onEnded={(e) => {
              e.currentTarget.play();
            }}
          />
        </div>
      </div>

      {/* Bottom Spacer/Footer area to balance vertical alignment */}
      <div className="h-24 w-full" />

      {/* Close/Back Button in bottom-left */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go Back"
        className="absolute bottom-4 left-4 sm:bottom-8 sm:left-16 z-50 group cursor-pointer"
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 70 70"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[42px] h-[42px] sm:w-[50px] sm:h-[50px] transition-transform duration-300 group-hover:scale-105 drop-shadow-lg"
        >
          <circle cx="35" cy="35" r="32" fill="rgba(255,206,117,1)" />
          <g transform="translate(25,23)">
            <path
              d="M17.1191 22.5V15.0098C17.1191 10.0392 13.0897 6.00977 8.11914 6.00977H2.11914M2.11914 6.00977L6.61914 10.5195M2.11914 6.00977L6.61914 1.5"
              stroke="#513203"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}
