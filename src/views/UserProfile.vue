<template>
  <div class="profile-page">
    <div class="page-header">
      <h1>👤 用户管理</h1>
      <p>学习异步操作、错误处理和复杂状态管理</p>
    </div>

    <!-- 登录状态显示 -->
    <div v-if="!userStore.isLoggedIn" class="login-section">
      <div class="login-card">
        <h2>🔐 用户登录</h2>
        <p>请登录以查看用户资料</p>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>邮箱地址：</label>
            <input
              v-model="loginForm.email"
              type="email"
              placeholder="请输入邮箱"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label>密码：</label>
            <input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              required
              class="form-input"
            >
          </div>
          
          <button
            type="submit"
            :disabled="userStore.isLoading"
            class="btn btn-primary btn-block"
          >
            {{ userStore.isLoading ? '登录中...' : '登录' }}
          </button>
        </form>
        
        <!-- 错误信息显示 -->
        <div v-if="userStore.error" class="error-message">
          ❌ {{ userStore.error }}
          <button @click="userStore.clearError()" class="error-close">×</button>
        </div>
        
        <!-- 测试账号提示 -->
        <div class="test-accounts">
          <h4>测试账号：</h4>
          <div class="account-item">
            <strong>管理员：</strong> admin@example.com / admin123
          </div>
          <div class="account-item">
            <strong>普通用户：</strong> user@example.com / user123
          </div>
        </div>
      </div>
    </div>

    <!-- 用户资料显示 -->
    <div v-else class="profile-section">
      <div class="profile-grid">
        <!-- 用户信息卡片 -->
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar">
              <img :src="userStore.avatarUrl" :alt="userStore.fullName" />
            </div>
            <div class="user-info">
              <h2>{{ userStore.fullName }}</h2>
              <p class="user-email">{{ userStore.user.email }}</p>
              <span :class="['role-badge', userStore.userRole]">
                {{ getRoleLabel(userStore.userRole) }}
              </span>
            </div>
          </div>
          
          <div class="profile-details">
            <div class="detail-item">
              <span class="detail-label">用户ID：</span>
              <span class="detail-value">{{ userStore.user.id }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">注册时间：</span>
              <span class="detail-value">{{ formatDate(userStore.user.createdAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">最后登录：</span>
              <span class="detail-value">{{ formatDate(userStore.user.lastLoginAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">管理员权限：</span>
              <span class="detail-value">
                {{ userStore.isAdmin ? '是' : '否' }}
              </span>
            </div>
          </div>
          
          <div class="profile-actions">
            <button @click="showEditForm = true" class="btn btn-primary">
              ✏️ 编辑资料
            </button>
            <button @click="refreshUserData" :disabled="userStore.isLoading" class="btn btn-secondary">
              {{ userStore.isLoading ? '刷新中...' : '🔄 刷新数据' }}
            </button>
            <button @click="userStore.logout()" class="btn btn-danger">
              🚪 退出登录
            </button>
          </div>
        </div>

        <!-- 用户偏好设置 -->
        <div class="preferences-card">
          <h3>⚙️ 偏好设置</h3>
          
          <div class="preference-item">
            <label>主题模式：</label>
            <div class="theme-toggle">
              <button
                @click="userStore.toggleTheme()"
                :class="['theme-btn', userStore.preferences.theme]"
              >
                {{ userStore.preferences.theme === 'light' ? '🌞 浅色' : '🌙 深色' }}
              </button>
            </div>
          </div>
          
          <div class="preference-item">
            <label>语言设置：</label>
            <select
              :value="userStore.preferences.language"
              @change="updateLanguage($event.target.value)"
              class="preference-select"
            >
              <option value="zh-CN">中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </select>
          </div>
          
          <div class="preference-item">
            <label>通知设置：</label>
            <div class="notification-toggle">
              <input
                type="checkbox"
                :checked="userStore.preferences.notifications"
                @change="userStore.toggleNotifications()"
                id="notifications"
              >
              <label for="notifications" class="toggle-label">
                {{ userStore.preferences.notifications ? '开启' : '关闭' }}
              </label>
            </div>
          </div>
        </div>

        <!-- 登录历史 -->
        <div class="history-card">
          <div class="history-header">
            <h3>📊 登录历史</h3>
            <button @click="userStore.clearLoginHistory()" class="btn btn-sm btn-outline">
              清空历史
            </button>
          </div>
          
          <div class="history-stats">
            <div class="stat-item">
              <span class="stat-number">{{ userStore.loginHistory.length }}</span>
              <span class="stat-label">总记录</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getSuccessLoginCount() }}</span>
              <span class="stat-label">成功登录</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getFailedLoginCount() }}</span>
              <span class="stat-label">失败尝试</span>
            </div>
          </div>
          
          <div class="history-list">
            <div
              v-for="record in userStore.loginHistory.slice(0, 5)"
              :key="record.id"
              :class="['history-item', record.type]"
            >
              <div class="history-type">
                {{ getHistoryTypeLabel(record.type) }}
              </div>
              <div class="history-time">
                {{ formatDateTime(record.timestamp) }}
              </div>
              <div v-if="record.message" class="history-message">
                {{ record.message }}
              </div>
            </div>
            
            <div v-if="userStore.loginHistory.length === 0" class="empty-history">
              暂无登录历史
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑资料模态框 -->
    <div v-if="showEditForm" class="modal-overlay" @click="closeEditForm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑用户资料</h3>
          <button @click="closeEditForm" class="modal-close">×</button>
        </div>
        
        <form @submit.prevent="saveProfile" class="edit-form">
          <div class="form-group">
            <label>名字：</label>
            <input
              v-model="editForm.firstName"
              type="text"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label>姓氏：</label>
            <input
              v-model="editForm.lastName"
              type="text"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label>邮箱：</label>
            <input
              v-model="editForm.email"
              type="email"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeEditForm" class="btn btn-secondary">
              取消
            </button>
            <button type="submit" class="btn btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 代码示例 -->
    <div class="code-examples">
      <h2>💻 User Store 代码</h2>
      
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
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'

// 使用user store
const userStore = useUserStore()

// 响应式数据
const showEditForm = ref(false)
const activeTab = ref('async')

const loginForm = reactive({
  email: '',
  password: ''
})

const editForm = reactive({
  firstName: '',
  lastName: '',
  email: ''
})

// 方法
const handleLogin = async () => {
  try {
    await userStore.login(loginForm.email, loginForm.password)
    // 登录成功后重置表单
    loginForm.email = ''
    loginForm.password = ''
  } catch (error) {
    // 错误已经在store中处理
    console.error('登录失败:', error.message)
  }
}

const refreshUserData = async () => {
  try {
    await userStore.fetchUserData()
  } catch (error) {
    console.error('刷新用户数据失败:', error)
  }
}

const updateLanguage = (language) => {
  userStore.updatePreferences({ language })
}

const closeEditForm = () => {
  showEditForm.value = false
}

const saveProfile = () => {
  userStore.updateProfile({
    firstName: editForm.firstName,
    lastName: editForm.lastName,
    email: editForm.email
  })
  closeEditForm()
}

// 当显示编辑表单时，填充当前用户数据
const openEditForm = () => {
  if (userStore.user) {
    editForm.firstName = userStore.user.firstName
    editForm.lastName = userStore.user.lastName
    editForm.email = userStore.user.email
  }
  showEditForm.value = true
}

// 工具函数
const getRoleLabel = (role) => {
  const labels = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客'
  }
  return labels[role] || role
}

const getHistoryTypeLabel = (type) => {
  const labels = {
    success: '✅ 登录成功',
    failed: '❌ 登录失败',
    logout: '🚪 退出登录'
  }
  return labels[type] || type
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const getSuccessLoginCount = () => {
  return userStore.loginHistory.filter(record => record.type === 'success').length
}

const getFailedLoginCount = () => {
  return userStore.loginHistory.filter(record => record.type === 'failed').length
}

// 代码示例
const codeTabs = [
  {
    id: 'async',
    label: '异步Actions',
    content: `// 异步登录操作
async login(email, password) {
  this.isLoading = true
  this.error = null
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟登录验证
    if (email === 'admin@example.com' && password === 'admin123') {
      this.user = {
        id: 1,
        email: 'admin@example.com',
        firstName: '管理员',
        lastName: '用户',
        role: 'admin'
      }
    } else {
      throw new Error('邮箱或密码错误')
    }
    
    // 记录登录历史
    this.addLoginHistory('success')
    
    return this.user
  } catch (error) {
    this.error = error.message
    this.addLoginHistory('failed', error.message)
    throw error
  } finally {
    this.isLoading = false
  }
}`
  },
  {
    id: 'getters',
    label: 'Getters计算',
    content: `getters: {
  // 检查用户是否已登录
  isLoggedIn: (state) => !!state.user,
  
  // 获取用户全名
  fullName: (state) => {
    if (!state.user) return ''
    return \`\${state.user.firstName} \${state.user.lastName}\`
  },
  
  // 获取用户头像URL
  avatarUrl: (state) => {
    if (!state.user) return ''
    return state.user.avatar || 
      \`https://ui-avatars.com/api/?name=\${state.user.firstName}+\${state.user.lastName}&background=667eea&color=fff\`
  },
  
  // 检查是否为管理员
  isAdmin: (state) => {
    return state.user?.role === 'admin'
  }
}`
  },
  {
    id: 'error',
    label: '错误处理',
    content: `// 组件中的错误处理
const handleLogin = async () => {
  try {
    await userStore.login(loginForm.email, loginForm.password)
    // 登录成功后重置表单
    loginForm.email = ''
    loginForm.password = ''
  } catch (error) {
    // 错误已经在store中处理并设置到error状态
    console.error('登录失败:', error.message)
  }
}

// Store中的错误处理
actions: {
  async login(email, password) {
    this.isLoading = true
    this.error = null // 清除之前的错误
    
    try {
      // ... 登录逻辑
    } catch (error) {
      this.error = error.message // 设置错误信息
      throw error // 重新抛出错误供组件处理
    } finally {
      this.isLoading = false // 确保loading状态被重置
    }
  },
  
  clearError() {
    this.error = null
  }
}`
  }
]
</script>

<style scoped>
.profile-page {
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

.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.login-card h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  text-align: center;
}

.login-card p {
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c0392b;
}

.btn-block {
  width: 100%;
  justify-content: center;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-close {
  background: none;
  border: none;
  color: #721c24;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.test-accounts {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.test-accounts h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.account-item {
  margin-bottom: 8px;
  color: #555;
  font-size: 0.9rem;
}

.profile-section {
  margin-bottom: 40px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.profile-card {
  grid-column: 1 / -1;
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 2px solid #f0f0f0;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #667eea;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info h2 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.user-email {
  color: #666;
  margin-bottom: 10px;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.role-badge.admin {
  background: #e74c3c;
}

.role-badge.user {
  background: #27ae60;
}

.role-badge.guest {
  background: #95a5a6;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-label {
  font-weight: 500;
  color: #555;
}

.detail-value {
  font-weight: 600;
  color: #2c3e50;
}

.profile-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.preferences-card,
.history-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.preferences-card h3,
.history-card h3 {
  color: #2c3e50;
  margin-bottom: 25px;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.preference-item:last-child {
  border-bottom: none;
}

.preference-item label {
  font-weight: 500;
  color: #555;
}

.theme-btn {
  padding: 8px 16px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-btn:hover {
  background: #667eea;
  color: white;
}

.theme-btn.dark {
  background: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

.preference-select {
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  background: white;
}

.notification-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-label {
  cursor: pointer;
  font-weight: 500;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  border-left: 4px solid #ddd;
}

.history-item.success {
  background: #d4edda;
  border-left-color: #28a745;
}

.history-item.failed {
  background: #f8d7da;
  border-left-color: #dc3545;
}

.history-item.logout {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.history-type {
  font-weight: 600;
  margin-bottom: 5px;
}

.history-time {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.history-message {
  color: #555;
  font-size: 0.9rem;
  font-style: italic;
}

.empty-history {
  text-align: center;
  color: #999;
  padding: 40px;
  font-style: italic;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 0;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 2px solid #f0f0f0;
}

.modal-header h3 {
  color: #2c3e50;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #666;
}

.edit-form {
  padding: 30px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 25px;
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
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-details {
    grid-template-columns: 1fr;
  }
  
  .profile-actions {
    justify-content: center;
  }
  
  .preference-item {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .history-stats {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>