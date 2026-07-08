import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/HomePage";

const Location = lazy(() => import("../pages/Location/Location"));
const Amenities = lazy(() => import("../pages/Amenities/Amenities"));
const Availability = lazy(() => import("../pages/Availability/Availability"));
const Media = lazy(() => import("../pages/Media/Media"));
const GalleryPage = lazy(() => import("../pages/Media/GalleryPage"));
const SectionalView = lazy(() => import("../components/Amenities/SectionalView"));
const UnitPlanPage = lazy(() => import("../pages/Availability/unitpage"));
const PanoramaViewer = lazy(() => import("../components/Amenities/PanaromaViewer"));
const Vr = lazy(() => import("../pages/Amenities/virtulatour"));
const CertificationsCard = lazy(() => import("../pages/Media/Certification"));
const TechnicalSpecificationsCard = lazy(() => import("../pages/Media/Technicalspecification"));
const Circulation = lazy(() => import("../pages/Amenities/Circulation"));

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
