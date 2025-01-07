type DimensionT = "w1280" | "w780" | "w500" | "w300";
export const getImageUrl = (path: string, dimension?: DimensionT) => {
	const defaultDimension: DimensionT = dimension || "w780";
	return `https://image.tmdb.org/t/p/${defaultDimension}${path}`;
};
