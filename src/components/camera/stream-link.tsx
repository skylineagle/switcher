import { Video } from "lucide-react";

export interface StreamLinkProps {
  name: string;
}

export function StreamLink({ name }: StreamLinkProps) {
  return (
    <a href={`${import.meta.env.VITE_STREAM_URL}/${name}`} target="_blank">
      <Video className="h-4 w-4 text-blue-500" />
    </a>
  );
}
