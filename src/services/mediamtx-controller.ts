import { CameraConfiguration } from "@/types/types";
import { logger } from "./logger";

const MEDIAMTX_API = `${Bun.env.MEDIAMTX_API || "http://localhost:9997"}/v3`;

export async function addMediaMTXPath(
  name: string,
  configuration: CameraConfiguration
) {
  logger.info(
    `Adding MediaMTX path for camera ${name} with source ${configuration.source}`
  );
  const response = await fetch(`${MEDIAMTX_API}/config/paths/add/${name}`, {
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
  const response = await fetch(`${MEDIAMTX_API}/config/paths/delete/${name}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 404) {
    logger.error(response);
    logger.error(`Failed to remove MediaMTX path: ${response.statusText}`);
    throw new Error(`Failed to remove MediaMTX path: ${response.statusText}`);
  }
}

export async function getMediaMTXPaths() {
  const response = await fetch(`${MEDIAMTX_API}/paths/list`);

  if (!response.ok) {
    throw new Error(`Failed to get MediaMTX paths: ${response.statusText}`);
  }

  return response.json();
}
