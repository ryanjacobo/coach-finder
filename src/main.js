import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import BaseCard from "./components/ui/BaseCard.vue";
import BaseButton from "./components/ui/BaseButton.vue";
import BaseBadge from "./components/ui/BaseBadge.vue";

// const app = createApp(App);
// app.use(router);
// app.mount('#app');

// shortcut for using const app
createApp(App)
  .use(router)
  .use(store)
  .component("base-card", BaseCard)
  .component("base-button", BaseButton)
  .component("base-badge", BaseBadge)
  .mount("#app");
