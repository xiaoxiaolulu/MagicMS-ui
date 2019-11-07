<template>
    <div>
        <el-menu
                :default-active="activeIndex"
                mode="horizontal"
                @select="handleSelect"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <el-menu-item index="home">论坛</el-menu-item>
            <el-menu-item index="group">小组</el-menu-item>
            <el-menu-item index="quora">问答</el-menu-item>
            <el-submenu index="2">
                <template slot="title">个人中心</template>
                <el-menu-item index="2-1">个人主页</el-menu-item>
                <el-menu-item index="2-2">设置</el-menu-item>
                <el-menu-item index="logout">退出</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    import cookie from '../vuex/cookie'
    export default {
        name: "TopNav",
        data() {
            return {
                activeIndex: '1',
            };
        },
        methods: {
            created(){
              if (cookie.getCookie('token') === 'undefined'){
                  this.$router.push({
                      name: 'login'
                  })
              }
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                if(key === 'home'){
                    this.$router.push({
                        name: 'home'
                    })
                }
                if(key === 'group'){
                    this.$router.push({
                        name: 'group'
                    })
                }
                if(key === 'quora'){
                    this.$router.push({
                        name: 'question'
                    })
                }
                if(key === 'login'){
                    cookie.delCookie('token');
                    cookie.delCookie('username');
                    cookie.delCookie('userid');
                    this.$store.dispatch('setInfo');
                    this.$router.push({
                        name: 'login'
                    })
                }
                if (key === 'logout'){
                    this.$router.push({
                        name: 'login'
                    })
                }
                if(key === 'register'){
                    this.$router.push({
                        name: 'register'
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>
