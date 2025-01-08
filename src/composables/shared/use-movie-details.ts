import { ENDPOINT } from "@/constants/endpoint-const";
import { axios } from "@/plugins/axios";
import type { CreditT, MovieDetailsFetchState } from "@/types/types";
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
	onMounted(() => getMovieDetails());

	return {
		detailsState,
	};
};

adult: false;
cast_id: 143;
character: "Ellen Hutter";
credit_id: "675ab27f661e8dd41d996f10";
gender: 1;
id: 1459885;
known_for_department: "Acting";
name: "Lily-Rose Depp";
order: 0;
original_name: "Lily-Rose Depp";
popularity: 67.388;
profile_path: "/kWSRS0M5uv0KlFJUvH6Rqm2g70B.jpg";
