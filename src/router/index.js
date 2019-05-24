import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const routes = [
    {
        path: '/',
        name: 'threeJs',
        component: r => require.ensure([], () => r(require('../components/HelloWorld')), 'threeJs')
    },
    {
        path: '/three-one',
        name: 'threeOne',
        component: r => require.ensure([], () => r(require('../components/threeOne')), 'threeOne'),
    },
    {
        path: '/three-Two',
        name: 'threeTwo',
        component: r => require.ensure([], () => r(require('../components/threeTwo')), 'threeTwo'),
    },
    {
        path: '/three-three',
        name: 'threeThree',
        component: r => require.ensure([], () => r(require('../components/three3')), 'threeThree'),
    },
    {
        path: '/three-four',
        name: 'threeFour',
        component: r => require.ensure([], () => r(require('../components/three4')), 'threeFour'),
    },
    {
        path: '/three-five',
        name: 'threeFive',
        component: r => require.ensure([], () => r(require('../components/three5')), 'threeFive'),
    }
]
const router = new Router({
    routes
});

export default router
