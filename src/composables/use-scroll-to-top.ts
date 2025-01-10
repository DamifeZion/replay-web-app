import { onUpdated, nextTick } from "vue";

export const useScrollToTop = () => {
	onUpdated(async () => {
		await nextTick();
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});
};
