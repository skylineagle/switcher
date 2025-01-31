import { pb } from "@/lib/pocketbase";
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
