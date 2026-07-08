import bgImage from "../../assets/LocationPage/Copy of Featherlite Signature Aerial Shot_01 day (1).jpg";
function Location() {
  return (
    <div className="w-full h-screen">
      <img
        src={bgImage}
        alt="Location"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default Location;