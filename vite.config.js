import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 获取路径中包含 /baseURL 的请求
      '/baseURL': {
        // 后端服务器所在源
        target: 'http://localhost:8080',
        //是否修改源
        changeOrigin: true,
        // 将请求路径中的 /baseURL 替换为 ''
        rewrite: (path) => path.replace(/^\/baseURL/, '')
      }
    }
  }
})
