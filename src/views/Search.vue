<script lang="ts" setup>
import Error from "@/components/Error.vue";
import Loading from "@/components/Loading.vue";
import { useSearch } from "@/composables/use-search";

const { searchResult, getSearchResult } = useSearch();
</script>

<template>
	<Loading 
      v-if="searchResult.isLoading" 
      class="pb-20 pt-[250px]"
   />

   <Error
		v-else-if="searchResult.error"
		:error="String(searchResult.error)"
		@retry="getSearchResult"
	/>

	<main v-else>
      
   </main>
</template>
