<template>
    <div>
        <div class="lk-toolbar">
            <el-button size="small" type="success" @click="addMenu(null)">添加项目</el-button>
        </div>
        <el-table
                :data="tableData"
                v-loading="tableLoading"
                element-loading-text="拼命加载中"
                height="100%"
                border>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="name" min-width="150" label="项目名称"></el-table-column>
            <el-table-column prop="creator.nick_name" min-width="150" label="创建人"></el-table-column>
            <el-table-column prop="env.name" min-width="150" label="环境名"></el-table-column>
            <el-table-column prop="env.host_address" min-width="150" label="环境地址"></el-table-column>
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
        <add-dialog v-model="addDialogVisible" :dialogData="rowData"></add-dialog>
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
        },
        editMenu(row) {
            this.rowData = row;
            this.editDialogVisible = true
        },
        addMenu(row) {
            this.rowData = row;
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
        }
    }
}
</script>
