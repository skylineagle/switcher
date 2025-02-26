import type {
  ActionsResponse,
  CamerasResponse as BaseCameraResponse,
  RunResponse as BaseRunResponse,
  CamerasRecord,
  ModelsResponse,
} from "./db.types";

export type CameraMode = "live" | "off" | "auto";

export interface CameraAutomation {
  minutesOn: number;
  minutesOff: number;
}

export interface CameraConfiguration {
  name: string;
  source: string;
}

export interface CameraInfo {
  host: string;
  user: string;
  password: string;
}

export type Camera = CamerasRecord<CameraAutomation, CameraConfiguration>;
export type InsertCamera = Omit<Camera, "id" | "created" | "updated">;
export type UpdateCamera = Partial<InsertCamera> & { id: string };

export type CamerasResponse = Omit<
  BaseCameraResponse<CameraAutomation, CameraConfiguration, CameraInfo>,
  "created" | "updated"
>;

export enum CamerasJobStatusOptions {
  "running" = "running",
  "stopped" = "stopped",
  "none" = "none",
}

export type RunResponse = BaseRunResponse<{
  model: ModelsResponse;
  action: ActionsResponse;
}>;
