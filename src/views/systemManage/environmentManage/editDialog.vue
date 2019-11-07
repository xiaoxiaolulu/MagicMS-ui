<template>
    <el-dialog title="修改环境" :visible.sync="editDialogVisible" center>
        <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData"
                 class="lk-form"
                 label-position="right"
                 label-width="100px">
            <el-form-item label="环境名称">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="环境地址">
                <el-input v-model="formData.host_address"></el-input>
            </el-form-item>
            <el-form-item label="环境描述">
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
    import {updateTestEnvironment} from "../../../api/api";

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
            const validaeEnvironmentName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入环境名称！'));
                } else {
                    callback();
                }
            };
            const validateEnvironmentHost = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入环境地址！'));
                } else {
                    callback();
                }
            };
            const validateEnvironmentDesc = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入环境描述！'));
                } else {
                    callback();
                }
            };
            return {
                formData: {
                    name: '',
                    host_address: '',
                    desc: ''
                },
                resetRules: {
                    name: [
                        { required: true, trigger: 'blur', validator: validaeEnvironmentName }
                    ],
                    host_address: [
                        { required: true, trigger: 'blur', validator: validateEnvironmentHost }
                    ],
                    desc: [
                        { required: true, trigger: 'blur', validator: validateEnvironmentDesc }
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
                this.formData = { ...this.dialogData }
            },
            editDialogVisible(val) {
                this.$emit('input', val)
            }
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        updateTestEnvironment({
                            environment_id: this.$parent.rowData.id,
                            name: this.formData.name,
                            host_address: this.formData.host_address,
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
