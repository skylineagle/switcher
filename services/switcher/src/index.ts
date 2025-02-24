import { MEDIAMTX_API } from "@/config";
import { logger } from "@/logger";
import { pb } from "@/pocketbase";
import { type RunResponse, RunTargetOptions } from "@/types/db.types";
import type { CamerasResponse } from "@/types/types";
import cors from "@elysiajs/cors";
import { $ } from "bun";
import { Elysia, t } from "elysia";

export const TO_REPLACE = ["camera", "action"];

const app = new Elysia()
  .onError(({ code, error, request }) => {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error({ code, error, path: request.url }, "Request error occurred");
    return { success: false, error: errorMessage };
  })
  .onRequest(({ request }) => {
    logger.info(
      { method: request.method, path: request.url },
      "Incoming request"
    );
  });

app.post(
  "/api/run/:camera/:action",
  async ({ params }) => {
    try {
      logger.info("Running command");

      const result = await pb
        .collection("cameras")
        .getFullList<CamerasResponse>(1, {
          filter: `id = "${params.camera}"`,
          expand: "model",
        });

      if (result.length !== 1)
        throw new Error(`Camera ${params.camera} not found`);

      const camera = result[0];

      const runResult = await pb.collection("run").getFullList<RunResponse>(1, {
        filter: `model = "${camera.model}" && action = "${params.action}"`,
      });
      const runConfig = runResult[0];

      if (!runConfig)
        throw new Error(
          `Run configuration not found for action ${params.action} on model ${camera.model}`
        );

      const command = runConfig.command
        .replace("$camera", params.camera)
        .replace("$name", camera.configuration?.name ?? "")
        .replace("$action", params.action)
        .replace("$configuration", JSON.stringify(camera?.configuration))
        .replace("$mediamtx", MEDIAMTX_API);

      const output =
        runConfig.target === RunTargetOptions.remote
          ? camera.info?.password
            ? await $`sshpass -p ${camera.info?.password} ssh -o StrictHostKeyChecking=no ${camera.info?.user}@${camera.info?.host} '${command}'`.text()
            : await $`ssh -o StrictHostKeyChecking=no ${camera.info?.user}@${camera.info?.host} '${command}'`.text()
          : await $`${{ raw: command }}`.text();

      return { success: true, output };
    } catch (error) {
      logger.error(error);
    }
  },
  {
    body: t.Optional(t.Any()),
  }
);

app.use(cors()).listen(8000);
logger.info("🦊 Switcher API server running at :8000");
logger.debug(`MEDIAMTX URL: ${MEDIAMTX_API}`);
