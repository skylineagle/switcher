import { CamerasResponse } from "@/types/db.types";
import { useQuery } from "@tanstack/react-query";
import Countdown from "react-countdown";

interface AutomationIndicatorProps {
  camera: CamerasResponse;
}

export function AutomationIndicator({ camera }: AutomationIndicatorProps) {
  const { data: nextExecution } = useQuery({
    queryKey: ["jobs", camera.id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BAKER_URL}/jobs/${camera.id}/next`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch next execution");
      }
      return data?.nextExecution;
    },
    enabled: camera.mode === "auto",
    refetchInterval: 1000,
  });

  return (
    <div className="text-sm text-muted-foreground">
      {camera.status ? (
        "Streaming..."
      ) : (
        <Countdown date={new Date(nextExecution)} />
      )}
    </div>
  );
}
