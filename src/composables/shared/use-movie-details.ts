import { ENDPOINT } from "@/constants/endpoint-const";
import { axios } from "@/plugins/axios";
import type {
	AxiosFetchState,
	CreditT,
	MovieDetailsFetchState,
} from "@/types/types";
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";

export const useMovieDetails = () => {
	const route = useRoute();

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
						String(route.params.id),
					),
				),
				axios.get(
					ENDPOINT.GET_MOVIE_CREDITS.replace(
						":movie_id",
						String(route.params.id),
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
					String(route.params.id),
				),
			);

			console.log(res.data);
		} catch (err) {
		} finally {
			recommendedState.isLoading = false;
		}
	};

	onMounted(() => {
		getMovieDetails();
		getRecommendedMovies();
	});

	return {
		detailsState,
		recommendedState
	};
};
