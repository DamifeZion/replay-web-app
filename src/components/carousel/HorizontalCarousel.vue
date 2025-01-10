<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel";
import type { MovieCarousel, MovieT } from "@/types/types";
import { Button } from "../ui/button";
import { RouterLink } from "vue-router";
import PortraitMovieCard from "../movie-card/PortraitMovieCard.vue";
import { cn } from "@/lib/utils";
import { routeConst } from "@/constants/route-const";
import LandscapeMovieCard from "../movie-card/LandscapeMovieCard.vue";
import LeaderboardMovieCard from "../movie-card/LeaderboardMovieCard.vue";

const props = defineProps<MovieCarousel>();
const isDesktop = useMediaQuery("(min-width: 1024px)");

const videoType = props.videoType || "movie";

const urlToken = {
	endpoint: String(props.showMoreEndpoint),
	pageTitle: props.headTitle,
	videoType,
};
const seeMoreURL = routeConst.seeMoreMovies.replace(
	":encrypted_endpoint",
	window.btoa(JSON.stringify(urlToken)),
);
</script>

<template>
	<section :class="cn('container py-20 space-y-4', props.class)">
		<div class="flex justify-between gap-2 sm:items-center">
			<h3 class="text-2xl font-semibold">{{ props.headTitle }}</h3>
			<Button v-if="props.showMore" as-child variant="link" size="sm">
				<RouterLink :to="seeMoreURL"> See more </RouterLink>
			</Button>
		</div>

		<Carousel v-slot="{ canScrollNext, canScrollPrev }">
			<CarouselContent>
				<CarouselItem
					v-for="(item, index) in props.data?.results"
					:key="item?.id"
					:class="
						cn(
							'basis-[45%] sm:basis-[30%] md:basis-[28%] lg:basis-[22%]',
							{
								'basis-[89%] min-[500px]:basis-8/12 min-[580px]:basis-7/12 sm:basis-7/12 md:basis-6/12 min-[800px]:basis-5/12 lg:basis-[35%] xl:basis-[28%]':
									props.cardPresentation === 'LeaderboardMovieCard',
							},
							props.carouselItemClass,
						)
					"
				>
					<PortraitMovieCard
						v-if="props.cardPresentation === 'PortraitMovieCard'"
						:index="index"
						:video-type="videoType"
						:movie="item as MovieT"
						:is-loading="props.isLoading"
					/>
					<LandscapeMovieCard
						v-if="props.cardPresentation === 'LandscapeMovieCard'"
						:index="index"
						:video-type="videoType"
						:movie="item as MovieT"
						:is-loading="props.isLoading"
					/>
					<LeaderboardMovieCard
						v-if="props.cardPresentation === 'LeaderboardMovieCard'"
						:index="index"
						:video-type="videoType"
						:movie="item as MovieT"
						:is-loading="props.isLoading"
					/>
				</CarouselItem>
			</CarouselContent>

			<CarouselPrevious v-if="isDesktop && canScrollPrev" />
			<CarouselNext v-if="isDesktop && canScrollNext" />
		</Carousel>
	</section>
</template>
