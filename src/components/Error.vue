<script lang="ts" setup>
import type { ErrorProps } from "@/types/types";
import { Button } from "./ui/button";

const props = defineProps<ErrorProps>();
const errorMsg = props.error
	? props.error.includes("AxiosError:")
		? props.error.split("AxiosError:")[1]?.trim() ||
			"An unknown error occurred."
		: props.error
	: "An unknown error occurred.";

const handleRetry = () => {
	if (props.onRetry) {
		props.onRetry();
	} else {
		window.location.reload();
	}
};
</script>

<template>
	<section class="py-20 text-lg text-center text-destructive">
		<p><b>Error:</b> {{ errorMsg }}</p>
		<Button variant="secondary" class="mt-4" @click="handleRetry">
			Click to try again
		</Button>
	</section>
</template>
