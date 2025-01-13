<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import CarouselContent from "@/components/ui/carousel/CarouselContent.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { useRenderGenre } from "@/composables/shared/use-render-genre";
import { routeConst } from "@/constants/route-const";
import { getImageUrl } from "@/helper/tmdb-image";
import { cn } from "@/lib/utils";
import { useFavouriteStore } from "@/stores/favourite.store.ts";
import { usePlayVideoStore } from "@/stores/play-video.store";
import type { FeaturedProps, MovieT } from "@/types/types";
import { useMediaQuery } from "@vueuse/core";
import moment from "moment";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = withDefaults(defineProps<FeaturedProps>(), {
	movies: () => [],
});

const router = useRouter();
const isDesktop = useMediaQuery("(min-width: 1024px)");
const playVideoStore = usePlayVideoStore();
const favouriteStore = useFavouriteStore();
const { renderGenre } = useRenderGenre();

const activeMovie = ref<MovieT | undefined>();
const showFullOverview = ref(false);

// Watch Trailer Click
const handlePlayNow = () => {
	playVideoStore.setState({
		id: activeMovie.value?.id,
		title: activeMovie.value?.title || activeMovie.value?.original_title,
		shouldPlay: true,
	}); // Effective to auto play the video in the details page

	router.push(
		routeConst.movieDetails.replace(":id", String(activeMovie.value?.id)),
	);
};

// Set the active movie on mount
watch(
	() => props.movies,
	(newResults) => {
		if (newResults && newResults.length > 0) {
			activeMovie.value = newResults[0];
		} else {
			activeMovie.value = undefined; // Reset activeMovie if no results
		}
	},
	{
		immediate: true,
	},
);
const handleShowMore = () => {
	showFullOverview.value = !showFullOverview.value;
};
const setActiveMovie = (id: number) => {
	activeMovie.value = props.movies.find((item) => item.id === id);
};
</script>

<template>
	<section class="relative mt-5 -py-20">
		<!-- Background Blur -->
		<div class="absolute inset-0 -z-[1] bg-center bg-cover blur-[2px]">
			<div
				:style="{
					backgroundImage: `
         linear-gradient(
            to bottom,
            rgba(12, 10, 9, 1) 5%, 
            rgba(12, 10, 9, 0.1) 50%,
            rgba(12, 10, 9, 0.1) 70%,
            rgba(12, 10, 9, 1) 100% 
            ),
            linear-gradient(
               to right,
               rgba(12, 10, 9, 0.7) 10%,
               rgba(12, 10, 9, 0.7) 30%,
               rgba(12, 10, 9, 0) 70%,
               rgba(12, 10, 9, 0.1) 100%
               ),
               url(${getImageUrl(activeMovie?.backdrop_path || '')})
               `,
				}"
				class="size-full"
			/>
		</div>

		<!-- Content -->
		<div class="container grid gap-8 lg:items-center lg:grid-cols-5">
			<div class="w-full max-w-lg select-none lg:col-span-2">
				<div>
					<h3 class="text-3xl font-semibold leading-loose">
						Featured in Replay
					</h3>
					<h4 class="text-muted-foreground">
						Best featured for you today
					</h4>
				</div>

				<div class="grid gap-2.5 mt-14">
					<h1 class="max-w-md text-4xl font-semibold">
						{{
							activeMovie?.title ||
							activeMovie?.original_title ||
							"Unknown"
						}}
					</h1>

					<ul
						class="flex items-center gap-1.5 text-xs text-muted-foreground list-inside min-[400px]:text-sm [&>:nth-child(n+3)]:list-disc"
					>
						<li class="inline-flex items-center gap-1 text-foreground">
							<i class="pi pi-star-fill text-gold"></i>
							{{ activeMovie?.vote_average.toFixed(1) || "0.0" }}
						</li>

						<li class="border-l border-muted-foreground pl-1.5">
							{{ moment(activeMovie?.release_date).format("YYYY") }}
						</li>

						<li v-for="item in activeMovie?.genre_ids" :key="item">
							{{ renderGenre(item) }}
						</li>
					</ul>

					<p class="max-w-[450px]">
						{{
							showFullOverview
								? activeMovie?.overview
								: activeMovie?.overview.substring(0, 130) + "..."
						}}

						<Button
							variant="link"
							size="sm"
							v-if="activeMovie && activeMovie?.overview.length > 130"
							@click="handleShowMore"
							class="inline-block px-1"
						>
							Show {{ showFullOverview ? "less" : "more" }}
						</Button>
					</p>
				</div>

				<div class="flex items-center gap-2 mt-3">
					<Button class="max-sm:text-xs" @click="handlePlayNow">
						<i class="text-sm pi pi-play-circle sm:text-lg"></i>
						Play Now
					</Button>

					<Button
						variant="secondary"
						class="max-sm:text-xs"
						@click="
							favouriteStore.setFavourite({
								...activeMovie,
								type: 'movie',
							} as MovieT)
						"
					>
						<i
							:class="`text-sm pi sm:text-lg ${favouriteStore.isFavourite(Number(activeMovie?.id)) ? 'pi-bookmark-fill' : 'pi-bookmark'}`"
						></i>

						{{
							favouriteStore.isFavourite(Number(activeMovie?.id))
								? "Remove from Watchlist"
								: "Add to Watchlist"
						}}
					</Button>
				</div>
			</div>

			<!-- Carousel -->
			<Carousel
				class="grid lg:col-span-3"
				v-slot="{ canScrollNext, canScrollPrev }"
			>
				<CarouselContent>
					<CarouselItem
						v-if="props.isLoading"
						v-for="(_, index) in 6"
						:key="index"
						class="basis-[45%] sm:basis-[30%] md:basis-[28%] lg:basis-5/12 first:ml-1"
					>
						<Skeleton
							class="overflow-hidden rounded-md aspect-[12/16] lg:aspect-[9/16] xl:aspect-[11/16]"
						/>
					</CarouselItem>

					<CarouselItem
						v-else
						v-for="item in props.movies"
						:key="item.id"
						class="basis-[45%] sm:basis-[30%] md:basis-[28%] lg:basis-5/12 first:ml-1"
					>
						<button @click="setActiveMovie(item.id)" class="size-full">
							<Card
								:class="
									cn(
										'overflow-hidden rounded-md transition-all ease-in duration-100',
										{
											'ring-2 ring-primary scale-[0.9]':
												activeMovie?.id === item.id,
										},
									)
								"
							>
								<CardContent
									:style="{
										backgroundImage: `linear-gradient(
                           to bottom, 
                           rgba(12, 10, 9, 0) 10%,
                           rgba(12, 10, 9, 1) 95%,
                           rgba(12, 10, 9, 1) 100%
                           ),
                           url(${getImageUrl(item.poster_path)})`,
									}"
									class="px-4 py-2.5 select-none bg-center bg-cover aspect-[12/16] flex flex-col gap-2 justify-end sm:py-5 lg:aspect-[9/16] xl:aspect-[11/16]"
								>
									<h4
										class="font-semibold w-fit text-start max-md:text-sm"
									>
										{{ item?.title || item?.original_title }}
									</h4>

									<div
										class="grid grid-cols-[auto_1fr] items-center gap-1 text-xxs sm:text-xs"
									>
										<span class="inline-flex items-center gap-1">
											<i class="pi pi-star-fill text-gold"></i>
											{{ item?.vote_average.toFixed(1) }}
										</span>

										<ul
											class="flex border-l-2 border-muted-foreground/50 pl-1.5 items-center gap-1.5 list-disc list-inside whitespace-nowrap overflow-hidden truncate text-ellipsis"
										>
											<li
												v-for="genre in item.genre_ids"
												:key="genre"
												class="first:list-none"
											>
												{{ renderGenre(genre) }}
											</li>
										</ul>
									</div>
								</CardContent>
							</Card>
						</button>
					</CarouselItem>
				</CarouselContent>

				<CarouselPrevious
					v-if="isDesktop && !props.isLoading && canScrollPrev"
				/>
				<CarouselNext
					v-if="isDesktop && !props.isLoading && canScrollNext"
				/>
			</Carousel>
		</div>
	</section>
</template>
