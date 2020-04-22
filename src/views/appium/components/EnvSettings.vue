<template>
  <div style="margin-right:50px;padding-left:50px;padding-top:50px; height:500px">
    <split-pane split="vertical"
      resize
      :min-percent='20'
      :default-percent='20'>
      <template slot="paneL">
        <div>
          <label>环境列表</label>
          <el-button type="text"
            style="float: right"></el-button>
          <el-table :data="tableData"
            style="width: 100%">
            <el-table-column prop="date"
              width="150px">
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template slot="paneR">
        <div style="margin-right:10px;padding-left:10px;padding-top:10px;">
          <el-form>
            <el-form-item>
              <MDinput v-model="
          envName"
                :maxlength="100"
                required>
                环境名称
              </MDinput>
            </el-form-item>
            <el-form-item>
              <label>环境域名</label></br>
              <el-select style="width:100px"
                v-model="envProtocol"></el-select>
              <el-input style="width:300px"
                v-model="envUrl"
                placeholder="ip:port"></el-input>
            </el-form-item>
            <el-form-item>
              <label>Header</label></br>
              <el-input style="width:200px"
                v-model="envHeaderKey"
                placeholder="请输入参数名称"></el-input>
              <el-input style="width:300px"
                v-model="envHeaderValue"
                placeholder="请输入参数值"></el-input>
              <el-button type="text">
                <i class="el-icon-delete" /></el-button>
              <el-button type="text">+</el-button>
            </el-form-item>
            <div style="text-align: center">
              <el-button type="success">保存</el-button>
              <el-button>取消</el-button>
            </div>
          </el-form>

        </div>

      </template>
    </split-pane>
  </div>
</template>

<style>
</style>

<script>
import splitPane from 'vue-splitpane'
import MDinput from '@/components/MDinput'
export default {
  name: 'EnvSettings',
  components: { splitPane, MDinput },
  data: {},
  methods: {}
}
</script>