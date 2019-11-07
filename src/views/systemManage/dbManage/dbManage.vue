<template>
    <div>
        <div class="lk-toolbar">
            <el-button size="small" type="success" @click="addMenu">添加数据库配置</el-button>
        </div>
        <el-table
                :data="tableData.slice((queryParams.currentPage-1)*20,queryParams.currentPage*20)"
                v-loading="tableLoading"
                element-loading-text="拼命加载中"
                height="100%"
                border>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="name" min-width="150" label="数据库名称"></el-table-column>
            <el-table-column prop="db_type" min-width="150" label="数据库类型"></el-table-column>
            <el-table-column prop="db_user" min-width="150" label="数据库账号"></el-table-column>
            <el-table-column prop="db_password" min-width="150" label="数据库密码"></el-table-column>
            <el-table-column prop="db_host" min-width="150" label="数据库IP"></el-table-column>
            <el-table-column prop="db_port" min-width="150" label="数据库端口号"></el-table-column>
            <el-table-column prop="desc" min-width="150" label="数据库描述"></el-table-column>
            <el-table-column prop="creator.nick_name" min-width="150" label="创建人"></el-table-column>
            <el-table-column prop="add_time" min-width="150" label="创建时间"></el-table-column>
            <el-table-column label="操作" min-width="150">
                <template slot-scope="scope">
                    <el-button @click="editMenu(scope.row)" type="text">编辑</el-button>
                    <el-button @click="deleteProjectData(scope.row)" type="text">删除</el-button>
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
    import {getDbSettingList, deleteDbSetting} from "../../../api/api";


    export default {
        data() {
            return {
                queryParams: {
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
            queryList() {
                this.tableLoading = true;
                getDbSettingList({ params: { name: this.name} }).then((response) => {
                    this.tableLoading = false;
                    console.log(response.data.data);
                    this.tableData = response.data.data;
                    this.total = response.data.data.length;
                }).catch((error) => {
                    console.log(error.response.data)
                })
                // this.$apis.queryApp(this.queryParams).then(res => {
                //     this.tableLoading = false
                //     if (res.code === '2000') {
                //         this.tableData = res.data.list
                //         this.total = res.data.total
                //     } else {
                //         this.$message.error(res.message)
                //     }
                // }).catch(error => {
                //     this.tableLoading = false
                //     this.$message.error(error)
                // })
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
            deleteProjectData(row){
                this.$confirm(`确认删除${row.id}?`).then(_ => {
                    deleteDbSetting({db_id: row.id}).then((response) => {
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
