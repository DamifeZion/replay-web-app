import type { PlayVideoStore, VideoTypeT } from "@/types/types";
import { defineStore } from "pinia";

export const usePlayVideoStore = defineStore("play-video", {
	state: (): PlayVideoStore => ({
		id: 0,
		title: "",
		shouldPlay: false,
		videoType: "movie",
	}),

	actions: {
		togglePlay() {
			this.shouldPlay = !this.shouldPlay;
			console.log(this.shouldPlay);
		},
		setState(payload: Partial<PlayVideoStore>) {
			this.id = payload.id || this.id;
			this.title = payload.title || this.title;
			this.videoType = payload.videoType || this.videoType;
			this.shouldPlay = payload.shouldPlay || this.shouldPlay;
		},
		resetState() {
			this.id = 0;
			this.title = "";
			this.videoType = "movie";
			this.shouldPlay = false;
		},
	},

	persist: true,
});
