import { createRouter, createWebHashHistory } from "vue-router";

import CoachesList from "../components/CoachesList.vue";
import RequestsReceived from "../components/RequestsReceived.vue";
import CoachRegistration from "../components/CoachRegistration.vue";
import CoachDetails from "../components/CoachDetails.vue";
import ContactCoach from "../components/ContactCoach.vue";
import NotFound from "../components/NotFound.vue";
import UserAuth from "../components/UserAuth.vue";
import store from "../store/index";

const routes = [
  {
    path: "/",
    redirect: "/coaches",
    component: CoachesList,
  },
  {
    path: "/coaches",
    component: CoachesList,
  },
  {
    path: "/coaches/:id",
    component: CoachDetails,
    props: true, // allows id to be used as props in CoachDetails
    name: "CoachDetails",
    children: [{ path: "contact", component: ContactCoach }], // <router-view></router-view>
  },
  {
    path: "/register",
    component: CoachRegistration,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/requests",
    component: RequestsReceived,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:notFound(.*)",
    component: NotFound,
  },
  {
    path: "/auth",
    component: UserAuth,
    meta: {
      requiresUnauth: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//Navigation guards. prevents user for accessing a page when not authenticated. "_" replaced "from" which is not used.
router.beforeEach(function(to, _, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next("/auth");
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next("/coaches");
  } else {
    next();
  }
});

export default router;
