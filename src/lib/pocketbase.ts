import { urls } from "@/lib/urls";
import { TypedPocketBase } from "@/types/db.types";
import PocketBase from "pocketbase";

export const pb = new PocketBase(urls.pocketbase) as TypedPocketBase;
