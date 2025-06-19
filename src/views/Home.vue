<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">Vue 3 + Pinia 状态管理教学</h1>
      <p class="hero-subtitle">学习现代Vue应用的状态管理最佳实践</p>
    </div>

    <div class="content-grid">
      <!-- Pinia简介 -->
      <div class="card">
        <h2>🍍 什么是Pinia？</h2>
        <p>Pinia是Vue的官方状态管理库，是Vuex的继任者。它提供了更简单、更类型安全的API，完美支持Vue 3的Composition API。</p>
        <ul>
          <li>✅ 直观的API设计</li>
          <li>✅ 完整的TypeScript支持</li>
          <li>✅ 开发工具支持</li>
          <li>✅ 模块化设计</li>
          <li>✅ 服务端渲染支持</li>
        </ul>
      </div>

      <!-- 核心概念 -->
      <div class="card">
        <h2>🎯 核心概念</h2>
        <div class="concept-item">
          <h3>State（状态）</h3>
          <p>存储应用的数据，类似于组件的data</p>
          <code>state: () => ({ count: 0 })</code>
        </div>
        <div class="concept-item">
          <h3>Getters（计算属性）</h3>
          <p>基于state计算派生状态，类似于computed</p>
          <code>getters: { doubleCount: (state) => state.count * 2 }</code>
        </div>
        <div class="concept-item">
          <h3>Actions（操作）</h3>
          <p>修改状态的方法，支持同步和异步操作</p>
          <code>actions: { increment() { this.count++ } }</code>
        </div>
      </div>

      <!-- 使用步骤 -->
      <div class="card">
        <h2>🚀 使用步骤</h2>
        <ol class="steps-list">
          <li>
            <strong>安装Pinia</strong>
            <code>npm install pinia</code>
          </li>
          <li>
            <strong>创建Pinia实例</strong>
            <code>const pinia = createPinia()</code>
          </li>
          <li>
            <strong>定义Store</strong>
            <code>export const useStore = defineStore('main', { ... })</code>
          </li>
          <li>
            <strong>在组件中使用</strong>
            <code>const store = useStore()</code>
          </li>
        </ol>
      </div>

      <!-- 示例导航 -->
      <div class="card">
        <h2>📚 学习示例</h2>
        <div class="example-links">
          <router-link to="/counter" class="example-link">
            <div class="example-icon">🔢</div>
            <div>
              <h3>计数器示例</h3>
              <p>学习基本的state、getters和actions</p>
            </div>
          </router-link>
          
          <router-link to="/todos" class="example-link">
            <div class="example-icon">📝</div>
            <div>
              <h3>待办事项</h3>
              <p>复杂状态管理和数据操作</p>
            </div>
          </router-link>
          
          <router-link to="/profile" class="example-link">
            <div class="example-icon">👤</div>
            <div>
              <h3>用户管理</h3>
              <p>异步操作和错误处理</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 代码示例 -->
    <div class="code-section">
      <h2>💻 基本用法示例</h2>
      <div class="code-example">
        <h3>1. 定义Store</h3>
        <pre><code>import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})</code></pre>
      </div>
      
      <div class="code-example">
        <h3>2. 在组件中使用</h3>
        <pre><code>&lt;template&gt;
  &lt;div&gt;
    &lt;p&gt;计数: \{\{ store.count \}\}&lt;/p&gt;
    &lt;p&gt;双倍: \{\{ store.doubleCount \}\}&lt;/p&gt;
    &lt;button @click="store.increment()"&gt;增加&lt;/button&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()
&lt;/script&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 20px;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card h2 {
  color: #667eea;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.card ul {
  list-style: none;
  padding: 0;
}

.card li {
  padding: 8px 0;
  color: #555;
}

.concept-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.concept-item:last-child {
  border-bottom: none;
}

.concept-item h3 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.concept-item p {
  color: #666;
  margin-bottom: 8px;
}

.concept-item code {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #e83e8c;
}

.steps-list {
  padding-left: 0;
  list-style: none;
}

.steps-list li {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.steps-list li:last-child {
  border-bottom: none;
}

.steps-list strong {
  color: #2c3e50;
}

.steps-list code {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  color: #e83e8c;
  font-size: 0.9rem;
}

.example-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.example-link {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.example-link:hover {
  background: #667eea;
  color: white;
  transform: translateX(10px);
}

.example-icon {
  font-size: 2rem;
}

.example-link h3 {
  margin: 0 0 5px 0;
  color: inherit;
}

.example-link p {
  margin: 0;
  opacity: 0.8;
}

.code-section {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.code-section h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.code-example {
  margin-bottom: 30px;
}

.code-example h3 {
  color: #667eea;
  margin-bottom: 15px;
}

.code-example pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 10px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  line-height: 1.5;
}

.code-example code {
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .card {
    padding: 20px;
  }
  
  .code-section {
    padding: 20px;
  }
  
  .code-example pre {
    padding: 15px;
    font-size: 0.9rem;
  }
}
</style>