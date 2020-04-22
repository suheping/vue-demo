<template>
  <div style="margin-right:50px;padding-left:50px;padding-top:50px;">
    <!-- <p>欢迎打开appium菜单</p> -->
    <!-- <div style="line-height:20px"> -->
    <el-form ref="postForm"
      :rules="rules"
      :model="postForm">
      <!-- 发送请求按钮 -->
      <el-button style="margin-left: 10px;"
        type="success"
        @click="submitForm">
        发送请求
      </el-button>
      <!-- 保存按钮 -->
      <el-button style="margin-left: 10px;"
        type="success"
        @click="saveForm">
        保存
      </el-button>
      <!-- 接口名称输入框 -->
      <el-form-item prop="apiName">
        <MDinput v-model="postForm.apiName"
          :maxlength="100"
          required>
          接口名称
        </MDinput>
      </el-form-item>
      <!-- 选择协议类型 -->
      <el-form-item label="协议类型"
        prop="apiProtocol">
        <el-select v-model="postForm.apiProtocol"
          filterable
          default-first-option
          remote
          required>
          <el-option v-for="item in protocols"
            :key="item"
            :label="item"
            :value="item"
            :disabled="item.disabled" />
        </el-select>
      </el-form-item>
      <!-- 选择方法 -->
      <el-form-item label="接口方法"
        prop="apiMethod">
        <el-select v-model="postForm.apiMethod"
          filterable
          default-first-option
          remote
          required>
          <el-option v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
            :disabled="item.disabled" />
        </el-select>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;"
        prop="apiPath">
        <MDinput v-model="postForm.apiPath"
          :maxlength="100"
          required>
          path
        </MDinput>
      </el-form-item>
      <!-- <input type="text" v-model="url" placeholder="请输入url" /> -->
      <el-form-item style="margin-bottom: 40px;"
        prop="headers">
        <label>headers:</label>
        <json-editor ref="jsonEditor"
          v-model="postForm.apiHeaders" />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;"
        prop="params">
        <label>params:</label>
        <json-editor ref="jsonEditor"
          v-model="postForm.apiQuerys" />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;"
        prop="body">
        <label>body:</label>
        <json-editor ref="jsonEditor"
          v-model="postForm.apiBody" />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;"
        prop="res">
        <label>res:</label>
        <json-editor ref="jsonEditor"
          v-model="postForm.apiResp" />
      </el-form-item>
    </el-form>
    <!-- </div> -->
  </div>
</template>

<style scoped>
.json-editor-container {
  position: relative;
  height: 50%;
}
</style>

<script>
import JsonEditor from '@/components/JsonEditor'
import MDinput from '@/components/MDinput'
import request from '@/utils/request'
import { addApi2, updateApi2 } from '@/api/appium'

const urlData = '127.0.0.1:8000'
const defaultForm = {
  projId: '', //项目名称
  apiGroupId: '', //接口分组id
  apiSortNo: '', //排序id
  apiName: '', // 接口名称
  apiPath: '', //接口路径
  apiProtocol: '', //接口协议类型
  apiMethod: '', //请求类型:get、post
  apiHeaders: '{}', //请求头
  apiQuerys: '{}', //请求参数
  apiBody: '{}', //post请求体
  apiResp: '{}' //请求响应
}

export default {
  name: 'CreateOrEdit',
  components: { JsonEditor, MDinput },
  data() {
    const validateRequire = (rule, value, callback) => {
      console.log('开始判断是否必填')
      if (value === '') {
        // this.$message({
        //   message: rule.field + '为必传项',
        //   type: 'error'
        // })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateExist = (rule, value, callback) => {
      console.log('开始判断是否重复')
      var apiList = this.$store.getters.apiList
      var isApiNameExist = false
      for (const i in apiList) {
        if (value === apiList[i].apiName) {
          isApiNameExist = true
          break
        }
      }
      if (isApiNameExist) {
        // this.$message({
        //   message: rule.field + '已存在，请确认',
        //   type: 'error'
        // })
        callback(new Error(rule.field + '已存在，请确认'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      options: ['POST', 'GET'],
      protocols: ['HTTP', 'HTTPS'],
      rules: {
        apiName: [{ validator: validateRequire }],
        apiMethod: [{ validator: validateRequire }],
        apiProtocol: [{ validator: validateRequire }],
        apiPath: [{ validator: validateRequire }]
      }
    }
  },
  mounted() {
    // 只有第一次打开的时候，才调用mounted
    if (this.$store.getters.cApiData != '') {
      this.postForm = this.$store.getters.cApiData
    } else {
      this.$refs.postForm.resetFields()
    }
  },
  watch: {
    // 当isApiCreate变化时，执行下列操作
    '$store.getters.isApiCreate'() {
      if (this.$store.getters.cApiData != '') {
        this.postForm = this.$store.getters.cApiData
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }
    }
  },

  methods: {
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.postForm.apiResp = ''
          return request({
            url:
              this.postForm.apiProtocol +
              '://' +
              urlData +
              this.postForm.apiPath,
            method: this.postForm.apiMethod,
            headers: JSON.parse(this.postForm.apiHeaders),
            params: JSON.parse(this.postForm.apiQuerys),
            data: JSON.parse(this.postForm.apiBody)
          })
            .then(response => {
              this.postForm.apiResp = response
              this.$notify({
                title: '成功',
                message: '请求成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch(function(error) {
              console.log('请求报错了：', error)
            })
        } else {
          console.log('error submit!!')
        }
      })
    },
    saveForm() {
      if (this.$store.getters.cApiData != '') {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            // 调后端接口更新
            updateApi2(this.postForm.id, JSON.stringify(this.postForm))
              .then(response => {
                if (response.code === 1) {
                  this.$store.dispatch('appium/changeIsApiCreate', false)
                  this.$notify({
                    title: '保存成功',
                    message: '保存成功',
                    type: 'success',
                    duration: 2000
                  })
                } else {
                  this.$notify({
                    title: '保存失败',
                    message: response.errors,
                    type: 'error',
                    duration: 2000
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
      } else {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.postForm.projId = this.$store.getters.projId
            this.postForm.apiGroupId = this.$store.getters.apiGroupId
            // 首先获取当前分组下的接口列表
            var apiList = this.$store.getters.apiList
            this.postForm.apiSortNo = apiList.length + 1
            console.log(this.postForm)

            // 调用新增接口接口
            addApi2(this.postForm)
              .then(response => {
                // 等待返回后，进行下一步操作
                if (response.code === 1) {
                  this.$store.dispatch('appium/changeIsApiCreate', false)
                  this.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success',
                    duration: 2000
                  })
                } else {
                  this.$notify({
                    title: '保存失败',
                    message: response.errors,
                    type: 'error',
                    duration: 2000
                  })
                }
              })
              .catch(function(error) {
                console.log('新增接口异常：', error)
              })
          } else {
            console.log('error save!!')
          }
        })
      }
    }
  }
}
</script>
