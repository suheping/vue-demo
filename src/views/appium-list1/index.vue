<template>
  <div class="components-container">
    <split-pane split="vertical"
      @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <p>树形结构</p>
          <appiumTree1></appiumTree1>
        </div>
      </template>
      <template slot="paneR">
        <split-pane split="horizontal">
          <template slot="paneL">
            <div class="top-container">
              <p>环境、按钮</p>
            </div>
          </template>
          <template slot="paneR">
            <div class="bottom-container">
              <p>列表</p>
            </div>
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import appiumTree1 from '@/views/appium-tree1'

export default {
  name: 'AppiumList1',
  components: { splitPane, appiumTree1 },
  methods: {
    resize() {
      console.log('resize')
    }
  }
}
</script>

<style  scoped>
.components-container {
  position: relative;
  height: 100vh;
}

.left-container {
  /* background-color: #f38181; */
  height: 100%;
  /* width: 30%; */
}

.right-container {
  background-color: #fce38a;
  height: 200px;
}

.top-container {
  background-color: #fce38a;
  width: 100%;
  height: 100%;
}

.bottom-container {
  width: 100%;
  background-color: #95e1d3;
  height: 100%;
}
</style>
