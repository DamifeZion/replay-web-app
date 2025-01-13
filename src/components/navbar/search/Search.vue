<script lang="ts" setup>
import Button from "@/components//ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import { useSearch } from "@/composables/use-search-bar";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@vueuse/core";
import { computed } from "vue";

const isMobile = useMediaQuery("(max-width: 1023px)");
const { handleSearchClick, searchStore, handleInputBlur } = useSearch();

const searchValue = computed(() => searchStore.searchValue);
</script>

<template>
	<span class="flex items-center lg:gap-1">
		<form
			@submit.prevent="handleSearchClick"
			v-if="searchStore.showSearch || searchStore.searchValue !== ''"
			class="w-full max-lg:container max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2 top-16"
		>
			<Input
				:class="
					cn('h-9', {
						'pr-10': isMobile,
					})
				"
				name="q"
				placeholder="Search..."
				@blur="handleInputBlur"
				v-model="searchStore.searchValue"
			/>
		</form>

		<li>
			<Button
				variant="ghost"
				size="icon"
				@click="handleSearchClick"
				:class="
					cn('', {
						'absolute top-16 ml-2':
							isMobile &&
							(searchStore.searchValue || searchStore.showSearch),
					})
				"
			>
				<i class="text-lg pi pi-search"></i>
			</Button>
		</li>
	</span>
</template>
