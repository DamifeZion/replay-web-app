<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import { useMediaQuery } from "@vueuse/core";
import NavMenuList from "./NavMenuList.vue";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
	SheetDescription,
	SheetTitle,
} from "../ui/sheet";
import Button from "../ui/button/Button.vue";
import ScrollArea from "../ui/scroll-area/ScrollArea.vue";
import { computed, ref } from "vue";
import Search from "./search/Search.vue";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/search.store";
import { useRoute } from "vue-router";

const searchStore = useSearchStore();
const isMobile = useMediaQuery("(max-width: 1023px)");

// Mobile Sidebar Drawer/Sheet
const openMobileMenu = ref(false);
const toggleMobileMenu = () => {
	openMobileMenu.value = !openMobileMenu.value;
};
console.log(openMobileMenu.value);

// Hide the navbar in auth route.
const route = useRoute();
const isAuthRoute = computed(() => route.path.toLowerCase().includes("auth"));
</script>

<template>
	<nav
		v-if="!isAuthRoute"
		class="fixed top-0 z-20 w-full bg-secondary/30 backdrop-blur-sm"
	>
		<section
			:class="
				cn('container relative flex items-center h-16', {
					'h-28 items-start py-4':
						isMobile &&
						(searchStore.showSearch || searchStore.searchValue),
				})
			"
		>
			<Logo />
			<NavMenuList v-if="!isMobile" />
			<section v-else class="flex items-center gap-2 ml-auto">
				<Search v-if="isMobile" />
				<Sheet :open="openMobileMenu" @update:open="toggleMobileMenu">
					<SheetTrigger as-child>
						<Button variant="outline" size="icon">
							<i class="text-lg pi pi-bars"></i>
						</Button>
					</SheetTrigger>

					<SheetContent
						side="left"
						class="grid grid-rows-[auto_1fr] px-3 *:px-3"
					>
						<SheetHeader>
							<SheetTitle class="text-start">
								<Logo />
							</SheetTitle>
							<SheetDescription class="sr-only">
								Welcome to our mobile navigation! Here you can easily
								explore our features and services. Select an option from
								the menu to get started or learn more about what we
								offer. Your journey begins here!
							</SheetDescription>
						</SheetHeader>

						<ScrollArea>
							<NavMenuList :toggle-mobile-menu="toggleMobileMenu" />
						</ScrollArea>
					</SheetContent>
				</Sheet>
			</section>
		</section>
	</nav>
</template>
