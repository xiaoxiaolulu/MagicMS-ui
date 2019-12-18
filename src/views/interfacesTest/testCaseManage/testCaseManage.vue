<template>
    <div>
        <div class="lk-toolbar">
            <el-form :inline="true" :model="queryParams" ref="queryParams">
                <el-form-item label="用例名称"  prop="name">
                    <el-input size="small" clearable type="name" v-model.trim="queryParams.name" placeholder="接口名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="queryList"></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="danger" icon="el-icon-delete" @click="resetForm('queryParams')"></el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="lk-button">
            <el-button size="small" type="success" @click="addMenu">新增</el-button>
        </div>
        <el-table
                :data="tableData"
                v-loading="tableLoading"
                element-loading-text="拼命加载中"
                height="100%"
                border>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="test_name" min-width="150" label="用例名称"></el-table-column>
            <el-table-column prop="desc" min-width="150" label="用例描述"></el-table-column>
            <el-table-column prop="assertion" min-width="150" label="断言数据"></el-table-column>
            <el-table-column prop="creator.nick_name" min-width="150" label="创建人"></el-table-column>
            <el-table-column prop="add_time" min-width="150" label="创建时间"></el-table-column>
            <el-table-column label="操作" min-width="150">
                <template slot-scope="scope">
                    <el-button @click="editMenu(scope.row)" type="text">编辑</el-button>
                    <el-button @click="deleteApiData(scope.row)" type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @current-change="queryList"
                :current-page.sync="queryParams.currentPage"
                :page-size="20"
                :total="total"
                layout="->, total, prev, pager, next, jumper">
        </el-pagination>
        <add-dialog v-model="addDialogVisible" :dialogData="menuData"></add-dialog>
        <edit-dialog v-model="editDialogVisible" :dialogData='rowData'></edit-dialog>
    </div>
</template>

<script>
    import addDialog from './addDialog'
    import editDialog from "./editDialog";
    import {getCaseList,  deleteApi} from "../../../api/api";


    export default {
        data() {
            return {
                queryParams: {
                    name: null,
                    currentPage: 1
                },
                name: null,
                addDialogVisible: false,
                editDialogVisible: false,
                menuData: null,
                tableData: null,
                rowData: null,
                total: null,
                tableLoading: false,
                dbList: []
            }
        },
        components: {
            editDialog,
            addDialog
        },
        created() {
            this.queryList()
        },
        methods: {
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.queryList();
            },
            queryList() {
                this.tableLoading = true;
                getCaseList({ params: this.queryParams }).then((response) => {
                    this.tableLoading = false;
                    console.log(response.data.data);
                    this.tableData = response.data.data;
                    this.total = response.data.data.length;
                }).catch((error) => {
                    console.log(error.response.data)
                })
            },
            editMenu(row) {
                this.rowData = row;
                this.editDialogVisible = true
            },
            addMenu(row, editable) {
                this.menuData = row;
                this.menuData.editable = editable;
                this.addDialogVisible = true;
            },
            deleteApiData(row){
                this.$confirm(`确认删除${row.id}?`).then(_ => {
                    deleteApi({interface_id: row.id}).then((response) => {
                        console.log(response.data.code);
                        console.log(response.data.msg);
                        if(response.data.code === 1){
                            this.$message.success("删除成功");
                            this.queryList();
                        } else{
                            this.$message.error(response.data.msg)
                        }
                    })
                }).catch(_ => {})
            },
        }
    }
</script>
