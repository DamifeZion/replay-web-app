import { routeConst } from "@/constants/route-const";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useURLQuery } from "./use-url-query";

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
   

	return {};
};
