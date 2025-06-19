import { defineStore } from 'pinia'

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [
      { id: 1, text: '学习Vue 3基础', completed: true, priority: 'high', createdAt: new Date('2024-01-01') },
      { id: 2, text: '掌握Pinia状态管理', completed: false, priority: 'high', createdAt: new Date('2024-01-02') },
      { id: 3, text: '构建完整项目', completed: false, priority: 'medium', createdAt: new Date('2024-01-03') }
    ],
    filter: 'all', // all, active, completed
    nextId: 4
  }),

  getters: {
    // 获取所有待办事项
    allTodos: (state) => state.todos,
    
    // 获取已完成的待办事项
    completedTodos: (state) => state.todos.filter(todo => todo.completed),
    
    // 获取未完成的待办事项
    activeTodos: (state) => state.todos.filter(todo => !todo.completed),
    
    // 根据当前过滤器获取待办事项
    filteredTodos: (state) => {
      switch (state.filter) {
        case 'active':
          return state.todos.filter(todo => !todo.completed)
        case 'completed':
          return state.todos.filter(todo => todo.completed)
        default:
          return state.todos
      }
    },
    
    // 统计信息
    todoStats: (state) => {
      const total = state.todos.length
      const completed = state.todos.filter(todo => todo.completed).length
      const active = total - completed
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
      
      return {
        total,
        completed,
        active,
        completionRate
      }
    },
    
    // 按优先级分组
    todosByPriority: (state) => {
      return state.todos.reduce((groups, todo) => {
        const priority = todo.priority
        if (!groups[priority]) {
          groups[priority] = []
        }
        groups[priority].push(todo)
        return groups
      }, {})
    }
  },

  actions: {
    // 添加新待办事项
    addTodo(text, priority = 'medium') {
      if (!text.trim()) return
      
      const newTodo = {
        id: this.nextId++,
        text: text.trim(),
        completed: false,
        priority,
        createdAt: new Date()
      }
      
      this.todos.unshift(newTodo)
    },
    
    // 切换待办事项完成状态
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    
    // 删除待办事项
    removeTodo(id) {
      const index = this.todos.findIndex(t => t.id === id)
      if (index > -1) {
        this.todos.splice(index, 1)
      }
    },
    
    // 编辑待办事项
    editTodo(id, newText) {
      const todo = this.todos.find(t => t.id === id)
      if (todo && newText.trim()) {
        todo.text = newText.trim()
      }
    },
    
    // 设置优先级
    setPriority(id, priority) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.priority = priority
      }
    },
    
    // 设置过滤器
    setFilter(filter) {
      this.filter = filter
    },
    
    // 清除所有已完成的待办事项
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
    },
    
    // 全部标记为完成
    markAllCompleted() {
      this.todos.forEach(todo => {
        todo.completed = true
      })
    },
    
    // 全部标记为未完成
    markAllActive() {
      this.todos.forEach(todo => {
        todo.completed = false
      })
    },
    
    // 按优先级排序
    sortByPriority() {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      this.todos.sort((a, b) => {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    },
    
    // 按创建时间排序
    sortByDate(ascending = false) {
      this.todos.sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return ascending ? dateA - dateB : dateB - dateA
      })
    }
  }
})