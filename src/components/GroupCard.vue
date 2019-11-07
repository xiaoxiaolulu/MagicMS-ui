<template>
  <el-card :body-style="{ padding: '4px' }" class="group-card" shadow="hover">
    <img :src="group.cover" class="image" @click="handleClick"/>
    <div style="padding: 14px;">
      <span>{{group.name}}</span>
      <div class="bottom clearfix">
        <span class="info">成员: {{group.member_nums}}人</span>
        <span class="info">帖子: {{group.post_nums}}个</span>
        <el-button type="text" class="button" @click="handleAddGroup">加入小组</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: 'GroupCard',
    props: {
      group: Object
    },
    data () {
      return {
        currentDate: new Date()
      }
    },
    methods: {
      handleAddGroup () {
        this.$emit('add_group', { group_id: this.group.id, group_name: this.group.name })
      },
      handleClick () {
        this.$router.push({ name: 'group_detail', params: { id: this.group.id } })
      }
    }
  }
</script>

<style scoped>
  .group-card {
    margin-bottom: 16px;
  }
  .info {
    margin-right: 8px;
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 200px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
