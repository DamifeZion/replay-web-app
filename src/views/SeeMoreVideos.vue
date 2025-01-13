<script lang="ts" setup>
import Error from "@/components/Error.vue";
import Loading from "@/components/Loading.vue";
import PortraitMovieCard from "@/components/movie-card/PortraitMovieCard.vue";
import { Button } from "@/components/ui/button";
import { axios } from "@/plugins/axios";
import { useSeeMoreStore } from "@/stores/see-more.store";
import type { AxiosFetchState, MovieT } from "@/types/types";
import { ChevronLeft, Loader } from "lucide-vue-next";
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

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

// Reset the see more title in Store on page exit;
onBeforeRouteLeave((to, from, next) => {
	seeMoreStore.setTitle("");
	next();
});

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
		movies.error = err;
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
		if (!movies.error) {
			fetchMovies();
		}
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
		<div class="flex items-center gap-2 mb-4">
			<Button
				variant="secondary"
				size="icon"
				@click="router.back"
				class="size-6"
			>
				<ChevronLeft class="!size-6" />
			</Button>

			<h3 class="text-2xl font-semibold">
				{{ pageTitle }}
			</h3>
		</div>

		<!-- Error -->
		<Error
			v-if="movies.error && !movies.isLoading"
			:error="String(movies.error)"
			@retry="fetchMovies"
		/>

		<!-- Initial Loading -->
		<Loading v-if="movies.isLoading && movies.data.results.length === 0" />

		<!-- Main Content -->
		<section
			v-else
			class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-4"
		>
			<PortraitMovieCard
				v-for="(movie, index) in movies.data.results as Array<MovieT>"
				:movie="movie as MovieT"
				:index="index"
				:key="movie?.id"
				:video-type="videoType"
			/>

			<!-- Subsequent Loading -->
			<Loader
				v-if="movies.isLoading && movies.data.results.length > 0"
				class="mx-auto my-4 col-span-full animate-spin size-8"
			/>
		</section>
	</main>
</template>
