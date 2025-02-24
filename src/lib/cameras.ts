import { pb } from "@/lib/pocketbase";
import { CamerasModeOptions } from "@/types/db.types";
import { CamerasResponse, UpdateCamera } from "types/types";

export async function getCamerasIds() {
  const records = await pb.collection("cameras").getFullList<CamerasResponse>({
    fields: "id",
  });
  return records?.map((record) => record.id);
}

export interface GetCamerasOptions {
  modes?: CamerasModeOptions[];
  search?: string;
}

export async function getCameras({
  modes = [],
  search,
}: GetCamerasOptions = {}) {
  const filters = [];

  if (modes.length > 0) {
    // PocketBase doesn't support direct 'in' operator, so we use OR conditions
    const modeFilters = modes.map((mode) => `mode = "${mode}"`);
    filters.push(`(${modeFilters.join(" || ")})`);
  }

  if (search?.trim()) {
    filters.push(
      `(nickname ~ "${search.trim()}" || configuration.name ~ "${search.trim()}")`
    );
  }

  const filterStr = filters.length > 0 ? filters.join(" && ") : "";

  const records = await pb
    .collection("cameras")
    .getList<CamerasResponse>(1, 50, {
      fields: "id,nickname,configuration,automation,mode,status",
      filter: filterStr || undefined,
    });

  return records.items;
}

export async function getCamera(id: string) {
  const record = await pb.collection("cameras").getOne<CamerasResponse>(id, {
    fields: "id,nickname,configuration,automation,mode,status",
  });
  return record;
}

export async function updateCamera({ id, ...data }: UpdateCamera) {
  const record = await pb.collection("cameras").update(id, data);
  return record;
}

export async function deleteCamera(id: string) {
  await pb.collection("cameras").delete(id);
}

export interface BatchUpdateCamerasData {
  ids: string[];
  data: Partial<UpdateCamera>;
  onProgress?: (current: number, total: number) => void;
}

export async function batchUpdateCameras({
  ids,
  data,
  onProgress,
}: BatchUpdateCamerasData) {
  let succeeded = 0;
  let failed = 0;
  const total = ids.length;

  for (let i = 0; i < ids.length; i++) {
    try {
      await pb.collection("cameras").update(ids[i], { id: ids[i], ...data });
      await new Promise((resolve) => setTimeout(resolve, 200));
      succeeded++;
    } catch (error) {
      failed++;
      console.error(`Failed to update camera ${ids[i]}:`, error);
    }
    onProgress?.(i + 1, total);
  }

  return {
    succeeded,
    failed,
    total,
  };
}

export async function batchDeleteCameras(
  ids: string[],
  onProgress?: (current: number, total: number) => void
) {
  let succeeded = 0;
  let failed = 0;
  const total = ids.length;

  for (let i = 0; i < ids.length; i++) {
    try {
      await pb.collection("cameras").delete(ids[i]);
      await new Promise((resolve) => setTimeout(resolve, 100));
      succeeded++;
    } catch (error) {
      failed++;
      console.error(`Failed to delete camera ${ids[i]}:`, error);
    }
    onProgress?.(i + 1, total);
  }

  return {
    succeeded,
    failed,
    total,
  };
}

export async function batchSetCameraMode(
  ids: string[],
  mode: CamerasModeOptions,
  onProgress?: (current: number, total: number) => void
) {
  return batchUpdateCameras({
    ids,
    data: { mode },
    onProgress,
  });
}
