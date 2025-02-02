import { BatchOperations } from "@/components/camera/batch-operations";
import { CameraRow } from "@/components/camera/camera";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { useCamerasQuery } from "@/hooks/use-cameras-query";
import { pb } from "@/lib/pocketbase";
import { useCameraStore } from "@/stores/camera-store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CameraTableHeader } from "./cameras-header";
import { Filters } from "./cameras/filters";

export function CamerasPage() {
  const queryClient = useQueryClient();
  const { cameras, isLoading } = useCamerasQuery();
  const { selectedCameras, selectCamera, selectAllCameras, clearSelection } =
    useCameraStore();

  useEffect(() => {
    pb.collection("cameras").subscribe("*", (e) => {
      if (e.action === "create" || e.action === "delete") {
        queryClient.invalidateQueries({ queryKey: ["cameras"] });
      }
    });

    return () => {
      pb.collection("cameras").unsubscribe("*");
    };
  }, [queryClient]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="shadow-2xl border-none">
      <CardHeader className="pb-4">
        <Filters />
        <BatchOperations
          selectedCameras={selectedCameras}
          onClearSelection={clearSelection}
        />
      </CardHeader>
      <CardContent>
        <div className="bg-background">
          <Table>
            <CameraTableHeader
              onSelectAll={() =>
                selectAllCameras(cameras?.map((camera) => camera.id) ?? [])
              }
              isAllSelected={
                cameras?.length === selectedCameras.length &&
                selectedCameras.length > 0
              }
            />
          </Table>
        </div>
        <div className="overflow-auto h-[calc(100vh-24rem)] scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/20">
          <Table>
            <TableBody className="relative">
              {cameras?.map((camera) => (
                <CameraRow
                  key={camera.id}
                  camera={camera}
                  isSelected={selectedCameras.includes(camera.id)}
                  onSelect={selectCamera}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
