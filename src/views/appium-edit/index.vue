<template>

  <div class="custom-tree-container">

    <!-- 备份 -->
    <div class="block"
      style="width:400px">
      <p>使用 scoped slot</p>
      <el-tree :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
        <span class="custom-tree-node"
          slot-scope="{ node, data }">
          <!-- 如果是编辑状态 -->
          <template v-if="data.isEdit">
            <el-input v-model="newLabel"
              size="min"></el-input>
            <el-button type="text"
              @click="() => cancelEdit(node,data)">C</el-button>
            <el-button type="text"
              @click="() => submitEdit(node,data)">S</el-button>
          </template>
          <!-- 如果不是编辑状态 -->
          <div v-else>
            <span v-text="node.label"></span>
          </div>
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
let id = 1000

export default {
  name: 'appiumEdit',
  data() {
    var newLabel = ''
    var data = [
      {
        id: 1,
        label: '一级 1',
        isEdit: false,
        children: [
          {
            id: 4,
            label: '二级 1-1',
            isEdit: false,
            children: [
              {
                id: 9,
                label: '三级 1-1-1',
                isEdit: false
              },
              {
                id: 10,
                label: '三级 1-1-2',
                isEdit: false
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: '一级 2',
        isEdit: false,
        children: [
          {
            id: 5,
            label: '二级 2-1',
            isEdit: false
          },
          {
            id: 6,
            label: '二级 2-2',
            isEdit: false
          }
        ]
      }
    ]
    return {
      data: JSON.parse(JSON.stringify(data)),
      vable: false,
      newLabel
    }
  },

  methods: {
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
      console.log('after:', data.id, data.label, data.isEdit)
    },

    submitEdit(node, data) {
      console.log('点击了保存按钮')
      console.log('before:', data.id, data.label)
      this.$set(data, 'label', this.newLabel)
      this.$set(data, 'isEdit', false)
      console.log('after:', data.id, data.label)
    },

    cancelEdit(node, data) {
      console.log('放弃编辑')
      console.log(data.id, data.label)
      this.$set(data, 'isEdit', false)
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 20px;
}
</style>