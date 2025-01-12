import type { GenericObject } from "vee-validate";
import type { URLQueryConst } from "../constants/url-query-const";

export interface UserStoreState {
	user: {
		profile: string;
		firstname: string;
		lastname: string;
		fullname: string;
		email: string;
		age: number;
		// date_of_birth: Date;
		email_active: boolean;
		phone_active: boolean;
		accesss_token: string;
		refresh_token: string;
		//Optional Fields
		phone_number?: string;
	};
}

export interface NavConstI {
	menu: Array<{
		label: string;
		route: string;
		isBtn?: boolean;
	}>;
}

export interface NavMenuListProps {
	class?: string;
	toggleMobileMenu?: () => void;
}

export type FormValuesT = GenericObject;

export type AxiosFetchState = {
	data: VideoDataResponse | any;
	isLoading: boolean;
	error: unknown;
};

export type MovieT = {
	id: number;
	genre_ids: Array<number>;
	title: string;
	video: boolean;
	overview: string;
	poster_path: string;
	backdrop_path: string;
	original_title: string;
	popularity: number;
	release_date: string;
	vote_average: number;
	vote_count: number;
};

export type GenreT = {
	id: number;
	name: string;
};

export type SpotlightProps = {
	isLoading: boolean;
	trendingVideos: Partial<Array<MovieT>>;
};

type VideoDataResponse = {
	page: number;
	results: Partial<Array<MovieT>>;
	total_pages: number;
	total_results: number;
};

export type NewReleaseProps = {
	isLoading: boolean;
	error: any;
	data: VideoDataResponse;
};

export type MovieCarousel = {
	headTitle: string;
	showMore?: boolean;
	showMoreEndpoint?: string;
	isLoading: boolean;
	cardPresentation:
		| "PortraitMovieCard"
		| "LeaderboardMovieCard"
		| "LandscapeMovieCard";
	data: VideoDataResponse;
	class?: string;
	carouselItemClass?: string;
	videoType?: VideoTypeT;
};

export type MovieCardProps = {
	index: number;
	movie: MovieT;
	videoType: VideoTypeT;
	class?: string;
	isLoading?: boolean;
};

export type VideoTypeT = "movie" | "tv";

export type URLQueryT = keyof typeof URLQueryConst;

export type FeaturedProps = {
	isLoading: boolean;
	movies: Array<MovieT>;
};

export type CastT = {
	id: number;
	cast_id: number;
	adult: boolean;
	character: string;
	credit_id: string;
	gender: "Male" | "Female";
	name: string;
	original_name: string;
	popularity: Number;
	profile_path: string;
	order: number;
};

export type CreditT = {
	id: number;
	cast: Array<CastT>;
	crew: [];
};

export type ReviewT = {
	author: string;
	author_details: {
		name: string;
		username: string;
		avatar_path: string;
		rating: number;
	};
	content: string;
	created_at: string;
	id: string;
	updated_at: string;
	url: string;
	showFullContent: boolean;
};

export type MovieDetailsFetchState = Omit<AxiosFetchState, "data"> & {
	data?: {
		movie: Omit<MovieT, "genre_ids"> & {
			genres: Array<{
				id: number;
				name: string;
			}>;
		};
		credit: CreditT;
	};
};

export type TvDetailsFetchState = Omit<AxiosFetchState, "data"> & {
	data?: {
		tv: TvShowDetailsT;
		credit: CreditT;
	};
};

export type TvCreatedByT = {
	id: number;
	credit_id: string;
	name: string;
	gender: "Male" | "Female";
	profile_path: string;
};
export type TvNetworkT = {
	id: number;
	logo_path: string;
	name: string;
	origin_country: string;
};
export type TvProductionCompanyT = {
	id: number;
	logo_path: string;
	name: string;
	origin_country: string;
};
export type TvProductionCountriesT = {
	iso_3166_1: string;
	name: string;
};
export type TvSeasonsT = {
	air_date: string;
	episode_count: number;
	id: number;
	name: string;
	overview: string;
	poster_path: string;
	season_number: number;
	vote_average: number;
};
export type SpokenLanguagesT = {
	english_name: string;
	iso_639_1: string;
	name: string;
};
export type TvShowDetailsT = {
	adult: boolean;
	backdrop_path: string;
	created_by: Array<TvCreatedByT>;
	episode_run_time: Array<number>;
	first_air_date: string;
	genres: Array<GenreT>;
	homepage: string;
	id: number;
	in_production: boolean;
	languages: Array<string>;
	last_air_date: string;
	last_episode_to_air: {
		id: number;
		name: string;
		overview: string;
		vote_average: number;
		vote_count: number;
		air_date: string;
		episode_number: number;
		production_code: string;
		runtime: number;
		season_number: number;
		show_id: number;
		still_path: string;
	};
	name: string;
	next_episode_to_air: {
		id: number;
		name: string;
		overview: string;
		vote_average: number;
		vote_count: number;
		air_date: string;
		episode_number: number;
		production_code: string;
		runtime: number;
		season_number: number;
		show_id: number;
		still_path: string;
	};
	networks: Array<TvNetworkT>;
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: Array<string>;
	origin_language: string;
	origin_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: Array<TvProductionCompanyT>;
	production_countries: Array<TvProductionCountriesT>;
	seasons: Array<TvSeasonsT>;
	spoken_languages: Array<SpokenLanguagesT>;
	status: string;
	tagline: string;
	type: string;
	vote_average: number;
	vote_count: number;
};

export type ErrorProps = {
	error: string;
	onRetry?: () => void;
};

export type PlayVideoStore = {
	id: number;
	title: string;
	videoType: VideoTypeT;
	shouldPlay: boolean;
};

export type VideoT = {
	id: string;
	iso_639_1: string;
	iso_3166_1: string;
	name: string;
	key: string;
	site: string;
	size: number;
	type: "trailer" | "behind the scenes";
	offiial: boolean;
	published_at: string;
};

export type FavouriteStoreT = {
	favVideos: Array<MovieT> | []
}