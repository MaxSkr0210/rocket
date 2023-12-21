import { createStore } from "vuex";
import axios from "axios";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

export default createStore({
  state: {
    leads: [],
    isLoaded: false,
    queries: [] as string[],
  },
  getters: {
    getLeads(state) {
      return state.leads;
    },
    getLoaded(state) {
      return state.isLoaded;
    },
  },
  mutations: {
    updateLeads(state, leads) {
      state.leads = leads;
    },
    isLoaded(state, loaded) {
      state.isLoaded = loaded;
    },
    addQuery(state, query) {
      state.queries.push(query);
    },
  },
  actions: {
    async getDeals({ commit }) {
      const res = await axios.get("http://localhost:3000/api/leads");
      commit("updateLeads", res.data);
      commit("isLoaded", true);
    },
    async searchLeads(store, query: string) {
      const queries = store.state.queries;

      const res = await axios.get(
        "http://localhost:3000/api/leads?query=" + query
      );

      store.commit("updateLeads", res.data);
      store.commit("isLoaded", true);

      store.state.queries.length = 0;
    },
  },
});
