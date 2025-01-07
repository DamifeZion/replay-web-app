import { URLQueryConst } from "@/constants/url-query-const";
import type { URLQueryT } from "@/types/types";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useURLQuery = () => {
	const router = useRouter();
	const route = useRoute();

	const getQuery = (key: URLQueryT) => {
		return computed(() => {
			const value = route.query[URLQueryConst[key]];
			return Array.isArray(value) ? value[0] : value || "";
		});
	};

	const appendQuery = (params: Record<string, string | number | null>) => {
		// Merge the existing query with the new params
		const updatedQuery = { ...route.query, ...params };

		// Remove any null or undefined values from the query
		Object.keys(updatedQuery).forEach((key) => {
			if (updatedQuery[key] === null || updatedQuery[key] === undefined) {
				delete updatedQuery[key];
			}
		});

		// Push the updated query to the URL
		router.push({ query: updatedQuery });
	};

	const deleteQuery = (key: string) => {
		const updatedQuery = { ...route.query };

		// Delete the key from the new query object
		delete updatedQuery[key];

		// Push the updated query to url
		router.push({ query: updatedQuery });
	};

	const deleteAllQuery = () => {
		router.push({ query: {} });
	};

	return { getQuery, appendQuery, deleteQuery, deleteAllQuery };
};
