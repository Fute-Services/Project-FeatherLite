// import { useState } from 'react';
// import amenities_bg from '../../assets/amenities/AMINITIES.png';
// import logo from '../../assets/logo.png';
// import sitePlanData from '../../data/sitePlanConfig.json';
// import HotspotMarker from '../../components/SitePlan/HotspotMarker';
// import BottomMenu from '../../components/SitePlan/BottomMenu';

// const Amenities = () => {
//   const [isLabelsVisible, setIsLabelsVisible] = useState(false);

//   return (
//     <div
//       className="w-full h-screen overflow-hidden bg-neutral-900 relative"
//       style={{
//         backgroundImage: `url(${amenities_bg})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat'
//       }}
//     >
//       <div className='absolute inset-0 w-full h-full'>
//         <svg
//           className="absolute inset-0 w-full h-full z-10 pointer-events-none"
//           viewBox="0 0 1200 629"
//           preserveAspectRatio="xMidYMid slice"
//         >
//           <defs>
//             <linearGradient id="red-gradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#FF0000" stopOpacity="0.7" />
//               <stop offset="100%" stopColor="#FF0000" stopOpacity="0" />
//             </linearGradient>
//           </defs>

//         {/* Polygons and Labels */}
//         {sitePlanData.map((marker) => (
//           <g key={`group-${marker.id}`}>
//             {isLabelsVisible && marker.polygon && (
//               <polygon
//                 points={marker.polygon}
//                 fill="url(#red-gradient)"
//                 stroke="transparent"
//                 strokeWidth="0"
//                 className="transition-all duration-300 pointer-events-auto cursor-pointer hover:opacity-80"
//               />
//             )}
//             <HotspotMarker
//               key={marker.id}
//               {...marker}
//               isVisible={isLabelsVisible}
//             />
//           </g>
//         ))}
//       </svg></div>
//       {/* Top Logo - Hidden when labels are visible */}
//       {!isLabelsVisible && (
//         <div className="absolute top-6 right-10 z-20 transition-opacity duration-300">
//           <img src={logo} alt="Logo" className="h-24 w-auto object-contain drop-shadow-md" />
//         </div>
//       )}

//       {/* SVG Canvas for Polygons and Labels */}

//       {/* Bottom Navigation */}
//       <BottomMenu
//         isViewActive={isLabelsVisible}
//         onToggleView={() => setIsLabelsVisible(!isLabelsVisible)}
//       />

//     </div>

//   );
// };

// export default Amenities;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import amenities_bg from "../../assets/amenities/SItePlan.png";
import terrace_bg from "../../assets/amenities/Terrace_plan.png";
import logo from "../../assets/logo.png";
import sitePlanLocal from "../../data/sitePlanConfig.json";
import terracePlanLocal from "../../data/terracePlanConfig.json";
import HotspotMarker from "../../components/SitePlan/HotspotMarker";
import BottomMenu from "../../components/SitePlan/BottomMenu";

interface MasterPlanItem {
  id: string;
  title: string;
  description: string;
  polygon?: string;
  x: number;
  y: number;
  _id?: string;
}

interface MasterPlanResponse {
  _id: string;
  type: "SitePlan" | "TerracePlan";
  image: string;
  name: string;
  masterplandata: MasterPlanItem[];
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

const parsePoints = (pointsStr?: string) => {
  if (!pointsStr) return null;
  // Match all numbers (including decimals/negatives if any)
  const numbers = pointsStr.match(/-?\d+(\.\d+)?/g);
  if (!numbers || numbers.length < 2) return null;

  const parsed = [];
  for (let i = 0; i < numbers.length; i += 2) {
    if (i + 1 < numbers.length) {
      parsed.push({
        x: parseFloat(numbers[i]),
        y: parseFloat(numbers[i + 1]),
      });
    }
  }
  return parsed.length > 0 ? parsed : null;
};

const ensureHighResCoordinate = (val: number, type: "x" | "y", currentLevel: "ground" | "terrace") => {
  const isLowRes = type === "x" ? val <= 1200 : val <= 629;
  if (!isLowRes) return val;

  const imgSize = currentLevel === "ground"
    ? (type === "x" ? 5121 : 2382)
    : (type === "x" ? 5325 : 2638);
  const targetSize = type === "x" ? 1200 : 629;

  return val * (imgSize / targetSize);
};

const ensureHighResPoints = (polygonStr?: string, currentLevel: "ground" | "terrace" = "ground") => {
  const points = parsePoints(polygonStr);
  if (!points) return null;

  // Detect if any X coordinate is in high-res range (> 1200)
  const isHighRes = points.some(pt => pt.x > 1200 || pt.y > 629);

  if (!isHighRes) {
    const imgW = currentLevel === "ground" ? 5121 : 5325;
    const imgH = currentLevel === "ground" ? 2382 : 2638;
    return points.map(pt => ({
      x: pt.x * (imgW / 1200),
      y: pt.y * (imgH / 629)
    }));
  }

  return points;
};

const ensureHighResMultipleLines = (polygonStr?: string, currentLevel: "ground" | "terrace" = "ground") => {
  if (!polygonStr) return [];
  const lineStrings = polygonStr.split(";");
  return lineStrings
    .map(lineStr => ensureHighResPoints(lineStr, currentLevel))
    .filter((line): line is { x: number; y: number }[] => line !== null);
};

const Amenities = () => {
  const [isLabelsVisible, setIsLabelsVisible] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<"ground" | "terrace">("ground");

  // API states
  const [sitePlanApiData, setSitePlanApiData] = useState<MasterPlanResponse | null>(null);
  const [terracePlanApiData, setTerracePlanApiData] = useState<MasterPlanResponse | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const siteRes = await fetch("https://api.featherlitesignature.futeservices.in/api/masterplan/type?type=SitePlan");
        if (siteRes.ok) {
          const siteJson = await siteRes.json();
          if (siteJson.success && siteJson.data && siteJson.data.length > 0) {
            setSitePlanApiData(siteJson.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch Site Plan data:", err);
      }

      try {
        const terraceRes = await fetch("https://api.featherlitesignature.futeservices.in/api/masterplan/type?type=TerracePlan");
        if (terraceRes.ok) {
          const terraceJson = await terraceRes.json();
          if (terraceJson.success && terraceJson.data && terraceJson.data.length > 0) {
            setTerracePlanApiData(terraceJson.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch Terrace Plan data:", err);
      }
    };

    fetchPlans();
  }, []);

  const activeBg = currentLevel === "ground"
    ? (sitePlanApiData?.image || amenities_bg)
    : (terracePlanApiData?.image || terrace_bg);

  const activeData: MasterPlanItem[] = currentLevel === "ground"
    ? (sitePlanApiData?.masterplandata || sitePlanLocal)
    : (terracePlanApiData?.masterplandata || terracePlanLocal);

  return (
    <div
      className="w-full h-screen overflow-hidden bg-neutral-900 relative"
      style={{
        backgroundImage: `url(${activeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      <div className="absolute inset-0 w-full h-full">
        <svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          viewBox={currentLevel === "ground" ? "0 0 5121 2382" : "0 0 5325 2638"}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient
              id="circle-gradient"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="#FF0000" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FF0000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Circles, Lines, and Labels */}
          {activeData.map((marker, index) => {
            const scale = currentLevel === "ground" ? 5121 / 1200 : 5325 / 1200;
            const lines = ensureHighResMultipleLines(marker.polygon, currentLevel);
            const hasLines = lines.length > 0;

            // Make sure the label and glowing dot coordinates are scaled up to match the high-res viewBox
            const boxDotX = ensureHighResCoordinate(marker.x, "x", currentLevel);
            const boxDotY = ensureHighResCoordinate(marker.y, "y", currentLevel);

            return (
              <g key={`group-${marker.id || index}-${index}`}>
                {isLabelsVisible && (
                  <>
                    {/* Render each connecting line if polygon exists */}
                    {hasLines && lines.map((linePoints, lIndex) => {
                      const pointsStr = linePoints.map((p) => `${p.x},${p.y}`).join(" ");
                      const lineDotX = linePoints[0].x;
                      const lineDotY = linePoints[0].y;

                      return (
                        <g key={`line-${lIndex}`}>
                          <motion.polyline
                            points={pointsStr}
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth={1.2 * scale}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          />
                          <circle
                            cx={lineDotX}
                            cy={lineDotY}
                            r={3.5 * scale}
                            fill="#EF4444"
                            className="pointer-events-none"
                          />
                        </g>
                      );
                    })}

                    {/* Original glowing background circle under/in the box */}
                    <circle
                      cx={boxDotX}
                      cy={boxDotY}
                      r={15 * scale}
                      fill="url(#circle-gradient)"
                      stroke="transparent"
                      strokeWidth="0"
                      className="transition-all duration-300 pointer-events-auto cursor-pointer hover:opacity-80"
                    />
                  </>
                )}
                <HotspotMarker
                  key={`${marker.id || index}-${index}`}
                  {...marker}
                  x={boxDotX}
                  y={boxDotY}
                  scale={scale}
                  isVisible={isLabelsVisible}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Top Logo - Always visible */}
      <div className="absolute top-2 right-4 z-20 transition-opacity duration-300">
        {/* Soft shadow background for logo visibility */}
        <div className="absolute inset-[-40px] bg-black/75 blur-[40px] rounded-full -z-10 pointer-events-none" />
        <img
          src={logo}
          alt="Logo"
          className="relative h-20 w-auto object-contain drop-shadow-2xl"
        />
      </div>

      {/* Bottom Navigation */}
      <BottomMenu
        isViewActive={isLabelsVisible}
        onToggleView={() => setIsLabelsVisible(!isLabelsVisible)}
        currentLevel={currentLevel}
        onChangeLevel={setCurrentLevel}
      />
    </div>
  );
};

export default Amenities;
