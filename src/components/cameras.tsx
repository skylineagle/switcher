import { CameraRow } from "@/components/camera/caemra";
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
import { useEffect } from "react";

function CameraTableHeader() {
  return (
    <TableHeader className="sticky top-0 bg-background z-10">
      <TableRow>
        <TableHead className="w-[20%]">Name</TableHead>
        <TableHead className="w-[25%]">Mode</TableHead>
        <TableHead className="w-[15%]">Status</TableHead>
        <TableHead className="w-[30%]">Automation</TableHead>
        <TableHead className="w-[30%]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function CamerasPage() {
  const queryClient = useQueryClient();

  const { data: cameras, isLoading: isCamerasLoading } = useQuery({
    queryKey: ["cameras"],
    queryFn: getCameras,
  });

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
      <CardHeader></CardHeader>
      <CardContent>
        <div className="relative rounded-md ">
          <Table>
            <CameraTableHeader />
          </Table>
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableBody>
                {cameras?.map((camera) => {
                  return <CameraRow camera={camera} key={camera.id} />;
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
