import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CamerasModeOptions } from "@/types/db.types";
import { SortState, SortableColumn } from "@/types/table";

interface CameraFilters {
  searchQuery: string;
  selectedModes: CamerasModeOptions[];
  sortState: SortState;
  selectedCameras: string[];
}

interface CameraActions {
  setSearchQuery: (query: string) => void;
  toggleMode: (mode: CamerasModeOptions) => void;
  setSortState: (column: SortableColumn) => void;
  selectCamera: (id: string, checked: boolean) => void;
  selectAllCameras: (ids: string[]) => void;
  clearSelection: () => void;
  clearFilters: () => void;
  clearMode: (mode: CamerasModeOptions) => void;
}

const initialState: CameraFilters = {
  searchQuery: "",
  selectedModes: [],
  sortState: {
    column: "name",
    direction: null,
  },
  selectedCameras: [],
};

export const useCameraStore = create<CameraFilters & CameraActions>()(
  persist(
    (set) => ({
      ...initialState,
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleMode: (mode) =>
        set((state) => ({
          selectedModes: state.selectedModes.includes(mode)
            ? state.selectedModes.filter((m) => m !== mode)
            : [...state.selectedModes, mode],
        })),
      setSortState: (column) =>
        set((state) => ({
          sortState: {
            column,
            direction:
              state.sortState.column === column
                ? state.sortState.direction === null
                  ? "asc"
                  : state.sortState.direction === "asc"
                  ? "desc"
                  : null
                : "asc",
          },
        })),
      selectCamera: (id, checked) =>
        set((state) => ({
          selectedCameras: checked
            ? [...state.selectedCameras, id]
            : state.selectedCameras.filter((cameraId) => cameraId !== id),
        })),
      selectAllCameras: (ids) =>
        set((state) => ({
          selectedCameras:
            state.selectedCameras.length === ids.length ? [] : ids,
        })),
      clearSelection: () => set({ selectedCameras: [] }),
      clearFilters: () =>
        set({
          searchQuery: "",
          selectedModes: [],
          sortState: initialState.sortState,
        }),
      clearMode: (mode) =>
        set((state) => ({
          selectedModes: state.selectedModes.filter((m) => m !== mode),
        })),
    }),
    {
      name: "camera-store",
    }
  )
);
