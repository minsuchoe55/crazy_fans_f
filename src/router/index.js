import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/:actor?",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
