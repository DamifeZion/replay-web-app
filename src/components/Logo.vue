<script setup lang="ts">
import { RouterLink } from "vue-router";
import Button from "./ui/button/Button.vue";
import { routeConst } from "@/constants/route-const";
</script>

<template>
	<Button
		:as-child="true"
		variant="ghost"
		class="px-0 text-3xl font-logo hover:bg-transparent"
	>
		<RouterLink :to="routeConst.home">Replay</RouterLink>
	</Button>
</template>
