import { GetCamerasOptions, getCameras } from "@/lib/cameras";
import { useCameraStore } from "@/stores/camera-store";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useCamerasQuery(options?: GetCamerasOptions) {
  const { searchQuery, sortState, isReversed } = useCameraStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cameras", options?.modes, options?.search],
    queryFn: async () => {
      const cameras = await getCameras(options || {});
      return cameras;
    },
  });

  const sortedAndFilteredCameras = useMemo(() => {
    let result = data;

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
  }, [data, searchQuery, sortState, isReversed]);

  return {
    cameras: sortedAndFilteredCameras,
    isLoading,
    isError,
    error,
  };
}
