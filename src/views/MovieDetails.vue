<script lang="ts" setup>
import HorizontalCarousel from "@/components/carousel/HorizontalCarousel.vue";
import CastCard from "@/components/CastCard.vue";
import Error from "@/components/Error.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieDetails } from "@/composables/use-movie-details";
import { ENDPOINT } from "@/constants/endpoint-const";
import { getImageUrl } from "@/helper/tmdb-image";
import { cn } from "@/lib/utils";
import type { ReviewT } from "@/types/types";
import { Download, Share2 } from "lucide-vue-next";
import moment from "moment";
import { computed } from "vue";

const {
	// API Data
	detailsState,
	recommendedState,
	reviewsState,
	getMovieDetails,
	getRecommendedVideos,
	getReviews,

	//Others
	movieId,
	isDesktop,
	reviewContentLength,
	toggleShowMore,
	maxShownReviews,
	toggleMaxShownReviews,
} = useMovieDetails();

const video = computed(() => detailsState.data?.movie);
const credit = computed(() => detailsState.data?.credit);

const handleRetry = () => {
	getMovieDetails();
	getRecommendedVideos();
	getReviews();
};
</script>

<template>
	<!-- DEtails Error -->
	<Error
		v-if="detailsState.error"
		error="You cant make this action"
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
					backgroundImage: `linear-gradient(to bottom, rgba(12, 10, 9, 0) 40%, rgba(12, 10, 9, 1) 100%), url(${video ? getImageUrl(video.backdrop_path || video?.poster_path, 'w1280') : ''})`,
				}"
				class="absolute inset-0 bg-center bg-cover size-full z-[-1]"
			/>

			<!-- Hero Content Overlay -->
			<div class="container select-none">
				<Badge> Movie </Badge>

				<h2 class="max-w-lg mt-6 text-4xl font-semibold lg:text-5xl">
					{{ video?.title }}
				</h2>

				<ul
					class="max-w-lg mt-2 flex flex-wrap items-center text-muted-foreground gap-1.5 list-disc font-medium list-inside"
				>
					<li class="list-none">
						{{ moment(video?.release_date).format("YYYY") }}
					</li>
					<li v-for="genre in video?.genres" :key="genre.id">
						{{ genre.name }}
					</li>
				</ul>

				<div
					class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4"
				>
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

					<div class="flex items-center gap-2">
						<Button size="sm" variant="outline">
							<Download /> Download
						</Button>

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
			<div>
				<h5>Story Line</h5>
				<p>
					{{ video?.overview }}
				</p>
			</div>

			<!-- Cast -->
			<div>
				<h5>Movie Cast</h5>

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
				<div class="flex items-center justify-between gap-4">
					<h5 class="text-xl font-semibold">⭐Reviews</h5>
				</div>

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
								v-if="item.content.length > reviewContentLength"
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
			class="mt-12 border-t"
			v-if="
				!recommendedState.error &&
				!recommendedState.isLoading &&
				recommendedState.data.results &&
				recommendedState.data?.results.length
			"
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
				head-title="Similar Movies For You"
				card-presentation="LandscapeMovieCard"
				:data="recommendedState.data"
				:is-loading="recommendedState.isLoading"
			/>
		</div>
	</main>
</template>
