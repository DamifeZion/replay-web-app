<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/navbar/Navbar.vue";
import { TooltipProvider } from "./components/ui/tooltip";
import Footer from "./components/footer/Footer.vue";
</script>

<template>
	<TooltipProvider :delay-duration="100">
		<Navbar />
		<RouterView />
		<Footer />
	</TooltipProvider>
</template>
