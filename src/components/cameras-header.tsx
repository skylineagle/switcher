import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useCameraStore } from "@/stores/camera-store";
import { ChevronDown, ChevronUp } from "lucide-react";
import { memo } from "react";

interface CameraTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
}

export const CameraTableHeader = memo(
  ({ onSelectAll, isAllSelected }: CameraTableHeaderProps) => {
    const { sortState, setSortState } = useCameraStore();

    return (
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px] px-0">
            <div className="pl-4">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
              />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => setSortState("name")}
          >
            <div className="flex items-center gap-2">
              Name
              {sortState.column === "name" && (
                <span
                  className={cn(
                    "transition-transform",
                    sortState.direction === "desc" && "rotate-180"
                  )}
                >
                  {sortState.direction ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => setSortState("mode")}
          >
            <div className="flex items-center gap-2">
              Mode
              {sortState.column === "mode" && (
                <span
                  className={cn(
                    "transition-transform",
                    sortState.direction === "desc" && "rotate-180"
                  )}
                >
                  {sortState.direction ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => setSortState("status")}
          >
            <div className="flex items-center gap-2">
              Status
              {sortState.column === "status" && (
                <span
                  className={cn(
                    "transition-transform",
                    sortState.direction === "desc" && "rotate-180"
                  )}
                >
                  {sortState.direction ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => setSortState("automation")}
          >
            <div className="flex items-center gap-2">
              Automation
              {sortState.column === "automation" && (
                <span
                  className={cn(
                    "transition-transform",
                    sortState.direction === "desc" && "rotate-180"
                  )}
                >
                  {sortState.direction ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
    );
  }
);
