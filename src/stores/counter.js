import { defineStore } from 'pinia'

// 使用 defineStore 定义一个store
// 第一个参数是store的唯一标识符
export const useCounterStore = defineStore('counter', {
  // state: 定义响应式状态
  state: () => ({
    count: 0,
    name: '计数器',
    history: [] // 记录操作历史
  }),

  // getters: 类似于computed，用于计算派生状态
  getters: {
    // 获取当前计数值
    doubleCount: (state) => state.count * 2,
    
    // 判断是否为偶数
    isEven: (state) => state.count % 2 === 0,
    
    // 获取计数状态描述
    countStatus: (state) => {
      if (state.count === 0) return '初始状态'
      if (state.count > 0) return '正数'
      return '负数'
    },
    
    // 获取操作历史数量
    historyCount: (state) => state.history.length
  },

  // actions: 定义方法，可以是同步或异步的
  actions: {
    // 增加计数
    increment() {
      this.count++
      this.addToHistory('增加', this.count)
    },
    
    // 减少计数
    decrement() {
      this.count--
      this.addToHistory('减少', this.count)
    },
    
    // 重置计数
    reset() {
      const oldCount = this.count
      this.count = 0
      this.addToHistory('重置', this.count, `从 ${oldCount} 重置到 0`)
    },
    
    // 设置特定值
    setCount(value) {
      const oldCount = this.count
      this.count = value
      this.addToHistory('设置', this.count, `从 ${oldCount} 设置为 ${value}`)
    },
    
    // 添加到历史记录
    addToHistory(action, value, description = '') {
      this.history.unshift({
        id: Date.now(),
        action,
        value,
        description,
        timestamp: new Date().toLocaleString('zh-CN')
      })
      
      // 只保留最近10条记录
      if (this.history.length > 10) {
        this.history = this.history.slice(0, 10)
      }
    },
    
    // 清空历史记录
    clearHistory() {
      this.history = []
    },
    
    // 异步操作示例：延迟增加
    async incrementAsync(delay = 1000) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.increment()
          resolve(this.count)
        }, delay)
      })
    }
  }
})