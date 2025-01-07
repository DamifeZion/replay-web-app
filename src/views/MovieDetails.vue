<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
	<section>Movie Details {{ route.params.id }}</section>
</template>
