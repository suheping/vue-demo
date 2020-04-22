<template>
  <div class="custom-tree-container">
    <div class="block"
      style="width:300px">
      <p>使用 scoped slot</p>
      <el-tree :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="nodeclick"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">
        <span class="custom-tree-node"
          slot-scope="{ node, data }">
          <!-- 如果是编辑状态，显示输入框 -->
          <template v-if="data.isEdit==1">
            <el-input ref="input"
              @blur="() => submitEdit(node,data)"
              v-model="newApiGroupName"
              style="height:20px line-height:20px"></el-input>
          </template>
          <!-- 如果不是编辑状态，显示分组名称span -->
          <span v-else
            v-text="data.apiGroupName"></span>
          <span>
            <el-button type="text"
              size="mini"
              @click="() => append(node,data)">
              +
            </el-button>
            <el-button v-if="data.id!=1"
              type="text"
              size="mini"
              @click="() => edit(node,data)">
              <i class="el-icon-edit" />
            </el-button>
            <el-button v-if="data.id!=1"
              type="text"
              size="mini"
              @click="() => remove(node, data)">
              <i class="el-icon-delete" />
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { getApiGroup2, updateApiGroup2 } from '@/api/appium'

// let id = 1000
export default {
  name: 'appiumTree1',
  data() {
    return {
      data: [],
      newApiGroupName: '',
      defaultProps: {
        children: 'children',
        apiGroupName: 'apiGroupName'
      }
    }
  },
  created() {
    this.getApiGroupData()
  },
  methods: {
    // 获取指定项目的接口分组数据
    getApiGroupData() {
      getApiGroup2(this.$store.getters.projId)
        .then(response => {
          console.log(response.data.apiGroupJson)
          // 将'替换为"
          this.data = JSON.parse(response.data.apiGroupJson.replace(/'/g, '"'))
          console.log('getApiGroup2 response:', this.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDragStart(node, ev) {
      console.log('drag start', node.data.apiGroupName)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.data.apiGroupName)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.data.apiGroupName)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.data.apiGroupName)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log(
        'tree drag end: ',
        dropNode && dropNode.data.apiGroupName,
        dropType
      )
      // 调后端更新
      this.updateApiGroup()
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.data.apiGroupName, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.id === 1) {
        return false
      } else {
        return true
      }
    },
    allowDrag(draggingNode) {
      // 顶层默认分组不允许拖拽
      if (draggingNode.data.id === 1) {
        return false
      } else {
        return true
      }
      // return draggingNode.data.apiGroupName.indexOf('三级 3-2-2') === -1
    },

    append(node, data) {
      // var pid = data.parentApiGroupId + ':' + data.id
      var timestamp = new Date().getTime()
      const newChild = {
        id: timestamp,
        isEdit: 0,
        apiGroupName: 'T' + timestamp,
        children: []
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      this.updateApiGroup()
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      this.updateApiGroup()
    },

    edit(node, data) {
      console.log(
        'before:',
        data.id,
        // data.parentApiGroupId,
        data.apiGroupName,
        data.isEdit
      )
      this.$set(data, 'isEdit', 1)
      this.newApiGroupName = data.apiGroupName
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
      console.log('after:', data.id, data.apiGroupName, data.isEdit)
    },

    submitEdit(node, data) {
      // console.log('点击了保存按钮')
      if (data.apiGroupName == this.newApiGroupName) {
        console.log('没有修改')
        this.newApiGroupName = ''
        this.$set(data, 'isEdit', 0)
      } else {
        this.$set(data, 'apiGroupName', this.newApiGroupName)
        this.newApiGroupName = ''
        this.$set(data, 'isEdit', 0)
        // console.log('after:', data.id, data.apiGroupName)
        // console.log(this.data)
        console.log(this.data)
        this.updateApiGroup()
      }
    },

    cancelEdit(node, data) {
      // console.log('放弃编辑')
      // console.log(data.id, data.apiGroupName)
      this.newApiGroupName = ''
      this.$set(data, 'isEdit', 0)
    },

    updateApiGroup() {
      var request_body = {
        projId: this.$store.getters.projId,
        // 转为字符串格式
        apiGroupJson: JSON.stringify(this.data)
      }
      updateApiGroup2(this.$store.getters.projId, request_body)
        .then(response => {
          console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
    },

    nodeclick(node, data, obj) {
      console.log('点击了：', node.id, node.apiGroupName)
      this.$store.dispatch('appium/changeApiGroupId', node.id)
      this.$store.dispatch('appium/changeApiGroupName', node.apiGroupName)
      console.log(this.$store.getters.apiGroupId)
    }
  }
}
</script>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 20px;
}
/* 修改el-input高度，方案一： */
/* 某些预处理器(sass)无法识别>>>，建议使用方案二 */
/* >>> .el-input__inner {
  height: 20px;
} */
/* 修改el-input高度，方案二： */
/deep/ .el-input__inner {
  height: 20px;
}
</style>
