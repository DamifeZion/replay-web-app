import { defineStore } from "pinia";

export const useSeeMoreStore = defineStore("seeMore", {
	state: () => ({
		title: "",
	}),
	actions: {
		setTitle(title: string) {
			this.title = title;
		},
	},
	persist: true,
});
