<template>
  <v-container class="d-flex justify-center">
    <v-progress-circular
      v-if="!getLoaded"
      indeterminate
      color="primary"
      class=""></v-progress-circular>
    <v-table v-else class="w-100">
      <thead>
        <tr>
          <th class="text-left">Название</th>
          <th class="text-left">Бюджет</th>
          <th class="text-left">Статус</th>
          <th class="text-left">Ответственный</th>
          <th class="text-left">Дата создания</th>
        </tr>
      </thead>
      <tbody v-if="getLeads.length !== 0">
        <tr v-for="item in getLeads" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.price }}</td>
          <td>
            <span
              class="rounded-pill py-1 px-2"
              :style="{ background: item.status_id.color }"
              >{{ item.status_id.name }}</span
            >
          </td>
          <td class="d-flex align-center">
            <userIcon />
            <span>{{ item.responsible_user_id.name }}</span>
          </td>
          <td>{{ item.created_at }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6" class="text-center">No Data</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import userIcon from "@/components/userIcon.vue";

export default defineComponent({
  data() {
    return {
      load: false,
    };
  },
  components: {
    userIcon,
  },
  methods: {
    ...mapActions(["getDeals"]),
  },
  computed: {
    ...mapGetters(["getLeads", "getLoaded"]),
  },
  async mounted() {
    await this.getDeals();
  },
});
</script>

<style scoped>
.status {
  border: none;
}
</style>
