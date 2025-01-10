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
	videoType?: GenreTypeT;
};

export type MovieCardProps = {
	index: number;
	movie: MovieT;
	videoType: GenreTypeT;
	class?: string;
	isLoading?: boolean;
};

export type GenreTypeT = "movie" | "tv";

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
}

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
