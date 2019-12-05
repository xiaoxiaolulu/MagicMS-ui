<template>
    <el-dialog title="Workspace" :visible.sync="editDialogVisible" center class="abow_dialog">
        <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData">
            <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">
                <el-row :gutter="20">
                    <el-col :span="3">
                        <el-form-item>
                            <role-select v-model="formData.id" name="id" data-vv-as="项目" v-validate="'required'">
                            </role-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-select v-model="formData.request4" placeholder="请求方式" @change="checkRequest" value="">
                                <el-option v-for="(item,index) in request" :key="index+''" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='15'>
                        <el-form-item prop="addr">
                            <el-row :gutter="2">
                                <el-col :span="22">
                                    <el-input v-model.trim="formData.addr" placeholder="地址" auto-complete=""></el-input>
                                </el-col>
                                <el-col :span="2">
                                    <el-button class="el-icon-refresh-left" @click="Refresh"
                                               :disabled="disabled"></el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span='3'>
                        <el-row :gutter="2">
                            <el-col :span="12">
                                <el-button type="primary" @click="fastTest('formData')" :loading="loadingSend">Send
                                </el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button :loading="loading" type="danger" @click="addInnerDialogVisible= true">Save
                                </el-button>
                                <el-dialog title="Save Request" center :visible.sync="addInnerDialogVisible"
                                           append-to-body>
                                    <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData"
                                             class="lk-form" label-position="right" label-width="100px">
                                        <el-form-item label="接口名称">
                                            <el-input v-model="formData.testName"></el-input>
                                        </el-form-item>
                                        <el-form-item label="接口描述">
                                            <el-input v-model="formData.desc"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button :loading="loading" type="primary"
                                                       @click="submitForm('formData')">确 认
                                            </el-button>
                                            <el-button @click="addInnerDialogVisible = false">取 消</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-dialog>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
            <el-row :span="24">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">
                        <el-collapse-item name="1">
                            <span class="collapse-title" slot="title">请求头部</span>
                            <el-table :data="formData.head" highlight-current-row ref="multipleHeadTable" border
                                      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                                <el-table-column type="selection" min-width="5%" label="头部">
                                </el-table-column>
                                <el-table-column prop="name" label="标签" min-width="20%">
                                    <template slot-scope="scope">
                                        <el-select placeholder="head标签" filterable v-model="scope.row.name" value="">
                                            <el-option v-for="(item,index) in header" :key="index+''"
                                                       :label="item.label"
                                                       :value="item.value"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="value" label="内容" min-width="40%">
                                    <template slot-scope="scope">
                                        <el-input v-model.trim="scope.row.value" :value="scope.row.value"
                                                  placeholder="请输入内容"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" min-width="7%">
                                    <template slot-scope="scope">
                                        <el-button class="el-icon-delete" @click="delHead(scope.$index)"
                                                   type="text"></el-button>
                                        <el-button v-if="scope.$index===(formData.head.length-1)" class="el-icon-plus"
                                                   @click="addHead" type="text"></el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="18%">
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                    </div>
                    <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">
                        <el-collapse-item name="2">
                            <span class="collapse-title" slot="title">请求参数</span>
                            <div style="margin: 5px">
                                <el-row :span="24">
                                    <el-col :span="4">
                                        <el-radio v-model="radio" label="form-data">表单(form-data)</el-radio>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-radio v-model="radio" label="raw" v-if="request3">源数据(raw)</el-radio>
                                    </el-col>
                                    <el-col v-show="request3" :span="16">
                                        <el-checkbox v-model="radioType" label="3" v-show="ParameterType">表单转源数据
                                        </el-checkbox>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-table ref="multipleParameterTable" :data="formData.parameter" highlight-current-row
                                      :class="ParameterType? 'parameter-a': 'parameter-b'"
                                      @selection-change="selsChangeParameter" border
                                      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                                <el-table-column type="selection" min-width="5%" label="头部">
                                </el-table-column>
                                <el-table-column prop="name" label="参数名" min-width="20%">
                                    <template slot-scope="scope">
                                        <el-input v-model.trim="scope.row.name" :value="scope.row.name"
                                                  placeholder="请输入参数值"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="value" label="参数值" min-width="40%">
                                    <template slot-scope="scope">
                                        <el-input v-model.trim="scope.row.value" :value="scope.row.value"
                                                  placeholder="请输入参数值"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" min-width="7%">
                                    <template slot-scope="scope">
                                        <el-button class="el-icon-delete" @click="delParameter(scope.$index)"
                                                   type="text"></el-button>
                                        <el-button v-if="scope.$index===(formData.parameter.length-1)"
                                                   class="el-icon-plus" @click="addParameter" type="text"></el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column label="" min-width="18%"></el-table-column>
                            </el-table>
                            <template>
                                <el-input :class="ParameterType? 'parameter-b': 'parameter-a'" type="textarea" :rows="5"
                                          placeholder="请输入内容" v-model.trim="formData.parameterRaw"></el-input>
                            </template>
                        </el-collapse-item>
                    </div>
                    <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">
                        <el-collapse-item name="3">
                            <span class="collapse-title" slot="title">响应结果</span>
                            <div style="margin-bottom: 10px">
                                <el-button @click="showBody">Body</el-button>
                                <el-button @click="showHeader">Head</el-button>
                                <div :class="formatJson? 'parameter-b': 'code-a'">
                                    Status: <span :class="formData.statusCode===200? 'green': 'red'" class="resultMsg">{{formData.statusCode}}</span>
                                    Times: <span class="resultMsg; green">{{formData.resultTimes}}s</span>
                                </div>

                            </div>
                            <el-card class="box-card">
                                <div v-model="formData.resultData" :class="resultShow? 'parameter-a': 'parameter-b'"
                                     v-show="!format">
                                    <div style="word-break: break-all;overflow:auto;overflow-x:hidden;">
                                        <json-viewer :value="formData.resultData" :expand-depth="5" copyable boxed sort
                                                     :class="formatJson? 'parameter-b': 'parameter-a'"></json-viewer>
                                    </div>
                                </div>
                                <div :class="resultShow? 'parameter-b': 'parameter-a'">
                                    <el-table :data="formData.resultHead" border v-if="headerTable">
                                        <el-table-column prop="name" label="KEY"></el-table-column>
                                        <el-table-column prop="value" label="VALUE"></el-table-column>
                                    </el-table>
                                </div>
                                <div :class="resultShow? 'parameter-a': 'parameter-b'"
                                     v-show="format && formData.resultData">
                                    <pre style="border: 1px solid #e6e6e6;word-break: break-all;overflow:auto;overflow-x:hidden">{{formData.resultData}}</pre>
                                </div>
                                <div v-show="!formData.resultData&&!formData.resultHead" class="raw">暂无数据</div>
                            </el-card>
                        </el-collapse-item>
                    </div>
                </el-collapse>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import {apiDebug, updateApi} from "../../../api/api";
    import roleSelect from '@/components/roleSelectProject'

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
                loadingSend: false,
                activeNames: ['1', '2', '3'],
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
                    id: "",
                    testName: "",
                    desc: "",
                    request4: 'POST',
                    addr: '',
                    head: [{name: "", value: ""},
                        {name: "", value: ""}],
                    parameter: [{name: "", value: "", required: "", restrict: "", description: ""}],
                    parameterRaw: "",
                    statusCode: "",
                    resultData: "",
                    resultHead: "",
                    resultTimes: "",
                },
                resetRules: {},
                loading: false,
                title: '',
                editDialogVisible: false,
                activeName: 'second',
                disabled: false,
                resultShow: true,
                format: false,
                formatJson: true,
                headerTable: false,
                addInnerDialogVisible: false,
            }
        },

        components: {
            roleSelect
        },

        watch: {
            value(val) {
                this.editDialogVisible = val;
                this.errors.clear();

                let editHeader = JSON.parse(this.$parent.rowData.headers);
                let editHeaderArray = [];
                for (var key in editHeader) {
                    editHeaderArray.push({name: key, value: editHeader[key]})
                }

                let params = JSON.parse(this.$parent.rowData.params);
                let paramsArray = [];
                for (var key in params) {
                    paramsArray.push({name: key, value: params[key], required: "", restrict: "", description: ""})
                }
                
                this.formData = {
                    addr: this.$parent.rowData.url,
                    testName: this.$parent.rowData.interface_name,
                    request4: this.$parent.rowData.method,
                    head: editHeaderArray,
                    parameter: paramsArray,
                    id: this.$parent.rowData.project.name,
                    desc: this.$parent.rowData.desc
                }
            },

            editDialogVisible(val) {
                this.$emit('input', val)
            },

            radio() {
                this.changeParameterType()
            },

        },

        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },

            checkRequest() {
                let request = this.formData.request4;
                this.request3 = !(request === "GET" || request === "DELETE");
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
                let rows = [this.formData.head[this.formData.head.length - 1]];
                this.toggleHeadSelection(rows)
            },

            // toggleHeadSelection(rows) {
            //
            //     this.$nextTick(function () {
            //         rows.forEach(row => {
            //             this.$refs.multipleHeadTable.toggleRowSelection(row, true);
            //         })
            //     })
            //
            // },

            selsChangeParameter: function (sels) {
                this.parameters = sels
            },

            delParameter(index) {
                if (this.formData.parameter.length !== 1) {
                    this.formData.parameter.splice(index, 1)
                }
            },

            // toggleParameterSelection(rows) {
            //     rows.forEach(row => {
            //         this.$refs.multipleParameterTable.toggleRowSelection(row, true);
            //     });
            // },

            addParameter() {
                let headers = {name: "", value: "", required: "True", restrict: "", description: ""};
                this.formData.parameter.push(headers);
                let rows = [this.formData.parameter[this.formData.parameter.length - 1]];
                this.toggleParameterSelection(rows)
            },

            changeParameterType() {
                if (this.radio === 'form-data') {
                    this.ParameterType = !this.ParameterType
                } else {
                    this.ParameterType = !this.ParameterType
                }
            },

            showBody() {
                this.resultShow = true
            },
            showHeader() {
                this.resultShow = false
            },

            fastTest(formName) {
                // 请求路由
                let _route = this.formData.addr.indexOf('?') === -1 ? this.formData.addr : this.formData.addr.split('?')[0];

                // 请求头部
                let headers = {};
                for (let i = 0; i < this.formData.head.length; i++) {
                    var a = this.formData.head[i]["name"];
                    if (a) {
                        headers[a] = this.formData.head[i]["value"]
                    }
                }

                // 请求参数
                let _type = this.radio;
                let _parameter = this.formData.request4 === 'get' ? "" : {};

                if (this.formData.request4 === 'get') {
                    let arrParams = [];
                    for (let i = 0; i < this.formData.parameter.length; i++) {
                        try {
                            var a = this.formData.parameter[i]['name'];
                            var b = this.formData.parameter[i]['value'];
                            arrParams.push(a + '=' + b);
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    var getParams = (arrParams).join("&");
                    _parameter += getParams;

                } else {
                    for (let i = 0; i < this.formData.parameter.length; i++) {
                        var a = this.formData.parameter[i]["name"];
                        if (a) {
                            _parameter[a] = this.formData.parameter[i]["value"];
                        }
                    }
                    _parameter = JSON.stringify(_parameter);
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        apiDebug({
                            url: _route,
                            method: this.formData.request4,
                            headers: JSON.stringify(headers),
                            params: _parameter,
                            project: this.formData.id
                        }).then((response) => {
                            console.log(response.data);
                            this.loadingSend = false;
                            this.formatJson = false;
                            this.headerTable = true;
                            this.formData.statusCode = response.data.data.status_code;
                            this.formData.resultTimes = response.data.data.times;
                            this.formData.resultData = JSON.stringify(response.data.data.response_body, null, 4);
                            this.formData.resultHead = this.formData.head;
                            this.$message({message: response.data.msg, type: 'success'})
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
                    }
                })

            },

            Refresh() {
                if (this.formData.addr.indexOf('?') !== -1) {
                    this.disabled = true;
                    delete this.formData.parameter[0];
                    let getUrlParams = this.formData.addr.split('?')[1].split("&");
                    for (let i = 0; i < getUrlParams.length; i++) {
                        let headers = {
                            name: getUrlParams[i].split("=")[0],
                            value: getUrlParams[i].split("=")[1],
                            required: "True",
                            restrict: "",
                            description: ""
                        };
                        this.formData.parameter.push(headers);
                        let rows = [this.formData.parameter[this.formData.parameter.length - 1]];
                        this.toggleParameterSelection(rows)
                    }
                }
            },
            submitForm(formName) {

                // 请求路由
                let _route = this.formData.addr.indexOf('?') === -1 ? this.formData.addr : this.formData.addr.split('?')[0];

                // 请求头部
                let headers = {};
                for (let i = 0; i < this.formData.head.length; i++) {
                    var a = this.formData.head[i]["name"];
                    if (a) {
                        headers[a] = this.formData.head[i]["value"]
                    }
                }

                // 请求参数
                let _type = this.radio;
                let _parameter = this.formData.request4 === 'get' ? "" : {};

                if (this.formData.request4 === 'get') {
                    let arrParams = [];
                    for (let i = 0; i < this.formData.parameter.length; i++) {
                        try {
                            var a = this.formData.parameter[i]['name'];
                            var b = this.formData.parameter[i]['value'];
                            arrParams.push(a + '=' + b);
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    var getParams = (arrParams).join("&");
                    _parameter += getParams;

                } else {
                    for (let i = 0; i < this.formData.parameter.length; i++) {
                        var a = this.formData.parameter[i]["name"];
                        if (a) {
                            _parameter[a] = this.formData.parameter[i]["value"];
                        }
                    }
                    _parameter = JSON.stringify(_parameter);
                }

                // 接口名称判断
                let testName = this.formData.testName === "" ? _route : this.formData.testName;

                this.$refs[formName].validate((valid) => {

                    if (valid) {
                        updateApi({
                            interface_id: this.$parent.rowData.id,
                            url: _route,
                            interface_name: testName,
                            method: this.formData.request4,
                            headers: JSON.stringify(headers),
                            params: _parameter,
                            project: this.formData.id,
                            desc: this.formData.desc
                        }).then((response) => {
                            console.log(response.data);
                            this.editDialogVisible = false;
                            this.addInnerDialogVisible = false
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
        },

        // mounted() {
        //     this.toggleHeadSelection(this.formData.head);
        //     this.toggleParameterSelection(this.formData.parameter);
        // }
    }
</script>

<style>
    .parameter-a {
        display: block;
    }

    .parameter-b {
        display: none;
    }

    .code-a {
        float: right;
        display: inline-block;
    }

    .resultMsg {
        margin-right: 20px;
    }

    .red {
        color: red;
        font-size: 15px;
    }

    .green {
        color: lightgreen;
        font-size: 15px;

    }

    .collapse-title {
        flex: 1 0 90%;
        order: 1;
    }

    .el-collapse-item__header {
        flex: 1 0 auto;
        order: -1;
    }
</style>
