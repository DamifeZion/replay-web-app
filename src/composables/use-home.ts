import { useURLQuery } from "./shared/use-url-query";
import { useVideoQuery } from "./shared/use-videos-query";

export const useHome = () => {
	const { getQuery } = useURLQuery();
	const page = getQuery("search");

	const {
		trendingState,
		getTrendingVideos,
		newReleaseState,
		getNewReleases,
		popularThisWeekState,
		getPopularThisWeek,
		featuredState,
		getFeatured,
		videoState,
		upcomingState,
		getUpcoming,
		tvSeriesState,
		getTvSeries,
	} = useVideoQuery();

	/** Initiallize fetches */
	getTrendingVideos();
	getNewReleases();
	getPopularThisWeek();
	getFeatured();
	getUpcoming();
	getTvSeries();

	return {
		trendingState,
		newReleaseState,
		popularThisWeekState,
		featuredState,
		videoState,
		upcomingState,
		tvSeriesState,
	};
};
