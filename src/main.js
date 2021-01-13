import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import BaseCard from "./components/ui/BaseCard.vue";
import BaseButton from "./components/ui/BaseButton.vue";
import BaseBadge from "./components/ui/BaseBadge.vue";

// defineAsyncComponent is a Vue function that allows app to import a project component asyncronously or only when needed
const BaseDialog = defineAsyncComponent(() =>
  import("./components/ui/BaseDialog.vue")
);
// shortcut for using const app
createApp(App)
  .use(router)
  .use(store)
  .component("base-card", BaseCard)
  .component("base-button", BaseButton)
  .component("base-badge", BaseBadge)
  .component("base-dialog", BaseDialog)
  .mount("#app");
