import { TypedPocketBase } from "@/types/db.types";
import PocketBase from "pocketbase";

export const pb = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL
) as TypedPocketBase;

console.log(import.meta.env.VITE_POCKETBASE_URL);
console.log(import.meta.env.VITE_BAKER_URL);
console.log(import.meta.env.VITE_STREAM_URL);
