import { StreamLink } from "@/components/camera/stream-link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/services/auth";
import { PermissionsAllowedOptions } from "@/types/db.types";
import { getIsPermitted } from "@/services/permissions";
import { Label } from "@radix-ui/react-label";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";

export interface CameraNameProps {
  nickname?: string;
  name: string;
}

export const CameraName = memo(({ nickname, name }: CameraNameProps) => {
  const { user } = useAuthStore();
  const { data: isPermitted } = useQuery({
    queryKey: ["permissions", "stream_view", user?.id],
    queryFn: async () =>
      await getIsPermitted(
        "stream_view",
        (user?.level ?? "user") as PermissionsAllowedOptions
      ),
  });

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

      {isPermitted && <StreamLink name={name} />}
    </div>
  );
});
