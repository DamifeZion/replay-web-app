<script setup lang="ts">
import { navConst } from "@/constants/nav-const";
import { routeConst } from "@/constants/route-const";
import { cn } from "@/lib/utils";
import type { NavMenuListProps } from "@/types/types";
import Button from "../ui/button/Button.vue";
import { useMediaQuery } from "@vueuse/core";
import { useIsRouteActive } from "@/composables/shared/is-route-active";
import Search from "./search/Search.vue";
import { Badge } from "../ui/badge";
import { useFavouriteStore } from "@/stores/favourite.store.ts";

const props = defineProps<NavMenuListProps>();
const isMobile = useMediaQuery("(max-width: 1023px)");
const isRouteActive = useIsRouteActive();

const favouriteStore = useFavouriteStore();

// Separate the button from the text menu
const textMenu = navConst.menu.filter((item) => !item.isBtn);
const btnMenu = navConst.menu.filter((item) => item.isBtn);
</script>

<template>
	<div
		:class="
			cn(
				'flex-grow flex max-lg:flex-col justify-between lg:mx-auto lg:gap-4 lg:items-center *:lg:flex *:gap-2 *:lg:gap-4 [&>ul_li]:py-4 [&>ul_li]:lg:py-2',
				props.class,
			)
		"
	>
		<ul class="lg:mx-auto">
			<li
				v-for="item in textMenu"
				:key="item.route"
				@click="props.toggleMobileMenu"
				:class="
					cn('text-muted-foreground relative lg:mx-1', {
						'text-foreground': isRouteActive(item.route),
					})
				"
			>
				<RouterLink :to="item.route">
					{{ item.label }}
				</RouterLink>

				<Badge
					v-if="item.route === routeConst.favourite && favouriteStore.favVideos.length > 0"
					class="absolute items-center justify-center px-1.5 py-0 ml-1 text-[11px] h-4"
					variant="destructive"
				>
					{{
						favouriteStore.favVideos.length > 10
							? "10+"
							: favouriteStore.favVideos.length
					}}
				</Badge>
			</li>
		</ul>

		<ul class="lg:flex">
			<Search v-if="!isMobile" />

			<li v-for="item in btnMenu" :key="item.route" class="!gap-2">
				<Button
					:as-child="true"
					:variant="
						item.route === routeConst.signup ? 'outline' : 'default'
					"
					@click="props.toggleMobileMenu"
					class="max-lg:w-full"
				>
					<RouterLink :to="item.route">
						{{ item.label }}
					</RouterLink>
				</Button>
			</li>
		</ul>
	</div>
</template>
