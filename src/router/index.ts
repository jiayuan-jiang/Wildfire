import { createRouter, createWebHistory} from 'vue-router'
import layout from '../components/App Layout/layout.vue'
import mapcanvas from "@/components/cesium/mapcanvas.vue"
import perdictFire from "@/components/dialogManagement/predictFire.vue"
import {useTokenStore} from "@/stores/myToken"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: "login",
      component: ()=> import("@/views/LoginPage/login.vue")
    },
    {
      path: "/leafTest",
      name: "leaflet2",
      component: () => import("@/components/leaflet/mapView.vue")
    },
    {
      path: '/',
      name: 'home',
      meta: {requiresAuth: true},
      component: layout,
      children:[
        {
          path: "",
          name: "AliMap",
          component: () => import("@/components/AMap/mapView.vue")
        },
        {
          path: "/database",
          name: "dataBase",
          component: () => import("@/components/dataUI/dataDisplay.vue")
        },
        {
          path: "/demo",
          name: "demoDisplay",
          component: () => import("@/components/CodeHight/demoDisplay.vue")
        },
        {
          path: "/leaflet",
          name: "leaflet",
          component: () => import("@/components/leaflet/mapView.vue")
        },
        {
          path: '/cesium',
          name: 'cesium',
          component: mapcanvas
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue')
        },
      ]
    },
    // 404路由移到最外层最后
    {
      path: "/:pathMatch(.*)*",
      name: "ErrorPage",
      component: () => import("@/components/ErrorPages/ErrorPage.vue")
    }
  ]
})

router.beforeEach((to, from, next)=>{
  if(to.matched.some(r=>r.meta?.requiresAuth)){
    const store = useTokenStore()
    if(!store.token.access_token){
      next({name: "login", query: {redirect: to.fullPath}})
      return // 添加return，防止继续执行
    }
  }
  next()
})

export default router