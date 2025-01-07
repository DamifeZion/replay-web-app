<script lang="ts" setup>
import { useRenderGenre } from "@/composables/shared/use-render-genre";
import { getImageUrl } from "@/helper/tmdb-image";
import { cn } from "@/lib/utils";
import type { MovieT, MovieCardProps } from "@/types/types";
import { Card, CardContent } from "../ui/card";
import { RouterLink } from "vue-router";
import { routeConst } from "@/constants/route-const";
import CardHeader from "../ui/card/CardHeader.vue";

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
</script>

<template>
	<RouterLink
		:to="routeConst.movieDetails.replace(':id', String(props.movie.id))"
	>
		<Card class="bg-transparent border-none">
			<CardHeader
				:style="{
					backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 60%, rgba(0,0,0,1) 100%), url(${getImageUrl(movieProps?.poster_path)})`,
				}"
				class="bg-bottom bg-cover border select-none aspect-[1/0.7] rounded-3xl"
			>
			</CardHeader>

			<CardContent
				:class="
					cn('px-4 py-2.5 gap-2 flex flex-col justify-end', props.class)
				"
			>
				<h4 class="font-semibold w-fit text-start max-md:text-sm">
					{{ movieProps?.title || movieProps?.original_title }}
				</h4>

				<div
					class="grid grid-cols-[auto_1fr] items-center gap-1 text-xxs sm:text-xs"
				>
					<span class="inline-flex items-center gap-1">
						<i class="pi pi-star-fill text-gold"></i>
						{{ movieProps?.vote_average.toFixed(1) }}
					</span>

					<ul
						class="flex border-l-2 border-muted-foreground/50 pl-1.5 items-center gap-1.5 list-disc list-inside whitespace-nowrap overflow-hidden truncate text-ellipsis"
					>
						<li
							v-for="item in movieProps.genre_ids"
							:key="item"
							class="first:list-none"
						>
							{{ renderGenre(item, props?.videoType) }}
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	</RouterLink>
</template>
