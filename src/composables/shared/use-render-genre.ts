import { useGenreStore } from "@/stores/genere.store";
import type { VideoTypeT } from "@/types/types";

export const useRenderGenre = () => {
	const genreStore = useGenreStore();

	// Function to render the genre
	const renderGenre = (genreID: number, type?: VideoTypeT): string => {
		let genre;
		const defaultType: VideoTypeT = type || "movie";

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
