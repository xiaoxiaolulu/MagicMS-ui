<template>
    <el-dialog title="Workspace" :visible.sync="addDialogVisible" center class="abow_dialog">
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
                    <el-col :span='2'>
                        <el-button type="primary" @click="fastTest('formData')" :loading="loadingSend">发送</el-button>
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
                                        <el-option v-for="(item,index) in header" :key="index+''" :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                    <!--                                    <el-input class="selectInput" v-model.trim="scope.row.name" :value="scope.row.name" placeholder="请输入内容"></el-input>-->
                                </template>
                            </el-table-column>
                            <el-table-column prop="value" label="内容" min-width="40%" sortable>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.value" :value="scope.row.value"
                                              placeholder="请输入内容"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="7%">
                                <template slot-scope="scope">
                                    <i class="el-icon-delete" style="font-size:30px;cursor:pointer;"
                                       @click="delHead(scope.$index)"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="" min-width="10%">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.$index===(formData.head.length-1)" size="mini"
                                               class="el-icon-plus" @click="addHead"></el-button>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="18%">
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                    <el-collapse-item title="请求参数" name="2">
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
                                  @selection-change="selsChangeParameter">
                            <el-table-column type="selection" min-width="5%" label="头部">
                            </el-table-column>
                            <el-table-column prop="name" label="参数名" min-width="20%" sortable>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.name" :value="scope.row.name"
                                              placeholder="请输入参数值"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="value" label="参数值" min-width="40%" sortable>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.value" :value="scope.row.value"
                                              placeholder="请输入参数值"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="7%">
                                <template slot-scope="scope">
                                    <i class="el-icon-delete" style="font-size:30px;cursor:pointer;"
                                       @click="delParameter(scope.$index)"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="" min-width="10%">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.$index===(formData.parameter.length-1)" size="mini"
                                               class="el-icon-plus" @click="addParameter"></el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="" min-width="18%"></el-table-column>
                        </el-table>
                        <template>
                            <el-input :class="ParameterType? 'parameter-b': 'parameter-a'" type="textarea" :rows="5"
                                      placeholder="请输入内容" v-model.trim="formData.parameterRaw"></el-input>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import {apiDebug} from "../../../api/api";
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
                    id: "",
                    request4: 'POST',
                    addr: '',
                    head: [{name: "", value: ""},
                        {name: "", value: ""}],
                    parameter: [{name: "", value: "", required: "", restrict: "", description: ""}],
                    parameterRaw: "",
                },
                resetRules: {},
                loading: false,
                title: '',
                addDialogVisible: false,
                activeName: 'second',
                disabled: false
            }
        },

        components: {
            roleSelect
        },

        watch: {
            value(val) {
                this.addDialogVisible = val;
                this.errors.clear();
                this.formData = {...this.dialogData}
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

            toggleHeadSelection(rows) {
                rows.forEach(row => {
                    this.$refs.multipleHeadTable.toggleRowSelection(row, true);
                });
            },

            selsChangeParameter: function (sels) {
                this.parameters = sels
            },

            delParameter(index) {
                console.log("我就测试一下" + ":" + index);
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
                    console.log("测试")
                    console.log(_parameter)
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
                        }).catch((err) => {
                            if (err.response.status === 400) {
                                if (err.response.data.code) {
                                    this.$message({message: err.response.data.code, type: 'error'})
                                }
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
        },

        mounted() {
            this.toggleHeadSelection(this.form.head);
            this.toggleParameterSelection(this.form.parameter);
        }
    }
</script>

<style>
    .parameter-a {
        display: block;
    }

    .parameter-b {
        display: none;
    }
</style>
