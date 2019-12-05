<template>
    <el-dialog title="添加项目" :visible.sync="addDialogVisible" center>
        <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData"
                class="lk-form"
                label-position="right"
                label-width="100px">
            <el-form-item label="项目名称">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="选择环境">
                <role-select
                        v-model="formData.id"
                        name="id"
                        data-vv-as="环境"
                        v-validate="'required'">
                </role-select>
            </el-form-item>
            <el-form-item label="项目描述">
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
    import {createProject} from "../../../api/api";
    import roleSelect from '@/components/roleSelectEnv'

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
            const validaeProjectName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入项目名称！'));
                } else {
                    callback();
                }
            };
            const validateDesc = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入项目描述！'));
                } else {
                    callback();
                }
            };
            return {
                formData: {
                    id: '',
                    name: '',
                    desc: ''
                },
                resetRules: {
                    name: [
                        { required: true, trigger: 'blur', validator: validaeProjectName }
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

        components: {
            roleSelect
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
                        createProject({
                            name: this.formData.name,
                            env: this.formData.id,
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
