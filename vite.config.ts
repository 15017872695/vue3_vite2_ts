import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      transformOn: true,
      mergeProps: true,
    }),
  ],
  base: './', // 开发或生产环境服务的公共基础路径 ,https://vitejs.bootcss.com/guide/build.html#public-base-path
  build: {
    outDir: 'dist', // 打包后的文件名称,
    // 压缩
    minify: process.env.VITE_NODE_ENV === 'production' ? 'esbuild' : false,
    // 服务端渲染
    ssr: false,
    chunkSizeWarningLimit: 2000,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    },
    terserOptions: {
      // 生产环境下移除console
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // 别名路径
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars:{
          hack:`true; @import (reference) "${path.resolve("src/assets/css/common.less")}"` // 配置全局 less
        },
        javascriptEnabled: true,
        // charset:false,
        // additionalData:'@import "./src/assets/css/common.less"'
      },
    },
  },
  server: {
    https: false, // 是否开启https
    open: false, // 是否自动打开浏览器
    port: 8081, // 端口号
    host: true, // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
    hmr: true,
    proxy: {
      '/api': {
        target: 'http://192.168.31.198/', // 后台接口,
        changeOrigin: true,
        secure: false, // 如果是 https 接口需要配置这个参数
        // ws:false,//websocket
        rewrite: (path) => path.replace(/^\/api/, ''), // 路径重写
      },
    },
  }
})
