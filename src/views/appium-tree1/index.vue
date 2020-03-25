<template>
  <div class="custom-tree-container">
    <div class="block"
      style="width:500px">
      <p>使用 scoped slot</p>
      <el-tree :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
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
          <!-- 如果是编辑状态 -->
          <template v-if="data.isEdit">
            <el-input ref="input"
              @blur="() => submitEdit(node,data)"
              v-model="newLabel"
              style="height:20px line-height:20px"></el-input>
            <!-- 放弃、提交按钮废弃，改为失去焦点自动提交 -->
            <!-- <el-button type="text"
              size="mini"
              @click="() => cancelEdit(node,data)">C</el-button>
            <el-button type="text"
              size="mini"
              @click="() => submitEdit(node,data)">S</el-button> -->
          </template>
          <!-- 如果不是编辑状态 -->
          <span v-else
            v-text="node.label"></span>
          <span>
            <el-button type="text"
              size="mini"
              @click="() => edit(node,data)">
              E
            </el-button>
            <el-button type="text"
              size="mini"
              @click="() => append(data)">
              +
            </el-button>
            <el-button type="text"
              size="mini"
              @click="() => remove(node, data)">
              D
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
// import { fetchList } from '@/api/article'
import { getApiGroup } from '@/api/appium'

let id = 1000
export default {
  name: 'appiumTree1',
  data() {
    return {
      data: [],
      newLabel: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getApiGroupData()
  },
  methods: {
    // 调api获取接口分组数据
    getApiGroupData() {
      getApiGroup()
        .then(response => {
          this.data = response
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDragStart(node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1
    },

    append(data) {
      const newChild = { id: id++, label: 'testtest' + id, children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },

    edit(node, data) {
      console.log('before:', data.id, data.label, data.isEdit)
      this.$set(data, 'isEdit', true)
      this.newLabel = data.label
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
      console.log('after:', data.id, data.label, data.isEdit)
    },

    submitEdit(node, data) {
      console.log('点击了保存按钮')
      console.log('before:', data.id, data.label)
      this.$set(data, 'label', this.newLabel)
      this.newLabel = ''
      this.$set(data, 'isEdit', false)
      console.log('after:', data.id, data.label)
      // console.log(this.data)
    },

    cancelEdit(node, data) {
      console.log('放弃编辑')
      console.log(data.id, data.label)
      this.newLabel = ''
      this.$set(data, 'isEdit', false)
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
