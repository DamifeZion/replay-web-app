import type { GenreT } from "@/types/types";
import { defineStore } from "pinia";

export const useGenreStore = defineStore("genre", {
	state: () => ({
		movieGenres: {} as Record<number, string>,
		tvGenres: {} as Record<number, string>,
	}),
	actions: {
		setMovieGenres(genres: Array<GenreT>) {
			genres.forEach((genre) => {
				if (!this.movieGenres[genre.id]) {
					this.movieGenres[genre.id] = genre.name;
				}
			});
		},
		setTvGenres(genres: Array<GenreT>) {
			genres.forEach((genre) => {
				if (!this.tvGenres[genre.id]) {
					this.tvGenres[genre.id] = genre.name;
				}
			});
		},
	},
	persist: true,
});
