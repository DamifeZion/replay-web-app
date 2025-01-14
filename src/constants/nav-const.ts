import type { NavConstI } from "@/types/types";
import { routeConst } from "./route-const";

export const navConst: NavConstI = {
	menu: [
		{
			label: "Home",
			route: routeConst.home,
			isBtn: false,
		},
		{
			label: "Discover",
			route: routeConst.discover,
			isBtn: false,
		},
		{
			label: "Movie Release",
			route: routeConst.movieRelease,
			isBtn: false,
		},
		{
			label: "Favourites",
			route: routeConst.favourite,
			isBtn: false,
		},
		{
			label: "Sign up",
			route: routeConst.signup,
			isBtn: true,
		},
		{
			label: "Login",
			route: routeConst.login,
			isBtn: true,
		},
	],
};
