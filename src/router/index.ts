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
			path: routeConst.tvDetails,
			name: "tv details",
			component: () => import("../views/TVDetails.vue"),
		},
		{
			path: routeConst.favourite,
			name: "favourites",
			component: () => import("../views/Favourite.vue"),
		},
		{
			path: routeConst.seeMoreVideos,
			name: routeConst.seeMoreVideos,
			component: () => import("../views/SeeMoreVideos.vue"),
		},
		{
			path: routeConst.search,
			name: "search",
			component: () => import("../views/Search.vue"),
		},
	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { top: 0, behavior: "smooth" };
		}
	},
});

export default router;
