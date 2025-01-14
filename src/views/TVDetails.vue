<script lang="ts" setup>
import HorizontalCarousel from "@/components/carousel/HorizontalCarousel.vue";
import CastCard from "@/components/CastCard.vue";
import Error from "@/components/Error.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import WatchVideo from "@/components/WatchVideo.vue";
import { useTvDetails } from "@/composables/use-tv-details";
import { ENDPOINT } from "@/constants/endpoint-const";
import { getImageUrl } from "@/helper/tmdb-image";
import { cn } from "@/lib/utils";
import { useFavouriteStore } from "@/stores/favourite.store.ts";
import type { MovieT, ReviewT } from "@/types/types";
import { Download, Share2 } from "lucide-vue-next";
import moment from "moment";
import { computed } from "vue";

const {
	// API Data
	detailsState,
	recommendedState,
	reviewsState,

	//Others
	movieId,
	isDesktop,
	reviewContentLength,
	toggleShowMore,
	maxShownReviews,
	toggleMaxShownReviews,
	handleRetry,
	handlePlayNow,
} = useTvDetails();

const favouriteStore = useFavouriteStore();

const tv = computed(() => detailsState.data?.tv);
const credit = computed(() => detailsState.data?.credit);

// Add/remove from favorites
const toggleFavourite = () => {
	favouriteStore.setFavourite({
		...tv.value,
		genre_ids: tv.value?.genres.map((item) => item.id) as Array<number>,
		original_title: String(tv.value?.origin_name),
		release_date: String(tv.value?.first_air_date),
		title: String(tv.value?.name),
		video: false,
		type: "tv",
	} as MovieT);
};
</script>

<template>
	<!-- DEtails Error -->
	<Error
		v-if="detailsState.error"
		:error="String(detailsState.error)"
		@retry="handleRetry"
		class="pt-64 pb-28"
	/>

	<main v-else>
		<Skeleton
			v-if="detailsState.isLoading"
			class="w-full h-full aspect-video pt-40 pb-10 min-[460px]:pb-24 lg:py-20 lg:max-h-[720px]"
		/>

		<section
			v-else
			class="relative aspect-video flex items-end w-full pt-40 pb-10 min-[460px]:pb-24 lg:py-20 lg:max-h-[720px]"
		>
			<!-- Hero Background Image -->
			<div
				:style="{
					backgroundImage: `linear-gradient(to bottom, rgba(12, 10, 9, 0) 40%, rgba(12, 10, 9, 1) 100%), url(${tv ? getImageUrl(tv.backdrop_path || tv?.poster_path, 'w1280') : ''})`,
				}"
				class="absolute inset-0 bg-center bg-cover size-full z-[-1]"
			/>

			<!-- Hero Content Overlay -->
			<div class="container select-none">
				<Badge> TV Show </Badge>

				<h2 class="max-w-lg mt-6 text-4xl font-semibold lg:text-5xl">
					{{ tv?.name || tv?.origin_name }}
				</h2>

				<ul
					class="max-w-lg mt-2 flex flex-wrap items-center text-muted-foreground gap-1.5 list-disc font-medium list-inside"
				>
					<li class="list-none">
						{{ moment(tv?.first_air_date).format("YYYY") }}
					</li>

					<li v-for="genre in tv?.genres" :key="genre.id">
						{{ genre.name }}
					</li>
				</ul>

				<div
					class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4"
				>
					<div class="flex mt-6 gap-y-6 gap-x-4">
						<Button class="max-sm:text-xs" @click="handlePlayNow">
							<i class="text-sm pi pi-play-circle sm:text-lg"></i>
							Watch Trailer
						</Button>

						<Button
							variant="secondary"
							class="max-sm:text-xs"
							@click="toggleFavourite"
						>
							<i
								:class="`text-sm pi sm:text-lg ${favouriteStore.isFavourite(Number(tv?.id)) ? 'pi-bookmark-fill' : 'pi-bookmark'}`"
							></i>

							{{
								favouriteStore.isFavourite(Number(tv?.id))
									? "Remove from Watchlist"
									: "Add to Watchlist"
							}}
						</Button>
					</div>

					<div class="flex items-center gap-2">
						<!-- <Button size="sm" variant="outline">
							<Download /> Download
						</Button> -->

						<Button size="sm" variant="outline">
							<Share2 /> Share
						</Button>
					</div>
				</div>
			</div>
		</section>

		<!-- Content  -->
		<section
			class="container grid gap-10 [&_h5]:text-xl [&_h5]:font-semibold [&_h5]:leading-[2.5] [&_p]:text-muted-foreground"
		>
			<!-- Overview -->
			<div v-if="!detailsState.isLoading && tv?.overview">
				<h5>Story Line</h5>
				<p>
					{{ tv?.overview }}
				</p>
			</div>

			<!-- Cast -->
			<div v-if="credit?.cast.length">
				<h5>Series Cast</h5>

				<Carousel v-slot="{ canScrollNext, canScrollPrev }" class="grid">
					<CarouselContent>
						<CarouselItem
							v-for="cast in credit?.cast"
							class="pl-10 basis-auto first:pl-4"
						>
							<CastCard :cast="cast" />
						</CarouselItem>
					</CarouselContent>

					<CarouselPrevious v-if="isDesktop && canScrollPrev" />
					<CarouselNext v-if="isDesktop && canScrollNext" />
				</Carousel>
			</div>
		</section>

		<!-- Seassons  -->
		<section v-if="tv?.seasons.length" class="pt-8 mt-10 mb-16 border-t">
			<div class="container">
				<div class="flex flex-wrap items-center gap-4">
					<h5 class="text-xl font-semibold">
						Seasons ({{ tv?.seasons.length }})
					</h5>

					<Badge>
						{{ tv.status }}
					</Badge>
				</div>

				<!-- Loading Seasons -->
				<ul
					v-if="detailsState.isLoading"
					class="grid min-[499px]:grid-cols-2 pt-4 gap-6"
				>
					<Skeleton
						v-for="index in 2"
						:key="index"
						class="rounded-[inherit] h-[220px] lg:h-[300px] rounded-md"
					/>
				</ul>

				<ul v-else class="grid gap-6 mt-6 list-inside lg:grid-cols-2">
					<li v-for="item in tv?.seasons" :key="item.id">
						<Card class="flex h-full max-[499px]:flex-wrap">
							<img
								:src="getImageUrl(item.poster_path)"
								class="flex-grow aspect-video min-[500px]:aspect-[11/16] min-[500px]:max-w-[150px] object-cover object-center rounded-[inherit]"
							/>

							<CardHeader class="gap-3">
								<CardTitle>
									{{ item.name }}
								</CardTitle>

								<ul
									class="flex items-center gap-2 text-muted-foreground list-inside [&:nth-child(2)]:list-disc"
								>
									<li class="inline-flex items-center gap-1">
										<i class="pi pi-star-fill text-gold"></i>
										{{ item?.vote_average.toFixed(1) }}
									</li>

									<li>
										{{ moment(item.air_date).format("YYYY") }}
									</li>

									<li>{{ item.episode_count }} Episodes</li>
								</ul>

								<CardDescription v-if="item.overview">
									{{ item.overview }}
								</CardDescription>

								<p class="text-sm text-muted-foreground">
									({{ item.season_number }}x{{ item.episode_count }}
									{{ moment(item.air_date).format("MMMM, DD, YYYY") }})
								</p>
							</CardHeader>
						</Card>
					</li>
				</ul>
			</div>
		</section>

		<!-- Reviews Error -->
		<Error
			v-if="reviewsState.error"
			:error="String(reviewsState.error)"
			@retry="handleRetry"
		/>

		<!-- Reviews -->
		<section
			v-if="
				!reviewsState.error &&
				!reviewsState.isLoading &&
				reviewsState.data.results &&
				reviewsState.data.results.length > 0
			"
			class="pt-8 mt-10 border-t"
		>
			<div class="container">
				<h5 class="text-xl font-semibold">⭐Reviews</h5>

				<div class="grid gap-12 mt-8">
					<div
						v-for="(item, index) in reviewsState.data?.results.slice(
							0,
							maxShownReviews,
						) as Array<ReviewT>"
						class="flex flex-col gap-4 select-none"
					>
						<ul class="flex items-center gap-2 list-inside">
							<li>
								<Avatar>
									<AvatarImage
										:src="
											getImageUrl(item.author_details.avatar_path)
										"
									/>
									<AvatarFallback class="font-semibold uppercase">
										{{ item.author.slice(0, 2) }}
									</AvatarFallback>
								</Avatar>
							</li>

							<li>
								{{ item.author }}
							</li>

							<li class="text-xs list-disc text-muted-foreground">
								{{ moment(item.created_at).fromNow() }}
							</li>
						</ul>

						<p class="text-sm">
							{{
								item.showFullContent
									? item.content
									: item.content.slice(0, reviewContentLength) +
										(item.content.length > reviewContentLength
											? "..."
											: "")
							}}

							<Button
								v-if="item.content.length >= reviewContentLength"
								variant="link"
								size="sm"
								@click="toggleShowMore(index)"
								:class="
									cn('px-0', {
										'pr-0 pl-2': item.showFullContent,
									})
								"
							>
								{{ item.showFullContent ? "See less" : "See more" }}
							</Button>
						</p>
					</div>

					<Button
						variant="outline"
						v-if="reviewsState.data.results.length > maxShownReviews"
						@click="toggleMaxShownReviews"
						class="justify-self-center w-fit"
					>
						{{ maxShownReviews === 3 ? `Show More` : "Show Less" }}
					</Button>
				</div>
			</div>
		</section>

		<!-- Recommended Error -->
		<Error
			v-if="recommendedState.error"
			:error="String(recommendedState.error)"
			@retry="handleRetry"
		/>

		<!-- Recommended -->
		<div
			v-if="
				!recommendedState.error &&
				!recommendedState.isLoading &&
				recommendedState.data.results &&
				recommendedState.data?.results.length
			"
			class="mt-12 border-t"
		>
			<HorizontalCarousel
				show-more
				class="pt-12 pb-0"
				:show-more-endpoint="
					ENDPOINT.GET_RECOMMENDED_MOVIE.replace(
						':movie_id',
						String(movieId),
					)
				"
				head-title="Similar TV Shows For You"
				card-presentation="LandscapeMovieCard"
				:data="recommendedState.data"
				:is-loading="recommendedState.isLoading"
				video-type="tv"
			/>
		</div>
	</main>

	<!-- Watch Video Dialog -->
	<WatchVideo v-if="!detailsState.isLoading || detailsState.error" />
</template>
