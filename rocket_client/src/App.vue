<template>
  <v-app>
    <searchLeads />
    <leadsTable />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import leadsTable from "@/components/leadsTable.vue";
import searchLeads from "@/components/searchLeads.vue";

export default defineComponent({
  name: "App",

  components: { leadsTable, searchLeads },
});
</script>
