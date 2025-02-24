import { POCKETBASE_URL, USERNAME, PASSWORD } from "@/services/baker/config";
import { TypedPocketBase } from "@/types/db.types";
import PocketBase from "pocketbase";

export const pb = new PocketBase(POCKETBASE_URL) as TypedPocketBase;
await pb.collection("users").authWithPassword(USERNAME, PASSWORD);

setInterval(() => {
  pb.collection("users").authRefresh();
}, 1000 * 60 * 2);
