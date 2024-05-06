import { createRouter, createWebHistory } from 'vue-router'
import DemoApp from "../DemoApp.vue";

const routes = [
  // 定义你的路由
    {
      path: '/calendar',
      name: 'calendar',
      component: DemoApp
  }
]

const router = createRouter({
  history: createWebHistory(),  // 设置为默认的根路径
  routes
})

export default router
