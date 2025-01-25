import { Camera } from "@/types/types";
import { Video } from "lucide-react";

export interface StreamLinkProps {
  camera: Camera;
}

export function StreamLink({ camera }: StreamLinkProps) {
  return (
    <a
      href={`${import.meta.env.VITE_STREAM_URL}/${camera.name}`}
      target="_blank"
    >
      <Video className="h-4 w-4 text-blue-500" />
    </a>
  );
}
