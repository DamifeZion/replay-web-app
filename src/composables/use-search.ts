import { routeConst } from "@/constants/route-const";
import { onMounted, onUnmounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useURLQuery } from "./shared/use-url-query";
import type { AxiosFetchState, MovieT } from "@/types/types";
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

	const resetSearchResult = () => {
		searchResult.data = {
			results: [],
			page: 0,
			total_pages: 0,
			total_results: 0,
		};
		searchResult.error = "";
	};

	const getSearchResult = async () => {
		// Prevent duplicate requests or unnecessary calls
		if (searchResult.isLoading || !q.value || searchResult.data?.page > searchResult.data?.total_pages) {
			return;
		}

		try {
			searchResult.isLoading = true;
			searchResult.error = "";

			const res = await axios.get(ENDPOINT.GET_SEARCH_RESULT, {
				params: {
					query: q.value,
					page: searchResult.data.page + 1 || 1,
				},
			});

			// Merge old and new resultsi
			searchResult.data.results = [
				...(searchResult.data.results || []),
				...(res.data.results.map(
					(item: any): MovieT => ({
						...item,
						title: item?.name || item?.title,
						original_title: item?.original_name || item?.original_title,
					}),
				) || []),
			];

			searchResult.data.page = res.data.page || searchResult.data.page;
			searchResult.data.total_pages =
				res.data?.total_pages || searchResult.data.total_pages;
			searchResult.data.total_results =
				res.data?.total_results || searchResult.data.total_results;
		} catch (err) {
			console.error(err);
		} finally {
			searchResult.isLoading = false;
		}
	};

	// Scroll detection
	const handleScroll = () => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const scrollHeight = document.documentElement.scrollHeight;
		const clientHeight = document.documentElement.clientHeight;

		// If user scrolls near the bottom, fetch more movies
		if (scrollTop + clientHeight >= scrollHeight - 100) {
			if (!searchResult.error) {
				getSearchResult();
			}
		}
	};

	//Scroll Event Listener
	onMounted(() => {
		window.addEventListener("scroll", handleScroll);
		getSearchResult();
	});

	// Clean up scroll event listener
	onUnmounted(() => {
		window.removeEventListener("scroll", handleScroll);
	});

	// Watch for changes in the query and reset/refetch results
	watch(
		q,
		(newValue, oldValue) => {
			if (newValue !== oldValue) {
				resetSearchResult();
				getSearchResult(); // Fetch results for the new query
			}
		},
		{ immediate: true },
	);

	return {
		router,
		searchResult,
		getSearchResult,
	};
};
