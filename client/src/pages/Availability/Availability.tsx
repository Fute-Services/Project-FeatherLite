import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
const buildingImg = "https://res.cloudinary.com/db0f2ofgf/image/upload/f_auto,q_auto/v1777965947/main_image_l1tzgg.png";
import GradientImg from "../../assets/AvailabilityPage/Gradient-Background.png";
import logo from "../../assets/logo.png"
import floorData from '../../data/floorData.json';

const Availability = () => {
  const [showMainContent, setShowMainContent] = useState(false);

  const navigate = useNavigate();

  // Trigger the transition from the "first screen" to the main content
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMainContent(true);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);

  // On phone/tablet show the WHOLE building (fit), not a cropped/zoomed-in
  // "cover" fill. The image and its SVG hotspot overlay switch together so
  // the floor polygons stay aligned with the image at every size.
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900 font-sans">
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
        }
      `}</style>
      {/* 0. STATIC TOP RIGHT LOGO */}
      <div className="absolute top-4 right-2 sm:right-6 lg:right-20 z-50 opacity-80 hover:opacity-100 transition-opacity">
        <img
          src={logo}  // put your SVG file in public folder
          alt="logo"
          className="w-[120px] h-auto sm:w-[160px] lg:w-[220px] lg:h-[110px]"
        />
      </div>

      {/* 1. BACKGROUND GRADIENT */}
      <img
        src={GradientImg}
        alt="Background Gradient"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 2. INITIAL SCREEN LOGO (Fades out) */}
      <AnimatePresence>
        {!showMainContent && (
          <motion.div
            key="initial-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="318" height="318" viewBox="0 0 318 318" fill="none"><path d="M318 156.921V161.063C317.822 161.563 317.831 162.085 317.813 162.606C317.731 165.066 317.837 167.533 317.6 169.991C317.361 172.475 317.207 174.968 316.927 177.446C316.548 180.806 316.039 184.15 315.435 187.478C314.267 193.939 312.696 200.321 310.729 206.585C304.906 225.114 295.98 242.004 283.951 257.257C267.978 277.469 248.27 292.946 224.827 303.688C210.097 310.431 194.662 314.719 178.591 316.729C176.312 317.013 174.016 317.173 171.729 317.39C169.404 317.612 167.076 317.746 164.743 317.79C164.348 317.79 163.954 317.818 163.559 317.843C161.394 318.001 159.223 318.04 157.054 317.959C153.444 317.791 149.827 317.75 146.226 317.39C143.94 317.163 141.644 317.007 139.364 316.722C136.891 316.411 134.429 316.001 131.963 315.612C127.748 314.946 123.583 314.032 119.451 312.97C91.0956 305.696 65.2989 290.742 44.9024 269.755C24.5058 248.768 10.3008 222.562 3.85178 194.023C2.9251 189.924 2.14202 185.796 1.59578 181.627C1.27307 179.154 0.93852 176.68 0.697229 174.197C0.475181 171.884 0.317281 169.558 0.223528 167.222C0.0977009 164.137 0 161.05 0 157.964C0.00680761 152.871 0.279061 147.782 0.815654 142.718C1.13244 139.714 1.52374 136.721 1.98954 133.741C2.84377 128.292 3.9962 122.894 5.44164 117.571C11.4655 95.4087 21.7967 75.4734 36.435 57.7645C55.8301 34.4437 79.9193 17.9219 108.703 8.19903C114.639 6.18996 120.701 4.57096 126.85 3.3524C129.167 2.89279 131.491 2.46178 133.821 2.05937C135.276 1.80787 136.741 1.61554 138.205 1.42913C139.573 1.25456 140.945 1.11106 142.316 0.973468C144.146 0.790018 145.975 0.581418 147.81 0.464542C149.875 0.334352 151.946 0.291449 154.014 0.217477C154.737 0.190847 155.461 0.199724 156.182 0.162738C156.539 0.12693 156.893 0.0726104 157.244 0L160.796 0C161.227 0.215997 161.696 0.164217 162.152 0.176053C163.827 0.215997 165.505 0.190847 167.185 0.284051C169.406 0.408324 171.637 0.624321 173.863 0.792977C176.156 0.96755 178.433 1.26492 180.71 1.56968C183.54 1.94694 186.351 2.42627 189.156 2.95147C193.769 3.81546 198.329 4.90038 202.836 6.20623C222.496 11.8725 240.451 20.9296 256.571 33.5358C280.355 52.1412 297.554 75.5878 308.169 103.876C310.957 111.38 313.157 119.09 314.751 126.935C315.414 130.149 315.996 133.38 316.409 136.636C316.697 138.914 316.966 141.196 317.217 143.48C317.595 146.742 317.784 150.024 317.784 153.308C317.784 154.162 317.799 155.015 317.836 155.869C317.869 156.222 317.924 156.574 318 156.921ZM135.076 180.876C134.854 181.214 134.655 181.512 134.465 181.814C129.876 189.132 125.287 196.451 120.698 203.77C118.862 206.69 117.075 209.643 115.146 212.499C109.235 221.258 101.835 228.571 93.2377 234.69C82.196 242.558 70.0189 247.953 56.9078 251.306C53.3175 252.233 49.6808 252.97 46.0127 253.514C45.8084 253.544 45.6174 253.662 45.3406 253.769C45.6219 254.12 45.8365 254.404 46.0674 254.676C50.4868 259.894 55.2671 264.796 60.3732 269.346C75.1497 282.513 91.8852 292.353 110.58 298.865C116.654 300.975 122.865 302.674 129.168 303.95C131.547 304.434 133.945 304.82 136.34 305.21C137.894 305.463 139.459 305.663 141.022 305.857C142.553 306.046 144.087 306.221 145.623 306.364C146.865 306.48 148.113 306.548 149.359 306.617C151.459 306.733 153.558 306.876 155.66 306.926C157.861 306.981 160.065 306.968 162.268 306.926C164.074 306.897 165.88 306.823 167.686 306.706C169.717 306.574 171.746 306.392 173.773 306.193C175.697 306.003 177.631 305.82 179.546 305.536C182.271 305.13 184.995 304.695 187.7 304.167C193.464 303.04 199.153 301.562 204.737 299.741C226.826 292.526 246.16 280.782 262.738 264.508C280.445 247.11 293.007 226.553 300.424 202.838C302.263 196.946 303.719 190.94 304.781 184.86C305.401 181.334 305.882 177.79 306.251 174.229C306.59 170.959 306.843 167.682 306.939 164.401C307.132 158.224 307.028 152.052 306.449 145.891C306.183 143.047 305.857 140.21 305.454 137.382C304.799 132.796 303.917 128.254 302.809 123.758C298.728 107.068 291.749 91.2225 282.19 76.9424C280.037 73.7153 277.759 70.5799 275.355 67.5362C275.16 67.2906 275.016 66.9755 274.615 66.8571C274.378 67.1279 274.14 67.3942 273.907 67.6664C272.042 69.8362 270.088 71.9222 268.044 73.9244C259.862 81.9207 250.498 88.1107 239.851 92.3374C235.151 94.197 230.302 95.6593 225.357 96.7092C223.209 97.1693 221.042 97.5554 218.871 97.8927C216.991 98.1886 215.094 98.3824 213.2 98.5629C210.979 98.7744 208.75 98.9993 206.519 99.0792C203.532 99.1872 200.537 99.2124 197.547 99.1813C194.656 99.1502 191.773 99.0141 188.875 98.9002C187.691 98.8543 186.515 98.7523 185.336 98.6605C184.058 98.5629 182.782 98.446 181.506 98.3424C180.425 98.2552 179.343 98.1797 178.264 98.0895C177.478 98.0244 176.693 97.9415 175.91 97.8661C174.896 97.7655 173.885 97.6545 172.871 97.5583C171.204 97.403 169.535 97.2625 167.868 97.1027C166.168 96.9385 164.472 96.7402 162.773 96.5834C160.974 96.4162 159.172 96.2801 157.372 96.1292C156.484 96.0552 155.605 95.9813 154.721 95.9029C153.411 95.7949 152.102 95.6735 150.792 95.5877C149.219 95.4857 147.644 95.4043 146.067 95.3348C143.403 95.2194 140.748 95.0744 138.088 95.0256C133.191 94.9209 128.291 95.0977 123.414 95.5552C121.421 95.749 119.426 95.9325 117.444 96.2121C114.423 96.6391 111.427 97.2107 108.457 97.9267C101.807 99.508 95.3822 101.915 89.3312 105.092C87.3268 106.148 85.3703 107.29 83.4617 108.517C83.3314 108.601 83.1923 108.845 82.9332 108.595C83.0739 108.419 83.21 108.24 83.3536 108.067C85.0313 106.043 86.787 104.087 88.6206 102.199C96.6942 93.876 105.991 87.2866 116.582 82.5317C122.311 79.9806 128.269 77.9808 134.377 76.5593C137.19 75.895 140.017 75.321 142.879 74.9156C144.341 74.71 145.801 74.491 147.266 74.3076C148.83 74.1123 150.396 73.9273 151.965 73.7853C153.306 73.664 154.652 73.5915 155.997 73.5249C158.366 73.4081 160.724 73.2882 163.088 73.2143C167.033 73.09 170.975 73.3075 174.919 73.4081C176.067 73.4377 177.216 73.522 178.363 73.5915C179.445 73.6581 180.527 73.7306 181.608 73.8193C182.792 73.9155 183.963 74.0353 185.14 74.1419C186.808 74.2898 188.478 74.4377 190.144 74.6005C191.745 74.7588 193.343 74.9585 194.943 75.1124C196.676 75.2795 198.411 75.4083 200.146 75.5562L202.796 75.7885C204.072 75.898 205.348 76.0207 206.625 76.1125C208.033 76.2131 209.438 76.2885 210.855 76.3669C212.889 76.4808 214.923 76.6332 216.958 76.6894C219.521 76.759 222.086 76.7605 224.656 76.7723C228.438 76.7881 232.213 76.6243 235.979 76.2811C237.973 76.0992 239.955 75.8092 241.941 75.5577C244.934 75.1611 247.904 74.607 250.838 73.8978C258.471 72.0973 265.789 69.4106 272.843 65.9991C273.106 65.8718 273.357 65.718 273.623 65.5715C273.519 65.1277 273.212 64.8702 272.963 64.5744C253.628 41.5721 229.615 25.6549 200.792 17.0416C196.298 15.6929 191.734 14.5896 187.121 13.7365C185.185 13.3815 183.244 13.0506 181.3 12.7438C179.549 12.4702 177.793 12.2186 176.033 12.016C174.371 11.8236 172.701 11.6831 171.031 11.5603C169.033 11.4124 167.034 11.3103 165.032 11.1919C164.539 11.1623 164.046 11.1609 163.551 11.1327C160.759 10.973 157.965 10.9848 155.171 11.0913C152.316 11.2008 149.457 11.2748 146.611 11.5736C144.982 11.7467 143.335 11.8281 141.708 12.0396C139.169 12.3681 136.639 12.7586 134.109 13.1477C130.183 13.7513 126.304 14.6005 122.458 15.5829C108.661 19.0855 95.4473 24.5723 83.2293 31.8715C55.9328 48.1505 34.5785 72.7479 22.3024 102.051C18.695 110.656 15.9302 119.59 14.0467 128.727C13.4383 131.686 12.9246 134.663 12.4776 137.647C12.0971 140.178 11.8662 142.731 11.5894 145.278C11.2933 147.988 11.1453 150.71 11.0446 153.435C10.9262 156.916 10.8803 160.4 11.0328 163.881C11.1483 166.544 11.2741 169.197 11.4902 171.848C11.7404 174.924 12.1208 177.986 12.5768 181.041C13.2528 185.591 14.141 190.098 15.2413 194.562C20.4013 215.392 30.0446 234.847 43.4991 251.57C43.6989 251.819 43.8514 252.13 44.2615 252.261C44.5072 252.125 44.7973 251.98 45.0727 251.809C47.2443 250.451 49.4322 249.115 51.5787 247.718C64.1983 239.506 75.1838 229.521 84.3543 217.557C86.5141 214.746 88.6591 211.911 90.5509 208.907C95.3975 201.206 100.229 193.495 105.046 185.776C106.58 183.326 108.119 180.879 109.644 178.424C109.828 178.128 110.107 177.865 110.103 177.432C109.891 177.35 109.674 177.286 109.452 177.239C108.279 177.091 107.107 176.933 105.931 176.81C104.331 176.643 102.729 176.497 101.126 176.356C99.7526 176.236 98.3774 176.085 97.0007 176.042C94.4057 175.962 91.8107 175.886 89.2127 175.971C86.7465 176.053 84.2966 176.247 81.8496 176.563C79.0182 176.93 76.217 177.501 73.4681 178.272C69.5143 179.381 65.6996 180.937 62.0978 182.908C61.852 183.043 61.63 183.247 61.2214 183.234C61.3395 183.06 61.467 182.892 61.6034 182.732C62.2177 182.092 62.832 181.451 63.4626 180.827C71.5333 172.832 81.0735 167.427 92.0831 164.612C95.8698 163.655 99.7253 162.994 103.615 162.634C106.005 162.411 108.398 162.256 110.797 162.247C111.192 162.247 111.586 162.226 111.981 162.23C114.38 162.264 116.781 162.198 119.176 162.406C119.35 162.407 119.524 162.392 119.695 162.362C119.892 162.066 120.094 161.77 120.288 161.461C124.854 154.167 129.399 146.858 133.992 139.58C145.49 121.362 161.628 109.173 182.122 102.662C182.394 102.577 182.678 102.526 182.96 102.458C182.972 102.507 182.98 102.556 182.985 102.606C182.982 102.638 182.974 102.669 182.961 102.698C182.948 102.729 182.933 102.758 182.915 102.787L182.868 102.872C182.853 102.901 182.84 102.932 182.823 102.96C182.807 102.988 182.789 103.016 182.772 103.044L182.718 103.127L182.67 103.211L182.621 103.297L155.137 148.747L154.678 149.506C154.644 149.562 154.613 149.62 154.578 149.676L145.327 164.47C145.293 164.525 145.255 164.58 145.219 164.634C145.201 164.663 145.185 164.691 145.169 164.719L145.117 164.803L145.064 164.886L145.01 164.969C144.994 164.998 144.981 165.028 144.966 165.056L144.917 165.143C144.899 165.171 144.883 165.199 144.868 165.228C144.855 165.258 144.846 165.29 144.84 165.322C144.836 165.354 144.836 165.386 144.84 165.417C144.84 165.45 144.853 165.482 144.868 165.553C144.981 165.593 145.096 165.625 145.213 165.648C146.351 165.796 147.49 165.957 148.63 166.092C150.129 166.271 151.629 166.454 153.131 166.601C154.316 166.715 155.488 166.793 156.669 166.855C158.802 166.967 160.936 167.124 163.07 167.139C166.718 167.179 170.364 166.952 173.979 166.46C176.06 166.164 178.123 165.812 180.175 165.34C184.843 164.25 189.394 162.71 193.764 160.742C194.052 160.613 194.348 160.505 194.841 160.307C194.595 160.615 194.488 160.764 194.366 160.899C192.833 162.615 191.212 164.25 189.509 165.797C183.883 170.916 177.533 174.865 170.386 177.51C164.367 179.738 158.123 180.887 151.734 181.302C149.734 181.432 147.725 181.45 145.721 181.462C144.473 181.47 143.224 181.405 141.977 181.334C140.304 181.24 138.635 181.106 136.963 180.991C136.337 180.948 135.715 180.914 135.076 180.876Z" fill="white" fill-opacity="0.2" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. BUILDING IMAGE (Slides up from bottom - Fixed sizing) */}
      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: showMainContent ? "4vh" : "100vh" }}
        transition={{
          type: "spring",
          stiffness: 40,
          damping: 20,
          delay: showMainContent ? 0.2 : 0,
        }}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
      >
        {/* Full screen container to eliminate side gaps */}
        <div className="relative w-screen h-screen">
          {/* Building Image - cover on desktop, contain (full view) on phone/tablet */}
          <img
            src={buildingImg}
            alt="Building"
            className={`w-full h-full pointer-events-none ${isDesktop ? "object-cover" : "object-contain"}`}
          />

          {/* SVG Overlay - matches the image's object-fit so polygons stay aligned */}
          <svg
            viewBox="0 0 1200 614"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio={isDesktop ? "xMidYMid slice" : "xMidYMid meet"}
          >
            {floorData.map((floor) => (
              <polygon
                key={floor.level}
                points={floor.polygon}
                className={`transition-colors duration-300 pointer-events-auto cursor-pointer ${hoveredFloor === floor.level ? 'fill-black/30' : 'fill-white/0 hover:fill-[#ff0000]/30'
                  }`}
                onMouseEnter={() => setHoveredFloor(floor.level)}
                onMouseLeave={() => setHoveredFloor(null)}
                onClick={() => navigate(`/unitplan/${encodeURIComponent(floor.level)}`, { state: { allFloors: floorData } })}
              />
            ))}
          </svg>

          {/* Dynamic Tooltip - Closely aligned to the building's right edge */}
          <AnimatePresence>
            {hoveredFloor && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -10 }}
                style={{
                  position: "absolute",
                  left: `${(() => {
                    const floor = floorData.find(f => f.level === hoveredFloor);
                    if (!floor) return 0;
                    // Extract X coordinates and find the rightmost edge
                    const coords = floor.polygon.split(',').map(Number);
                    const xCoords = coords.filter((_: number, i: number) => i % 2 === 0);
                    const maxX = Math.max(...xCoords);
                    return (maxX / 1200) * 100; // Convert to percentage of container width
                  })()}%`,
                  top: `${(() => {
                    const floor = floorData.find(f => f.level === hoveredFloor);
                    if (!floor) return 0;

                    // Extract Y coordinates and find the center
                    const coords = floor.polygon.split(',').map(Number);
                    const yCoords = coords.filter((_: number, i: number) => i % 2 !== 0);
                    const minY = Math.min(...yCoords);
                    const maxY = Math.max(...yCoords);
                    const centerY = (minY + maxY) / 2;

                    // 1. Get the exact mathematical percentage
                    const basePercent = (centerY / 614) * 100;

                    // 2. Apply a progressive upward correction
                    // As basePercent gets smaller (higher up the building), (100 - basePercent) gets larger.
                    // This pulls the top tooltips up, while leaving the bottom tooltips alone.
                    const tuningFactor = 0.10; // Adjust this number (e.g., 0.04 to 0.10) to perfect the 11th floor
                    let correctedPercent = basePercent - ((100 - basePercent) * tuningFactor);

                    if (floor.level === "11th") {
                      correctedPercent += 4;
                    }

                    return correctedPercent;
                  })()}%`,
                  transform: "translateY(-50%)",
                  marginLeft: "10px", // Small gap between building and tooltip
                  zIndex: 100,
                  pointerEvents: "none",
                }}
                className="flex flex-col items-start"
              >
                <div className="relative font-sans inline-block mt-4">
                  {/* Golden Box (Floor Number) */}
                  <div className="absolute -top-[10px] left-0 z-10 bg-[#ceb382] px-2 py-1 flex items-baseline gap-1 shadow-sm whitespace-nowrap">
                    <span className="text-white text-[14px] font-bold leading-none tracking-wide">
                      {(() => {
                        const lvl = floorData.find(f => f.level === hoveredFloor)?.level;
                        if (!lvl) return '';
                        if (lvl === '0') return 'Ground Floor';
                        if (lvl === '11') return 'Terrace';
                        if (lvl.toLowerCase().includes('refuge')) return lvl;
                        return `${lvl} Floor`;
                      })()}
                    </span>
                  </div>

                  {/* Red Box (Area) */}
                  <div className="bg-black/40 text-white pl-3 pr-4 pt-[18px] pb-1 min-w-[150px] shadow-md">
                    <div className="text-[18px] font-medium tracking-wide whitespace-nowrap">
                      {floorData.find(f => f.level === hoveredFloor)?.area}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 4. GLASSMORPHIC AVAILABILITY TAB */}
      <motion.div
        initial={{ x: "140%" }}
        animate={{ x: showMainContent ? "0%" : "140%" }}
        transition={{
          type: "spring",
          stiffness: 45,
          damping: 16,
          delay: showMainContent ? 0.6 : 0,
        }}
        className="absolute right-2 sm:right-6 lg:right-20 top-[130px] -translate-y-1/2 z-30 w-[130px] sm:w-[190px] lg:w-[260px] rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(162, 185, 196, 0.45) 0%, rgba(66, 75, 78, 0.55) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          fontFamily: '"Nortica Typeface", sans-serif',
        }}
      >
        <div className="p-2 relative z-10">
          {/* Table Headers */}
          <div className="flex items-center text-white text-[9px] sm:text-[11px] lg:text-[14px] tracking-[1px] font-normal py-0.5 mb-1.5 lg:mb-[10px] mr-1.5 rounded-full" style={{ background: "rgba(92, 107, 119, 0.9)" }}>
            <span className="w-[34px] sm:w-[42px] lg:w-[56px] text-center flex-shrink-0">Floor</span>
            <div className="w-[1px] bg-white/20 self-stretch mx-[2px] my-1"></div>
            <span className="flex-1 text-center">Tower</span>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col gap-1 lg:gap-[6px] max-h-[calc(100vh-220px)] overflow-y-auto pr-1 custom-scroll">
            {floorData.map((floor, index) => {
              const isHovered = hoveredFloor === floor.level;
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 lg:gap-[6px] cursor-pointer"
                  onMouseEnter={() => setHoveredFloor(floor.level)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  onClick={() => navigate(`/unitplan/${encodeURIComponent(floor.level)}`, { state: { allFloors: floorData } })}
                >
                  {/* Floor Number Pill */}
                  <div
                    className={`w-[34px] sm:w-[42px] lg:w-[56px] flex-shrink-0 flex items-center justify-center py-0.5 rounded-full text-[9px] sm:text-[11px] lg:text-[14px] font-normal tracking-wide transition-all duration-300 ${isHovered ? "text-black" : (floor.level === "6th" || floor.level === "9th" ? "text-[#CDAE7F]" : "text-white")
                      }`}
                    style={{
                      background: isHovered ? "#CDAE7F" : "rgba(0, 0, 0, 0.65)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(30.83333396911621px)",
                      WebkitBackdropFilter: "blur(30.83333396911621px)",
                    }}
                  >
                    {floor.level}
                  </div>

                  {/* Area Pill */}
                  <div
                    className={`flex-1 flex items-center justify-center py-0.5 rounded-full text-[9px] sm:text-[11px] lg:text-[14px] tracking-wide whitespace-nowrap transition-all duration-300 ${isHovered ? "text-black" : (floor.level === "6th" || floor.level === "9th" ? "text-[#CDAE7F]" : "text-white/90")
                      }`}
                    style={{
                      background: isHovered ? "#CDAE7F" : "rgba(0, 0, 0, 0.40)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(20.808547973632812px)",
                      WebkitBackdropFilter: "blur(20.808547973632812px)",
                    }}
                  >
                    {floor.area}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>



      {/* <button 
      onClick={() => navigate("/sectionalview")}
      className="absolute bottom-8 right-20 z-50 bg-[#E52B1F] text-white px-8 py-3 rounded-full text-sm font-semibold shadow-2xl "
    >
      Sectional View
    </button> */}

    </div>
  );
};

export default Availability;