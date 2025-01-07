import type { FormValuesT } from "@/types/types";
import { defineStore } from "pinia";
import type { ComputedRef } from "vue";

export const useSearchStore = defineStore("search", {
	state: () => ({
		showSearch: false,
		searchValue: "",
	}),
	actions: {
		toggleShowSearch() {
			this.showSearch = !this.showSearch;
		},
		setSearchValue(payload: string) {
			this.searchValue = payload;
		},
	},
});
