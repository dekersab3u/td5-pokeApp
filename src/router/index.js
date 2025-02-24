import { createMemoryHistory, createRouter } from 'vue-router'
import Panier from "./../Panier.vue"
import Accueil from './../Accueil.vue'


const routes = [
    {
        path: "/",
        name: "Accueil",
        component: Accueil,
        meta: {},
    },
    {
        path: "/panier",
        name: "Panier",
        component: Panier,
        meta: {}
    }

]

const router = createRouter({
    history: createMemoryHistory(),
    routes,

})
/*router.beforeEach((to, from, next) => {
    const isLogged = isAuthenticated();
    if (routes.meta?.requiresAuth && !isLogged) {
        this.error("vous n'etes pas connecté");
        next('/login');
    }
    next();
});*/

export { router };