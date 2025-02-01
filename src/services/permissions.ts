import { pb } from "@/lib/pocketbase";
import type { PermissionsAllowedOptions } from "@/types/db.types";

export async function getIsPermitted(
  name: string,
  level: PermissionsAllowedOptions
) {
  const permission = await pb
    .collection("permissions")
    .getFirstListItem(`name="${name}"`);

  return permission.allowed.includes(level);
}
