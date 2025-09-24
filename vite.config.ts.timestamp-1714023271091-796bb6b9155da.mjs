// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///F:/Documents/JS_Leaarn/Vue_learn/practice/%E7%BB%83%E6%89%8B/node_modules/vite/dist/node/index.js";
import vue from "file:///F:/Documents/JS_Leaarn/Vue_learn/practice/%E7%BB%83%E6%89%8B/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///F:/Documents/JS_Leaarn/Vue_learn/practice/%E7%BB%83%E6%89%8B/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///F:/Documents/JS_Leaarn/Vue_learn/practice/%E7%BB%83%E6%89%8B/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///F:/Documents/JS_Leaarn/Vue_learn/practice/%E7%BB%83%E6%89%8B/node_modules/unplugin-vue-components/dist/resolvers.js";
import Icons from "file:///F:/Documents/JS_Leaarn/Vue_learn/practice/%E7%BB%83%E6%89%8B/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///F:/Documents/JS_Leaarn/Vue_learn/practice/%E7%BB%83%E6%89%8B/node_modules/unplugin-icons/dist/resolver.js";
import cesium from "file:///F:/Documents/JS_Leaarn/Vue_learn/practice/%E7%BB%83%E6%89%8B/node_modules/vite-plugin-cesium/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///F:/Documents/JS_Leaarn/Vue_learn/practice/%E7%BB%83%E6%89%8B/vite.config.ts";
var vite_config_default = defineConfig({
  server: {
    proxy: {
      "/front": {
        target: "https://mock.apifox.cn/m1/2401164-0-default",
        changeOrigin: true
      },
      "/login_process": {
        target: "http://localhost:5198/login_process",
        changeOrigin: true
      },
      "/flask": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flask/, "")
        //将 '/api' 替换为空
      }
    }
  },
  plugins: [
    vue(),
    cesium(),
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
          prefix: "Icon"
        })
      ],
      eslintrc: { enabled: true }
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"]
        })
      ]
    }),
    Icons({
      autoInstall: true
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxEb2N1bWVudHNcXFxcSlNfTGVhYXJuXFxcXFZ1ZV9sZWFyblxcXFxwcmFjdGljZVxcXFxcdTdFQzNcdTYyNEJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXERvY3VtZW50c1xcXFxKU19MZWFhcm5cXFxcVnVlX2xlYXJuXFxcXHByYWN0aWNlXFxcXFx1N0VDM1x1NjI0QlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovRG9jdW1lbnRzL0pTX0xlYWFybi9WdWVfbGVhcm4vcHJhY3RpY2UvJUU3JUJCJTgzJUU2JTg5JThCL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtmaWxlVVJMVG9QYXRoLCBVUkx9IGZyb20gJ25vZGU6dXJsJ1xuXG5pbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuXG4vLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHtFbGVtZW50UGx1c1Jlc29sdmVyfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5cbi8vIFx1NTZGRVx1NjgwN1x1NUU5M1x1NUJGQ1x1NTE2NVxuaW1wb3J0IEljb25zIGZyb20gXCJ1bnBsdWdpbi1pY29ucy92aXRlXCJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gXCJ1bnBsdWdpbi1pY29ucy9yZXNvbHZlclwiXG5cbi8vIGNlc2l1bVx1NUJGQ1x1NTE2NVxuaW1wb3J0IGNlc2l1bSBmcm9tICd2aXRlLXBsdWdpbi1jZXNpdW0nO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgcHJveHk6IHtcbiAgICAgICAgICAgIFwiL2Zyb250XCI6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiaHR0cHM6Ly9tb2NrLmFwaWZveC5jbi9tMS8yNDAxMTY0LTAtZGVmYXVsdFwiLFxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiL2xvZ2luX3Byb2Nlc3NcIjoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjUxOTgvbG9naW5fcHJvY2Vzc1wiLFxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiL2ZsYXNrXCI6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo1MDAwXCIsXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9mbGFzay8sICcnKVxuICAgICAgICAgICAgLy9cdTVDMDYgJy9hcGknIFx1NjZGRlx1NjM2Mlx1NEUzQVx1N0E3QVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgIHZ1ZSgpLFxuICAgICAgICAgICAgY2VzaXVtKCksXG4gICAgICAgICAgICBBdXRvSW1wb3J0KHtcbiAgICAgICAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgVnVlIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQXJlZiwgcmVhY3RpdmUsIHRvUmVmIFx1N0I0OVxuICAgICAgICAgICAgICAgIGltcG9ydHM6IFtcInZ1ZVwiXSxcblxuICAgICAgICAgICAgICAgIC8vIEF1dG8gaW1wb3J0IGZ1bmN0aW9ucyBmcm9tIEVsZW1lbnQgUGx1cywgZS5nLiBFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAod2l0aCBzdHlsZSlcbiAgICAgICAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQUVsTWVzc2FnZSwgRWxNZXNzYWdlQm94Li4uIChcdTVFMjZcdTY4MzdcdTVGMEYpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgICAgICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcblxuICAgICAgICAgICAgICAgICAgICAvLyBBdXRvIGltcG9ydCBpY29uIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XG4gICAgICAgICAgICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAnSWNvbicsXG4gICAgICAgICAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBlc2xpbnRyYzoge2VuYWJsZWQ6IHRydWV9LFxuXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICAgICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gQXV0byByZWdpc3RlciBpY29uIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDXHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XG4gICAgICAgICAgICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZENvbGxlY3Rpb25zOiBbJ2VwJ10sXG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgSWNvbnMoe1xuICAgICAgICAgICAgICAgIGF1dG9JbnN0YWxsOiB0cnVlLFxuICAgICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1YsU0FBUSxlQUFlLFdBQVU7QUFFblgsU0FBUSxvQkFBbUI7QUFDM0IsT0FBTyxTQUFTO0FBR2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVEsMkJBQTBCO0FBR2xDLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUcxQixPQUFPLFlBQVk7QUFmd0wsSUFBTSwyQ0FBMkM7QUFrQjVQLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFFBQVE7QUFBQSxJQUNKLE9BQU87QUFBQSxNQUNILFVBQVU7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNsQjtBQUFBLE1BQ0Esa0JBQWtCO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDbEI7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxZQUFZLEVBQUU7QUFBQTtBQUFBLE1BRWxEO0FBQUEsSUFDQTtBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLFdBQVc7QUFBQTtBQUFBLE1BRVAsU0FBUyxDQUFDLEtBQUs7QUFBQTtBQUFBO0FBQUEsTUFJZixXQUFXO0FBQUEsUUFDUCxvQkFBb0I7QUFBQTtBQUFBO0FBQUEsUUFJcEIsY0FBYztBQUFBLFVBQ1YsUUFBUTtBQUFBLFFBQ1osQ0FBQztBQUFBLE1BRUw7QUFBQSxNQUNBLFVBQVUsRUFBQyxTQUFTLEtBQUk7QUFBQSxJQUU1QixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDUCxXQUFXO0FBQUEsUUFBQyxvQkFBb0I7QUFBQTtBQUFBO0FBQUEsUUFHNUIsY0FBYztBQUFBLFVBQ1Ysb0JBQW9CLENBQUMsSUFBSTtBQUFBLFFBQzdCLENBQUM7QUFBQSxNQUNMO0FBQUEsSUFDSixDQUFDO0FBQUEsSUFFRCxNQUFNO0FBQUEsTUFDRixhQUFhO0FBQUEsSUFDakIsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDeEQ7QUFBQSxFQUVKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
