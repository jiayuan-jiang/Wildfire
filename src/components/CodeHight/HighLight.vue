<template>
  <div class="code-container">
    <div class="code-header">demo.py</div>
    <pre class="line-numbers"><code ref="codeElement" class="language-python">{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';

const codeElement = ref(null);
const props = defineProps({
  code: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  if (codeElement.value) {
    Prism.highlightElement(codeElement.value);
  }
});
</script>

<style scoped>
.code-container {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 20px;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 800px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.code-header {
  background-color: #44475a;
  color: #f8f8f2;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}

pre {
  margin: 0;
  overflow-x: auto;
  background: none;
}

code {
  display: block;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  white-space: pre-wrap;
}
</style>
