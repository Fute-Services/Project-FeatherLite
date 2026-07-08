import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/media/gallery" || location.pathname === "/sectionalview" || location.pathname === "/technicalspecifictions" || location.pathname === "/certifictions";

  return (
    <ThemeProvider>
      <div className="w-full min-h-screen">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
        {!hideNavbar && <Navbar />}
      </div>
    </ThemeProvider>
  );
}

export default App;