import { StreamLink } from "@/components/camera/stream-link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@radix-ui/react-label";
import { memo } from "react";

export interface CameraNameProps {
  nickname?: string;
  name: string;
}

export const CameraName = memo(({ nickname, name }: CameraNameProps) => {
  return (
    <div className="flex items-center gap-2">
      {nickname ? (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="default" className="text-md">
              <Label>{nickname}</Label>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={30}>
            {name}
          </TooltipContent>
        </Tooltip>
      ) : (
        <Badge variant="default">
          <Label>{name}</Label>
        </Badge>
      )}

      <StreamLink name={name} />
    </div>
  );
});
