import { getCameras } from "@/lib/cameras";
import { useCameraStore } from "@/stores/camera-store";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useCamerasQuery() {
  const { selectedModes, searchQuery, sortState, isReversed } =
    useCameraStore();

  const { data: cameras, isLoading } = useQuery({
    queryKey: ["cameras", { modes: selectedModes }],
    queryFn: () => getCameras({ modes: selectedModes }),
  });

  const sortedAndFilteredCameras = useMemo(() => {
    let result = cameras;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result?.filter((camera) => {
        const matches =
          camera.nickname?.toLowerCase().includes(query) ||
          camera.configuration?.name.toLowerCase().includes(query);
        return isReversed ? !matches : matches;
      });
    }

    // Apply sorting
    if (result && sortState.direction) {
      return [...result].sort((a, b) => {
        let aValue: string | undefined;
        let bValue: string | undefined;

        switch (sortState.column) {
          case "name":
            aValue = a.nickname || a.configuration?.name;
            bValue = b.nickname || b.configuration?.name;
            break;
          case "mode":
            aValue = a.mode;
            bValue = b.mode;
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "automation":
            aValue = a.automation
              ? `${a.automation.minutesOn}/${a.automation.minutesOff}`
              : "";
            bValue = b.automation
              ? `${b.automation.minutesOn}/${b.automation.minutesOff}`
              : "";
            break;
        }

        if (!aValue) return sortState.direction === "asc" ? -1 : 1;
        if (!bValue) return sortState.direction === "asc" ? 1 : -1;

        const comparison = aValue.localeCompare(bValue);
        return sortState.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [cameras, searchQuery, sortState, isReversed]);

  return {
    cameras: sortedAndFilteredCameras,
    isLoading,
  };
}
