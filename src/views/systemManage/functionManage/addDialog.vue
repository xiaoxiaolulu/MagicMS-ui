<template>
    <el-dialog title="添加内置函数" :visible.sync="addDialogVisible" center>
        <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData"
                 label-position="right"
                 label-width="100px">
            <el-form-item label="方法名称">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="方法描述">
                <el-input v-model="formData.desc"></el-input>
            </el-form-item>
            <el-form-item label="函数编写">
                <md-card>
                    <md-card-actions>
                        <div class="md-subhead">
                            <span><el-button type="danger" size="mini" class="iconfont icondebug" @click="DebugFunc"></el-button></span>
                        </div>
                    </md-card-actions>
                    <md-card-media>
                        <div class="codemirror">
                            <!-- codemirror -->
                            <codemirror v-model="code" :options="cmOption"></codemirror>
                        </div>
                        <div v-html="funcResult" style="color: red">{{funcResult}}</div>
                    </md-card-media>
                </md-card>

            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" @click="submitForm('formData')">确 认</el-button>
                <el-button @click="addDialogVisible = false">取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import 'codemirror/mode/python/python.js'
    // theme css
    import 'codemirror/theme/night.css'

    // require active-line.js
    import 'codemirror/addon/selection/active-line.js'
    // closebrackets
    import 'codemirror/addon/edit/closebrackets.js'
    // keyMap
    import 'codemirror/mode/clike/clike.js'
    import 'codemirror/addon/edit/matchbrackets.js'
    import 'codemirror/addon/comment/comment.js'
    import 'codemirror/addon/dialog/dialog.js'
    import 'codemirror/addon/dialog/dialog.css'
    import 'codemirror/addon/search/searchcursor.js'
    import 'codemirror/addon/search/search.js'
    import 'codemirror/keymap/emacs.js'
    import {functionDebug, createFunction} from "../../../api/api";

    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
            dialogData: {
                default: null
            }
        },
        data() {
            const validaeFunctionName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入方法名称！'));
                } else {
                    callback();
                }
            };
            const validateDesc = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入方法描述！'));
                } else {
                    callback();
                }
            };
            const validateFunction = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入函数方法！'));
                } else {
                    callback();
                }
            };
            return {
                code: "",
                funcResult: '',
                ssh_cmd: null,
                cmOption: {
                    autoCloseBrackets: true,
                    tabSize: 4,
                    styleActiveLine: true,
                    lineNumbers: true,
                    line: true,
                    mode: 'python',
                    theme: 'night',
                    keyMap: "emacs"
                },
                formData: {
                    name: '',
                    desc: '',
                },
                resetRules: {
                    name: [
                        { required: true, trigger: 'blur', validator: validaeFunctionName }
                    ],
                    code: [
                        { required: true, trigger: 'blur', validator: validateFunction }
                    ],
                    desc: [
                        { required: true, trigger: 'blur', validator: validateDesc }
                    ]
                },
                loading: false,
                title: '',
                addDialogVisible: false,
            }
        },
        watch: {
            value(val) {
                this.addDialogVisible = val;
                this.errors.clear();
                this.formData = { ...this.dialogData }
            },
            addDialogVisible(val) {
                this.$emit('input', val)
            }
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        createFunction({
                            name: this.formData.name,
                            function: this.code,
                            desc: this.formData.desc,
                        }).then((response) => {
                            console.log(response.data);
                            this.addDialogVisible = false;
                            this.$parent.queryList()
                        }).catch((err) => {
                            if (err.response.status === 400) {
                                if (err.response.data.code) {
                                    this.$message({ message: err.response.data.code, type: 'error' })
                                } else if (err.response.data.email) {
                                    this.$message({ message: err.response.data.email, type: 'error' })
                                }
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false
                    }
                })
            },
            DebugFunc(){
                functionDebug({
                    function: this.code,
                }).then((response) =>{
                    this.funcResult = "[INFO]: " + response.data.data.RunningRes;
                    console.log(this.funcResult);
                }).catch((err) =>{
                    if (err.response.status === 400) {
                        if (err.response.data.code) {
                            this.$message({ message: err.response.data.code, type: 'error' })
                        } else if (err.response.data.email) {
                            this.$message({ message: err.response.data.email, type: 'error' })
                        }
                    }
                })
            }
            // submit() {
            //     let params = { ...this.formData }
            //     if (this.dialogData.editable) {
            //         // 修改权限
            //         params.menuId = this.dialogData.menuId
            //         params.parentMenuId = this.dialogData.parentMenuId
            //     } else {
            //         // 添加权限
            //         params.menuId = 0
            //         params.parentMenuId = this.dialogData.menuId || 0
            //     }
            //     params.menuStatus = params.menuStatus ? 1 : 0
            //     params.menuType = params.parentMenuId ? 2 : 1
            //     this.$apis.addOrUpdateMenu(params).then(res => {
            //         if (res.code === '2000') {
            //             this.addDialogVisible = false
            //             this.$parent.queryMenu()
            //         } else {
            //             this.$message.error(res.message)
            //         }
            //     }).catch(error => {
            //         this.$message.error(error)
            //     })
            // }
        }
    }
</script>
