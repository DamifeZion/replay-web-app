<script lang="ts" setup>
import PortraitMovieCard from "@/components/movie-card/PortraitMovieCard.vue";
import { Button } from "@/components/ui/button";
import { axios } from "@/plugins/axios";
import { useSeeMoreStore } from "@/stores/see-more.store";
import type { AxiosFetchState, MovieT } from "@/types/types";
import { ChevronLeft, Loader, Loader2 } from "lucide-vue-next";
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const seeMoreStore = useSeeMoreStore();
const route = useRoute();
const router = useRouter();
const decodedRoute = JSON.parse(
	window.atob(String(route.params.encrypted_endpoint)),
);
const endpoint = computed(() => decodedRoute.endpoint);
const pageTitle = seeMoreStore.title
	? `Similar to ${seeMoreStore.title}`
	: computed(() => decodedRoute.pageTitle);
const videoType = computed(() => decodedRoute.videoType);

const movies = reactive<AxiosFetchState>({
	data: {
		results: [],
		page: 0,
		total_pages: 1,
		total_results: 1,
	},
	isLoading: false,
	error: "",
});

// Fetch function with pagination
const fetchMovies = async () => {
	if (movies.isLoading || movies.data.page >= movies.data.total_pages) {
		// Prevent Duplicate Requests;
		return;
	}
	try {
		movies.isLoading = true;
		movies.error = "";

		const res = await axios.get(endpoint.value, {
			params: {
				page: movies.data.page + 1,
			},
		});

		console.log(res.data);
		// Merge old and new resultsi
		movies.data.results = [
			...(movies.data.results || []),
			...(res.data.results.map(
				(item: any): MovieT => ({
					...item,
					title: item?.name || item?.title,
					original_title: item?.original_name || item?.original_title,
				}),
			) || []),
		];

		movies.data.page = res.data.page || movies.data.page;
		movies.data.total_pages =
			res.data?.total_pages || movies.data.total_pages;
		movies.data.total_results =
			res.data?.total_results || movies.data.total_results;
	} catch (err) {
		movies.error = String(err);
		console.error(err);
	} finally {
		movies.isLoading = false;
	}
};

// Scroll detection
const handleScroll = () => {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = document.documentElement.clientHeight;

	// If user scrolls near the bottom, fetch more movies
	if (scrollTop + clientHeight >= scrollHeight - 100) {
		fetchMovies();
	}
};

//Scroll Event Listener
onMounted(() => {
	window.addEventListener("scroll", handleScroll);
	fetchMovies();
});

// Clean up scroll event listener
onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
	<main class="container pt-10 mt-16">
		<section v-if="movies.error" class="text-red-500">
			<p>Error: {{ movies.error }}</p>
		</section>

		<section
			v-if="movies.isLoading && movies.data.results.length === 0"
			class="flex items-center justify-center py-40"
		>
			<Loader2 class="animate-spin size-8" />
		</section>

		<section v-else>
			<div class="flex items-center gap-2 mb-4">
				<Button
					variant="secondary"
					size="icon"
					@click="router.back"
					class="size-6"
				>
					<ChevronLeft class="!size-5" />
				</Button>

				<h3 class="text-2xl font-semibold">
					{{ pageTitle }}
				</h3>
			</div>

			<div
				class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-4"
			>
				<PortraitMovieCard
					v-for="(movie, index) in movies.data.results as Array<MovieT>"
					:movie="movie as MovieT"
					:index="index"
					:key="movie?.id"
					:video-type="videoType"
				/>

				<Loader
					v-if="movies.isLoading"
					class="mx-auto my-4 col-span-full animate-spin size-8"
				/>
			</div>
		</section>
	</main>
</template>
