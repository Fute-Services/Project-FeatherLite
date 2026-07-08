import homeDay from "../../assets/Home Page/home day.png"
import homeNight from "../../assets/Home Page/home night.png"
import logo from "../../assets/logo.png"
import { useTheme } from "../../context/ThemeContext"

function Home() {
  const { theme } = useTheme();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-900">
      {/* Day Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${theme === "day" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        style={{
          backgroundImage: `url(${homeDay})`,
          backgroundSize: '100%',
          backgroundPosition: 'center 70%',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* Night Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${theme === "night" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        style={{
          backgroundImage: `url(${homeNight})`,
          backgroundSize: '100%',
          backgroundPosition: 'center 70%',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="absolute top-6 right-10 z-20 transition-opacity duration-300">
        {/* Soft shadow background for logo visibility */}
        <div className="absolute inset-[-40px] bg-sky-800/30 blur-[40px] rounded-full -z-10 pointer-events-none" />
        <img src={logo} alt="Logo" className="relative h-24 w-auto object-contain drop-shadow-2xl" />
      </div>
    </div>
  );
}

export default Home;