<template>
    <el-select size="small" v-model="currentValue" v-loading="loading" element-loading-spinner="el-icon-loading" clearable filterable>
        <template v-if="roles">
            <el-option v-for="item in roles" :key="item.id" :label="item.interface_name" :value="item.id">
                {{item.interface_name}}
            </el-option>
        </template>
    </el-select>
</template>

<script>
import {getApiList} from "../../api/api";

export default {
    props: {
        value: {
            default: ''
        }
    },
    data() {
        return {
            loading: false,
            roles: "",
            currentValue: ''
        }
    },
    watch: {
        value: function (val) {
            this.currentValue = val
        },
        currentValue: function (val) {
            this.$emit('input', val)
        }
    },
    methods: {
        queryRoles() {
            this.loading = true;
            getApiList({ params: { name: this.name} }).then((res) => {
                this.loading = false;
                this.roles = res.data.data;
                console.log(res.data.data)
            }).catch((error) => {
                this.loading = false;
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: error.msg
                })
            })
        }
    },
    created() {
        this.queryRoles()
    }
}
</script>
