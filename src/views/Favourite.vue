<script lang="ts" setup>
import PortraitMovieCard from "@/components/movie-card/PortraitMovieCard.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getImageUrl } from "@/helper/tmdb-image";
import { useFavouriteStore } from "@/stores/favourite.store.ts";
import type { MovieT, VideoTypeT } from "@/types/types";

const favouriteStore = useFavouriteStore();
</script>

<template>
	<main class="container pt-10 mt-16">
		<!-- Empty State -->
		<section v-if="favouriteStore.favVideos.length === 0">
			No favourite lorem100
		</section>

		<!-- Favourite -->
		<section v-else>
			<h5 class="text-2xl font-semibold">
				Your Favourites ({{ favouriteStore.favVideos.length }})
			</h5>

			<ul
				class="grid grid-cols-2 mt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-4"
			>
				<li
					v-for="(item, index) in favouriteStore.favVideos"
					class="relative"
				>
					<PortraitMovieCard
						:movie="item as MovieT"
						:index="index"
						:key="item?.id"
						:video-type="item?.type as VideoTypeT"
					/>

					<Button
						size="icon"
						variant="ghost"
						@click="favouriteStore.setFavourite(item)"
						class="absolute top-0 right-0 p-1.5 px-2 rounded-sm size-fit"
					>
						<i
							:class="`pi text-sm backdrop-blur-md text-primary sm:text-lg ${favouriteStore.isFavourite(Number(item?.id)) ? 'pi-bookmark-fill' : 'pi-bookmark'}`"
						></i>
					</Button>
				</li>
			</ul>
		</section>
	</main>
</template>
