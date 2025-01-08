import { useRoute } from "vue-router";

export const useIsRouteActive = () => {
	const route = useRoute();

	// Return a function directly
	const isRouteActive = (path: string, matchSubroute = false): boolean => {
		if (matchSubroute) {
			return route.path.startsWith(path);
		}
		return route.path === path;
	};

	return isRouteActive;
};
