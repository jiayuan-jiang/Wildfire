import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// 图标库导入
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
            imports: ["vue"],

            // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
            // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
            resolvers: [
                ElementPlusResolver(),

                // Auto import icon components
                // 自动导入图标组件
                IconsResolver({
                    prefix: 'Icon',
                }),

            ],
            eslintrc: {enabled: true},

        }),
        Components({
            resolvers: [ElementPlusResolver(),
                // Auto register icon components
                // 自动注册图标组件
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
            ],
        }),

        Icons({
            autoInstall: true,
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    base: './',  // 添加这行，解决部署路径问题
    server: {
        proxy: {
            "/front": {
                target: "https://mock.apifox.cn/m1/2401164-0-default",
                changeOrigin: true
            },
            "/login_process": {
                target: "https://wildfirebackend.onrender.com",
                changeOrigin: true
            },
            "/flask": {
                target: "https://wildfirebackend.onrender.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/flask/, '')
                //将 '/api' 替换为空
            },
            "/predict": {
                target: "https://wildfirebackend.onrender.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/predict/, '')
                //将 '/api' 替换为空
            },
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                format: 'es'  // 确保输出ES模块格式
            }
        }
    }
})
