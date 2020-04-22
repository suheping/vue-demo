<template>
  <div class="components-container">
    <split-pane split="vertical"
      @resize="resize"
      :min-percent='10'
      :default-percent='18'>
      <template slot="paneL">
        <div class="left-container">
          <!-- 树 -->
          <appiumTree1></appiumTree1>
        </div>
      </template>
      <template slot="paneR">
        <split-pane split="horizontal"
          :min-percent='10'
          :default-percent='10'>
          <template slot="paneL">
            <!-- 头部设置 -->
            <ApiHeader></ApiHeader>
          </template>
          <template slot="paneR">
            <div class="bottom-container">
              <!-- 列表 -->
              <AppiumList></AppiumList>
            </div>
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import appiumTree1 from './components/AppiumTree'
import AppiumList from './components/AppiumList'
import ApiHeader from './components/ApiHeader'
// import CreateOrEdit from './components/CreateOrEdit'

export default {
  name: 'AppiumList1',
  components: { splitPane, appiumTree1, AppiumList, ApiHeader },
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
  background-color: #ffffff;
  height: 200px;
}

.top-container {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}

.bottom-container {
  width: 100%;
  background-color: #ffffff;
  height: 100%;
}
</style>
