import { AddCameraModal } from "@/components/camera/add-camera-modal";
import { modeConfig } from "@/components/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/services/auth";
import { getIsPermitted } from "@/services/permissions";
import { useCameraStore } from "@/stores/camera-store";
import {
  CamerasModeOptions,
  PermissionsAllowedOptions,
} from "@/types/db.types";
import { useQuery } from "@tanstack/react-query";
import { Check, Search, X } from "lucide-react";
import { memo, useCallback } from "react";

function renderModeIcon(mode: CamerasModeOptions) {
  const Icon = modeConfig[mode].icon;
  return <Icon className={cn("h-4 w-4", modeConfig[mode].color)} />;
}

export const Filters = memo(() => {
  const { user } = useAuthStore();
  const {
    searchQuery,
    selectedModes,
    setSearchQuery,
    toggleMode,
    clearMode,
    clearFilters,
  } = useCameraStore();
  const { data: isAllowdToCreate } = useQuery({
    queryKey: ["camera_create"],
    queryFn: () =>
      getIsPermitted(
        "camera_create",
        (user?.level || "user") as PermissionsAllowedOptions
      ),
  });

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cameras..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Select value="select-mode" onValueChange={toggleMode}>
          <SelectTrigger className="w-[180px]">
            {selectedModes.length > 0
              ? `${selectedModes.length} mode${
                  selectedModes.length > 1 ? "s" : ""
                } selected`
              : "Filter by mode"}
          </SelectTrigger>
          <SelectContent>
            {Object.values(CamerasModeOptions).map((mode) => (
              <SelectItem key={mode} value={mode}>
                <div className="flex items-center gap-2">
                  {renderModeIcon(mode)}
                  <span>{modeConfig[mode].label}</span>
                  {selectedModes.includes(mode) && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isAllowdToCreate && <AddCameraModal />}
      </div>
      {(selectedModes.length > 0 || searchQuery) && (
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {selectedModes.map((mode) => (
              <Badge
                key={mode}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {renderModeIcon(mode)}
                <span>{modeConfig[mode].label}</span>
                <X
                  className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => clearMode(mode)}
                />
              </Badge>
            ))}
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                <span>{searchQuery}</span>
                <X
                  className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
});
