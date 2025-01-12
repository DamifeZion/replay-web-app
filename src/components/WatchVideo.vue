<script lang="ts" setup>
import { usePlayVideoStore } from "@/stores/play-video.store";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { ref, watch, type VNode } from "vue";
import { ENDPOINT } from "@/constants/endpoint-const";
import { axios } from "@/plugins/axios";
import { Skeleton } from "./ui/skeleton";
import Error from "./Error.vue";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import type { VideoT } from "@/types/types";

const baseVideoURL = "https://www.youtube.com/embed/:key?autoplay=1";
const baseThumbnailURL = "https://img.youtube.com/vi/:key/hqdefault.jpg";

const playVideoStore = usePlayVideoStore();

const trailerVids = ref<Array<VideoT>>([]);
const behindScenesVids = ref<Array<VideoT>>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const activeVideoURL = ref<string>("");

const setActiveVideo = (key: string) => {
	activeVideoURL.value = baseVideoURL.replace(":key", key);
   window.location.hash = "bop"
};
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

		// Filter videos to include only YouTube trailers
		const ytVideos = res.data?.results.filter(
			(item: VideoT) => item.site?.toLowerCase() === "youtube",
		);

		trailerVids.value = ytVideos.filter(
			(item: VideoT) => item.type.toLowerCase() === "trailer",
		);
		behindScenesVids.value = ytVideos.filter(
			(item: VideoT) => item.type.toLowerCase() === "behind the scenes",
		);

		activeVideoURL.value = baseVideoURL.replace(
			":key",
			trailerVids.value[0].key,
		);

		console.log("Filtered Videos: ", ytVideos);
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
			activeVideoURL.value = "";
		}
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<Dialog
		:open="playVideoStore.shouldPlay"
		@update:open="playVideoStore.togglePlay"
	>
		<DialogContent
			class="grid w-full max-w-screen-2xl grid-rows-[auto_1fr] px-2 *:px-4"
		>
			<DialogHeader>
				<DialogTitle>
					{{ playVideoStore.title }}
				</DialogTitle>

				<DialogDescription class="sr-only">
					Watch {{ playVideoStore.title }} trailer. Powered by TMDB.
				</DialogDescription>
			</DialogHeader>

			<ScrollArea>
				<!-- Loading State -->
				<section v-if="isLoading">
					<Skeleton class="w-full rounded-lg aspect-video" />

					<ul class="flex mt-6 overflow-auto">
						<li v-for="_ in 4">
							<Skeleton class="basis-1/4" />
						</li>
					</ul>
				</section>

				<Error
					v-else-if="error"
					:error="String(error)"
					@retry="fetchTrailer"
				/>

				<section v-else>
					<iframe
                  id="bop"
						class="w-full aspect-video"
						:src="activeVideoURL"
						:title="`${playVideoStore.title} Trailer`"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>

					<!-- The Trailers -->
					<section v-if="trailerVids.length" class="mt-10">
						<h5 class="text-xl font-semibold">
							Trailers ({{ trailerVids.length }})
						</h5>

						<ScrollArea class="pb-3 mt-4 whitespace-nowrap">
							<button
								v-for="item in trailerVids"
								:key="item.id"
								@click="setActiveVideo(item.key)"
								class="ml-4 overflow-hidden border rounded-lg first:ml-0 aspect-video"
							>
								<img
									:src="baseThumbnailURL.replace(':key', item.key)"
									alt="Behind the Scenes Thumbnail"
									class="object-cover w-full h-full"
								/>
							</button>

							<ScrollBar orientation="horizontal" />
						</ScrollArea>
					</section>

					<!-- Behind The Scenes -->
					<section v-if="behindScenesVids.length" class="mt-6">
						<h5 class="text-xl font-semibold">
							Behind the scenes ({{ behindScenesVids.length }})
						</h5>

						<ScrollArea class="pb-3 mt-4 whitespace-nowrap">
							<button
								v-for="item in behindScenesVids"
								:key="item.id"
								@click="setActiveVideo(item.key)"
								class="ml-4 overflow-hidden border rounded-lg first:ml-0 aspect-video"
							>
								<img
									:src="baseThumbnailURL.replace(':key', item.key)"
									alt="Behind the Scenes Thumbnail"
									class="object-cover w-full h-full"
								/>
							</button>

							<ScrollBar orientation="horizontal" />
						</ScrollArea>
					</section>
				</section>
			</ScrollArea>
		</DialogContent>
	</Dialog>
</template>
