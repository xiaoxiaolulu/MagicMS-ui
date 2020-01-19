<template>
    <el-dialog :title="'测试套件配置'" :visible.sync="operatorDialogVisible" center width="60%">
        <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData"
                 class="lk-form"
                 label-position="right"
                 label-width="100px">
            <div style="margin-bottom: 10px">
                <el-row>
                    <el-col :span="9">
                        <el-table
                                :data="outTableData"
                                v-loading="outTableLoading"
                                element-loading-text="拼命加载中"
                                @selection-change="outTableSelChange"
                                max-height="450"
                                size="small"
                                border>
                            <el-table-column type="selection" width="50"/>
                            <el-table-column prop="test_name" label="未分配用例"/>
                        </el-table>
                        <el-pagination
                                @current-change="queryOutTable"
                                :current-page.sync="queryOutParams.currentPage"
                                :page-size="20"
                                :total="outTableTotal"
                                layout="->, total, prev, pager, next">
                        </el-pagination>
                    </el-col>
                    <el-col :span="6" class="centerBtns">
                        <div>
                            <el-button type="success" :disabled="addBtnDisabled" @click="addRoleOperator"> 添 加 &gt; &gt;
                            </el-button>
                        </div>
                        <div>
                            <el-button type="danger" :disabled="removeBtnDisabled" @click="removeRoleOperator"> &lt; &lt; 移 除
                            </el-button>
                        </div>
                    </el-col>
                    <el-col :span="9">
                        <el-table
                                :data="inTableData"
                                v-loading="inTableLoading"
                                element-loading-text="拼命加载中"
                                @selection-change="inTableSelChange"
                                max-height="450"
                                size="small"
                                border>
                            <el-table-column type="selection" width="50"/>
                            <el-table-column prop="test_name" label="已分配测试用例"/>
                        </el-table>
                        <el-pagination
                                @current-change="queryInTable"
                                :current-page.sync="queryInParams.currentPage"
                                :page-size="20"
                                :total="inTableTotal"
                                layout="->, total, prev, pager, next">
                        </el-pagination>
                    </el-col>
                </el-row>
            </div>
            <el-form-item>
                <el-button :loading="loading" type="primary" @click="addInnerDialogVisible= true">Save</el-button>
                <el-button @click="operatorDialogVisible = false">Cancel</el-button>
                <el-dialog title="Save Suites" center  :visible.sync="addInnerDialogVisible" append-to-body>
                    <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData" class="lk-form" label-position="right" label-width="100px">
                        <el-form-item label="套件名称">
                            <el-input v-model="formData.suiteName"/>
                        </el-form-item>
                        <el-form-item label="套件描述">
                            <el-input v-model="formData.desc"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button :loading="loading" type="primary" @click="submitForm('formData')">确 认</el-button>
                            <el-button @click="addInnerDialogVisible = false">取 消</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import {createSuite, getCaseList} from "../../../api/api";

    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
            dialogData: {}
        },
        data() {
            return {
                inCaseTableData: [],
                outCaseTableData: [],
                operatorDialogVisible: false,
                outTableData: null,
                outTableLoading: false,
                outTableTotal: null,
                queryOutParams: {
                    currentPage: 1,
                    status: 0
                },
                inTableData: null,
                inTableLoading: false,
                inTableTotal: null,
                queryInParams: {
                    currentPage: 1,
                    status: 1
                },
                addBtnDisabled: true,
                removeBtnDisabled: true,
                addArray: [],
                removeArray: [],
                loading: false,
                addInnerDialogVisible: false,
                formData: {
                    suiteName: '',
                    desc: ''
                },
                resetRules: {

                }
            }
        },
        watch: {
            value(val) {
                this.operatorDialogVisible = val;
                if (val) {
                    this.queryOutParams.roleId = this.dialogData.roleId;
                    this.queryInParams.roleId = this.dialogData.roleId;
                    this.queryOutTable();
                    this.queryInTable()
                }
            },
            operatorDialogVisible(val) {
                this.$emit('input', val)
            }
        },
        methods: {

            queryOutTable() {
                this.outTableLoading = true;
                getCaseList({params: {name: this.name}}).then((res) => {
                    this.outTableLoading = false;
                    this.outCaseTableData = res.data.data;
                    this.outTableData = this.outCaseTableData;
                    this.outTableTotal = res.data.data.length;
                }).catch((error) => {
                    this.outTableLoading = false;
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: error.msg
                    })
                });
            },
            queryInTable() {
                this.inTableLoading = true;
                try {
                    this.inTableLoading = false;
                    this.inTableData = this.inCaseTableData;
                    this.inTableTotal = this.inCaseTableData.length;
                } catch (error) {
                    this.inTableLoading = false;
                    this.$message.error(error)
                }
            },
            outTableSelChange(val) {
                if (val.length > 0) {
                    this.addBtnDisabled = false
                } else {
                    this.addBtnDisabled = true
                }
                this.addArray = val;
            },
            inTableSelChange(val) {
                if (val.length > 0) {
                    this.removeBtnDisabled = false
                } else {
                    this.removeBtnDisabled = true
                }
                this.removeArray = val
            },

            addRoleOperator() {
                for (let i = 0; i < this.addArray.length; i++) {
                    this.inCaseTableData.push(this.addArray[i]);
                }
                for (let i = 0; i < this.addArray.length; i++) {
                    for (let j = 0; j < this.outCaseTableData.length; j++) {
                        if(JSON.stringify(this.outCaseTableData[j]) === JSON.stringify(this.addArray[i])){
                            this.outCaseTableData.splice(j, 1)
                        }
                    }
                }
            },
            removeRoleOperator() {
                for (let i = 0; i < this.removeArray.length; i++) {
                    this.outCaseTableData.push(this.removeArray[i]);
                }
                for (let i = 0; i < this.removeArray.length; i++) {
                    for (let j = 0; j < this.inCaseTableData.length; j++) {
                        if(JSON.stringify(this.inCaseTableData[j]) === JSON.stringify(this.removeArray[i])){
                            this.inCaseTableData.splice(j, 1)
                        }
                    }
                }
            },
            submitForm (formName) {
                // 获取用例id
                let casesId = [];
                for(let i=0; i<this.inCaseTableData.length; i++){
                    casesId.push(this.inCaseTableData[i]['id'])
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        createSuite({
                            suite_name: this.formData.suiteName,
                            cases: casesId,
                            desc: this.formData.desc,
                        }).then((response) => {
                            console.log(response.data);
                            this.operatorDialogVisible = false;
                            this.addInnerDialogVisible = false;
                            this.$parent.queryList()
                        }).catch((err) => {
                            if (err.code !== 1) {
                                let errorMsg = "";
                                for (var key in err.msg) {
                                    var item = err.msg[key][0];
                                    errorMsg += item + "\xa0\xa0\xa0\xa0\xa0\xa0"
                                }
                                this.$message({message: errorMsg, type: 'error'})
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

<style lang="less" scoped>
    .centerBtns {
        text-align: center;

        > div {
            margin-top: 25px;
        }
    }

</style>
