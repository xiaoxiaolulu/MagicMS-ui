import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/group',
    name: 'group',
    component: () => import('../views/GroupList.vue')
  },
  {
    path: '/question',
    name: 'question',
    component: () => import('../views/QuestionList.vue')
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
    path: '/group/create',
    name: 'group_create',
    component: () => import('../views/GroupCreate.vue')
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
      path: '/userDetail',
      name: 'userDetail',
      component: resolve => require(['@/views/userManage/userDetail'], resolve),
      meta: {
        preTitle: '用户管理',
        title: '用户管理'
      }
    }, {
      path: '/userLog',
      name: 'userLog',
      component: resolve => require(['@/views/userManage/userLog'], resolve),
      meta: {
        preTitle: '用户管理',
        title: '用户日志查询'
      }
    }, {
      path: '/userAssets',
      name: 'userAssets',
      component: resolve => require(['@/views/userManage/userAssets'], resolve),
      meta: {
        preTitle: '用户管理',
        title: '用户资产查询'
      }
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
      path: '/roleManage',
      name: 'roleManage',
      component: resolve => require(['@/views/systemManage/roleManage'], resolve),
      meta: {
        preTitle: '系统管理',
        title: '分组权限管理'
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
