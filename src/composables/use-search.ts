import { routeConst } from "@/constants/route-const";
import { onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useURLQuery } from "./shared/use-url-query";
import type { AxiosFetchState } from "@/types/types";
import { axios } from "@/plugins/axios";
import { ENDPOINT } from "@/constants/endpoint-const";

export const useSearch = () => {
	const { getQuery } = useURLQuery();
	const route = useRoute();
	const router = useRouter();

	const q = getQuery("search");

	// Check if the page is search and there is no search query then redirect home.
	watch(
		() => route.path,
		(newPath) => {
			if (newPath === routeConst.search && !q.value) {
				router.push(routeConst.home);
			}
		},
		{
			immediate: true,
		},
	);

	// MAke a search request with the query
	const searchResult = reactive<AxiosFetchState>({
		data: {},
		error: "",
		isLoading: false,
	});
	const getSearchResult = async () => {
		try {
			searchResult.isLoading = true;
			searchResult.error = "";

			const res = await axios.get(ENDPOINT.GET_SEARCH_RESULT, {
				params: {
					query: q,
				},
			});

			console.log(res.data);
			searchResult.data = res.data;
		} catch (err) {
			console.error(err);
		} finally {
			searchResult.isLoading = false;
		}
	};
	onMounted(() => getSearchResult());

	return {
		searchResult,
		getSearchResult
	};
};
