<template>
    <el-select v-model="currentValue" v-loading="loading" element-loading-spinner="el-icon-loading" clearable filterable>
        <template v-if="roles">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
                {{ item.name }}
            </el-option>
        </template>
    </el-select>
</template>

<script>
import {getDbSettingList} from "../../api/api";

export default {
    props: {
        value: {
            default: ''
        }
    },
    data() {
        return {
            loading: false,
            roles: null,
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
            getDbSettingList({ params: { name: this.name} }).then((res) => {
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
