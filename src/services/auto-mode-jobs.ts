import { pb } from "@/lib/pocketbase";
import { CameraConfiguration } from "@/types/types";
import { Baker, Status } from "cronbake";
import { logger } from "./logger";
import { addMediaMTXPath, removeMediaMTXPath } from "./mediamtx-controller";

const baker = Baker.create();

async function initializeJobs() {
  try {
    const cameras = await pb.collection("cameras").getFullList();

    for (const camera of cameras) {
      const config = camera.configuration as CameraConfiguration;

      await createJob(camera.id, config);
      logger.info(`Initialized job for camera ${camera.id}`);

      if (camera.mode === "auto") {
        logger.info(`Starting job for camera ${camera.id} on auto mode`);
        await startJob(camera.id);
      }
    }

    logger.info("All camera jobs initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize camera jobs", error);
    throw error;
  }
}

// Initialize jobs on startup
initializeJobs();

export async function createJob(
  camera: string,
  params: CameraConfiguration
): Promise<void> {
  try {
    logger.info(`Creating job for camera ${camera}`);
    baker.add({
      name: camera,
      cron: `@every_${params.minutesOn + params.minutesOff}_minutes`,
      start: false,
      callback: async () => {
        // Turn camera on
        logger.info(`Starting automation routinefor camera ${camera}`);
        const data = await pb.collection("cameras").getOne(camera);
        await addMediaMTXPath(data.name, data.source);
        logger.info(`Camera ${camera} turned on`);
        // Keep camera on for specified duration
        setTimeout(async () => {
          // Turn camera off after duration
          await removeMediaMTXPath(data.name);
          logger.info(`Camera ${camera} turned off`);
        }, params.minutesOn * 1000);
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function startJob(camera: string): Promise<void> {
  try {
    baker.bake(camera);
    logger.info(`Job for camera ${camera} started`);
    logger.debug(baker.getStatus(camera));
    logger.debug(baker.isRunning(camera));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function stopJob(camera: string): Promise<void> {
  try {
    baker.stop(camera);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getJobStatus(camera: string): Status | undefined {
  try {
    return baker.getStatus(camera);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteJob(camera: string): Promise<void> {
  try {
    baker.stop(camera);
    baker.remove(camera);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getNextExecution(camera: string): Promise<Date> {
  try {
    return baker.nextExecution(camera);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
