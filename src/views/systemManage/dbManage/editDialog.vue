<template>
    <el-dialog title="修改项目" :visible.sync="editDialogVisible" center>
        <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData"
                 class="lk-form"
                 label-position="right"
                 label-width="100px">
            <el-form-item label="数据库名称">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="数据库类型">
                <el-input v-model="formData.type"></el-input>
            </el-form-item>
            <el-form-item label="数据库账号">
                <el-input v-model="formData.user"></el-input>
            </el-form-item>
            <el-form-item label="数据库密码">
                <el-input v-model="formData.password"></el-input>
            </el-form-item>
            <el-form-item label="数据库IP">
                <el-input v-model="formData.host"></el-input>
            </el-form-item>
            <el-form-item label="数据库端口">
                <el-input v-model="formData.port"></el-input>
            </el-form-item>
            <el-form-item label="数据库描述">
                <el-input v-model="formData.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" @click="submitForm('formData')">确 认</el-button>
                <el-button @click="editDialogVisible = false">取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import {updateDbSetting} from "../../../api/api";

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
            const validaeDBName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入数据库名称！'));
                } else {
                    callback();
                }
            };
            const validateType = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入数据库类型！'));
                } else {
                    callback();
                }
            };
            const validateUser = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入数据库账号！'));
                } else {
                    callback();
                }
            };
            const validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入数据库密码！'));
                } else {
                    callback();
                }
            };
            const validateIP = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入数据库IP！'));
                } else {
                    callback();
                }
            };
            const validatePort = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入数据库端口！'));
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
                formData: {
                    name: '',
                    type: '',
                    user: '',
                    password: '',
                    host: '',
                    port: '',
                    desc: ''
                },
                resetRules: {
                    name: [
                        { required: true, trigger: 'blur', validator: validaeDBName }
                    ],
                    type: [
                        { required: true, trigger: 'blur', validator: validateType }
                    ],
                    user: [
                        { required: true, trigger: 'blur', validator: validateUser }
                    ],
                    password: [
                        { required: true, trigger: 'blur', validator: validatePassword }
                    ],
                    host: [
                        { required: true, trigger: 'blur', validator: validateIP }
                    ],
                    port: [
                        { required: true, trigger: 'blur', validator: validatePort }
                    ],
                    desc: [
                        { required: true, trigger: 'blur', validator: validateDesc }
                    ]
                },
                loading: false,
                title: '',
                editDialogVisible: false,
            }
        },
        watch: {
            value(val) {
                this.editDialogVisible = val;
                this.errors.clear();
                this.formData = {
                    name:  this.$parent.rowData.name,
                    type:  this.$parent.rowData.db_type,
                    user:  this.$parent.rowData.db_user,
                    password:  this.$parent.rowData.db_password,
                    host:  this.$parent.rowData.db_host,
                    port:  this.$parent.rowData.db_port,
                    desc:  this.$parent.rowData.desc,
                }
            },
            editDialogVisible(val) {
                this.$emit('input', val)
            }
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        updateDbSetting({
                            db_id: this.$parent.rowData.id,
                            name: this.formData.name,
                            db_type: this.formData.type,
                            db_user: this.formData.user,
                            db_password: this.formData.password,
                            db_host: this.formData.host,
                            db_port: this.formData.port,
                            desc: this.formData.desc,
                        }).then((response) => {
                            console.log(response.data);
                            this.editDialogVisible = false;
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
