<template>

  <div class="custom-tree-container">
    <div class="block"
      style="width:400px">
      <p>使用 scoped slot</p>
      <el-tree :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
        <span class="custom-tree-node"
          slot-scope="{ node, data }">
          <!-- <span>{{ node.label }}</span> -->
          <!-- 如果为编辑状态 -->
          <template v-if="node.isEdit">
            <!-- <span>{{ node.label }}</span> -->
            <el-input v-model="node.label"
              type="text"></el-input>
            <el-button @click="cancelEdit()">取消</el-button>
            <el-button @click="submitEdit()">保存</el-button>
          </template>
          <!-- 如果不是编辑状态 -->
          <template v-else>
            <span>{{ node.label }}</span>
          </template>
          <span>
            <el-button type="text"
              size="mini"
              @click="() => edit(node,data)">
              Edit
            </el-button>
            <el-button type="text"
              size="mini"
              @click="() => append(data)">
              Append
            </el-button>
            <el-button type="text"
              size="mini"
              @click="() => remove(node, data)">
              Delete
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
    const data = [
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
      },
      {
        id: 3,
        label: '一级 3',
        isEdit: false,
        children: [
          {
            id: 7,
            label: '二级 3-1',
            isEdit: false
          },
          {
            id: 8,
            label: '二级 3-2',
            isEdit: false
          }
        ]
      }
    ]
    return {
      // data: JSON.parse(JSON.stringify(data)),
      data: JSON.parse(JSON.stringify(data))
    }
  },

  methods: {
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
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
      node.isEdit = true
      console.log(node.label, node.isEdit)
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
  padding-right: 8px;
}
</style>