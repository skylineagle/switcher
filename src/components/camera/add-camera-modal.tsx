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
import { Separator } from "@/components/ui/separator";
import { pb } from "@/lib/pocketbase";
import { cn } from "@/lib/utils";
import { CamerasResponse } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  nickname: z.string().min(2, "Nickname must be at least 2 characters"),
  configuration: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    source: z.string().url("Must be a valid URL"),
  }),
  automation: z
    .object({
      minutesOn: z.number().optional(),
      minutesOff: z.number().optional(),
    })
    .refine(
      (data) => {
        if (data?.minutesOn && !data?.minutesOff) return false;
        if (!data?.minutesOn && data?.minutesOff) return false;
        return true;
      },
      {
        message: "Both Minutes On and Minutes Off must be set together",
      }
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function AddCameraModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      configuration: {
        name: "",
        source: "",
      },
    },
  });

  const { mutate: addCamera, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      return pb.collection("cameras").create<CamerasResponse>(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast.success("Camera added successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to add camera: " + error.message);
    },
  });

  const onSubmit = (data: FormValues) => {
    addCamera(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Camera
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Camera</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new camera to your system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Basic Information</h4>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    placeholder="Enter a nickname for this camera"
                    {...form.register("nickname")}
                    className={cn(
                      form.formState.errors.nickname && "border-destructive"
                    )}
                  />
                  {form.formState.errors.nickname && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.nickname.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Configuration</h4>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Configuration Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter a name for this configuration"
                    {...form.register("configuration.name")}
                    className={cn(
                      form.formState.errors.configuration?.name &&
                        "border-destructive"
                    )}
                  />
                  {form.formState.errors.configuration?.name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.configuration.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="source">Source URL</Label>
                  <Input
                    id="source"
                    placeholder="Enter the camera source URL"
                    {...form.register("configuration.source")}
                    className={cn(
                      form.formState.errors.configuration?.source &&
                        "border-destructive"
                    )}
                  />
                  {form.formState.errors.configuration?.source && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.configuration.source.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">
                Automation (Optional)
              </h4>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="minutesOn">Minutes On</Label>
                  <Input
                    id="minutesOn"
                    type="number"
                    required={false}
                    placeholder="Enter minutes to stay on"
                    {...form.register("automation.minutesOn", {
                      valueAsNumber: true,
                      required: false,
                    })}
                    className={cn(
                      form.formState.errors.automation?.minutesOn &&
                        "border-destructive"
                    )}
                  />
                  {form.formState.errors.automation?.minutesOn && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.automation.minutesOn.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minutesOff">Minutes Off</Label>
                  <Input
                    id="minutesOff"
                    type="number"
                    required={false}
                    placeholder="Enter minutes to stay off"
                    {...form.register("automation.minutesOff", {
                      valueAsNumber: true,
                    })}
                    className={cn(
                      form.formState.errors.automation?.minutesOff &&
                        "border-destructive"
                    )}
                  />
                  {form.formState.errors.automation?.minutesOff && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.automation.minutesOff.message}
                    </p>
                  )}
                </div>
                {form.formState.errors.automation?.root && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.automation.root.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2 justify-end w-full">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Add Camera
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
