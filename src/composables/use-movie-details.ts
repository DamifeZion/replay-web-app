import { ENDPOINT } from "@/constants/endpoint-const";
import { routeConst } from "@/constants/route-const";
import { axios } from "@/plugins/axios";
import { usePlayVideoStore } from "@/stores/play-video.store";
import { useSeeMoreStore } from "@/stores/see-more.store";
import type {
	AxiosFetchState,
	MovieDetailsFetchState,
	ReviewT,
} from "@/types/types";
import { useMediaQuery } from "@vueuse/core";
import { watch, reactive, computed, ref } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";

export const useMovieDetails = () => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const seeMoreStore = useSeeMoreStore();
	const playVideoStore = usePlayVideoStore();

	const route = useRoute();
	const movieId = computed(() => route.params.id);

	const detailsState = reactive<MovieDetailsFetchState>({
		data: undefined,
		error: "",
		isLoading: false,
	});

	const getMovieDetails = async () => {
		try {
			detailsState.isLoading = true;
			detailsState.error = "";

			const [videoDetails, credits] = await Promise.all([
				axios.get(
					ENDPOINT.GET_VIDEO_DETAILS.replace(
						":movie_id",
						String(movieId.value),
					),
				),
				axios.get(
					ENDPOINT.GET_MOVIE_CREDITS.replace(
						":movie_id",
						String(movieId.value),
					),
				),
			]);

			detailsState.data = {
				movie: videoDetails.data,
				credit: {
					...credits.data,
					cast: credits.data?.cast.map((item: any) => ({
						...item,
						gender:
							item?.gender === 1
								? "Female"
								: item?.gender === 2
									? "Male"
									: "Unknown",
					})),
				},
			};
		} catch (err) {
			console.error(err);
			detailsState.error = err;
		} finally {
			detailsState.isLoading = false;
		}
	};

	// Persist the Video Title to use in See More
	watch(
		detailsState,
		(newVal) => {
			if (newVal) {
				seeMoreStore.setTitle(
					String(
						newVal.data?.movie.title || newVal.data?.movie.original_title,
					),
				);
			}
		},
		{
			immediate: true,
		},
	);

	// If the next route name is not see More, then remove the title set in the store.
	onBeforeRouteLeave((to, from, next) => {
		if (to.name !== routeConst.seeMoreVideos) {
			seeMoreStore.setTitle("");
		}

		// Clear the current playing
		playVideoStore.resetState();
		next();
	});

	const recommendedState = reactive<AxiosFetchState>({
		data: [],
		error: "",
		isLoading: false,
	});
	const getRecommendedVideos = async () => {
		try {
			recommendedState.isLoading = false;
			recommendedState.error = "";

			const res = await axios.get(
				ENDPOINT.GET_RECOMMENDED_MOVIE.replace(
					":movie_id",
					String(movieId.value),
				),
			);

			recommendedState.data = res.data;
		} catch (err) {
			console.error(err);
		} finally {
			recommendedState.isLoading = false;
		}
	};

	const reviewsState = reactive<AxiosFetchState>({
		data: [],
		error: "",
		isLoading: false,
	});
	const getReviews = async () => {
		try {
			reviewsState.isLoading = false;
			reviewsState.error = "";

			const res = await axios.get(
				ENDPOINT.GET_MOVIE_REVIEWS.replace(
					":movie_id",
					String(movieId.value),
				),
			);

			reviewsState.data = res.data;
		} catch (err) {
			console.error(err);
		} finally {
			reviewsState.isLoading = false;
		}
	};

	watch(
		() => route.params.id,
		(newMovieId, oldMovieId) => {
			if (newMovieId !== oldMovieId) {
				getMovieDetails();
				getRecommendedVideos();
				getReviews();
			}
		},
		{ immediate: true },
	);

	// Add `showFullContent` to each review item
	const reviewContentLength: number = isDesktop ? 600 : 300;
	reviewsState.data.results?.map((item: ReviewT) => ({
		...item,
		showFullContent: false,
	}));

	// Toggle show more/less for a specific review
	const toggleShowMore = (index: number) => {
		reviewsState.data.results[index].showFullContent =
			!reviewsState.data.results[index].showFullContent;
	};

	const maxShownReviews = ref(3);
	const toggleMaxShownReviews = () => {
		let value: number = 3;
		const reviewLength = reviewsState.data?.results.length;

		switch (maxShownReviews.value) {
			case 3:
				value = reviewLength;
				break;
			default:
				value = 3;
		}

		maxShownReviews.value = value;
	};

	const handleRetry = () => {
		getMovieDetails();
		getRecommendedVideos();
		getReviews();
	};

	const handlePlayNow = () => {
		playVideoStore.setState({
			id: detailsState.data?.movie.id,
			title:
				detailsState.data?.movie.title ||
				detailsState.data?.movie.original_title,
			shouldPlay: true,
		});
	};

	return {
		// API Data
		detailsState,
		recommendedState,
		reviewsState,

		//Others
		movieId,
		isDesktop,
		reviewContentLength,
		toggleShowMore,
		maxShownReviews,
		toggleMaxShownReviews,
		handleRetry,
		handlePlayNow,
	};
};
