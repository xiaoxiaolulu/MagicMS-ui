<template>
    <div>
        <h1>创建小组</h1>
        <hr/>
        <el-row>
            <el-col :span="3"><div style="height: 1px;width: 100%"></div></el-col>
            <el-col :span="10">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="小组名称" prop="name">
                        <el-input type="text" v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="小组类别" prop="category">
                        <el-select v-model="ruleForm.category" placeholder="请选择小组类别">
                            <el-option label="在线教育" value="在线教育"></el-option>
                            <el-option label="同城交易" value="同城交易"></el-option>
                            <el-option label="哲学思辨" value="哲学思辨"></el-option>
                            <el-option label="史海钩沉" value="史海钩沉"></el-option>
                            <el-option label="天文地理" value="天文地理"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="封面图象">
                        <!--            <el-input type="file" v-model="ruleForm.cover"></el-input>-->
                        <input type="file" id="cover" name="cover" accept="image/png, image/jpeg, image/jpg" @change="changeImage($event)">
                    </el-form-item>
                    <el-form-item label="小组简介" prop="desc">
                        <el-input type="textarea" v-model="ruleForm.desc" :rows="5"></el-input>
                    </el-form-item>
                    <el-form-item label="小组公告" prop="notice">
                        <el-input type="textarea" v-model="ruleForm.notice" :rows="7"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { createCommunityGroup } from '../api/api'
    export default {
        name: 'GroupCreate',
        data () {
            return {
                ruleForm: {
                    name: '',
                    category: '',
                    cover: '',
                    desc: '',
                    notice: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入小组名称', trigger: 'blur' },
                        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                    ],
                    category: [
                        { required: true, message: '请选择小组类别', trigger: 'blur' }
                    ],
                    // cover: [
                    //   { required: true, message: '请选择封面图象', trigger: 'blur' }
                    // ],
                    desc: [
                        { required: true, message: '请填写小组简介', trigger: 'blur' },
                        { min: 10, max: 255, message: '长度在 10 到 255 个字符', trigger: 'blur' }
                    ],
                    notice: [
                        { required: true, message: '请填写小组公告', trigger: 'blur' },
                        { min: 10, max: 255, message: '长度在 10 到 255 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            changeImage (evt) {
                this.ruleForm.cover = evt.target.files[0];
                console.log(this.ruleForm.cover)
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.ruleForm.cover === '') {
                            alert('请选择封面文件!');
                            return false
                        }
                        let formData = new FormData();
                        formData.append('name', this.ruleForm.name);
                        formData.append('category', this.ruleForm.category);
                        formData.append('desc', this.ruleForm.desc);
                        formData.append('notice', this.ruleForm.notice);
                        formData.append('cover', this.ruleForm.cover);
                        createCommunityGroup(formData).then((response) => {
                            console.log(response.data);
                            this.$router.push({ name: 'group' })
                        }).catch((error) => {
                            console.log(error.response.data)
                        })
                    } else {
                        console.log('error submit!!');
                        return false
                    }
                })
            },
            resetForm (formName) {
                this.$refs[formName].resetFields()
            }
        }
    }
</script>

<style scoped>

</style>
