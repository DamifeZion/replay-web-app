import { ENDPOINT } from "@/constants/endpoint-const";
import { axios } from "@/plugins/axios";
import { useGenreStore } from "@/stores/genere.store";
import type { AxiosFetchState, MovieT } from "@/types/types";
import { reactive } from "vue";
import { useURLQuery } from "./use-url-query";

export const useVideoQuery = () => {
	/** URL PARAMS*/
	const { getQuery } = useURLQuery();

	/** Get Movie and TV Genres */
	const genreStore = useGenreStore();
	const genreState = reactive<AxiosFetchState>({
		data: {},
		isLoading: false,
		error: "",
	});
	const getGenres = async () => {
		try {
			genreState.isLoading = true;
			genreState.error = false;

			const [movieGenresRes, tvGenresRes] = await Promise.all([
				axios.get(ENDPOINT.GET_MOVIE_GENRES),
				axios.get(ENDPOINT.GET_TV_GENRES),
			]);
			genreStore.setMovieGenres(movieGenresRes.data?.genres);
			genreStore.setTvGenres(tvGenresRes.data?.genres);
		} catch (err) {
			genreState.error = err;
		} finally {
			genreState.isLoading = false;
		}
	};
	getGenres();

	/** The state while fetching trending videos */
	const trendingState = reactive<AxiosFetchState>({
		data: {},
		isLoading: false,
		error: "",
	});
	/** Get all trending videos from the TMDB */
	const getTrendingVideos = async () => {
		try {
			trendingState.isLoading = true;
			trendingState.error = "";

			const res = await axios.get(ENDPOINT.GET_TRENDING_MOVIES);

			trendingState.data = res.data;
		} catch (err) {
			console.error(err);
			trendingState.error = err;
		} finally {
			trendingState.isLoading = false;
		}
	};

	/** Get New Releases */
	const newReleaseState = reactive<AxiosFetchState>({
		data: {},
		isLoading: false,
		error: "",
	});
	const getNewReleases = async () => {
		try {
			newReleaseState.isLoading = true;
			newReleaseState.error = "";

			const res = await axios.get(ENDPOINT.GET_LATEST_MOVIES, {
				params: {
					page: 2,
					// primary_release_date_gte: "2024-01-01",
					// primary_release_date_lte: "2024-12-31",
				},
			});
			newReleaseState.data = res.data;
		} catch (err) {
			console.error(err);
			newReleaseState.error = err;
		} finally {
			newReleaseState.isLoading = false;
		}
	};

	/** Get Popular */
	const popularThisWeekState = reactive<AxiosFetchState>({
		data: {},
		isLoading: false,
		error: "",
	});
	const getPopularThisWeek = async () => {
		try {
			popularThisWeekState.isLoading = true;
			popularThisWeekState.error = "";

			const res = await axios.get(ENDPOINT.GET_POPULAR_MOVIES_THIS_WEEK);

			popularThisWeekState.data = res.data;
		} catch (err) {
			console.error(err);
			popularThisWeekState.error = err;
		} finally {
			popularThisWeekState.isLoading = false;
		}
	};

	/** Get Featured */
	const featuredState = reactive<AxiosFetchState>({
		data: {},
		isLoading: false,
		error: "",
	});
	const getFeatured = async () => {
		try {
			featuredState.isLoading = true;
			featuredState.error = "";

			const res = await axios.get(ENDPOINT.GET_FEATURED, {
				params: {
					page: 2,
				},
			});

			featuredState.data = res.data;
		} catch (err) {
			console.error(err);
			featuredState.error = err;
		} finally {
			featuredState.isLoading = false;
		}
	};

	/** Get A Video */
	const videoID = getQuery("videoID");
	const videoState = reactive<AxiosFetchState>({
		data: {},
		isLoading: false,
		error: "",
	});
	const getVideo = async (videoID: number) => {
		try {
			videoState.isLoading = true;
			videoState.error = "";

			if (!videoID) {
				throw new Error("Invalid videoID");
			}

			const res = await axios.get(
				ENDPOINT.GET_VIDEO.replace(":movie_id", String(videoID)),
			);

			videoState.data = res.data;
		} catch (err) {
		} finally {
			videoState.isLoading = false;
		}
	};

	/** Get Featured */
	const upcomingState = reactive<AxiosFetchState>({
		data: {},
		isLoading: false,
		error: "",
	});
	const getUpcoming = async () => {
		try {
			upcomingState.isLoading = true;
			upcomingState.error = "";

			const res = await axios.get(ENDPOINT.GET_UPCOMING_MOVIES, {
				params: {
					page: 3,
				},
			});

			upcomingState.data = res.data;
		} catch (err) {
			console.error(err);
			upcomingState.error = err;
		} finally {
			upcomingState.isLoading = false;
		}
	};

	/** Get Featured */
	const tvSeriesState = reactive<AxiosFetchState>({
		data: {},
		isLoading: false,
		error: "",
	});
	const getTvSeries = async () => {
		try {
			tvSeriesState.isLoading = true;
			tvSeriesState.error = "";

			const res = await axios.get(ENDPOINT.GET_TV_SERIES, {});

			tvSeriesState.data = {
				...res.data,
				response: res.data?.results.map(
					(item: any): MovieT => ({
						...item,
						title: item?.name,
						original_title: item?.original_name,
					}),
				),
			};
		} catch (err) {
			console.error(err);
			tvSeriesState.error = err;
		} finally {
			tvSeriesState.isLoading = false;
		}
	};


	return {
		trendingState,
		getTrendingVideos,
		newReleaseState,
		getNewReleases,
		popularThisWeekState,
		getPopularThisWeek,
		featuredState,
		getFeatured,
		videoState,
		getVideo,
		upcomingState,
		getUpcoming,
		tvSeriesState,
		getTvSeries,
	};
};
