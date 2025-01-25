import { Label } from "@/components/ui/label";
import { CamerasResponse } from "@/types/db.types";
import { CameraAutomation } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Countdown from "react-countdown";

type CountdownData = {
  countdownTime: number;
  until: "on" | "off";
};

interface AutomationIndicatorProps {
  camera: CamerasResponse<CameraAutomation>;
}

export function AutomationIndicator({ camera }: AutomationIndicatorProps) {
  const { data } = useQuery<CountdownData>({
    queryKey: ["jobs", camera.id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BAKER_URL}/jobs/${camera.id}/next`
      );
      const data = await response.json();

      if (
        !response.ok ||
        !camera?.automation?.minutesOn ||
        !camera?.automation?.minutesOff
      ) {
        throw new Error("Failed to fetch next execution");
      }

      const secondsUntilNextExecution = Math.floor(
        (new Date(data?.nextExecution).getTime() - new Date().getTime()) / 1000
      );

      console.log("seconds until:", secondsUntilNextExecution);

      if (secondsUntilNextExecution < camera.automation.minutesOff * 60) {
        return { countdownTime: secondsUntilNextExecution, until: "on" };
      } else {
        return {
          countdownTime:
            secondsUntilNextExecution - camera.automation.minutesOff * 60,
          until: "off",
        };
      }
    },
    enabled: camera.mode === "auto",
    refetchInterval: 1000,
  });

  if (camera.mode !== "auto" || !camera.automation) {
    return null;
  }

  console.log(data);

  return (
    <div className="text-sm text-muted-foreground">
      <div className="flex items-center space-x-2">
        <Countdown
          date={new Date().getTime() + (data?.countdownTime || 0) * 60 * 1000}
        />
        <Label>until {data?.until}</Label>
      </div>
    </div>
  );
}
