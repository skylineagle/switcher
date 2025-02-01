import { CameraRow } from "@/components/camera/camera";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pb } from "@/lib/pocketbase";
import { getCameras } from "@/services/cameras";
import { CamerasResponse } from "@/types/db.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { BatchOperations } from "./camera/batch-operations";

function CameraTableHeader({
  onSelectAll,
  isAllSelected,
}: {
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
}) {
  return (
    <TableHeader className="sticky top-0 bg-background z-10">
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
        <TableHead className="w-[200px]">Name</TableHead>
        <TableHead className="w-[150px]">Mode</TableHead>
        <TableHead className="w-[100px]">Status</TableHead>
        <TableHead className="w-[200px]">Automation</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function CamerasPage() {
  const queryClient = useQueryClient();
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);

  const { data: cameras, isLoading: isCamerasLoading } = useQuery({
    queryKey: ["cameras"],
    queryFn: getCameras,
  });

  const handleSelectCamera = (id: string, checked: boolean) => {
    setSelectedCameras((prev) =>
      checked ? [...prev, id] : prev.filter((cameraId) => cameraId !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedCameras(
      checked ? cameras?.map((camera) => camera.id) || [] : []
    );
  };

  const isAllSelected =
    cameras?.length === selectedCameras.length && selectedCameras.length > 0;

  useEffect(() => {
    pb.collection("cameras").subscribe("*", (e) => {
      // Update React Query cache with the new data
      queryClient.setQueryData<CamerasResponse[]>(["cameras"], (old) => {
        if (!old) return old;

        if (e.action === "create") {
          return [...old, e.record];
        }

        if (e.action === "delete") {
          return old.filter((camera) => camera.id !== e.record.id);
        }

        if (e.action === "update") {
          return old.map((camera) =>
            camera.id === e.record.id ? e.record : camera
          );
        }

        return old;
      });
    });

    // Cleanup subscription on component unmount
    return () => {
      pb.collection("cameras").unsubscribe("*");
    };
  }, [queryClient]);

  if (isCamerasLoading) return <div>Loading...</div>;

  return (
    <Card className="h-full shadow-2xl border-none">
      <CardHeader>
        <BatchOperations
          selectedCameras={selectedCameras}
          onClearSelection={() => setSelectedCameras([])}
        />
      </CardHeader>
      <CardContent>
        <div className="relative rounded-md">
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <CameraTableHeader
                onSelectAll={handleSelectAll}
                isAllSelected={isAllSelected}
              />
              <TableBody>
                {cameras?.map((camera) => {
                  return (
                    <CameraRow
                      key={camera.id}
                      camera={camera}
                      isSelected={selectedCameras.includes(camera.id)}
                      onSelect={(checked) =>
                        handleSelectCamera(camera.id, checked)
                      }
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
