<script lang="ts" setup>
import { useRenderGenre } from "@/composables/shared/use-render-genre";
import { getImageUrl } from "@/helper/tmdb-image";
import type { MovieT, MovieCardProps } from "@/types/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { RouterLink } from "vue-router";
import { routeConst } from "@/constants/route-const";
import { Film } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";
import { computed } from "vue";

const props = withDefaults(defineProps<MovieCardProps>(), {
	movie: () =>
		({
			id: 0,
			genre_ids: [],
			title: "Unknown",
			video: false,
			overview: "No description available.",
			poster_path: "",
			backdrop_path: "",
			original_title: "Unknown",
			popularity: 0,
			release_date: "N/A",
			vote_average: 0,
			vote_count: 0,
		}) as MovieT,
});
const movieProps = props.movie;

const { renderGenre } = useRenderGenre();
const isXsScreen = useMediaQuery("(max-width: 250px)");
// Determine the number of visible genres
const visibleGenresCount = computed(() => (isXsScreen.value ? 1 : 2));
</script>

<template>
	<RouterLink
		:to="routeConst.movieDetails.replace(':id', String(props.movie.id))"
	>
		<div
			class="grid grid-cols-[auto_1fr] max-h-[150px] items-center gap-3 select-none"
		>
			<h1 class="text-5xl font-semibold font-logo">
				{{ props.index + 1 }}
			</h1>

			<Card class="bg-transparent border-none flex-row flex gap-4 *:p-0">
				<img
					:src="getImageUrl(movieProps.poster_path)"
					class="object-cover object-center w-24 h-32 border rounded-md"
				/>

				<CardContent
					class="flex flex-col justify-center flex-grow gap-3 pt-2"
				>
					<h3 class="text-sm font-semibold text-balance line-clamp-2">
						{{ movieProps.title || movieProps.original_title }}
					</h3>

					<ul
						class="flex flex-wrap items-center gap-1.5 list-disc list-inside [&>:nth-child(2)]:list-none"
					>
						<Film class="text-muted-foreground size-3" />

						<li
							v-for="item in movieProps.genre_ids.slice(
								0,
								visibleGenresCount,
							)"
							:key="item"
							class="text-xxs"
						>
							{{ renderGenre(item) }}
						</li>
					</ul>

					<div class="flex items-center gap-1.5">
						<span class="inline-flex items-center gap-1 text-xs">
							<i class="pi pi-star-fill text-gold"></i>
							{{ movieProps?.vote_average.toFixed(1) }}
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	</RouterLink>
</template>
