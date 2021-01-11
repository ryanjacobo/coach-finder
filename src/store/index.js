import { createStore } from "vuex";
import coachesModule from "./coaches";
import requestsModule from "./requests";
import authModule from "./auth";

const store = createStore({
  modules: {
    coaches: coachesModule,
    requests: requestsModule,
    auth: authModule,
  },
  
});

export default store;
