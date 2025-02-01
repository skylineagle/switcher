import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CamerasResponse } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import Countdown from "react-countdown";

type CountdownData = {
  countdownTime: number;
  until: "on" | "off";
};

interface AutomationIndicatorProps {
  camera: CamerasResponse;
}

export function AutomationIndicator({ camera }: AutomationIndicatorProps) {
  const { data } = useQuery<CountdownData>({
    queryKey: ["next-job", camera.id],
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

      if (secondsUntilNextExecution < camera.automation.minutesOff * 60) {
        return {
          countdownTime: new Date(data?.nextExecution).getTime(),
          until: "on",
        };
      } else if (camera.status === "off") {
        return {
          countdownTime: new Date(data?.nextExecution).getTime(),
          until: "on",
        };
      } else {
        return {
          countdownTime:
            new Date().getTime() +
            (secondsUntilNextExecution - camera.automation.minutesOff * 60) *
              1000,
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

  return (
    data?.countdownTime && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-sm text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Clock className="h-3 w-3" />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent
              className="flex flex-col gap-1 items-start border-none"
              side="top"
              sideOffset={10}
            >
              <Label className="text-xs">
                On: {camera.automation.minutesOn} minutes
              </Label>
              <Label className="text-xs">
                Off: {camera.automation.minutesOff} minutes
              </Label>
            </TooltipContent>
          </Tooltip>
          <span>Going</span>
          <div
            className={`font-medium ${
              data.until === "on" ? "text-emerald-500" : "text-destructive"
            }`}
          >
            {data.until === "on" ? "Live" : "Offline"}
          </div>
          <ArrowRight className="h-3 w-3" />
          <Countdown
            date={data?.countdownTime}
            daysInHours
            key={`${data?.countdownTime}-${camera.id}`}
          />
        </div>
      </motion.div>
    )
  );
}
