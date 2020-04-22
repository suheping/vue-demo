<template>
  <div style="margin-right:20px;padding-left:20px;padding-top:10px;">
    <!-- 选择运行环境 -->
    <el-tag size="max">运行环境：</el-tag>
    <el-select size="small"></el-select>

    <!-- 设置运行环境 -->
    <el-button size="small"
      @click="settingsDialogVisible=true">设置运行环境</el-button>
    <el-dialog :visible.sync="settingsDialogVisible"
      title="设置运行环境"
      close="settingsDialogVisible=false">
      <EnvSettings></EnvSettings>
    </el-dialog>
    <!-- 运行按钮 -->
    <el-button style="float: right;"
      type="success">运行</el-button>
  </div>
</template>



<script>
import EnvSettings from './EnvSettings'
export default {
  name: 'ApiHeader',
  components: { EnvSettings },
  data() {
    return {
      settingsDialogVisible: false
    }
  },
  methods: {}
}
</script>

<style>
</style>