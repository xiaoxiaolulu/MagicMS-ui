<template>
    <el-dialog title="Collections" :visible.sync="addDialogVisible" center class="abow_dialog">
        <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData">
            <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-row :gutter="2">
                            <el-col :span="2">
                                <el-form-item label="Name">
                                </el-form-item>
                            </el-col>
                            <el-col :span="22">
                                <el-form-item>
                                    <el-input size="small" v-model.trim="formData.testName" placeholder="用例名称" auto-complete=""></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="4">
                        <el-row :gutter="2">
                            <el-col :span="12">
                                <el-form-item>
                                    <el-button size="small" type="primary" @click="fastTest('formData')" :loading="loadingSend">Send</el-button>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item>
                                    <el-button size="small" :loading="loading" type="danger" @click="addInnerDialogVisible= true">Save</el-button>
                                    <el-dialog title="Save Collections" center  :visible.sync="addInnerDialogVisible" append-to-body>
                                        <el-form autoComplete="on" :model="formData" :rules="resetRules" ref="formData" class="lk-form" label-position="right" label-width="100px">
                                            <el-form-item label="用例描述">
                                                <el-input v-model="formData.desc"></el-input>
                                            </el-form-item>
                                            <el-form-item>
                                                <el-button :loading="loading" type="primary" @click="submitForm('formData')">确 认</el-button>
                                                <el-button @click="addInnerDialogVisible = false">取 消</el-button>
                                            </el-form-item>
                                        </el-form>
                                    </el-dialog>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
            <el-row :span="24">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">
                        <el-collapse-item name="1">
                            <span class="collapse-title" slot="title">接口配置</span>
                            <el-table :data="formData.api" highlight-current-row ref="multipleHeadTable" border :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                                <el-table-column type="selection" min-width="5%" label="头部">
                                </el-table-column>
                                <el-table-column prop="name" label="接口" min-width="20%">
                                    <template slot-scope="scope">
                                        <api-select size="small" v-model.trim="scope.row.name" :value="scope.row.name" data-vv-as="接口">
                                        </api-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="priority" label="优先级" min-width="40%">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model.trim="scope.row.priority" :value="scope.row.priority"
                                                  placeholder="请输入内容"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="setUp" label="是否前置条件" min-width="40%">
                                    <template slot-scope="scope">
                                        <el-checkbox size="mini" v-model.trim="scope.row.setUp" :value="scope.row.setUp">
                                        </el-checkbox>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" min-width="7%">
                                    <template slot-scope="scope">
                                        <el-button size="small" class="el-icon-delete" @click="delApi(scope.$index)" type="text"></el-button>
                                        <el-button size="small" v-if="scope.$index===(formData.api.length-1)" class="el-icon-plus" @click="addApi" type="text"></el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="18%">
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                    </div>
                    <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">
                        <el-collapse-item name="2">
                            <span class="collapse-title" slot="title">断言</span>
                            <div style="margin: 5px">
                                <el-row :span="24">
                                    <el-col :span="4">
                                        <el-radio size="mini" v-model="radio" label="form-data">response-check</el-radio>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-radio size="mini" v-model="radio" label="raw" v-if="request3">db-check</el-radio>
                                    </el-col>
<!--                                    <el-col v-show="request3" :span="16">-->
<!--                                        <el-checkbox size="mini" v-model="radioType" label="3" v-show="ParameterType">to-json-->
<!--                                        </el-checkbox>-->
<!--                                    </el-col>-->
                                </el-row>
                            </div>
                            <el-table ref="multipleParameterTable" :data="formData.assertion" highlight-current-row
                                      :class="ParameterType? 'parameter-a': 'parameter-b'"
                                      @selection-change="selsChangeAssertion" border :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                                <el-table-column type="selection" min-width="5%" label="头部">
                                </el-table-column>
                                <el-table-column prop="name" label="key" min-width="20%">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model.trim="scope.row.name" :value="scope.row.name"
                                                  placeholder="请输入断言的键"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="comparetor" label="comparetor" min-width="20%">
                                    <template slot-scope="scope">
                                        <el-select size="small" placeholder="请选择校验器" filterable v-model.trim="scope.row.comparetor" :value="scope.row.comparetor">
<!--                                            EQU - 等于-->
<!--                                            NEQ - 不等于-->
<!--                                            LSS - 小于-->
<!--                                            LEQ - 小于或等于-->
<!--                                            GTR - 大于-->
<!--                                            GEQ - 大于或等于-->
                                            <el-option v-for="(item,index) in comparetor" :key="index+''" :label="item.label"
                                                       :value="item.value"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="value" label="value" min-width="40%">
                                    <template slot-scope="scope">
                                        <el-input  size="small" v-model.trim="scope.row.value" :value="scope.row.value"
                                                   placeholder="请输入断言的值"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" min-width="7%">
                                    <template slot-scope="scope">
                                        <el-button size="small" class="el-icon-delete" @click="delAssertion(scope.$index)" type="text"></el-button>
                                        <el-button size="small"  v-if="scope.$index===(formData.assertion.length-1)" class="el-icon-plus" @click="addAssertion" type="text"></el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column label="" min-width="18%"></el-table-column>
                            </el-table>
                            <template>
                                <el-table ref="multipleParameterTable" :data="formData.dbCheck" highlight-current-row
                                          :class="ParameterType? 'parameter-b': 'parameter-a'"
                                          @selection-change="selsChangeDb" border :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                                    <el-table-column type="selection" min-width="5%" label="头部">
                                    </el-table-column>
                                    <el-table-column prop="db" label="db-setting" min-width="20%">
                                        <template slot-scope="scope">
                                            <db-select size="small" v-model.trim="scope.row.db" :value="scope.row.db" data-vv-as="数据库">
                                            </db-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="key" min-width="20%">
                                        <template slot-scope="scope">
                                            <el-input size="small" v-model.trim="scope.row.name" :value="scope.row.name"
                                                      placeholder="请输入断言的键"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="comparetor" label="comparetor" min-width="20%">
                                        <template slot-scope="scope">
                                            <el-select size="small" placeholder="请选择校验器" filterable v-model.trim="scope.row.comparetor" :value="scope.row.comparetor">
                                                <!--                                            EQU - 等于-->
                                                <!--                                            NEQ - 不等于-->
                                                <!--                                            LSS - 小于-->
                                                <!--                                            LEQ - 小于或等于-->
                                                <!--                                            GTR - 大于-->
                                                <!--                                            GEQ - 大于或等于-->
                                                <el-option v-for="(item,index) in comparetor" :key="index+''" :label="item.label"
                                                           :value="item.value"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="value" label="value" min-width="40%">
                                        <template slot-scope="scope">
                                            <el-input  size="small" v-model.trim="scope.row.value" :value="scope.row.value"
                                                       placeholder="请输入断言的值"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" min-width="7%">
                                        <template slot-scope="scope">
                                            <el-button size="small" class="el-icon-delete" @click="delDb(scope.$index)" type="text"></el-button>
                                            <el-button size="small"  v-if="scope.$index===(formData.dbCheck.length-1)" class="el-icon-plus" @click="addDb" type="text"></el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="" min-width="18%"></el-table-column>
                                </el-table>
                            </template>
                        </el-collapse-item>
                    </div>
                </el-collapse>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import {createCase} from "../../../api/api";
    import apiSelect from '@/components/roleSelectApi'
    import dbSelect from '@/components/roleSelectDb'

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
                api: [{name: "", priority: "", setUp:""}],
                comparetor: [{value: 'EQU ', label: 'EQU'},
                    {value: 'NEQ ', label: 'NEQ'},
                    {value: 'LSS', label: 'LSS'},
                    {value: 'LEQ', label: 'LEQ'},
                    {value: 'GTR', label: 'GTR'},
                    {value: 'GEQ', label: 'GEQ'}],
                radio: "form-data",
                radioType: "",
                ParameterType: true,
                assertion: "",
                dbCheck: "",
                formData: {
                    testName: "",
                    desc: "",
                    request4: 'POST',
                    addr: '',
                    api: [{name: "", priority: "", setUp:""}],
                    assertion: [{name: "", comparetor: "", value: ""}],
                    dbCheck: [{db: "", name: "", comparetor: "", value: ""}],
                },
                resetRules: {},
                loading: false,
                title: '',
                addDialogVisible: false,
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
            apiSelect,
            dbSelect
        },

        watch: {
            value(val) {
                this.addDialogVisible = val;
                this.errors.clear();
                // this.formData = {...this.dialogData}
            },
            addDialogVisible(val) {
                this.$emit('input', val)
            },

            radio() {
                this.changeAssertionType()
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

            delApi(index) {
                if (this.formData.api.length !== 1) {
                    this.formData.api.splice(index, 1)
                }
            },

            addApi() {
                let api = {name: "", priority: "", setUp:""};
                this.formData.api.push(api);
                let rows = [this.formData.api[this.formData.api.length - 1]];
                this.toggleHeadSelection(rows)
            },

            // toggleHeadSelection(rows) {
            //     rows.forEach(row => {
            //         this.$refs.multipleHeadTable.toggleRowSelection(row, true);
            //     });
            // },

            selsChangeAssertion: function (sels) {
                this.assertion = sels
            },

            selsChangeDb: function (sels) {
                this.dbCheck = sels
            },

            delAssertion(index) {
                if (this.formData.assertion.length !== 1) {
                    this.formData.assertion.splice(index, 1)
                }
            },

            // toggleParameterSelection(rows) {
            //     rows.forEach(row => {
            //         this.$refs.multipleParameterTable.toggleRowSelection(row, true);
            //     });
            // },

            addAssertion() {
                let assertion = {name: "", comparetor: "", value: ""};
                this.formData.assertion.push(assertion);
                let rows = [this.formData.assertion[this.formData.assertion.length - 1]];
                this.toggleParameterSelection(rows)
            },

            delDb(index) {
                if (this.formData.dbCheck.length !== 1) {
                    this.formData.dbCheck.splice(index, 1)
                }
            },

            addDb() {
                let db = {db:"", name: "", comparetor: "", value: ""};
                this.formData.dbCheck.push(db);
                let rows = [this.formData.dbCheck[this.formData.dbCheck.length - 1]];
                this.toggleParameterSelection(rows)
            },
            changeAssertionType() {
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
            submitForm (formName){

                // 断言参数
                let _assertionContents = [];
                let assertionContent = this.formData.assertion;
                for (let i = 0; i < assertionContent.length; i++) {
                    var assertionKey = assertionContent[i]['name'];
                    var assertionCom = assertionContent[i]['comparetor'];
                    var assertionVal = assertionContent[i]['value'];
                    _assertionContents.push(
                        {
                            "name": assertionKey,
                            "comparetor": assertionCom,
                            "value": assertionVal
                        }
                    );
                }

                // 接口配置
                let _apiSet = [];
                let apiSetting = this.formData.api;
                for (let i = 0; i <apiSetting.length ; i++) {
                    var apiIndex = apiSetting[i]['name'];
                    var apipriority = apiSetting[i]['priority'];
                    var apiSetUp = apiSetting[i]['setUp'];
                    _apiSet.push(apiIndex);
                }

                // 落库校验
                let _checkDbSet = [];
                let dbCheck = this.formData.dbCheck;
                for (let i = 0; i < dbCheck.length ; i++) {
                    var dbIndex = dbCheck[i]['db'];
                    var assertSqlKey = dbCheck[i]['name'];
                    var assertSqlCom = dbCheck[i]['comparetor'];
                    var assertSqlVal = dbCheck[i]['value'];
                    _checkDbSet.push(
                        {
                            "db": dbIndex,
                            "assertSql": {
                                "assertKey": assertSqlKey,
                                "assertCom": assertSqlCom,
                                "assertVal": assertSqlVal
                            }
                        }
                    )
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        createCase({
                            test_name: this.formData.testName,
                            assertion: _assertionContents,
                            interfaces: _apiSet,
                            db_check: _checkDbSet,
                            desc: this.formData.desc
                        }).then((response) => {
                            console.log(response.data);
                            this.addDialogVisible = false;
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
