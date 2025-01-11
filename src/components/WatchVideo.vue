<script lang="ts" setup>
import { usePlayVideoStore } from "@/stores/play-video.store";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { ref, watch } from "vue";
import { ENDPOINT } from "@/constants/endpoint-const";
import { axios } from "@/plugins/axios";

const playVideoStore = usePlayVideoStore();

const videoKey = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Fetch Trailer
const fetchTrailer = async () => {
	try {
		isLoading.value = true;
		error.value = null;

		const videoEndpoint =
			playVideoStore.videoType === "movie"
				? ENDPOINT.GET_MOVIE_VIDEO
				: ENDPOINT.GET_TV_VIDEO;

		const res = await axios.get(
			videoEndpoint.replace(":id", String(playVideoStore.id)),
		);

		console.log(res);
	} catch (err) {
		error.value = String(err);
	} finally {
		isLoading.value = false;
	}
};

// Watch `shouldPlay` and fetch trailer when dialog opens
watch(
	() => playVideoStore.shouldPlay,
	(newValue) => {
		if (newValue) {
			fetchTrailer();
		} else {
			// Clear the video key when dialog closes
			videoKey.value = null;
		}
	},
);
</script>

<template>
	<Dialog
		:open="playVideoStore.shouldPlay"
		@update:open="playVideoStore.togglePlay"
	>
		<DialogContent>
			<DialogHeader>
				<DialogTitle> </DialogTitle>

				<DialogDescription> </DialogDescription>
			</DialogHeader>

			<div>
				<video />
			</div>
		</DialogContent>
	</Dialog>
</template>
