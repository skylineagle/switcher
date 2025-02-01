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
import { useCameraStore } from "@/stores/camera-store";
import { CamerasModeOptions } from "@/types/db.types";
import { Check, Search, X } from "lucide-react";
import { memo, useCallback } from "react";
import { modeConfig } from "../config";

function renderModeIcon(mode: CamerasModeOptions) {
  const Icon = modeConfig[mode].icon;
  return <Icon className={cn("h-4 w-4", modeConfig[mode].color)} />;
}

export const Filters = memo(() => {
  const {
    searchQuery,
    selectedModes,
    setSearchQuery,
    toggleMode,
    clearMode,
    clearFilters,
  } = useCameraStore();

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
      </div>
      {selectedModes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedModes.map((mode) => (
            <Badge key={mode} variant="secondary">
              <div className="flex items-center gap-2">
                {renderModeIcon(mode)}
                <span>{modeConfig[mode].label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => clearMode(mode)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Badge>
          ))}
          {selectedModes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
