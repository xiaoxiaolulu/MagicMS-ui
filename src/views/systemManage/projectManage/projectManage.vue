<template>
    <div>
        <div class="lk-toolbar">
            <el-button size="small" type="success" @click="addMenu">添加项目</el-button>
        </div>
        <el-table
                :data="tableData.slice((queryParams.currentPage-1)*20,queryParams.currentPage*20)" :row-class-name="tableRowClassName"
                v-loading="tableLoading"
            element-loading-text="拼命加载中"
            height="100%"
            border>
            <el-table-column type="expand" >
                <template slot-scope="props">
                    <el-table border :data="props.row.env" :row-class-name="tableRowClassName">
                        <el-table-column prop="name" label="测试环境"></el-table-column>
                        <el-table-column prop="host_address" label="测试地址"></el-table-column>
                    </el-table>
                    <el-table border :data="props.row.children" style="margin-top: 10px" :row-class-name="tableRowClassName">
                        <el-table-column prop="db_setting.name" label="数据库"></el-table-column>
                        <el-table-column prop="db_setting.db_type" label="类型"></el-table-column>
                        <el-table-column prop="db_setting.db_user" label="账号"></el-table-column>
                        <el-table-column prop="db_setting.db_password" label="密码"></el-table-column>
                        <el-table-column prop="db_setting.db_host" label="地址"></el-table-column>
                        <el-table-column prop="db_setting.db_port" label="端口"></el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="name" min-width="150" label="项目名称"></el-table-column>
            <el-table-column prop="creator.nick_name" min-width="150" label="创建人"></el-table-column>
            <el-table-column prop="env.name" min-width="150" label="环境"></el-table-column>
            <el-table-column prop="db_setting.name" min-width="150" label="数据库"></el-table-column>
            <el-table-column prop="desc" min-width="150" label="项目描述"></el-table-column>
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
import {getProjectList, deleteProject} from "../../../api/api";


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
            projectList: [],
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
            getProjectList({ params: { name: this.name} }).then((response) => {
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
              deleteProject({project_id: row.id}).then((response) => {
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
        tableRowClassName({ row, rowIndex }) {
            if (row.disabled) {
                return 'disabled-row'
            } else {
                return ''
            }
        }
    }
}
</script>
