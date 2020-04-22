<template>
  <div class="app-container">
    <div name="apiHeaders"
      style="margin-bottom: 1.5cm">
      <span>{{apiGroupName}}({{list.length}}个接口)</span>
      <!-- <el-button style="float: right;" @click="dialogFormVisible = !dialogFormVisible">添加</el-button> -->
      <el-button style="float: right;"
        @click="()=>addApi()">添加</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <!-- 列表 -->
    <div name="apiList">
      <el-table ref="AppiumList"
        v-loading="listLoading"
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center"
          label="ID"
          width="65">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="200px"
          label="接口名称">
          <template slot-scope="{ row }">
            <span>{{ row.apiName }}</span>
          </template>
        </el-table-column>

        <el-table-column width="200px"
          align="center"
          label="接口路径">
          <template slot-scope="{ row }">
            <span>{{ row.apiPath }}</span>
          </template>
        </el-table-column>

        <el-table-column width="200px"
          align="left"
          label="操作">
          <template slot-scope="{ row }">
            <el-button @click="()=>editApi(row)">编辑</el-button>
            <el-button @click="()=>handleDeleteApi(row)">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->
    <!-- 显示新旧列表顺序 -->
    <div class="show-d">
      <el-tag style="margin-right:12px;">{{ $t("table.dragTips1") }} :</el-tag>
      {{ oldList }}
    </div>
    <div class="show-d">
      <el-tag>{{ $t("table.dragTips2") }} :</el-tag> {{ newList }}
    </div>

    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialogFormVisible"
      @close='closeDialog'>
      <!-- <p>this is a test</p> -->
      <CreateOrEdit></CreateOrEdit>
    </el-dialog>
  </div>
</template>

<script>
import {
  updateApis,
  getApi2,
  getApiList,
  updateApi2,
  deleleApi2
} from '@/api/appium'
import Sortable from 'sortablejs'
import CreateOrEdit from './CreateOrEdit'

export default {
  name: 'AppiumList',
  components: { CreateOrEdit },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      projId: 1,
      apiGroupId: 1,
      apiGroupName: '默认分组',
      listLoading: true,
      dialogFormVisible: false,
      sortable: null,
      oldList: [],
      newList: [],
      visible: false
    }
  },
  created() {
    this.getList()
  },
  watch: {
    '$store.getters.apiGroupId'() {
      this.apiGroupId = this.$store.getters.apiGroupId
      this.apiGroupName = this.$store.getters.apiGroupName
      console.log('监听到apiGroupId改变', this.apiGroupId, this.apiGroupName)
      this.getList()
    },
    '$store.getters.isApiCreate'() {
      this.dialogFormVisible = this.$store.getters.isApiCreate
      this.apiGroupId = this.$store.getters.apiGroupId
      this.apiGroupName = this.$store.getters.apiGroupName
      console.log('appium-list---isApiCreate:', this.$store.getters.isApiCreate)
      console.log('appium-list---dialogFormVisible:', this.dialogFormVisible)
      this.getList()
    }
  },
  methods: {
    async getList() {
      console.log('调用获取接口列表')
      this.listLoading = true
      // this.list = await getApi(this.projId, this.apiGroupId)
      await getApiList(
        this.$store.getters.projId,
        this.$store.getters.apiGroupId,
        'apiSortNo'
      )
        .then(response => {
          // console.log(response.data)
          // alert(response.data)
          this.list = response.data
          this.$store.dispatch('appium/changeApiList', this.list)
        })
        .catch(err => {
          console.log(err)
        })
      // console.log('接口列表：', this.list)
      this.$store.dispatch('appium/changeApiList', this.list)
      this.listLoading = false
      this.oldList = this.list.map(v => v.apiSortNo)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      const el = this.$refs.AppiumList.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      // console.log(el)
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          // 初始化sortno为1
          var sortno = 1
          // 遍历拖拽后的list
          for (var i in this.list) {
            // 将sortno赋值给每条用例
            this.list[i].apiSortNo = sortno
            sortno = sortno + 1
          }
          // 调后端更新接口
          updateApis(this.list)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    // submitForm() {
    //   this.dialogFormVisible = false
    //   console.log('你提交了dialog')
    // },
    editApi(row) {
      this.dialogFormVisible = true
      console.log('点击了编辑按钮')
      this.$store.dispatch('appium/changeIsApiCreate', true)
      // this.$store.dispatch('appium/changeIsApiEdit', true)
      console.log('打开了编辑页面，修改cApiData的值为row')
      this.$store.dispatch('appium/changeCApiData', row)
      // console.log('点击编辑，cApiData:', this.$store.getters.cApiData)
    },
    addApi() {
      this.dialogFormVisible = true
      console.log('点击了添加按钮')
      this.$store.dispatch('appium/changeIsApiCreate', true)
      console.log('打开了新增页面，修改capiData的值为空')
      this.$store.dispatch('appium/changeCApiData', '')
      // console.log('点击添加，cApiData:', this.$store.getters.cApiData)
    },
    handleDeleteApi(row) {
      // this.visible = true
      this.$confirm('确定删除吗?', '提示', {})
        .then(() => {
          console.log('确定删除', row)
          deleleApi2(row.id)
            .then(response => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch(err => {
              console.log(err)
              this.$notify({
                title: '失败',
                message: 'err',
                type: 'error',
                duration: 2000
              })
            })
        })
        .catch(() => {
          this.$notify({
            title: '成功',
            message: '放弃删除',
            type: 'info',
            duration: 2000
          })
        })
    },
    deleteApi(row) {
      console.log('点击了删除按钮')
    },
    cancelDelete() {
      console.log('放弃删除')
      this.visible = false
    },
    closeDialog() {
      console.log('关闭了新增、编辑弹窗')
      this.$store.dispatch('appium/changeIsApiCreate', false)
      this.$store.dispatch('appium/changeIsApiEdit', false)
      console.log('关闭了弹窗，修改capiData的值为空')
      this.$store.dispatch('appium/changeCApiData', '')
      // console.log('关闭弹窗，cApiData:', this.$store.getters.cApiData)
    }
  }
}
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #f80606 !important;
  background: #20e03a !important;
}
</style>

<style scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>
