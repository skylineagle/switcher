import { CameraConfiguration } from "@/types/types";
import { logger } from "./logger";
import { MEDIAMTX_API } from "@/config";

export const API_URL = `${MEDIAMTX_API}/v3`;

export async function addMediaMTXPath(
  name: string,
  configuration: CameraConfiguration
) {
  logger.info(
    `Adding MediaMTX path for camera ${name} with source ${configuration.source}`
  );
  const response = await fetch(`${API_URL}/config/paths/add/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(configuration),
  });

  if (!response.ok) {
    logger.error(`Failed to add MediaMTX path: ${response.statusText}`);
  }
}

export async function removeMediaMTXPath(name: string) {
  logger.info(`Removing MediaMTX path for camera ${name}`);
  const response = await fetch(`${API_URL}/config/paths/delete/${name}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 404) {
    logger.error(response);
    logger.error(`Failed to remove MediaMTX path: ${response.statusText}`);
    throw new Error(`Failed to remove MediaMTX path: ${response.statusText}`);
  }
}

export async function getMediaMTXPaths() {
  const response = await fetch(`${API_URL}/paths/list`);

  if (!response.ok) {
    throw new Error(`Failed to get MediaMTX paths: ${response.statusText}`);
  }

  return response.json();
}
