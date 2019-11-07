<template>
    <el-row :gutter="16" class="mt8">
        <el-col :span="17" class="mt8">
            <el-card class="categories">
                <el-button round @click="handleSelectCategory('所有小组')">所有小组</el-button>
                <el-button size="small" type="primary" round @click="handleSelectCategory('在线教育')">在线教育</el-button>
                <el-button size="small" type="success" round @click="handleSelectCategory('同城交易')">同城交易</el-button>
                <el-button size="small" type="info" round @click="handleSelectCategory('哲学思辨')">哲学思辨</el-button>
                <el-button size="small" type="warning" round @click="handleSelectCategory('史海钩沉')">史海钩沉</el-button>
                <el-button size="small" type="danger" round @click="handleSelectCategory('天文地理')">天文地理</el-button>
                <hr/>
                <el-button round @click="handleSelectOrder('默认排序')">默认排序</el-button>
                <el-button size="small" type="primary" round @click="handleSelectOrder('post_nums')">贴子数量</el-button>
                <el-button size="small" type="info" round @click="handleSelectOrder('member_nums')">组员数量</el-button>
                <el-button size="small" type="success" round @click="handleSelectOrder('add_time')">创建时间</el-button>
            </el-card>
            <el-row :gutter="16" class="mt8">
                <el-col :span="8" v-for="(item, index) in groupList" :key="index">
                    <group-card :group="item" @add_group="handleApplyGroup"></group-card>
                </el-col>
            </el-row>
        </el-col>
        <el-col :span="7" class="mt8">
            <el-card>
                <el-button type="primary" icon="el-icon-share" @click="handleCreateGroup">创建小组</el-button>
            </el-card>
            <el-card class="mt8">
                <h3>热门小组</h3>
            </el-card>
        </el-col>
        <!--申请加入小组对话框-->
        <el-dialog title="申请加入小组" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="ruleForm" :rules="rules">
                <el-form-item label="小组名称" :label-width="formLabelWidth">
                    <el-input type="text" v-model="form.group_name" readonly autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="小组ID" :label-width="formLabelWidth" prop="group_id">
                    <el-input type="number" v-model="form.group_id" readonly autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="申请理由" :label-width="formLabelWidth" prop="apply_reason">
                    <el-input type="textarea" :rows="6" :maxlength="120" :minlength="5"
                              v-model="form.apply_reason" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" class="ml250">提交申请</el-button>
                    <el-button @click="resetForm('ruleForm')">取消申请</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-row>
</template>

<script>
    import { getCommunityGroups,} from '../api/api'
    // import { getCommunityGroups, applyGroupMember } from '../api/api'
    import GroupCard from '../components/GroupCard'
    export default {
        name: 'GroupList',
        components: { GroupCard },
        data () {
            return {
                category: null,
                order: null,
                groupList: [],
                dialogFormVisible: false,
                formLabelWidth: '120px',
                form: {
                    group_name: '',
                    group_id: 0,
                    apply_reason: ''
                },
                rules: {
                    group_id: [
                        { required: true, message: '小组ID不能为空！', trigger: 'blur' }
                    ],
                    apply_reason: [
                        { required: true, message: '申请理由不能为空！', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleCreateGroup () {
                this.$router.push({ name: 'group_create' })
            },
            handleSelectCategory (category) {
                this.category = category === '所有小组' ? null : category;
                this.obtainGroups(this.category, this.order)
            },
            handleSelectOrder (order) {
                this.order = order === '默认排序' ? null : order;
                this.obtainGroups(this.category, this.order)
            },
            obtainGroups (category, order) {
                getCommunityGroups({ params: { ctg: category, order: order } }).then((response) => {
                    console.log(response.data);
                    this.groupList = response.data
                }).catch((error) => {
                    console.log(error.response.data)
                })
            },
            handleApplyGroup (param) {
                this.form.group_name = param.group_name;
                this.form.group_id = param.group_id;
                this.form.apply_reason = '';
                this.dialogFormVisible = true
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        applyGroupMember({ group_id: this.form.group_id, apply_reason: this.form.apply_reason }).then(
                            (response) => {
                                console.log(response.data);
                                this.$message({ message: '成功加入小组！', type: 'success' });
                                this.dialogFormVisible = false
                            }
                        ).catch((error) => {
                            console.log(error.response.data);
                            if (error.response.status === 400) {
                                if (error.response.data.apply_reason) {
                                    alert(error.response.data.apply_reason);
                                    this.dialogFormVisible = false
                                }
                                if (error.response.data.non_fields) {
                                    alert(error.response.data.non_fields);
                                    this.dialogFormVisible = false
                                }
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false
                    }
                })
            },
            resetForm (formName) {
                this.$refs[formName].resetFields();
                this.dialogFormVisible = false
            }
        },
        mounted () {
            this.obtainGroups(this.category, this.order)
        }
    }
</script>

<style scoped>
    .mt8 {
        margin-top: 8px;
    }
    .ml250 {
        margin-left: 250px;
    }
</style>
