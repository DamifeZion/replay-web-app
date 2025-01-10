import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { routeConst } from "@/constants/route-const";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			redirect: routeConst.home,
		},
		{
			path: routeConst.home,
			name: "home",
			component: HomeView,
		},
		{
			path: routeConst.movieDetails,
			name: "movie details",
			component: () => import("../views/MovieDetails.vue"),
		},
		{
			path: routeConst.seeMoreMovies,
			name: "more movies",
			component: () => import("../views/SeemoreMovies.vue"),
		},
	],
});

export default router;
