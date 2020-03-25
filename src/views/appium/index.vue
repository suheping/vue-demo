<template>
  <div style="margin-right:50px;padding-left:50px;padding-top:50px;">
    <!-- <p>欢迎打开appium菜单</p> -->
    <!-- <div style="line-height:20px"> -->
    <el-form ref="postForm"
      :rules="rules"
      :model="postForm">
      <!-- 发送请求按钮 -->
      <el-button v-loading="loading"
        style="margin-left: 10px;"
        type="success"
        @click="submitForm">
        发送请求
      </el-button>
      <!-- 保存按钮 -->
      <el-button v-loading="loading"
        style="margin-left: 10px;"
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
      <!-- 选择方法 -->
      <el-form-item label="接口方法"
        prop="method">
        <el-select v-model="postForm.method"
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
        prop="url">
        <MDinput v-model="postForm.url"
          :maxlength="100"
          required>
          url
        </MDinput>
      </el-form-item>
      <!-- <input type="text" v-model="url" placeholder="请输入url" /> -->
      <el-form-item style="margin-bottom: 40px;"
        prop="headers">
        <label>headers:</label>
        <json-editor ref="jsonEditor"
          v-model="postForm.headers" />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;"
        prop="body">
        <label>body:</label>
        <json-editor ref="jsonEditor"
          v-model="postForm.body" />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;"
        prop="res">
        <label>res:</label>
        <json-editor ref="jsonEditor"
          v-model="postForm.res" />
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

// const jsonData = '{"key1":"value1","key2":"value2"}';
const urlData = 'http://192.168.1.225:9527/getToken'
const headersData = '{"Content-Type": "application/json"}'
const bodyData =
  '{"publicKey":"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDtr+cB9v5bPz5D6NidUBT6eGmdjlCz0maLYTK4qnOXUJv2qKWSNEXblSrLOJ4Ea8wKZjutDGrzW+7rM935YPbVd5Igo1VTAEjYXR2AQEwFRp9sPq8a6RyT1juKzel3ca65b8F4UYl/Ud/UZeKtrO0YruntCN0pvEPDkKpooY8RBQIDAQAB","privateKey":"MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAO2v5wH2/ls/PkPo2J1QFPp4aZ2OULPSZothMriqc5dQm/aopZI0RduVKss4ngRrzApmO60MavNb7usz3flg9tV3kiCjVVMASNhdHYBATAVGn2w+rxrpHJPWO4rN6XdxrrlvwXhRiX9R39Rl4q2s7Riu6e0I3Sm8Q8OQqmihjxEFAgMBAAECgYAIbCRfilnCCjArjN7PWEA3p4VEKxmKyoJauKBPZEh05ks+7TcmXD07eWiX5R/Ouhkm8/xAw6diJaUfzYM1bCB8jeRZiI6nTQmNMTicct5jNrmcVqFG6flRPbggt3VCjWgb3lyMGzmilNaExCP+aZ0QmG+hhrZC94HNpl8Nt647oQJBAPsJcLBnGjHlBp4H8FAHEHzqGRqnEA7hM1i3m+yhf3EBmegKJq6N3JBG810FidR8M5c78IkPEvCtXQlIOHCGYrECQQDyYuVQLiQdstgLPAx+9Emq+6MUPnX5SCbMzNmYV0HdN79A8XBJAQ8CsPcNm74Qbp+ALhWNEVXGurpVK76AeaCVAkEAzUc37hgxVHGayqllOpu8QNlRM/k+6VwAF+D00ThytR8BEr0SSpTYsuZB5WQ9BBOYQGgUVo+MBmFNfeSfumw50QJBAI1DS+gN7CiO2dC6X4IB94k5/NJIkNMG1O4ZGVvqxs0Zt1IvJES35DqqTmHU+dFz12uJ8C92Aeq/WudWhkE0IX0CQQDHJBkHJhkb/Q30XHUzVtIGi/FdIsW5qOPyUDTLp6ztaOAMtwdLQHV/sG1mqJMrtkOUcLx8D/EolFyLssaBx3Ls"}'
const defaultForm = {
  apiName: '', // 接口名称
  method: 'POST', // http请求类型
  url: urlData, // 请求地址
  // headers: JSON.parse(headersData), // 请求headers
  // body: JSON.parse(bodyData) // 请求body
  headers: headersData,
  body: bodyData,
  res: ''
}

export default {
  name: 'Appium',
  components: { JsonEditor, MDinput },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      options: ['POST', 'GET'],
      rules: {
        apiName: [{ validator: validateRequire }],
        url: [{ validator: validateRequire }]
        // headers: [{ validator: validateRequire }],
        // body: [{ validator: validateRequire }]
      }
    }
  },
  methods: {
    submitForm() {
      // alert("点击了提交按钮");
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postForm.res = ''
          console.log(this.postForm.method)
          return request({
            url: this.postForm.url,
            method: this.postForm.method,
            headers: JSON.parse(this.postForm.headers),
            data: JSON.parse(this.postForm.body)
          })
            .then(response => {
              console.log(response)
              // console.log(this.loading);
              // this.loading = false;
              this.postForm.res = response
              this.$notify({
                title: '成功',
                message: '请求成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
            })
            .catch(function(error) {
              console.log(error)
              // this.postForm.res = error
              // this.loading = false
            })
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    },
    saveForm() {
      alert('点击了保存按钮')
    }
  }
}
</script>
