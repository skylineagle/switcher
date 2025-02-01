import { pb } from "@/lib/pocketbase";
import { CamerasModeOptions } from "@/types/db.types";
import { CamerasResponse, UpdateCamera } from "@/types/types";

export async function getCameras() {
  const records = await pb.collection("cameras").getFullList<CamerasResponse>({
    fields: "id,nickname,configuration,automation,mode,status",
  });
  return records;
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
