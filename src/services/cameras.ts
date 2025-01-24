import { pb } from "@/lib/pocketbase";
import { UpdateCamera } from "@/types/types";

export async function getCameras() {
  const records = await pb.collection("cameras").getFullList();
  return records;
}

export async function updateCamera({ id, ...data }: UpdateCamera) {
  const record = await pb.collection("cameras").update(id, data);
  return record;
}
