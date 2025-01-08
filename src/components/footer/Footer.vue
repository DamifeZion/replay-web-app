<script lang="ts" setup>
import { RouterLink, useRoute } from "vue-router";
import { navConst } from "@/constants/nav-const";
import { computed } from "vue";

const menus = navConst.menu.filter((item) => !item.isBtn);
const route = useRoute();
const isAuthRoute = computed(() => route.path.toLowerCase().includes("auth"));
</script>

<template>
	<footer
		v-if="!isAuthRoute"
		class="pt-20 pb-16 mt-20 space-y-10 border-t sm:space-y-16"
	>
		<section class="container grid gap-y-8 gap-x-10 md:grid-cols-2">
			<h1
				class="text-4xl leading-[1.1] select-none font-semibold text-balance md:max-w-lg lg:text-5xl"
			>
				Our platform is trusted by millions & features best updated movies
				all around the world
			</h1>

			<div
				class="flex flex-col gap-6 [&>ul]:flex [&>ul]:max-lg:flex-wrap [&>ul]:lg:justify-end [&>ul]:gap-2"
			>
				<ul>
					<li
						v-for="(menu, index) in menus"
						class="flex gap-2 font-medium whitespace-nowrap lg:text-lg hover:text-primary"
					>
						<RouterLink :to="menu.route">
							{{ menu.label }}
						</RouterLink>

						<span v-if="index !== menus.length - 1"> / </span>
					</li>
				</ul>

				<ul class="mt-auto !gap-x-6 [&>li_i]:text-xl">
					<li>
						<a href="#">
							<i class="pi pi-instagram"></i>
						</a>
					</li>

					<li>
						<a href="#">
							<i class="pi pi-facebook"></i>
						</a>
					</li>

					<li>
						<a href="#">
							<i class="pi pi-twitter"></i>
						</a>
					</li>

					<li>
						<a href="#">
							<i class="pi pi-google"></i>
						</a>
					</li>
				</ul>
			</div>
		</section>

		<section
			class="container flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground [&>ul]:flex [&>ul]:flex-wrap [&>ul]:gap-x-2 [&>ul>li:hover]:text-primary"
		>
			<ul>
				<li>
					<RouterLink to="#"> Privacy Policy </RouterLink>
				</li>

				<li>
					<RouterLink to="#"> Term of Service </RouterLink>
				</li>

				<li>
					<RouterLink to="#"> Language </RouterLink>
				</li>
			</ul>

			<p>&copy; {{ new Date().getFullYear() }}</p>
		</section>
	</footer>
</template>
