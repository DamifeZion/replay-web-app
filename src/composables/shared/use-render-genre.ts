import { useGenreStore } from "@/stores/genere.store";
import type { GenreTypeT } from "@/types/types";

export const useRenderGenre = () => {
	const genreStore = useGenreStore();

	// Function to render the genre
	const renderGenre = (genreID: number, type?: GenreTypeT): string => {
		let genre;
		const defaultType: GenreTypeT = type || "movie";

		switch (defaultType) {
			case "movie":
				genre = genreStore.movieGenres[genreID];
				break;
			case "tv":
				genre = genreStore.tvGenres[genreID];
				break;
			default:
				genre = "Unknown";
		}
		return genre;
	};

	return { renderGenre };
};
