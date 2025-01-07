import { computed } from "vue";
import { useRoute } from "vue-router";

export const useIsRouteActive = () => {
	const route = useRoute();

	const isRouteActive = computed(
		() =>
			(path: string, matchSubroute = false) => {
				if (matchSubroute) {
					return route.path.startsWith(path);
				}
				return route.path === path;
			},
	);

	return isRouteActive;
};
