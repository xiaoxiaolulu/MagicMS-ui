<template>
    <div class="login-container">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
                 label-width="0px"
                 class="card-box login-form">
            <h3 class="title">系统登录<i class="fa fa-tripadvisor" aria-hidden="true"></i></h3>
            <el-form-item prop="email">
                <span class="svg-container"><i class="fa fa-user-circle-o" aria-hidden="true"></i></span>
                <el-input name="email" type="text" v-model="loginForm.email" autoComplete="off"
                          placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container"><i class="fa fa-lock" aria-hidden="true"></i></span>
                <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                          autoComplete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click="submitForm('loginForm')">
                    登录
                </el-button>
            </el-form-item>
            <router-link to="/register" class="forget-pwd">
                忘记密码?(或注册)
            </router-link>
        </el-form>

    </div>
</template>

<script>
    // import { mapGetters } from 'vuex';
    import {loginUser} from "../../api/api";
    import { isEmail } from '../../utils/validate';
    import cookie from '../../vuex/cookie'
    import md5 from 'blueimp-md5';
    // import { getQueryObject } from 'utils';


    export default {

        name: 'Login',
        data() {
            const validateEmail = (rule, value, callback) => {
                if (!isEmail(value)) {
                    callback(new Error('请输入正确的合法邮箱'));
                } else {
                    callback();
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('密码不能小于6位'));
                } else {
                    callback();
                }
            };

            return {
                loginForm: {
                    email: '',
                    password: ''
                },
                loginRules: {
                    email: [
                        { required: true, trigger: 'blur', validator: validateEmail },
                    ],
                    password: [
                        { required: true, trigger: 'blur', validator: validatePass },
                    ]
                },
                loading: false,
                showDialog: false
            }
        },
        computed: {
            // ...mapGetters([
            //   // 映射 this.auth_type 为 vuex.getters.auth_type。已删除
            //   'auth_type'
            // ])
        },
        methods: {

            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        loginUser({'account': this.loginForm.email, 'password': this.loginForm.password}).then(
                            (response) => {
                                var responseJson = response.data;
                                cookie.setCookie('username', responseJson.data.nick_name, 7);
                                cookie.setCookie('userid', responseJson.data.id, 7);
                                cookie.setCookie('token', responseJson.data.token, 7);

                                // 存储,更新 vuex
                                this.$store.dispatch('setInfo');
                                // 刷新跳转到当前页
                                // this.$router.go(0);
                                // 跳转到首页
                                this.$router.push({ name: 'welcome' })
                            }
                        ).catch((error) => {
                            console.log(error)
                            // if (error.response.status === 400) {
                            //     if (error.response.data.password) {
                            //         this.$message({ message: error.response.data.password, type: 'error' })
                            //     } else if (error.response.data.mobile) {
                            //         this.$message({ message: error.response.data.mobile, type: 'error' })
                            //     }
                            // }
                        })
                    } else {
                        console.log('error submit!!');
                        return false
                    }
                })
            },

            // handleLogin() {
            //
            //     this.$refs.loginForm.validate(valid => {
            //         if (valid) {
            //             this.loading = true;
            //             var  par = JSON.parse(JSON.stringify(this.loginForm)) ;
            //             par.password = md5('@lss'+par.password);
            //
            //             this.$vuex.dispatch('LoginByEmail', par).then(() => {
            //                 this.loading = false;
            //
            //                 console.log('登陆成功即将跳转--------');
            //                 this.$router.push({ path: '/' });
            //
            //
            //                 // this.showDialog = true;
            //             }).catch(err => {
            //                 this.$message.error(err);
            //                 this.loading = false;
            //             });
            //         } else {
            //             console.log('error submit!!');
            //             return false;
            //         }
            //     });
            // },
            afterQRScan() {
                // const hash = window.location.hash.slice(1);
                // const hashObj = getQueryObject(hash);
                // const originUrl = window.location.origin;
                // history.replaceState({}, '', originUrl);
                // const codeMap = {
                //   wechat: 'code',
                //   tencent: 'code'
                // };
                // const codeName = hashObj[codeMap[this.auth_type]];
                // if (!codeName) {
                //   alert('第三方登录失败');
                // } else {
                //   this.$vuex.dispatch('LoginByThirdparty', codeName).then(() => {
                //     this.$router.push({ path: '/' });
                //   });
                // }
            }
        },
        // created() {
        //     // window.addEventListener('hashchange', this.afterQRScan);
        // },
        // destroyed() {
        //     // window.removeEventListener('hashchange', this.afterQRScan);
        // }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/css/mixin";
    .tips{
        font-size: 14px;
        color: #fff;
        margin-bottom: 5px;
    }
    .login-container {
        @include relative;
        height: 100vh;
        /*background-color: #2d3a4b;*/

        background: url('../../assets/img/bg_sky.jpg') no-repeat;
        background-size: cover;

        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
            -webkit-text-fill-color: #fff !important;
        }
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #eeeeee;
            height: 47px;
        }
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            width: 40px;
            float: left;
            text-align: center;
            color: #889aa4;
            font-size: 20px;
        }

        .title {
            font-size: 26px;
            font-weight: 400;
            color: #eeeeee;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 400px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }

        .forget-pwd {
            color: #fff;
        }
    }

</style>
