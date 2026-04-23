import { Outlet } from "react-router-dom";
import { ImageStudioProvider } from "../../context/ImageStudioContext";

export default function ImageStudioShell() {
  return (
    <ImageStudioProvider>
      <Outlet />
    </ImageStudioProvider>
  );
}