import { ENDPOINT } from "@/constants/endpoint-const";
import { axios } from "@/plugins/axios";
import type {
	AxiosFetchState,
	CreditT,
	MovieDetailsFetchState,
} from "@/types/types";
import { watch, reactive, computed } from "vue";
import { useRoute } from "vue-router";

export const useMovieDetails = () => {
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

			console.log(credits.data);
		} catch (err) {
			console.error(err);
			detailsState.error = err;
		} finally {
			detailsState.isLoading = false;
		}
	};

	const recommendedState = reactive<AxiosFetchState>({
		data: [],
		error: "",
		isLoading: false,
	});
	const getRecommendedMovies = async () => {
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
		} finally {
			reviewsState.isLoading = false;
		}
	};

	watch(
		() => route.params.id,
		(newMovieId, oldMovieId) => {
			if (newMovieId !== oldMovieId) {
				getMovieDetails();
				getRecommendedMovies();
				getReviews();
			}
		},
		{ immediate: true },
	);

	return {
		detailsState,
		recommendedState,
		movieId,
		reviewsState
	};
};
