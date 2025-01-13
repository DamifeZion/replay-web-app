import { useSearchStore } from "@/stores/search.store";
import { watchEffect } from "vue";
import { useURLQuery } from "./shared/use-url-query";
import { useRouter } from "vue-router";
import { routeConst } from "@/constants/route-const";

export const useSearchBar = () => {
	const { getQuery, deleteQuery } = useURLQuery();

	const router = useRouter();
	const q = getQuery("search");
	const searchStore = useSearchStore();

	watchEffect(() => {
		searchStore.setSearchValue(String(q.value));
		if (q.value) {
			searchStore.showSearch = true;
		}
	});

	const handleSearchClick = () => {
		if (searchStore.searchValue) {
			router.push({
				path: routeConst.search,
				query: {
					q: searchStore.searchValue,
				},
			});
		}

		searchStore.toggleShowSearch();
	};

	const handleInputBlur = () => {
		if (!searchStore.searchValue) {
			searchStore.showSearch = false;
			deleteQuery("search");
		}
	};



	return {
		searchStore,
		handleSearchClick,
		handleInputBlur,
	};
};
