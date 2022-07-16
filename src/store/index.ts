import { PlaylistItem } from "iptv-playlist-parser";
import create from "zustand";

export const useSearchStore = create<{
  list: PlaylistItem[];
  setList: (list: PlaylistItem[]) => void;
  clearList: () => void;
}>((set) => ({
  list: [],
  setList: (list: PlaylistItem[]) => set((state) => ({ list })),
  clearList: () => set({ list: [] }),
}));
