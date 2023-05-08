import { createApp } from 'vue'
import './app.less'
import router from './router/router';
import { createPinia } from 'pinia'
import { ConfigProvider } from '@nutui/nutui-taro';

const pinia = createPinia()
const App = createApp({
  onShow (options) {
    console.log(options)
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(router).use(pinia).use(ConfigProvider)

export default App
