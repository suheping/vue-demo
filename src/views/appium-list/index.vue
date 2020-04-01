<template>
  <div class="app-container">
    <!-- 
    <div class="filter-container">
      <el-input v-model="listQuery.title"
        :placeholder="$t('table.title')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance"
        :placeholder="$t('table.importance')"
        clearable
        style="width: 90px"
        class="filter-item">
        <el-option v-for="item in importanceOptions"
          :key="item"
          :label="item"
          :value="item" />
      </el-select>
      <el-select v-model="listQuery.type"
        :placeholder="$t('table.type')"
        clearable
        class="filter-item"
        style="width: 130px">
        <el-option v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name + '(' + item.key + ')'"
          :value="item.key" />
      </el-select>
      <el-button v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter">
        {{ $t("table.search") }}
      </el-button>
      <el-button class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="dialogFormVisible = !dialogFormVisible">
        {{ $t("table.add") }}
      </el-button>
      <el-button v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload">
        {{ $t("table.export") }}
      </el-button>
      <el-checkbox v-model="showReviewer"
        class="filter-item"
        style="margin-left:15px;"
        @change="tableKey = tableKey + 1">
        {{ $t("table.reviewer") }}
      </el-checkbox>
    </div> -->
    <!-- 
    <div>
      <el-button type="primary" icon="el-icon-edit" style="margin-top: 10px; margin-bottom: 10px;" @click="dialogFormVisible = !dialogFormVisible">添加</el-button>
    </div> -->

    <!-- Note that row-key is necessary to get a correct row order. -->
    <!-- 列表 -->
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

      <!-- <el-table-column width="180px"
        align="center"
        label="排序号">
        <template slot-scope="{ row }">
          <span>{{ row.apiSortNo }}</span>
        </template>
      </el-table-column> -->

      <el-table-column min-width="300px"
        label="接口名称">
        <template slot-scope="{ row }">
          <span>{{ row.apiName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px"
        align="center"
        label="接口路径">
        <template slot-scope="{ row }">
          <span>{{ row.apiPath }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px"
        align="center"
        label="操作">
        <template slot-scope="{ row }">
          <el-button>编辑</el-button>
        </template>
      </el-table-column>

    </el-table>

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
      close>
      <p>this is a test</p>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button type="primary"
          @click="submitForm">
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import { getApi, updateApis } from '@/api/appium'
import Sortable from 'sortablejs'

export default {
  name: 'AppiumList',
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
      // total: null,
      listLoading: true,
      dialogFormVisible: false,
      // listQuery: {
      //   page: 1,
      //   limit: 10
      // },
      sortable: null,
      oldList: [],
      newList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      this.list = await getApi(1, 1)
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
          // console.log(this.list)
          // 调后端更新接口
          updateApis(this.list)
          // const oldno = this.list[evt.oldIndex].apiSortNo
          // const newno = this.list[evt.newIndex].apiSortNo
          // console.log(evt.oldIndex, evt.newIndex)
          // console.log(oldno, newno)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    submitForm() {
      this.dialogFormVisible = false
      console.log('你提交了dialog')
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
