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
import { Trash2 } from "lucide-react";
import { deleteCamera } from "@/services/cameras";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CamerasResponse } from "@/types/types";

export function DeleteCamera({ camera }: { camera: CamerasResponse }) {
  const queryClient = useQueryClient();
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
      <AlertDialogTrigger disabled>
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
