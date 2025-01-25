import { POCKETBASE_URL } from "@/config";
import { TypedPocketBase } from "@/types/db.types";
import PocketBase from "pocketbase";

export const pb = new PocketBase(POCKETBASE_URL) as TypedPocketBase;
