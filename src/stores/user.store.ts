import type { UserStoreState } from "@/types/types";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
	state: (): UserStoreState => ({
		user: {
			profile: "",
			firstname: "",
			lastname: "",
			fullname: "",
			email: "",
			age: 0,
			email_active: false,
			phone_active: false,
			accesss_token: "",
			refresh_token: "",
			phone_number: "",
		},
	}),
	actions: {
		/**
		 * Set the user state with a payload.
		 * @param payload - An object containing user properties.
		 */
		setUser(payload: Partial<UserStoreState["user"]>) {
			this.user = { ...this.user, ...payload };
		},
	},
	persist: true,
});
