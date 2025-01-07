import { defineStore } from "pinia";

export const useFeaturedStore = defineStore("featured", {
	state: () => ({
		featuredVideos: [{}],
	}),
	actions: {
		setVideos(featuredVids: Array<{}>) {
			this.featuredVideos = featuredVids;
		},
	},
});
