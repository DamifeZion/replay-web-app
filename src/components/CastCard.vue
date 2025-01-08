<script lang="ts" setup>
import type { CastT } from "@/types/types";
import { Card, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getImageUrl } from "@/helper/tmdb-image";

const props = defineProps<{ cast: CastT }>();
const cast = props.cast;
</script>

<template>
	<Card class="bg-transparent border-none select-none w-fit">
		<CardHeader
			class="px-0 py-2 grid grid-cols-[auto_1fr] items-center gap-3"
		>
			<Avatar class="text-2xl rounded-full aspect-square size-12 sm:size-16">
				<AvatarImage :src="getImageUrl(cast.profile_path)" />
				<AvatarFallback class="capitalize">
					{{ cast.original_name.slice(0, 2) }}
				</AvatarFallback>
			</Avatar>

			<span>
				<h4 class="text-lg font-semibold">
					{{ cast.original_name }}
				</h4>
				<p>
					{{ cast.character }}
				</p>
			</span>
		</CardHeader>
	</Card>
</template>
