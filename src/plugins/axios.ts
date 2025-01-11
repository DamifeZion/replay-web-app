import axiosLib from "axios";

const axiosInstance = (baseUrl?: string) => {
	const baseURL = baseUrl || import.meta.env.VITE_TMDB_BASE_URL;
	const axiosInstance = axiosLib.create({
		baseURL,
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${import.meta.env.VITE_TMDB_AUTHORIZATION}`,
		},
	});

	// Add a request interceptor
	axiosInstance.interceptors.request.use(
		(config) => {
			return config;
		},
		(error) => {
			console.error("Request error:", error);
			return Promise.reject(error);
		},
	);

	// Add a response intercaptor
	axiosInstance.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			const newError =
				error.response.data.status_message ||
				"An unknown error occured. Please try again.";
			// Handle errors globally
			console.error("Response error:", newError || error.response);
			return Promise.reject(newError);
		},
	);

	return axiosInstance;
};

const axios = axiosInstance();
export default axiosInstance;
export { axios };
