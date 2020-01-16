<template>
    <el-dialog title="添加页面元素" :visible.sync="addDialogVisible" center>
        <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData"
                class="lk-form"
                label-position="right"
                label-width="100px">
            <el-form-item label="元素名称">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="操作类型">
                <el-select type="type" v-model="formData.type" v-loading="loading"
                           element-loading-spinner="el-icon-loading" clearable filterable>
                    <el-option v-for="item in type" :value="item" :key="null">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属页面">
                <el-input v-model="formData.page"></el-input>
            </el-form-item>
            <el-form-item label="元素描述">
                <el-input v-model="formData.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" @click="submitForm('formData')">确 认</el-button>
                <el-button @click="addDialogVisible = false">取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import {getKeywordsList, createPageElement} from "../../../api/api";

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
            const validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入元素名称！'));
                } else {
                    callback();
                }
            };
            const validateType = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入操作类型！'));
                } else {
                    callback();
                }
            };
            const validatePage = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入所属页面！'));
                } else {
                    callback();
                }
            };
            const validateDesc = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入数据库描述！'));
                } else {
                    callback();
                }
            };
            return {
                type: [],
                formData: {
                    name: '',
                    type: '',
                    page: '',
                    desc: ''
                },
                resetRules: {
                    name: [
                        { required: true, trigger: 'blur', validator: validateName }
                    ],
                    type: [
                        { required: true, trigger: 'blur', validator: validateType }
                    ],
                    page: [
                        { required: true, trigger: 'blur', validator: validatePage }
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
                this.formData = { ...this.dialogData };
            },
            addDialogVisible(val) {
                this.$emit('input', val)
            },

        },

        mounted() {
            this.queryKeyWords()
        },
        methods: {
            queryKeyWords() {
                this.loading = true;
                getKeywordsList({ params: {} }).then((res) => {
                    this.loading = false;
                    this.type = res.data.data.keyword;
                    console.log(res.data.data.keyword)
                }).catch((error) => {
                    this.loading = false;
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: error.msg
                    })
                })
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        createPageElement({
                            element_name: this.formData.name,
                            operate_type: this.formData.type,
                            owner_page: this.formData.page,
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
        }
    }
</script>
