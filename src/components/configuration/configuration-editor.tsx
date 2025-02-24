import { cameraConfigSchema } from "@/components/configuration/consts";
import { EditorMarker } from "@/components/configuration/types";
import { useTheme } from "@/components/theme-provider";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";
import { updateCamera } from "@/lib/cameras";
import { getIsPermitted } from "@/lib/permissions";
import {
  CamerasModeOptions,
  PermissionsAllowedOptions,
} from "@/types/db.types";
import { CameraAutomation, CamerasResponse, UpdateCamera } from "types/types";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import type * as Monaco from "monaco-editor";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export interface ConfigurationEditorProps {
  camera: CamerasResponse;
}

export function ConfigurationEditor({ camera }: ConfigurationEditorProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const [editingConfig, setEditingConfig] = useState<{
    id: string;
    config: string;
    automation: CameraAutomation | null;
    nickname: string;
  } | null>(null);
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [currentTab, setCurrentTab] = useState<"general" | "config">("general");
  const monacoRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const { data: isConfigurationEditPermitted } = useQuery({
    queryKey: ["permissions", "configuration_edit", user?.id],
    queryFn: async () =>
      await getIsPermitted(
        "configuration_edit",
        (user?.level ?? "user") as PermissionsAllowedOptions
      ),
  });
  const { data: isCameraEditPermitted } = useQuery({
    queryKey: ["permissions", "camera_edit", user?.id],
    queryFn: async () =>
      await getIsPermitted(
        "camera_edit",
        (user?.level ?? "user") as PermissionsAllowedOptions
      ),
  });
  const { mutate: updateCameraMutation } = useMutation({
    mutationFn: async (data: UpdateCamera) => {
      if (
        (data.configuration || data.automation) &&
        camera.mode !== CamerasModeOptions.offline
      ) {
        throw new Error(
          "Configuration and automation can only be updated when camera is off"
        );
      }
      await updateCamera(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast.success("Camera updated successfully");
      setEditingConfig(null);
    },
    onError: (error) => {
      toast.error("Failed to update camera: " + error.message);
    },
  });

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    monacoRef.current = editor;

    // Configure JSON schema
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: "http://myschema/camera-config.json",
          fileMatch: ["*"],
          schema: cameraConfigSchema,
        },
      ],
      enableSchemaRequest: false,
    });
  };

  function handleEditorValidation(markers: EditorMarker[]) {
    setIsJsonValid(markers.length === 0);
  }

  const isAutomationValid = useCallback(() => {
    if (!editingConfig?.automation) return false;
    const { minutesOn, minutesOff } = editingConfig.automation;
    return minutesOn > 0 && minutesOff > 0;
  }, [editingConfig]);

  const isSaveDisabled = useCallback(() => {
    if (currentTab === "config") return !isJsonValid;
    return !isAutomationValid();
  }, [currentTab, isJsonValid, isAutomationValid]);

  const handleSave = useCallback(() => {
    if (!editingConfig) return;

    if (currentTab === "config") {
      try {
        const parsedConfig = JSON.parse(editingConfig.config);
        updateCameraMutation({
          id: editingConfig.id,
          configuration: parsedConfig,
          automation: editingConfig.automation,
          nickname: editingConfig.nickname,
        });
      } catch {
        toast.error("Invalid JSON configuration");
      }
    } else {
      if (!isAutomationValid()) {
        toast.error("Minutes On and Minutes Off must be greater than 0");
        return;
      }
      updateCameraMutation({
        id: editingConfig.id,
        configuration: JSON.parse(editingConfig.config),
        automation: editingConfig.automation,
        nickname: editingConfig.nickname,
      });
    }
  }, [editingConfig, currentTab, updateCameraMutation, isAutomationValid]);

  return (
    <Dialog
      open={editingConfig?.id === camera.id}
      onOpenChange={(open: boolean) => {
        if (!open) setEditingConfig(null);
        else
          setEditingConfig({
            id: camera.id,
            config: JSON.stringify(camera.configuration, null, 2),
            automation: camera.automation,
            nickname: camera.nickname ?? "",
          });
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={
            camera.mode !== CamerasModeOptions.offline || !isCameraEditPermitted
          }
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Camera Settings</DialogTitle>
          <DialogDescription>
            Configure camera settings and automation.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="general"
          onValueChange={(value) =>
            setCurrentTab(value as "general" | "config")
          }
        >
          <TabsList
            className={cn(
              "w-full",
              isConfigurationEditPermitted && "grid grid-cols-2"
            )}
          >
            <TabsTrigger className="w-full" value="general">
              <Label className="text-foreground">General</Label>
            </TabsTrigger>
            {isConfigurationEditPermitted && (
              <TabsTrigger className="w-full" value="config">
                <Label className="text-foreground">Configuration</Label>
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="config" className="py-4">
            <Editor
              height="400px"
              theme={theme === "dark" ? "vs-dark" : "light"}
              defaultLanguage="json"
              value={editingConfig?.config ?? ""}
              onChange={(value) =>
                setEditingConfig((prev) =>
                  prev ? { ...prev, config: value ?? "" } : null
                )
              }
              onMount={handleEditorDidMount}
              onValidate={handleEditorValidation}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
              }}
            />
          </TabsContent>
          <TabsContent value="general" className="py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="nickname"
                  className="text-right text-sm font-medium"
                >
                  Nickname
                </Label>
                <Input
                  id="nickname"
                  type="text"
                  className="col-span-3"
                  value={editingConfig?.nickname ?? ""}
                  onChange={(e) =>
                    setEditingConfig((prev) =>
                      prev ? { ...prev, nickname: e.target.value } : null
                    )
                  }
                />
              </div>
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
                  value={editingConfig?.automation?.minutesOn ?? 0}
                  min={1}
                  onChange={(e) =>
                    setEditingConfig((prev) => ({
                      ...prev!,
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
                  value={editingConfig?.automation?.minutesOff ?? 0}
                  min={1}
                  onChange={(e) =>
                    setEditingConfig((prev) => ({
                      ...prev!,
                      automation: {
                        minutesOn: prev?.automation?.minutesOn ?? 0,
                        minutesOff: parseInt(e.target.value),
                      },
                    }))
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditingConfig(null)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaveDisabled()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
