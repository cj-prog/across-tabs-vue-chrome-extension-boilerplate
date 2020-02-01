import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router';
import Child from "./components/Child";
import Parent from "./components/Parent";


Vue.config.productionTip = false

Vue.use(VueRouter)
const router = new VueRouter({routes: [
    {
      path: '/child',
      component: Child,
    },
    {
      path: '/',
      component: Parent,
    },
  ]});


new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
