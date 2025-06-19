<template>
  <div class="counter-page">
    <div class="page-header">
      <h1>🔢 计数器示例</h1>
      <p>学习Pinia的基本概念：State、Getters、Actions</p>
    </div>

    <div class="counter-grid">
      <!-- 主计数器区域 -->
      <div class="counter-main">
        <div class="counter-display">
          <div class="count-value">{{ counterStore.count }}</div>
          <div class="count-label">当前计数</div>
        </div>
        
        <div class="counter-controls">
          <button @click="counterStore.decrement()" class="btn btn-danger">
            <span>-</span> 减少
          </button>
          <button @click="counterStore.increment()" class="btn btn-primary">
            <span>+</span> 增加
          </button>
        </div>
        
        <div class="counter-actions">
          <button @click="counterStore.reset()" class="btn btn-secondary">
            🔄 重置
          </button>
          <button @click="handleAsyncIncrement" :disabled="isAsyncLoading" class="btn btn-info">
            {{ isAsyncLoading ? '⏳ 处理中...' : '⚡ 异步增加' }}
          </button>
        </div>
        
        <div class="custom-input">
          <label>设置特定值：</label>
          <input 
            v-model.number="customValue" 
            type="number" 
            placeholder="输入数字"
            @keyup.enter="setCustomValue"
          >
          <button @click="setCustomValue" class="btn btn-outline">设置</button>
        </div>
      </div>

      <!-- Getters展示区域 -->
      <div class="getters-panel">
        <h3>📊 计算属性 (Getters)</h3>
        <div class="getter-item">
          <span class="getter-label">双倍值：</span>
          <span class="getter-value">{{ counterStore.doubleCount }}</span>
        </div>
        <div class="getter-item">
          <span class="getter-label">是否为偶数：</span>
          <span class="getter-value" :class="{ 'text-success': counterStore.isEven, 'text-danger': !counterStore.isEven }">
            {{ counterStore.isEven ? '是' : '否' }}
          </span>
        </div>
        <div class="getter-item">
          <span class="getter-label">状态描述：</span>
          <span class="getter-value">{{ counterStore.countStatus }}</span>
        </div>
        <div class="getter-item">
          <span class="getter-label">操作次数：</span>
          <span class="getter-value">{{ counterStore.historyCount }}</span>
        </div>
      </div>

      <!-- 操作历史 -->
      <div class="history-panel">
        <div class="history-header">
          <h3>📝 操作历史</h3>
          <button @click="counterStore.clearHistory()" class="btn btn-sm btn-outline">
            清空历史
          </button>
        </div>
        
        <div class="history-list" v-if="counterStore.history.length > 0">
          <div 
            v-for="item in counterStore.history" 
            :key="item.id" 
            class="history-item"
          >
            <div class="history-action">{{ item.action }}</div>
            <div class="history-value">值: {{ item.value }}</div>
            <div class="history-time">{{ item.timestamp }}</div>
            <div v-if="item.description" class="history-description">
              {{ item.description }}
            </div>
          </div>
        </div>
        
        <div v-else class="empty-history">
          暂无操作历史
        </div>
      </div>
    </div>

    <!-- 代码示例 -->
    <div class="code-examples">
      <h3>💻 代码示例</h3>
      <div class="code-tabs">
        <button 
          v-for="tab in codeTabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="code-content">
        <pre><code>{{ codeTabs.find(tab => tab.id === activeTab)?.content }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'

// 使用store
const counterStore = useCounterStore()

// 响应式数据
const customValue = ref(0)
const isAsyncLoading = ref(false)
const activeTab = ref('store')

// 方法
const setCustomValue = () => {
  if (customValue.value !== null && customValue.value !== undefined) {
    counterStore.setValue(customValue.value)
    customValue.value = 0
  }
}

const handleAsyncIncrement = async () => {
  isAsyncLoading.value = true
  try {
    await counterStore.incrementAsync(2000) // 2秒延迟
  } finally {
    isAsyncLoading.value = false
  }
}

// 代码示例
const codeTabs = [
  {
    id: 'store',
    label: 'Store定义',
    content: `// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    history: []
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2,
    isEven: (state) => state.count % 2 === 0
  },
  
  actions: {
    increment() {
      this.count++
      this.addToHistory('增加', this.count)
    },
    
    decrement() {
      this.count--
      this.addToHistory('减少', this.count)
    }
  }
})`
  },
  {
    id: 'component',
    label: '组件使用',
    content: `<template>
  <div>
    <div>计数: \{{ counterStore.count }}</div>
    <div>双倍: \{{ counterStore.doubleCount }}</div>
    <button @click="counterStore.increment()">增加</button>
    <button @click="counterStore.decrement()">减少</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'
const counterStore = useCounterStore()
<\/script>`
  },
  {
    id: 'async',
    label: '异步操作',
    content: `// Store中的异步action
async incrementAsync(delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      this.increment()
      resolve(this.count)
    }, delay)
  })
}

// 组件中使用
const handleAsyncIncrement = async () => {
  isAsyncLoading.value = true
  try {
    await counterStore.incrementAsync(2000)
  } finally {
    isAsyncLoading.value = false
  }
}`
  }
]
</script>

<style scoped>
.counter-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.counter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 50px;
}

.counter-main {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.counter-display {
  margin-bottom: 30px;
}

.count-value {
  font-size: 4rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 10px;
}

.count-label {
  color: #666;
  font-size: 1.1rem;
}

.counter-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.counter-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.custom-input {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.custom-input label {
  font-weight: 500;
  color: #555;
}

.custom-input input {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  width: 120px;
  text-align: center;
}

.custom-input input:focus {
  outline: none;
  border-color: #3498db;
}

.getters-panel {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.getters-panel h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.getter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.getter-item:last-child {
  border-bottom: none;
}

.getter-label {
  font-weight: 500;
  color: #555;
}

.getter-value {
  font-weight: bold;
  color: #2c3e50;
}

.text-success {
  color: #27ae60 !important;
}

.text-danger {
  color: #e74c3c !important;
}

.history-panel {
  grid-column: 1 / -1;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-header h3 {
  color: #2c3e50;
  margin: 0;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  border-left: 4px solid #3498db;
}

.history-action {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 4px;
}

.history-value {
  color: #666;
  font-size: 0.9rem;
}

.history-time {
  color: #999;
  font-size: 0.8rem;
  margin-top: 4px;
}

.history-description {
  color: #666;
  font-size: 0.85rem;
  font-style: italic;
  margin-top: 4px;
}

.empty-history {
  text-align: center;
  color: #999;
  padding: 40px;
  font-style: italic;
}

.code-examples {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.code-examples h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.code-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #3498db;
}

.tab-btn.active {
  color: #3498db;
  border-bottom-color: #3498db;
  font-weight: bold;
}

.code-content {
  background: #f8f9fa;
  border-radius: 8px;
  overflow-x: auto;
}

.code-content pre {
  margin: 0;
  padding: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #2c3e50;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-outline {
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.btn-outline:hover {
  background: #3498db;
  color: white;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .counter-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .counter-controls,
  .counter-actions {
    flex-direction: column;
  }
  
  .count-value {
    font-size: 3rem;
  }
  
  .code-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    text-align: left;
  }
}
</style>