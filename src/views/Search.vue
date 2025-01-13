<script lang="ts" setup>
import Error from "@/components/Error.vue";
import Loading from "@/components/Loading.vue";
import PortraitMovieCard from "@/components/movie-card/PortraitMovieCard.vue";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/composables/use-search";
import type { MovieT, VideoTypeT } from "@/types/types";
import { ChevronLeft, Loader } from "lucide-vue-next";

const { router, searchResult, getSearchResult } = useSearch();
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
				Search result: {{ searchResult.data?.total_results }}
			</h3>
		</div>

		<!-- Error -->
		<Error
			v-if="searchResult.error && !searchResult.isLoading"
			:error="String(searchResult.error)"
			@retry="getSearchResult"
			class="pt-[230px]"
		/>

		<!-- Initial Loading -->
		<Loading
			v-if="searchResult.isLoading && searchResult.data.results.length === 0"
			class="pb-20 pt-[230px]"
		/>

		<!-- Main Content -->
		<section
			class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-4"
		>
			<PortraitMovieCard
				v-for="(movie, index) in searchResult.data.results as Array<MovieT>"
				:movie="movie as MovieT"
				:index="index"
				:key="movie?.id"
				video-type="movie"
			/>

			<!-- Subsequent Loading -->
			<Loader
				v-if="
					searchResult.isLoading && searchResult.data.results.length > 0
				"
				class="mx-auto my-4 col-span-full animate-spin size-8"
			/>
		</section>
	</main>
</template>
