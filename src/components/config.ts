import { CamerasModeOptions, CamerasStatusOptions } from "@/types/db.types";
import {
  Ban,
  Clock,
  Filter,
  Loader2,
  PauseCircle,
  PlayCircle,
  Video,
} from "lucide-react";

export const modeConfig = {
  [CamerasModeOptions.live]: {
    icon: Video,
    label: "Live",
    color: "text-green-500",
  },
  [CamerasModeOptions.auto]: {
    icon: Clock,
    label: "Auto",
    color: "text-blue-500",
  },
  [CamerasModeOptions.offline]: {
    icon: Ban,
    label: "Offline",
    color: "text-gray-500",
  },
  all: {
    icon: Filter,
    label: "All modes",
    color: "text-foreground",
  },
} as const;

export const statusConfig = {
  [CamerasStatusOptions.on]: {
    icon: PlayCircle,
    label: "On",
    color: "text-green-500",
  },
  [CamerasStatusOptions.off]: {
    icon: PauseCircle,
    label: "Off",
    color: "text-gray-500",
  },
  [CamerasStatusOptions.waiting]: {
    icon: Loader2,
    label: "Waiting",
    color: "text-yellow-500",
  },
  all: {
    icon: Filter,
    label: "All statuses",
    color: "text-foreground",
  },
} as const;
