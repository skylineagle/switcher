import type { CamerasRecord } from "./db.types";

export type CameraMode = "live" | "off" | "auto";

export interface CameraConfiguration {
  minutesOn: number;
  minutesOff: number;
}

export type Camera = CamerasRecord<CameraConfiguration>;
export type InsertCamera = Omit<Camera, "id" | "created" | "updated">;
export type UpdateCamera = Partial<InsertCamera> & { id: string };

export enum CamerasJobStatusOptions {
  "running" = "running",
  "stopped" = "stopped",
  "none" = "none",
}
