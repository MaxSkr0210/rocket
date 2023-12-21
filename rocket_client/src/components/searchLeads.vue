<template>
  <v-container class="d-flex align-center ga-5">
    <v-text-field
      v-model="lead"
      :loading="loading"
      append-inner-icon="mdi-magnify"
      :rules="[rules.required]"
      label="Найти"
      @click:append-inner="onClick"
      @keyup.enter="search"></v-text-field>
    <v-btn class="primary" @click="search" color="blue-accent-3">Search</v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default defineComponent({
  data() {
    return {
      lead: "",
      loaded: false,
      loading: false,
      rules: {
        required: (value: string) =>
          value.length > 2 ||
          value.length === 0 ||
          "Должно быть больше 2 символов",
      },
    };
  },
  methods: {
    ...mapActions(["searchLeads", "getDeals"]),
    ...mapMutations(["isLoaded"]),
    onClick() {
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
        this.loaded = true;
      }, 2000);
    },
    async search() {
      if (this.lead.length > 2) {
        this.isLoaded(false);
        await this.searchLeads(this.lead);
      } else {
        this.isLoaded(false);
        await this.searchLeads("");
      }
    },
  },

  computed: {
    ...mapGetters(["getLeads"]),
  },
});
</script>

<style scoped>
.status {
  border-radius: 8px;
  border: none;
  padding: 4px 9px;
}
</style>
