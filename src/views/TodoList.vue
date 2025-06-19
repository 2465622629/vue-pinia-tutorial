<template>
  <div class="todo-page">
    <div class="page-header">
      <h1>📝 待办事项管理</h1>
      <p>学习复杂状态管理：数组操作、过滤、排序</p>
    </div>

    <!-- 统计面板 -->
    <div class="stats-panel">
      <div class="stat-card">
        <div class="stat-number">{{ todosStore.todoStats.total }}</div>
        <div class="stat-label">总计</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ todosStore.todoStats.active }}</div>
        <div class="stat-label">待完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ todosStore.todoStats.completed }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ todosStore.todoStats.completionRate }}%</div>
        <div class="stat-label">完成率</div>
      </div>
    </div>

    <div class="todo-container">
      <!-- 左侧：待办事项列表 -->
      <div class="todo-main">
        <!-- 添加新待办事项 -->
        <div class="add-todo">
          <div class="add-todo-form">
            <input
              v-model="newTodoText"
              @keyup.enter="addTodo"
              placeholder="添加新的待办事项..."
              class="todo-input"
            >
            <select v-model="newTodoPriority" class="priority-select">
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
            <button @click="addTodo" class="btn btn-primary">
              <span>+</span> 添加
            </button>
          </div>
        </div>

        <!-- 过滤和排序控制 -->
        <div class="controls">
          <div class="filter-controls">
            <label>过滤：</label>
            <button
              v-for="filter in filters"
              :key="filter.value"
              @click="todosStore.setFilter(filter.value)"
              :class="['filter-btn', { active: todosStore.filter === filter.value }]"
            >
              {{ filter.label }}
            </button>
          </div>
          
          <div class="sort-controls">
            <button @click="todosStore.sortByPriority()" class="btn btn-sm btn-outline">
              按优先级排序
            </button>
            <button @click="todosStore.sortByDate()" class="btn btn-sm btn-outline">
              按时间排序
            </button>
          </div>
        </div>

        <!-- 批量操作 -->
        <div class="batch-actions" v-if="todosStore.allTodos.length > 0">
          <button @click="todosStore.markAllCompleted()" class="btn btn-sm btn-success">
            全部完成
          </button>
          <button @click="todosStore.markAllActive()" class="btn btn-sm btn-warning">
            全部未完成
          </button>
          <button @click="todosStore.clearCompleted()" class="btn btn-sm btn-danger">
            清除已完成
          </button>
        </div>

        <!-- 待办事项列表 -->
        <div class="todo-list">
          <div
            v-for="todo in todosStore.filteredTodos"
            :key="todo.id"
            :class="['todo-item', { completed: todo.completed }]"
          >
            <div class="todo-checkbox">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="todosStore.toggleTodo(todo.id)"
              >
            </div>
            
            <div class="todo-content">
              <div v-if="editingId !== todo.id" class="todo-text">
                {{ todo.text }}
              </div>
              <input
                v-else
                v-model="editingText"
                @keyup.enter="saveEdit(todo.id)"
                @keyup.esc="cancelEdit"
                @blur="saveEdit(todo.id)"
                class="edit-input"
                ref="editInput"
              >
              
              <div class="todo-meta">
                <span :class="['priority-badge', todo.priority]">
                  {{ getPriorityLabel(todo.priority) }}
                </span>
                <span class="todo-date">
                  {{ formatDate(todo.createdAt) }}
                </span>
              </div>
            </div>
            
            <div class="todo-actions">
              <button
                v-if="editingId !== todo.id"
                @click="startEdit(todo)"
                class="action-btn edit-btn"
                title="编辑"
              >
                ✏️
              </button>
              
              <select
                :value="todo.priority"
                @change="todosStore.setPriority(todo.id, $event.target.value)"
                class="priority-mini-select"
                title="设置优先级"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
              
              <button
                @click="todosStore.removeTodo(todo.id)"
                class="action-btn delete-btn"
                title="删除"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <div v-if="todosStore.filteredTodos.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <div class="empty-text">
              {{ getEmptyMessage() }}
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：优先级分组 -->
      <div class="priority-panel">
        <h3>📊 按优先级分组</h3>
        <div
          v-for="(todos, priority) in todosStore.todosByPriority"
          :key="priority"
          class="priority-group"
        >
          <div :class="['priority-header', priority]">
            <span class="priority-name">{{ getPriorityLabel(priority) }}</span>
            <span class="priority-count">{{ todos.length }}</span>
          </div>
          <div class="priority-todos">
            <div
              v-for="todo in todos.slice(0, 3)"
              :key="todo.id"
              :class="['priority-todo', { completed: todo.completed }]"
            >
              {{ todo.text }}
            </div>
            <div v-if="todos.length > 3" class="more-todos">
              还有 {{ todos.length - 3 }} 项...
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 代码示例 -->
    <div class="code-examples">
      <h2>💻 Todos Store 代码</h2>
      
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
import { ref, nextTick } from 'vue'
import { useTodosStore } from '@/stores/todos'

// 使用todos store
const todosStore = useTodosStore()

// 响应式数据
const newTodoText = ref('')
const newTodoPriority = ref('medium')
const editingId = ref(null)
const editingText = ref('')
const activeTab = ref('state')
const editInput = ref(null)

// 过滤选项
const filters = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '待完成' },
  { value: 'completed', label: '已完成' }
]

// 方法
const addTodo = () => {
  if (newTodoText.value.trim()) {
    todosStore.addTodo(newTodoText.value, newTodoPriority.value)
    newTodoText.value = ''
    newTodoPriority.value = 'medium'
  }
}

const startEdit = (todo) => {
  editingId.value = todo.id
  editingText.value = todo.text
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus()
    }
  })
}

const saveEdit = (id) => {
  if (editingText.value.trim()) {
    todosStore.editTodo(id, editingText.value)
  }
  cancelEdit()
}

const cancelEdit = () => {
  editingId.value = null
  editingText.value = ''
}

const getPriorityLabel = (priority) => {
  const labels = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return labels[priority] || priority
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getEmptyMessage = () => {
  switch (todosStore.filter) {
    case 'active':
      return '没有待完成的事项'
    case 'completed':
      return '没有已完成的事项'
    default:
      return '暂无待办事项，添加一个开始吧！'
  }
}

// 代码示例
const codeTabs = [
  {
    id: 'state',
    label: 'State定义',
    content: `state: () => ({
  todos: [
    {
      id: 1,
      text: '学习Vue 3基础',
      completed: true,
      priority: 'high',
      createdAt: new Date()
    }
  ],
  filter: 'all', // all, active, completed
  nextId: 2
})`
  },
  {
    id: 'getters',
    label: 'Getters计算',
    content: `getters: {
  // 获取已完成的待办事项
  completedTodos: (state) => {
    return state.todos.filter(todo => todo.completed)
  },
  
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
    return {
      total,
      completed,
      active: total - completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }
}`
  },
  {
    id: 'actions',
    label: 'Actions操作',
    content: `actions: {
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
  }
}`
  }
]
</script>

<style scoped>
.todo-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.stats-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-weight: 500;
}

.todo-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.todo-main {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.add-todo {
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.add-todo-form {
  display: flex;
  gap: 15px;
  align-items: center;
}

.todo-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
}

.todo-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.priority-select {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
}

.controls {
  padding: 20px 25px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-controls label {
  font-weight: 500;
  color: #2c3e50;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #e9ecef;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active:hover {
  color: white;
}

.sort-controls {
  display: flex;
  gap: 10px;
}

.batch-actions {
  padding: 15px 25px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.todo-list {
  max-height: 600px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.todo-item:hover {
  background: #f8f9fa;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.todo-checkbox {
  margin-right: 15px;
}

.todo-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.todo-content {
  flex: 1;
}

.todo-text {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.4;
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #667eea;
  border-radius: 6px;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.todo-meta {
  display: flex;
  gap: 15px;
  align-items: center;
}

.priority-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.priority-badge.high {
  background: #e74c3c;
}

.priority-badge.medium {
  background: #f39c12;
}

.priority-badge.low {
  background: #27ae60;
}

.todo-date {
  color: #999;
  font-size: 0.9rem;
}

.todo-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.action-btn:hover {
  background: #f0f0f0;
}

.priority-mini-select {
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 1.2rem;
}

.priority-panel {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.priority-panel h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.priority-group {
  margin-bottom: 20px;
}

.priority-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  margin-bottom: 10px;
  color: white;
  font-weight: 500;
}

.priority-header.high {
  background: #e74c3c;
}

.priority-header.medium {
  background: #f39c12;
}

.priority-header.low {
  background: #27ae60;
}

.priority-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.priority-todos {
  padding-left: 15px;
}

.priority-todo {
  padding: 8px 0;
  color: #555;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
}

.priority-todo:last-child {
  border-bottom: none;
}

.priority-todo.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.more-todos {
  padding: 8px 0;
  color: #999;
  font-style: italic;
  font-size: 0.8rem;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.code-examples {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.code-examples h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.code-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.tab-btn {
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-btn:hover {
  color: #667eea;
}

.code-content pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 25px;
  border-radius: 10px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 1024px) {
  .todo-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .add-todo-form {
    flex-direction: column;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls,
  .sort-controls {
    justify-content: center;
  }
  
  .batch-actions {
    justify-content: center;
  }
  
  .todo-item {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .todo-actions {
    justify-content: center;
  }
}
</style>