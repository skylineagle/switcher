import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCamera } from "@/lib/cameras";
import { CameraAutomation, CamerasResponse, UpdateCamera } from "types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface AutomationEditorProps {
  camera: CamerasResponse;
}

export function AutomationEditor({ camera }: AutomationEditorProps) {
  const queryClient = useQueryClient();
  const [editingAutomation, setEditingAutomation] = useState<{
    id: string;
    automation: CameraAutomation | null;
  } | null>(null);

  const { mutate: updateCameraMutation } = useMutation({
    mutationFn: async (data: UpdateCamera) => {
      await updateCamera(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast.success("Camera updated successfully");
      setEditingAutomation(null);
    },
    onError: (error) => {
      toast.error("Failed to update camera: " + error.message);
    },
  });

  return (
    <Dialog
      open={editingAutomation?.id === camera.id}
      onOpenChange={(open: boolean) => {
        if (!open) setEditingAutomation(null);
        else
          setEditingAutomation({
            id: camera.id,
            automation: camera.automation,
          });
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {camera.automation
            ? `${camera.automation.minutesOn}m on / ${camera.automation.minutesOff}m off`
            : "Configure"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Automation Settings</DialogTitle>
          <DialogDescription>
            Configure the camera's on/off cycle duration in minutes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="minutesOn"
              className="text-right text-sm font-medium"
            >
              Minutes On
            </Label>
            <Input
              id="minutesOn"
              type="number"
              className="col-span-3"
              value={editingAutomation?.automation?.minutesOn ?? 0}
              onChange={(e) =>
                setEditingAutomation((prev) => ({
                  id: prev?.id ?? camera.id,
                  automation: {
                    minutesOn: parseInt(e.target.value),
                    minutesOff: prev?.automation?.minutesOff ?? 0,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="minutesOff"
              className="text-right text-sm font-medium"
            >
              Minutes Off
            </Label>
            <Input
              id="minutesOff"
              type="number"
              className="col-span-3"
              value={editingAutomation?.automation?.minutesOff ?? 0}
              onChange={(e) =>
                setEditingAutomation((prev) => ({
                  id: prev?.id ?? camera.id,
                  automation: {
                    minutesOn: prev?.automation?.minutesOn ?? 0,
                    minutesOff: parseInt(e.target.value),
                  },
                }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditingAutomation(null)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!editingAutomation) return;
              updateCameraMutation({
                id: editingAutomation.id,
                automation: editingAutomation.automation,
              });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
