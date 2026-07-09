import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";

import logo from "../../assets/logo.png";
import boxes from "../../assets/Media/boxes.png";
import mediaBg from "../../assets/Media/Media Bg.png";
import brochurePdf from "../../assets/Media/broucher.pdf?url";
import BrochureCard from "../../components/Media/BrochureCard";
import GalleryCard from "../../components/Media/GalleryCard";
import WalkthroughCard from "../../components/Media/WalkthroughCard";
// 1. Import the new cards (Make sure these component files exist in your folder!)
import CertificationCard from "../../components/Media/CertificationCard";
import TechnicalSpecificationCard from "../../components/Media/TechnicalSpecificationCard";
// @ts-ignore
import backImg from "../../assets/unit/back.png";

// Bundle the PDF.js worker locally (same-origin) instead of fetching it from
// a CDN on every first load — removes an extra DNS/TLS/network round-trip
// before the brochure can start rendering.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function Media() {
  const navigate = useNavigate();
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

  // State for tracking PDF pages
  const [numPages, setNumPages] = useState<number | null>(null);
  // Only the pages near the one currently shown are rasterized — with 57
  // pages in the brochure, rendering all of them at once on open is what
  // made it feel slow. The rest stay as blank placeholders (same as before
  // any page has loaded) and render in as the user flips close to them.
  const [currentPage, setCurrentPage] = useState(0);
  const FlipBook = HTMLFlipBook as any;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div
      className="w-full h-screen overflow-hidden relative text-white"
      style={{
        fontFamily: '"Nortica Typeface", sans-serif',
        backgroundImage: `url(${mediaBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* --- LOGO: Right to Left --- */}
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-4 right-4 sm:top-6 sm:right-10 z-20 pointer-events-none"
      >
        <div className="absolute inset-[-40px] blur-[40px] rounded-full -z-10" />
        <img
          src={logo}
          alt="Logo"
          className="relative h-16 sm:h-20 lg:h-24 w-auto object-contain drop-shadow-2xl"
        />
      </motion.div>

      {/* Main Content Center: Bottom to Top */}
      <div className="w-full h-full flex items-center justify-center px-4 md:px-0 pt-[90px] sm:pt-[110px] lg:pt-[130px]">
        <motion.div
          initial={{ y: 800, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          // 2. INCREASED max-w-[750px] to max-w-[1200px] to fit the 5 cards
          className="flex flex-col md:flex-row h-[70vh] md:h-[60vh] max-h-[550px] w-full max-w-[1200px] relative z-10 shadow-2xl"
        >
          <BrochureCard onClick={() => setIsBrochureOpen(true)} />
          <GalleryCard onClick={() => navigate("/media/gallery")} />
          <WalkthroughCard onClick={() => setIsWalkthroughOpen(true)} />
          {/* 3. Added the new cards */}
          <CertificationCard onClick={() => navigate("/certifictions")} />
          <TechnicalSpecificationCard
            onClick={() => navigate("/technicalspecifictions")}
          />
        </motion.div>
      </div>

      {/* --- BOXES: Left to Right --- */}
      <motion.img
        initial={{ x: -500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        src={boxes}
        className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[70%]"
        alt="Decorative Boxes"
      />

      {/* Brochure PDF Modal Logic (Flipbook Version) */}
      {isBrochureOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex flex-col items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsBrochureOpen(false)}
              className="absolute top-0 right-0 md:-top-5 md:-right-5 z-20 p-2 bg-[#FF0000] text-white rounded hover:bg-red-700 transition-colors shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Flipbook Container */}
            <Document
              file={brochurePdf}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center items-center w-full h-full"
            >
              {numPages && (
                <FlipBook
                  width={450}
                  height={420}
                  size="stretch"
                  minWidth={315}
                  maxWidth={1000}
                  minHeight={400}
                  maxHeight={1533}
                  showCover={true}
                  className="shadow-2xl"
                  onFlip={(e: any) => setCurrentPage(e.data)}
                >
                  {/* Dynamically render all PDF pages into the flipbook.
                      Only pages near the current one are actually rasterized;
                      the rest render as blank placeholders until the user
                      flips close enough to need them. */}
                  {Array.from(new Array(numPages), (_, index) => (
                    <div
                      key={`page_${index + 1}`}
                      className="bg-white w-full h-full flex justify-center items-center overflow-hidden"
                    >
                      {Math.abs(index - currentPage) <= 3 && (
                        <Page
                          pageNumber={index + 1}
                          width={684}
                          scale={0.75}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          className="flex justify-center items-center"
                        />
                      )}
                    </div>
                  ))}
                </FlipBook>
              )}
            </Document>
          </div>
        </div>
      )}

      {/* Walkthrough Video Modal Logic */}
      {isWalkthroughOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-md">
          {/* Back Button */}
          <div className="absolute bottom-10 left-8 md:bottom-12 md:left-12 z-[110]">
            <button
              onClick={() => setIsWalkthroughOpen(false)}
              className="block w-[35px] h-[35px] sm:w-[42px] sm:h-[42px] cursor-pointer hover:scale-105 transition-transform bg-transparent border-none outline-none p-0"
            >
              <img src={backImg} alt="Back" className="w-full h-full object-contain" />
            </button>
          </div>

          <div className="relative w-full max-w-[1200px] aspect-video bg-black rounded-lg overflow-hidden shadow-2xl flex flex-col">
            <iframe
              src="https://www.youtube.com/embed/CgHy7kYATNo?autoplay=1"
              className="w-full h-full flex-1 border-none"
              title="Walkthrough Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Media;
