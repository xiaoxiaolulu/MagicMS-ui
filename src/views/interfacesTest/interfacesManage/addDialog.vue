<template>
    <el-dialog title="Workspace" :visible.sync="addDialogVisible" center class="abow_dialog">
        <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData">
            <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">
                <el-row :gutter="10">
                    <el-col :span="3">
                        <el-form-item>
                            <el-select v-model="formData.request4" placeholder="请求方式" @change="checkRequest" value="">
                                <el-option v-for="(item,index) in request" :key="index+''" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-select v-model="formData.Http4" placeholder="HTTP协议" value="">
                                <el-option v-for="(item,index) in Http" :key="index+''" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='16'>
                        <el-form-item prop="addr">
                            <el-input v-model.trim="formData.addr" placeholder="地址" auto-complete=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='2'>
                        <el-button type="primary" @click="fastTest" :loading="loadingSend">发送</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-row :span="24">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item title="请求头部" name="1">
                        <el-table :data="formData.head" highlight-current-row ref="multipleHeadTable">
                            <el-table-column type="selection" min-width="5%" label="头部">
                            </el-table-column>
                            <el-table-column prop="name" label="标签" min-width="20%" sortable>
                                <template slot-scope="scope">
                                    <el-select placeholder="head标签" filterable v-model="scope.row.name" value="">
                                        <el-option v-for="(item,index) in header" :key="index+''" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
<!--                                    <el-input class="selectInput" v-model.trim="scope.row.name" :value="scope.row.name" placeholder="请输入内容"></el-input>-->
                                </template>
                            </el-table-column>
                            <el-table-column prop="value" label="内容" min-width="40%" sortable>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.value" :value="scope.row.value" placeholder="请输入内容"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="7%">
                                <template slot-scope="scope">
                                    <i class="el-icon-delete" style="font-size:30px;cursor:pointer;" @click="delHead(scope.$index)"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="" min-width="10%">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.$index===(formData.head.length-1)" size="mini" class="el-icon-plus" @click="addHead"></el-button>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="18%">
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                    <el-collapse-item title="请求参数" name="2">
                        <div style="margin: 5px">
                            <el-row :span="24">
                                <el-col :span="4"><el-radio v-model="radio" label="form-data">表单(form-data)</el-radio></el-col>
                                <el-col :span="4"><el-radio v-model="radio" label="raw" v-if="request3">源数据(raw)</el-radio></el-col>
                                <el-col v-show="request3" :span="16"><el-checkbox v-model="radioType" label="3" v-show="ParameterType">表单转源数据</el-checkbox></el-col>
                            </el-row>
                        </div>
                        <el-table ref="multipleParameterTable" :data="formData.parameter" highlight-current-row  @selection-change="selsChangeParameter">
                            <el-table-column type="selection" min-width="5%" label="头部">
                            </el-table-column>
                            <el-table-column prop="name" label="参数名" min-width="20%" sortable>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.name" :value="scope.row.name" placeholder="请输入参数值"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="value" label="参数值" min-width="40%" sortable>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.value" :value="scope.row.value" placeholder="请输入参数值"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="7%">
                                <template slot-scope="scope">
                                    <i class="el-icon-delete" style="font-size:30px;cursor:pointer;" @click="delParameter(scope.$index)"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="" min-width="10%">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.$index===(formData.parameter.length-1)" size="mini" class="el-icon-plus" @click="addParameter"></el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="" min-width="18%"></el-table-column>
                        </el-table>
                        <template>
                            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model.trim="formData.parameterRaw"></el-input>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import {createDbSetting} from "../../../api/api";

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
            return {
                request: [{value: 'get', label: 'GET'},
                    {value: 'post', label: 'POST'},
                    {value: 'put', label: 'PUT'},
                    {value: 'delete', label: 'DELETE'}],
                request3: true,
                Http: [{value: 'http', label: 'HTTP'},
                    {value: 'https', label: 'HTTPS'}],
                loadingSend: false,
                activeNames: ['1', '2', '3', '4'],
                head: [{name: "", value: ""},
                    {name: "", value: ""}],
                header: [{value: 'Accept', label: 'Accept'},
                    {value: 'Accept-Charset', label: 'Accept-Charset'},
                    {value: 'Accept-Encoding', label: 'Accept-Encoding'},
                    {value: 'Accept-Language', label: 'Accept-Language'},
                    {value: 'Accept-Ranges', label: 'Accept-Ranges'},
                    {value: 'Authorization', label: 'Authorization'},
                    {value: 'Cache-Control', label: 'Cache-Control'},
                    {value: 'Connection', label: 'Connection'},
                    {value: 'Cookie', label: 'Cookie'},
                    {value: 'Content-Length', label: 'Content-Length'},
                    {value: 'Content-Type', label: 'Content-Type'},
                    {value: 'Content-MD5', label: 'Content-MD5'},
                    {value: 'Date', label: 'Date'},
                    {value: 'Expect', label: 'Expect'},
                    {value: 'From', label: 'From'},
                    {value: 'Host', label: 'Host'},
                    {value: 'If-Match', label: 'If-Match'},
                    {value: 'If-Modified-Since', label: 'If-Modified-Since'},
                    {value: 'If-None-Match', label: 'If-None-Match'},
                    {value: 'If-Range', label: 'If-Range'},
                    {value: 'If-Unmodified-Since', label: 'If-Unmodified-Since'},
                    {value: 'Max-Forwards', label: 'Max-Forwards'},
                    {value: 'Origin', label: 'Origin'},
                    {value: 'Pragma', label: 'Pragma'},
                    {value: 'Proxy-Authorization', label: 'Proxy-Authorization'},
                    {value: 'Range', label: 'Range'},
                    {value: 'Referer', label: 'Referer'},
                    {value: 'TE', label: 'TE'},
                    {value: 'Upgrade', label: 'Upgrade'},
                    {value: 'User-Agent', label: 'User-Agent'},
                    {value: 'Via', label: 'Via'},
                    {value: 'Warning', label: 'Warning'}],
                radio: "form-data",
                radioType: "",
                ParameterType: true,
                parameters: "",
                formData: {
                    request4: 'POST',
                    Http4: 'HTTP',
                    addr: '',
                    head: [{name: "", value: ""},
                        {name: "", value: ""}],
                    parameter: [{name: "", value: "", required:"", restrict: "", description: ""},
                        {name: "", value: "", required:"", restrict: "", description: ""}],
                    parameterRaw: "",
                },
                resetRules: {
                },
                loading: false,
                title: '',
                addDialogVisible: false,
                activeName: 'second'
            }
        },
        watch: {
            value(val) {
                this.addDialogVisible = val;
                this.errors.clear();
                this.formData = { ...this.dialogData }
            },
            editDialogVisible(val) {
                this.$emit('input', val)
            }
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },

            checkRequest(){
                let request = this.formData.request4;
                this.request3 = !(request === "GET" || request === "DELETE");
            },

            fastTest() {
                console.log(this.formData.head)
            },

            handleChange(val) {
            },

            delHead(index) {
                if (this.formData.head.length !== 1) {
                    this.formData.head.splice(index, 1)
                }
            },

            addHead() {
                let headers = {name: "", value: ""};
                this.formData.head.push(headers);
                let rows = [this.formData.head[this.formData.head.length-1]];
                this.toggleHeadSelection(rows)
            },

            toggleHeadSelection(rows) {
                rows.forEach(row => {
                    this.$refs.multipleHeadTable.toggleRowSelection(row, true);
                });
            },

            selsChangeParameter: function (sels) {
                this.parameters = sels
            },

            delParameter(index) {
                if (this.formData.parameter.length !== 1) {
                    this.formData.parameter.splice(index, 1)
                }
            },

            toggleParameterSelection(rows) {
                rows.forEach(row => {
                    this.$refs.multipleParameterTable.toggleRowSelection(row, true);
                });
            },

            addParameter() {
                let headers = {name: "", value: "", required:"True", restrict: "", description: ""};
                this.formData.parameter.push(headers);
                let rows = [this.formData.parameter[this.formData.parameter.length-1]];
                this.toggleParameterSelection(rows)
            },

            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        createDbSetting({
                            name: this.formData.name,
                            db_type: this.formData.type,
                            db_user: this.formData.user,
                            db_password: this.formData.password,
                            db_host: this.formData.host,
                            db_port: this.formData.port,
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
