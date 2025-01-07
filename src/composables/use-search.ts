import { useSearchStore } from "@/stores/search.store";
import { watchEffect } from "vue";
import { useURLQuery } from "./shared/use-url-query";

export const useSearch = () => {
	const { appendQuery, getQuery, deleteQuery } = useURLQuery();

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
			return appendQuery({ q: searchStore.searchValue });
		}

		return searchStore.toggleShowSearch();
	};

	const handleInputBlur = () => {
		if (!searchStore.searchValue) {
			searchStore.showSearch = false;
			deleteQuery("q");
		}
	};

	return {
		searchStore,
		handleSearchClick,
		handleInputBlur,
	};
};
