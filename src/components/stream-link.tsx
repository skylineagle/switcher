import { CamerasResponse } from "@/types/types";
import { Video } from "lucide-react";

export function StreamLink({ camera }: { camera: CamerasResponse }) {
  return (
    <a
      href={`${import.meta.env.VITE_STREAM_URL}/${camera.name}`}
      target="_blank"
    >
      <Video className="h-4 w-4 text-blue-500" />
    </a>
  );
}
