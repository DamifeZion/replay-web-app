<script lang="ts" setup>
import Badge from "@/components/ui/badge/Badge.vue";
import { Button } from "@/components/ui/button";
import {
	CarouselContent,
	Carousel,
	type CarouselApi,
} from "@/components/ui/carousel";
import CarouselItem from "@/components/ui/carousel/CarouselItem.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { useRenderGenre } from "@/composables/shared/use-render-genre";
import { getImageUrl } from "@/helper/tmdb-image";
import { cn } from "@/lib/utils";
import type { MovieCardProps, MovieT, SpotlightProps } from "@/types/types";
import { watchOnce } from "@vueuse/core";
import moment from "moment";
import { ref } from "vue";
import Autoplay from "embla-carousel-autoplay";

/**Props definition */
const props = withDefaults(defineProps<SpotlightProps>(), {
	trendingVideos: () => [],
});

const { renderGenre } = useRenderGenre();

// Pagination controls
const emblaMainApi = ref<CarouselApi>();
const selectedIndex = ref(0);

const onSelect = () => {
	if (!emblaMainApi.value) return;
	selectedIndex.value = emblaMainApi.value.selectedScrollSnap();
};

const onDotClick = (index: number) => {
	if (emblaMainApi.value) {
		selectedIndex.value = index;
		return emblaMainApi.value?.scrollTo(index);
	}
};

// Watch for Embla API initialization
watchOnce(emblaMainApi, (emblaMainApi) => {
	if (!emblaMainApi) return;

	onSelect();
	emblaMainApi.on("select", onSelect);
	emblaMainApi.on("reInit", onSelect);
});
</script>

<template>
	<Skeleton
		v-if="props.isLoading"
		class="aspect-video h-full max-h-[780px] w-full"
	/>

	<Carousel
		v-else
		@init-api="(val) => (emblaMainApi = val)"
		class="relative flex flex-col w-full"
		:opts="{
			align: 'start',
			loop: true,
		}"
		:plugins="[
			Autoplay({
				delay: 5000,
			}),
		]"
	>
		<CarouselContent>
			<CarouselItem
				v-for="item in props.trendingVideos as Array<MovieT>"
				:key="item?.id"
				:style="{
					backgroundImage: `linear-gradient(to bottom, rgba(12, 10, 9, 0) 40%, rgba(12, 10, 9, 1) 100%), url(${item ? getImageUrl(item.backdrop_path, 'w1280') : ''})`,
				}"
				class="flex flex-col justify-end pt-40 pb-24 lg:py-20 bg-center bg-cover aspect-video lg:max-h-[780px]"
			>
				<div class="container">
					<div class="max-w-lg select-none">
						<Badge> Movie </Badge>
						<h2 class="mt-6 text-4xl font-semibold lg:text-5xl">
							{{ item?.title }}
						</h2>
						<ul
							class="mt-2 flex flex-wrap items-center text-muted-foreground gap-1.5 list-disc font-medium list-inside"
						>
							<li class="list-none">
								{{ moment(item.release_date).format("YYYY") }}
							</li>
							<li v-for="genre in item.genre_ids" :key="genre">
								{{ renderGenre(genre, "movie") }}
							</li>
						</ul>
						<p class="mt-4">
							{{ item.overview }}
						</p>

						<div class="flex mt-6 gap-y-6 gap-x-4">
							<Button class="max-sm:text-xs">
								<i class="text-sm pi pi-play-circle sm:text-lg"></i>
								Watch Trailer
							</Button>

							<Button variant="secondary" class="max-sm:text-xs">
								<i class="text-sm pi pi-bookmark sm:text-lg"></i> Add
								Watchlist
							</Button>
						</div>
					</div>
				</div>
			</CarouselItem>
		</CarouselContent>

		<section
			class="container absolute z-10 left-1/2 -translate-x-1/2 flex flex-wrap items-center gap-1.5 bottom-10 sm:bottom-12 sm:justify-end lg:bottom-16"
		>
			<Button
				v-for="(_, index) in props.trendingVideos.length"
				:key="index"
				@click="onDotClick(index)"
				:class="
					cn('rounded-full bg-muted size-2.5 p-0 hover:bg-white/50', {
						'bg-white': index === selectedIndex,
					})
				"
			/>
		</section>
	</Carousel>
</template>
