import { CopyButton } from "@/components/ui/copy-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Camera } from "@/types/types";
import { Label } from "@radix-ui/react-label";
import { StreamLink } from "./stream-link";
import { Badge } from "./ui/badge";

export interface CameraNameProps {
  camera: Camera;
}

export function CameraName({ camera }: CameraNameProps) {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="default">
            <Label>{camera.name}</Label>
          </Badge>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={30}
          className="flex items-center gap-2"
        >
          <span>ID: {camera.id}</span>
          <CopyButton
            value={camera.id}
            className="text-foreground hover:bg-muted hover:text-foreground"
          />
        </TooltipContent>
      </Tooltip>
      <StreamLink camera={camera} />
    </div>
  );
}
