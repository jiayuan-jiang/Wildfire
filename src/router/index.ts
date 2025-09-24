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
          path: "/:xxx(.*)*",
          name: "ErrorPage",
          component: () => import("@/components/ErrorPages/ErrorPage.vue")
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        },
      ]
    },

  ]
})

router.beforeEach((to, from, next)=>{
  if(to.matched.some(r=>r.meta?.requiresAuth)){
    const store = useTokenStore()
    if(!store.token.access_token){
      next({name: "login", query: {redirect: to.fullPath}})
    }
  }
  next()
})

export default router
