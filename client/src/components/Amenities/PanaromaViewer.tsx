import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SRGBColorSpace,
  SphereGeometry,
  TextureLoader,
  MeshBasicMaterial,
  Mesh,
  MathUtils,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const PanoramaViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the specific panorama image passed from the SectionalView click
  // Fallback to a default image if accessed directly
  const panoramaImage = location.state?.panoramaImage || "/default-placeholder.jpg";

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new Scene();
    const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // Camera inside the sphere

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

   // 2. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false; 
    controls.enablePan = false;
    controls.rotateSpeed = -0.5;

    // Auto-rotation settings
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5; 

    // Use 'any' to avoid strict TypeScript DOM/Node environment conflicts
    let interactionTimeout: any;

    controls.addEventListener('start', () => {
      // User grabbed the image -> stop auto-rotating
      clearTimeout(interactionTimeout);
      controls.autoRotate = false; 
    });

    controls.addEventListener('end', () => {
      // User let go -> wait 1.5 seconds, then resume auto-rotation
      interactionTimeout = setTimeout(() => {
        controls.autoRotate = true;
      }, 1500);
    });

    // 3. Sphere Geometry & Texture
    const geometry = new SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Crucial: Invert the sphere to see the texture from the inside

    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(panoramaImage);
    texture.colorSpace = SRGBColorSpace;
    const material = new MeshBasicMaterial({ map: texture });
    
    const sphere = new Mesh(geometry, material);
    
    // Rotate the sphere 45 degrees on the Y (vertical) axis
    // Note: If this rotates it 45 degrees to the right instead of left, 
    // just make it negative: -Math.PI / 4
    sphere.rotation.y = -Math.PI / 2; 
    
    scene.add(sphere);

    // 4. Animation Loop
    let animationFrameId: number;
    const targetPolarAngle = Math.PI / 2; // 90 degrees (horizon)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // --- NEW, BUG-FREE CENTERING LOGIC ---
      if (controls.autoRotate) {
        const currentPolar = controls.getPolarAngle();
        
        // If camera is off-center vertically...
        if (Math.abs(currentPolar - targetPolarAngle) > 0.005) {
          // Calculate the smooth step toward the horizon
          const newPolar = MathUtils.lerp(currentPolar, targetPolarAngle, 0.02);
          
          // Adjust camera position directly instead of fighting the controls
          const radius = camera.position.distanceTo(controls.target);
          const azimuth = controls.getAzimuthalAngle();
          
          camera.position.setFromSphericalCoords(radius, newPolar, azimuth);
          camera.position.add(controls.target); // Keeps it anchored to the center
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 5. Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 6. Cleanup to prevent memory leaks
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      texture.dispose();
      
      // ADD THIS LINE: Forces the browser to free up the WebGL slot immediately
      renderer.forceContextLoss(); 
      renderer.dispose();
    };
  }, [panoramaImage]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Custom SVG Back Button */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="absolute bottom-8 left-16 z-50 group"
      >
        <svg
          width="70"
          height="70"
          viewBox="0 0 70 70"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105 drop-shadow-lg"
        >
          <circle cx="35" cy="35" r="32" fill='#CDAE7F' />
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

      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};

export default PanoramaViewer;