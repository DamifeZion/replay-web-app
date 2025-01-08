<script setup lang="ts">
import HorizontalCarousel from "@/components/carousel/HorizontalCarousel.vue";
import { useHome } from "@/composables/use-home";
import { ENDPOINT } from "@/constants/endpoint-const";
import Featured from "@/sections/home/Featured.vue";
import Spotlight from "@/sections/home/Spotlight.vue";

const {
	trendingState,
	newReleaseState,
	popularThisWeekState,
	featuredState,
	upcomingState,
	tvSeriesState,
} = useHome();
</script>

<template>
	<main>
		<Spotlight
			:is-loading="trendingState.isLoading"
			:trending-videos="trendingState.data?.results || []"
		/>

		<HorizontalCarousel
			show-more
			:show-more-endpoint="ENDPOINT.GET_LATEST_MOVIES"
			head-title="New Release"
			card-presentation="PortraitMovieCard"
			:data="newReleaseState.data"
			:is-loading="newReleaseState.isLoading"
		/>

		<HorizontalCarousel
			class="pt-0"
			carousel-item-class="pl-6"
			show-more
			:show-more-endpoint="ENDPOINT.GET_POPULAR_MOVIES_THIS_WEEK"
			head-title="Popular This Week"
			card-presentation="LeaderboardMovieCard"
			:data="popularThisWeekState.data"
			:is-loading="popularThisWeekState.isLoading"
		/>

		<Featured
			:is-loading="featuredState.isLoading"
			:movies="featuredState.data?.results"
		/>

		<HorizontalCarousel
			show-more
			:show-more-endpoint="ENDPOINT.GET_UPCOMING_MOVIES"
			head-title="Upcoming Movies"
			card-presentation="LandscapeMovieCard"
			:data="upcomingState.data"
			:is-loading="upcomingState.isLoading"
		/>

		<HorizontalCarousel
			video-type="tv"
			show-more
			class="py-0"
			:show-more-endpoint="ENDPOINT.GET_TV_SERIES"
			head-title="TV Series"
			card-presentation="LandscapeMovieCard"
			:data="tvSeriesState.data"
			:is-loading="tvSeriesState.isLoading"
		/>
	</main>
</template>
