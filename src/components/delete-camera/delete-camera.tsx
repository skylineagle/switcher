import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/services/auth";
import { deleteCamera } from "@/services/cameras";
import { getIsPermitted } from "@/services/permissions";
import { PermissionsAllowedOptions } from "@/types/db.types";
import { CamerasResponse } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteCamera({ camera }: { camera: CamerasResponse }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: isPermitted } = useQuery({
    queryKey: ["permissions", "camera_delete", user?.id],
    queryFn: async () =>
      await getIsPermitted(
        "camera_delete",
        (user?.level ?? "user") as PermissionsAllowedOptions
      ),
  });
  const { mutate: deleteCameraMutation } = useMutation({
    mutationFn: async (id: string) => {
      await deleteCamera(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast.success("Camera deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete camera: " + error.message);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={!isPermitted}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete the camera and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteCameraMutation(camera.id)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
