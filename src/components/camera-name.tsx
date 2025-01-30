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
      {camera.nickname ? (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="default">
              <Label>{camera.nickname}</Label>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={30}>
            {camera.name}
          </TooltipContent>
        </Tooltip>
      ) : (
        <Badge variant="default">
          <Label>{camera.name}</Label>
        </Badge>
      )}

      <StreamLink camera={camera} />
    </div>
  );
}
