// import bgImage from "../../assets/LocationPage/Copy of Featherlite Signature Aerial Shot_01 day (1).jpg";
import logo from "../../assets/logo.png";

function Location() {
  return (
    <div className="relative w-full h-screen">
      {/* <img
        src={bgImage}
        alt="Location"
        className="w-full h-full object-cover"
      /> */}
      <iframe
        src="https://futeservices.com/26-27/Featherlight/index.html"
        title="Location Panorama"
        className="w-full h-full border-none"
        allow="accelerometer; gyroscope; magnetometer; vr"
        allowFullScreen
      />

      {/* Top Right Logo */}
      <div className="absolute top-4 right-4 md:top-6 md:right-10 z-20 pointer-events-none">
        {/* Soft shadow background for logo visibility */}
        <div className="absolute inset-[-40px] bg-sky-800/30 blur-[40px] rounded-full -z-10" />
        <img
          src={logo}
          alt="Logo"
          className="relative h-14 md:h-24 w-auto object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}

export default Location;