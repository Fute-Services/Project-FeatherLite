import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/HomePage";
import Location from "../pages/Location/Location";
import Amenities from "../pages/Amenities/Amenities";
import Availability from "../pages/Availability/Availability";
import Media from "../pages/Media/Media";
import GalleryPage from "../pages/Media/GalleryPage";
import SectionalView from "../components/Amenities/SectionalView";
import UnitPlanPage from "../pages/Availability/unitpage";
import PanoramaViewer from "../components/Amenities/PanaromaViewer";
import Vr from "../pages/Amenities/virtulatour";
import CertificationsCard from "../pages/Media/Certification";
import TechnicalSpecificationsCard from "../pages/Media/Technicalspecification";
import Circulation from "../pages/Amenities/Circulation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "/location",
    element: <App />,
    children: [
      {
        path: "",
        element: <Location />,
      },
    ],
  },
  {
    path: "/amenities",
    element: <App />,
    children: [
      {
        path: "",
        element: <Amenities />,
      },
    ],
  },
  {
    path: "/availability",
    element: <App />,
    children: [
      {
        path: "",
        element: <Availability />,
      },
    ],
  },
  {
    path: "/media",
    element: <App />,
    children: [
      {
        path: "",
        element: <Media />,
      },
      {
        path: "gallery",
        element: <GalleryPage />,
      },
    ],
  },
  {
    path: "/sectionalview",
    element: <App />,
    children: [
      {
        path: "",
        element: <SectionalView />,
      },
    ],
  },
  {
    path: "/unitplan/:id",
    element: <App />,
    children: [
      {
        path: "",
        element: <UnitPlanPage />,
      },
    ],
  },
  {
    path: "/360-viewer",
    element: <App />,
    children: [
      {
        path: "",
        element: <PanoramaViewer />,
      },
    ],
  },
  {
    path: "/virtualtour",
    element: <App />,
    children: [
      {
        path: "",
        element: <Vr />,
      },
    ],
  },
  {
    path: "/certifictions",
    element: <App />,
    children: [
      {
        path: "",
        element: <CertificationsCard />,
      },
    ],
  },
  {
    path: "/technicalspecifictions",
    element: <App />,
    children: [
      {
        path: "",
        element: <TechnicalSpecificationsCard />,
      },
    ],
  },
  {
    path: "/circulation",
    element: <App />,
    children: [
      {
        path: "",
        element: <Circulation />,
      },
    ],
  },
]);
