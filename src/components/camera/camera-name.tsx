import { StreamLink } from "@/components/camera/stream-link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/lib/auth";
import { getIsPermitted } from "@/lib/permissions";
import { Label } from "@radix-ui/react-label";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { PermissionsAllowedOptions } from "@/types/db.types";

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
