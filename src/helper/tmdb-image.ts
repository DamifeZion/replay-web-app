type DimensionT = "w1280" | "w780" | "w500" | "w300";
export const getImageUrl = (path: string, dimension?: DimensionT) => {
	const defaultDimension: DimensionT = dimension || "w780";
	return path
		? `https://image.tmdb.org/t/p/${defaultDimension}${path}`
		: "https://placehold.co/600x400";
};
