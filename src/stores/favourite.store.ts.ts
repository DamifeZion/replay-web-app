import type { FavouriteStoreT, MovieT } from "@/types/types";
import { defineStore } from "pinia";

export const useFavouriteStore = defineStore("favourite", {
	state: (): FavouriteStoreT => ({
		favVideos: [],
	}),
	actions: {
		setFavourite(video: MovieT) {
			const existing = this.favVideos.find(
				(item: MovieT) => item?.id === video?.id,
			);

			// If it exists, remove it; otherwise, add it
			if (existing) {
				this.favVideos = this.favVideos.filter(
					(item: MovieT) => item.id !== video.id,
				);
			} else {
				this.favVideos = [...this.favVideos, video];
			}
		},
		isFavourite(id: number) {
			return this.favVideos.find((item) => item.id === id);
		},
	},
	persist: true,
});
