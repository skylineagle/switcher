import type { CamerasResponse as BaseCameraResponse } from "./db.types";

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

export type CamerasResponse = Omit<
  BaseCameraResponse<CameraAutomation, CameraConfiguration, CameraInfo>,
  "created" | "updated"
>;
