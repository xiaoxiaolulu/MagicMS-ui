import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/welcome')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register/register.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "about" */ '../views/404')
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import(/* webpackChunkName: "about" */ '../views/layout'),
    children: [{
      path: '/welcome',
      name: 'welcome',
      component: resolve => require(['@/views/welcome'], resolve)
    }, {
      path: '/projectManage',
      name: 'projectManage',
      component: resolve => require(['@/views/systemManage/projectManage'], resolve),
      meta: {
        preTitle: '项目管理',
        title: '项目设置'
      }
    }, {
      path: '/environmentManage',
      name: 'environmentManage',
      component: resolve => require(['@/views/systemManage/environmentManage'], resolve),
      meta: {
        preTitle: '项目管理',
        title: '环境配置'
      }
    }, {
      path: '/functionManage',
      name: 'functionManage',
      component: resolve => require(['@/views/systemManage/functionManage'], resolve),
      meta: {
        preTitle: '项目管理',
        title: '内置函数'
      }
    }, {
      path: '/dbManage',
      name: 'dbManage',
      component: resolve => require(['@/views/systemManage/dbManage'], resolve),
      meta: {
        preTitle: '项目管理',
        title: '数据库配置'
      }
    }, {
      path: '/interfacesManage',
      name: 'interfacesManage',
      component: resolve => require(['@/views/interfacesTest/interfacesManage'], resolve),
      meta: {
        preTitle: '接口测试',
        title: '接口管理'
      }
    },{
      path: '/testCaseManage',
      name: 'testCaseManage',
      component: resolve => require(['@/views/interfacesTest/testCaseManage'], resolve),
      meta: {
        preTitle: '用例管理',
        title: '接口管理'
      }
    },{
      path: '/pageElementManage',
      name: 'pageElementManage',
      component: resolve => require(['@/views/webUiTest/pageElementManage'], resolve),
      meta: {
        preTitle: '页面元素',
        title: 'web测试'
      }
    },
      {
      path: '/DataConstruction',
      name: 'DataConstruction',
      component: resolve => require(['@/views/testTools/DataConstruction'], resolve),
      meta: {
        preTitle: '测试工具',
        title: '数据构造'
      }
    }]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
