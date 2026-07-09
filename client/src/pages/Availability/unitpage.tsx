import { useParams, useNavigate } from "react-router-dom";


import backBtnImg from '../../assets/unit/back.png';
import zoomBtnImg from '../../assets/unit/zoom.png';
import minusBtnImg from '../../assets/unit/minus.png';
import zoomoutBtnImg from '../../assets/unit/zoomout.png';
import verticalLinePanel from '../../assets/unit/vertical_line_panel.png';
import buaImg from '../../assets/unit/BUA.png';
import boxes from '../../assets/Media/boxes.png';
import upIcon from '../../assets/unit/up_icon.png';
import downIcon from '../../assets/unit/down_icon.png';
import bottomFloorNameImg from '../../assets/unit/Bottom_floor_name.png';
import logo from '../../assets/logo.png';

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import floorData from '../../data/floorData.json';

// Using solid background color instead of image to match Media page

// Specific zoom area mappings for each floor
const zoomCoordinates: Record<string, { scale: number, x: number, y: number }> = {
    "11th": { scale: 2, x: -65, y: 279 },
    "10th": { scale: 2, x: -65, y: 279 },
    "9th refuge": { scale: 1.50, x: -44, y: 172 },
    "8th": { scale: 1.50, x: -44, y: 172 },
    "7th": { scale: 1.50, x: -36, y: 127 },
    "6th refuge": { scale: 1.50, x: -65, y: 85 },
    "5th": { scale: 1.50, x: -43, y: 50 },
    "default": { scale: 1.5, x: 0, y: 0 } // Fallback
};

// Renders one room's rect/polygon hotspots. Memoized so hovering one room
// doesn't force every other room's SVG elements to re-render.
const RoomHotspotGroup = memo(function RoomHotspotGroup({
    roomObj,
    isHovered,
    isActive,
    onHover,
    onLeave,
    onSelect,
}: {
    roomObj: any;
    isHovered: boolean;
    isActive: boolean;
    onHover: (name: string) => void;
    onLeave: () => void;
    onSelect: (name: string) => void;
}) {
    if (!roomObj.polygon && !roomObj.rectangles) return null;

    const rectItems = roomObj.rectangles || roomObj.polygon || [];

    let fillColor = 'transparent';
    let strokeColor = 'transparent';
    if (isHovered) {
        fillColor = 'rgba(250, 146, 0, 0.6)';
        strokeColor = 'rgba(197, 168, 128, 1)';
    } else if (isActive) {
        fillColor = 'rgba(197, 168, 128, 0.4)';
        strokeColor = 'rgba(197, 168, 128, 0.8)';
    }

    const interactiveProps = {
        className: "transition-all duration-300",
        style: {
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: 2,
            cursor: 'pointer',
            pointerEvents: 'auto' as const
        },
        onMouseEnter: () => onHover(roomObj.name),
        onMouseLeave: () => onLeave(),
        onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onSelect(roomObj.name);
        }
    };

    return (
        <>
            {rectItems.map((item: any) => {
                // If we have polygon coordinates
                if (item.polygon) {
                    const coords = item.polygon.split(',').map(Number);
                    // If it's a 2-point bounding box (x1, y1, x2, y2), draw as rect
                    if (coords.length === 4) {
                        const x = Math.min(coords[0], coords[2]);
                        const y = Math.min(coords[1], coords[3]);
                        const width = Math.abs(coords[2] - coords[0]);
                        const height = Math.abs(coords[3] - coords[1]);
                        return (
                            <rect
                                key={item._id || item.rect_Id || item.poly_Id}
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                                {...interactiveProps}
                            />
                        );
                    }
                    // Otherwise, render as polygon
                    return (
                        <polygon
                            key={item._id || item.poly_Id}
                            points={item.polygon}
                            {...interactiveProps}
                        />
                    );
                }

                // If we have direct rect coordinates
                if (item.x !== undefined && item.y !== undefined) {
                    return (
                        <rect
                            key={item._id || item.rect_Id || item.poly_Id}
                            x={item.x}
                            y={item.y}
                            width={item.width}
                            height={item.height}
                            {...interactiveProps}
                        />
                    );
                }

                return null;
            })}
        </>
    );
});

export default function UnitPlanPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Decode ID (e.g. "9%20Refuge" -> "9 Refuge")
    const floorId = id ? decodeURIComponent(id) : '';
    // The topmost level is the Terrace: it has no rooms / side panel / 2D plan,
    // so hide those UI pieces and label it "Terrace" instead of "11".
    const isTerrace = String(floorId).toLowerCase() === "11" || String(floorId).toLowerCase() === "11th";
    const displayFloorName = isTerrace ? "Terrace" : floorId;

    const isLoading = floorData.length === 0;

    const currentUnit = useMemo(() => {
        if (!floorData.length) return null;
        return floorData.find((f) => String(f.level).toLowerCase() === String(floorId).toLowerCase());
    }, [floorData, floorId]);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [activeRoom, setActiveRoom] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const [imgSize3D, _setImgSize3D] = useState({ w: 2000, h: 1125 });
    const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

    const handleRoomHover = useCallback((name: string) => setHoveredRoom(name), []);
    const handleRoomLeave = useCallback(() => setHoveredRoom(null), []);
    const handleRoomSelect = useCallback((name: string) => setActiveRoom(name), []);

    const containerRef = useRef<HTMLDivElement>(null);
    const minimapRef = useRef<HTMLDivElement>(null);
    const [transformOrigin, setTransformOrigin] = useState('bottom right');

    const computeOrigin = useCallback(() => {
        if (!containerRef.current || !minimapRef.current) return;
        const cRect = containerRef.current.getBoundingClientRect();
        const mRect = minimapRef.current.getBoundingClientRect();
        const cx = mRect.left + mRect.width / 2 - cRect.left;
        const cy = mRect.top + mRect.height / 2 - cRect.top;
        const ox = ((cx / cRect.width) * 100).toFixed(2) + '%';
        const oy = ((cy / cRect.height) * 100).toFixed(2) + '%';
        setTransformOrigin(`${ox} ${oy}`);
    }, []);

    useEffect(() => {
        computeOrigin();
        window.addEventListener('resize', computeOrigin);
        return () => window.removeEventListener('resize', computeOrigin);
    }, [computeOrigin]);

    const handleMiniMapClick = () => {
        const next = (selectedImageIndex + 1) % 2;
        computeOrigin();
        setSelectedImageIndex(next);
    };

    useEffect(() => {
        if (zoom > 1) setIsPanelOpen(false);
        else setIsPanelOpen(true);
    }, [zoom]);

    const handleZoomIn = () => {
        const coords = zoomCoordinates[floorId.toLowerCase()] || zoomCoordinates["default"];
        if (zoom === 1) {
            // 1st click: Zoom to specific particular area based on floorId
            setZoom(coords.scale);
            setPosition({ x: coords.x, y: coords.y });
        } else if (zoom === coords.scale) {
            // 2nd click: Zoom in further at same position
            setZoom(coords.scale + 0.5);
        }
    };

    const handleZoomOut = () => {
        const coords = zoomCoordinates[floorId.toLowerCase()] || zoomCoordinates["default"];
        if (zoom > coords.scale) {
            // 1st click out: Drop back to specific area zoom
            setZoom(coords.scale);
        } else if (zoom > 1) {
            // 2nd click out: Reset to normal view
            setZoom(1);
            setPosition({ x: 0, y: 0 });
        }
    };


    useEffect(() => {
        let rafId: number | null = null;
        let pendingPosition: { x: number; y: number } | null = null;

        const flush = () => {
            rafId = null;
            if (pendingPosition) {
                setPosition(pendingPosition);
                pendingPosition = null;
            }
        };
        const schedule = (pos: { x: number; y: number }) => {
            pendingPosition = pos;
            if (rafId === null) rafId = requestAnimationFrame(flush);
        };

        const onMouseMove = (e: MouseEvent) => {
            if (isDragging && zoom > 1) {
                schedule({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
            }
        };
        const onTouchMove = (e: TouchEvent) => {
            if (isDragging && zoom > 1) {
                if (e.cancelable) e.preventDefault();
                const t = e.touches[0];
                schedule({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
            }
        };
        const onEnd = () => setIsDragging(false);
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('touchmove', onTouchMove, { passive: false });
            window.addEventListener('mouseup', onEnd);
            window.addEventListener('touchend', onEnd);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchend', onEnd);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [isDragging, zoom, dragStart]);

    const onMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) { setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); }
    };
    const onTouchStart = (e: React.TouchEvent) => {
        if (zoom > 1) {
            const t = e.touches[0];
            setIsDragging(true);
            setDragStart({ x: t.clientX - position.x, y: t.clientY - position.y });
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#101010] text-white">
                <div className="animate-pulse">Loading Unit Details...</div>
            </div>
        );
    }

    if (!currentUnit) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#101010] text-white gap-4">
                <p>Floor data not found for ID: {floorId}</p>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white/10 rounded">Go Back</button>
            </div>
        );
    }


    const planImages = [currentUnit.image3D, currentUnit.image2D];
    const nextImage = planImages[(selectedImageIndex + 1) % planImages.length];

    const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    const DUR = '680ms';

    const is3dActive = selectedImageIndex === 0;
    const is2dActive = selectedImageIndex === 1;

    return (
        <div
            className="h-screen w-full bg-[#072847] relative overflow-hidden flex font-sans"
        >


            {/* Background Glows using radial-gradients for reliable rendering */}
            <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0"
                style={{ background: 'radial-gradient(ellipse at center, rgba(115, 227, 255, 0.47) 0%, rgba(115, 227, 255, 0) 65%)' }} />

            <div className={`absolute top-1/2 left-[3%] -translate-y-1/2 w-[200px] h-[300px] pointer-events-none z-0 transition-opacity duration-[800ms] ${isPanelOpen ? 'opacity-100' : 'opacity-0'}`}
                style={{ background: 'radial-gradient(ellipse at center, rgba(115, 227, 255, 0.47)  0%, rgba(115, 227, 255, 0) 65%)' }} />

            <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] pointer-events-none z-0"
                style={{ background: 'radial-gradient(ellipse at center, rgba(115, 227, 255, 0.25) 0%, rgba(115, 227, 255, 0) 65%)' }} />

            {/* Decorative Boxes */}
            <img
                src={boxes}
                className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[60%] pointer-events-none z-0"
                alt="Decorative Boxes"
            />

            {/* TEMPORARY DEBUGGER OVERLAY */}
            {/* <div className="fixed bottom-[120px] left-[120px] z-[2000] bg-black/80 text-white p-4 rounded text-xs pointer-events-none font-mono">
                    <div>Scale (Zoom): {zoom.toFixed(2)}</div>
                    <div>X: {position.x.toFixed(0)}</div>
                    <div>Y: {position.y.toFixed(0)}</div>
                    <div>Floor ID: {floorId.toLowerCase()}</div>
                </div> */}

            {/* Top Center Floor Title (left-aligned for the Terrace) */}
            <div
                className={`absolute top-10 sm:top-14 w-full flex ${isTerrace ? 'justify-start pl-8 sm:pl-16 lg:pl-24' : 'justify-center'} pointer-events-none z-10`}
                style={{
                    opacity: is2dActive ? 0 : 1,
                    transition: `opacity ${DUR} ${EASE}`,
                }}
            >
                <h1 className="tracking-wide flex items-baseline gap-1" style={{
                    fontFamily: '"Nortica", sans-serif', /* Updated Font Family */
                    background: 'linear-gradient(180deg, #FFF 0%, #73E3FF 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    <span className="capitalize text-[60px] sm:text-[75px] font-medium leading-none">{displayFloorName}</span>
                    {/* <span className="text-[20px] sm:text-[28px] mr-2 leading-none relative -top-6">th</span> */}
                    <span className="text-[50px] sm:text-[50px] font-light leading-none ml-3">Floor</span>
                </h1>
            </div>

            {/* Top Left Floor Toggle */}
            {!isTerrace && (
            <div
                className={`fixed left-4 sm:left-6 lg:left-8 xl:left-[90px] top-[80px] sm:top-[100px] xl:top-[120px] z-[1100] flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 ${zoom > (zoomCoordinates[floorId.toLowerCase()]?.scale || 2) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onClick={() => setIsPanelOpen(!isPanelOpen)}
            >
                <div className="text-white font-sans flex  items-baseline gap-[2px] drop-shadow-md mb-1">
                    <span className="capitalize text-[18px] sm:text-[22px] font-medium" style={{
                        background: 'linear-gradient(180deg, #FFF 0%, #73E3FF 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>{floorId}</span>
                    {/* <span className="text-[10px] sm:text-[12px] relative -top-2">th</span> */}
                    <span className="text-[18px] sm:text-[22px] font-light ml-1">Floor</span>
                </div>
                <img
                    src={bottomFloorNameImg}
                    alt="Decorative Line"
                    className="w-[80px] sm:w-[100px] object-contain mb-1"
                />
                <img
                    src={isPanelOpen ? downIcon : upIcon}
                    alt="Toggle Panel"
                    className="w-[20px] sm:w-[24px] object-contain drop-shadow-md"
                />
            </div>
            )}

            {/* Top Right Logo */}
            <div className="absolute top-8 sm:top-12 right-10 sm:right-16 z-20 pointer-events-none hidden sm:block">
                <img src={logo} alt="Logo" className="w-[180px] sm:w-[220px] object-contain drop-shadow-2xl" />
            </div>

            <button
                className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 w-[35px] h-[35px] sm:w-[42px] sm:h-[42px] flex items-center justify-center z-20 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform"
                onClick={() => navigate(-1)}
            >
                <img src={backBtnImg} alt="Back" className="w-full h-full object-contain" />
            </button>

            {/* Side Panel Wrapper (Fixed Position) */}
            {!isTerrace && (
            <div
                className={`fixed left-3.5 sm:left-5 lg:left-[24px] xl:left-[30px] top-[140px] sm:top-[160px] lg:top-[170px] xl:top-[200px] z-[1000] bg-transparent max-w-[calc(100vw-28px)] sm:max-w-none
            ${selectedImageIndex === 0 || selectedImageIndex === 1 ? 'visible' : 'invisible'}`}
            >
                <div className="relative pl-[30px] sm:pl-[40px] lg:pl-[40px] xl:pl-[50px]">

                    {/* 1. Image sliding FULLY LEFT like motion div (used -translate-x-[200px] instead of % so it moves far enough) */}
                    <img
                        src={verticalLinePanel}
                        alt="Panel Line"
                        className={`absolute left-5 -top-4 h-[350px] sm:h-[400px] lg:h-[450px] xl:h-[400px] w-auto object-contain object-left pointer-events-none transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isPanelOpen ? 'translate-x-0 opacity-100' : '-translate-x-[200px] opacity-0'}`}
                    />

                    {/* 2. Content sliding UP only */}
                    <div className={`transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isPanelOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-[200px] opacity-0 pointer-events-none'}`}>
                        <ul className="list-none p-0 m-0 flex flex-col gap-2 sm:gap-3 lg:gap-3 xl:gap-4 relative z-10">
                            {currentUnit.sideContent?.map((roomObj: any) => {
                                const isActive = activeRoom === roomObj.name;
                                const isHovered = hoveredRoom === roomObj.name;

                                return (
                                    <li
                                        key={roomObj.id}
                                        onClick={() => { setActiveRoom(roomObj.name); }}
                                        onMouseEnter={() => setHoveredRoom(roomObj.name)}
                                        onMouseLeave={() => setHoveredRoom(null)}
                                        className={`relative cursor-pointer font-semibold transition-all duration-300 font-[Poppins,sans-serif] not-italic
                                    text-[11px] sm:text-[12px] lg:text-[11px] xl:text-[13px] 2xl:text-[14px]
                                    py-[6px] px-[12px] sm:py-[8px] sm:px-[18px] lg:py-[8px] lg:px-[18px] xl:py-[10px] xl:px-[24px] 2xl:px-[30px]
                                    min-w-[100px] sm:min-w-[130px] lg:min-w-[140px] xl:min-w-[160px] 2xl:min-w-[180px]
                                    ${isActive || isHovered
                                                ? 'bg-gradient-to-r from-[#C5A880] to-transparent text-white font-bold'
                                                : 'text-white/80 hover:text-white bg-transparent'}`}
                                    >
                                        {roomObj.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            )}

            {/* Main Content */}
            <div
                ref={containerRef}
                className="flex-1 flex items-center justify-center relative touch-none overflow-hidden"
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
            >
                {/* 3D VIEW */}
                <div
                    className="absolute inset-0 flex items-center justify-center p-[10px_8px] sm:p-[14px_10px] lg:p-3 xl:p-4 gap-2 sm:gap-2.5 lg:gap-2 xl:gap-3.5"
                    style={{
                        transform: is3dActive ? 'scale(1)' : 'scale(0)',
                        opacity: is3dActive ? 1 : 0,
                        transformOrigin: transformOrigin,
                        transition: `transform ${DUR} ${EASE}, opacity ${DUR} ${EASE}`,
                        willChange: 'transform, opacity',
                        pointerEvents: is3dActive ? 'auto' : 'none',
                    }}
                >
                    {planImages[0] && (
                        <div
                            className="relative w-full h-full rounded-[20px]
                max-w-[90%] max-h-[70vh]
                sm:max-w-[85%] sm:max-h-[75vh]
                lg:max-w-[80%] lg:max-h-[80vh]
                xl:max-w-[80%] xl:max-h-[80vh]
                2xl:max-w-[80%] 2xl:max-h-[80vh]"
                            style={{
                                transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
                                transformOrigin: 'center',
                                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                                transition: isDragging ? 'none' : `transform 700ms ${EASE}`,
                                willChange: 'transform'
                            }}
                        >
                            {/* 1. Base Image (Unfurnished) - Now clipped to the RIGHT side of the slider */}
                            <img
                                src={planImages[0]}
                                alt="3D Floor Plan Base"
                                className="absolute inset-0 w-full h-full select-none object-contain pointer-events-none rounded-[20px]"
                                draggable={false}
                                /* style={{
                                    clipPath: `polygon(${sliderValue}% 0, 100% 0, 100% 100%, ${sliderValue}% 100%)`
                                }} */
                            />

                            {/* 2. Overlay Image (Furnished Placeholder) - Clipped to the LEFT side of the slider */}
                            {/* <img
                                src="https://res.cloudinary.com/db0f2ofgf/image/upload/v1777960614/Third_Floor_2_pxbcq5.png"
                                alt="3D Floor Plan Furnished"
                                className="absolute inset-0 w-full h-full select-none object-contain pointer-events-none rounded-[20px]"
                                draggable={false}
                                style={{
                                    clipPath: `polygon(0 0, ${sliderValue}% 0, ${sliderValue}% 100%, 0 100%)`
                                }}
                            /> */}

                            {/* 3. The SVG Layer (interactive room hotspots) */}
                            <svg
                                viewBox={`0 0 ${imgSize3D.w} ${imgSize3D.h}`}
                                className="absolute inset-0 w-full h-full pointer-events-none rounded-[20px]"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                {currentUnit.sideContent?.map((roomObj: any) => (
                                    <RoomHotspotGroup
                                        key={roomObj.id || roomObj.name}
                                        roomObj={roomObj}
                                        isHovered={hoveredRoom === roomObj.name}
                                        isActive={activeRoom === roomObj.name}
                                        onHover={handleRoomHover}
                                        onLeave={handleRoomLeave}
                                        onSelect={handleRoomSelect}
                                    />
                                ))}
                            </svg>

                            {/* 4. Custom Slider Visuals (Line and Grab Handle) */}
                            {/* <div
                                className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center z-20"
                                style={{ left: `${sliderValue}%`, transform: 'translateX(-50%)' }}
                            >
                                <div className="absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)]" />

                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg relative z-30 transition-transform duration-150 hover:scale-110">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 17l-5-5 5-5" />
                                        <path d="M13 17l5-5-5-5" />
                                    </svg>
                                </div>
                            </div> */}

                            {/* 5. Injected CSS for Slider interaction */}
                            {/* <style>{`
                .comparison-slider {
                    pointer-events: none;
                }
                .comparison-slider::-webkit-slider-thumb {
                    pointer-events: auto;
                    width: 40px;
                    height: 100vh;
                    appearance: none;
                    -webkit-appearance: none;
                }
                .comparison-slider::-moz-range-thumb {
                    pointer-events: auto;
                    width: 40px;
                    height: 100vh;
                    border: none;
                    background: transparent;
                }
            `}</style> */}

                            {/* 6. Invisible Range Slider (Handles all touch/mouse drag events cleanly) */}
                            {/* <input
                                type="range"
                                min="0"
                                max="100"
                                value={sliderValue}
                                onChange={(e) => setSliderValue(Number(e.target.value))}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="comparison-slider absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0 p-0"
                            /> */}
                        </div>
                    )}
                </div>

                {/* 2D VIEW */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center
                        p-[10px_8px] sm:p-[14px_10px] lg:p-3 xl:p-4
                        gap-2 sm:gap-2.5 lg:gap-2 xl:gap-3.5"
                    style={{
                        transform: is2dActive ? 'scale(1)' : 'scale(0)',
                        opacity: is2dActive ? 1 : 0,
                        transformOrigin: transformOrigin,
                        transition: `transform ${DUR} ${EASE}, opacity ${DUR} ${EASE}`,
                        willChange: 'transform, opacity',
                        pointerEvents: is2dActive ? 'auto' : 'none',
                    }}
                >
                    <div
                        className="relative shrink ml-[4px] rounded-[20px]
                                max-w-[95%] max-h-[65vh]
                                sm:max-w-[95%] sm:max-h-[68vh]
                                lg:max-w-[96%] lg:max-h-[72vh]
                                xl:max-w-full xl:max-h-[74vh]
                                2xl:max-w-full 2xl:max-h-[75vh]"
                        style={{
                            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
                            transformOrigin: 'center center',
                            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                            transition: isDragging ? 'none' : `transform 700ms ${EASE}`,
                            willChange: 'transform',
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {planImages[1] && (
                            <img
                                src={planImages[1]}
                                alt="2D Floor Plan"
                                className="rounded-[20px] select-none w-auto h-auto max-w-full max-h-full object-contain pointer-events-none"
                                draggable={false}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute flex gap-4 z-20
                    right-[12%] bottom-8 sm:right-[15%] lg:right-[12%] xl:right-[10%] 2xl:right-[120px] sm:bottom-12">
                <button
                    className="flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform
                            w-[35px] h-[35px] sm:w-[42px] sm:h-[42px]"
                    onClick={handleZoomIn}
                >
                    <img src={zoomBtnImg} alt="Zoom In" className="w-full h-full object-contain" />
                </button>

                <button
                    disabled={zoom <= 1}
                    className={`flex items-center justify-center shadow-lg transition-transform
                            w-[35px] h-[35px] sm:w-[42px] sm:h-[42px]
                            ${zoom <= 1 ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                    onClick={handleZoomOut}
                >
                    <img src={zoom <= 1 ? minusBtnImg : zoomoutBtnImg} alt="Zoom Out" className="w-full h-full object-contain" />
                </button>
            </div>

            {/* BUA Graphic */}
            <div className="absolute right-[12%] sm:right-[15%] lg:right-[12%] xl:right-[10%] 2xl:right-[120px] top-[40%] sm:top-[35%] lg:top-[38%] 2xl:top-[40%] -translate-y-1/2 z-20 pointer-events-none">
                <img src={buaImg} alt="Total BUA" className="w-[80px] sm:w-[110px] lg:w-[130px] xl:w-[145px] 2xl:w-[160px] object-contain drop-shadow-xl" />
            </div>

            {currentUnit.image2D && (
            <div
                ref={minimapRef}
                className={`absolute bg-[#1D7AD9] flex items-center justify-center z-30 overflow-hidden cursor-pointer transition-all duration-300
                        bottom-[10px] right-[10px] w-[90px] h-[70px] rounded-xl border border-white/20 shadow-xl
                        sm:bottom-[14px] sm:right-[14px] sm:w-[130px] sm:h-[104px] sm:rounded-[20px]
                        lg:bottom-[5%] lg:right-[3%] lg:w-[160px] lg:h-[124px] lg:rounded-[20px]
                        xl:bottom-[6%] xl:right-[5.5%] xl:w-[160px] xl:h-[120px]
                        2xl:bottom-[14%] 2xl:right-[70px] 2xl:w-[200px] 2xl:h-[130px]
                        ${zoom > 1 ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                onClick={handleMiniMapClick}
            >
                {nextImage && (
                    <img src={nextImage} alt="Switch View" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                    <span className="text-white font-bold tracking-wider text-xs shadow-black drop-shadow-md">
                        {is3dActive ? '2D VIEW' : '3D VIEW'}
                    </span>
                </div>
            </div>
            )}
        </div>
    );
}