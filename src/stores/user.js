import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
    preferences: {
      theme: 'light',
      language: 'zh-CN',
      notifications: true
    },
    loginHistory: []
  }),

  getters: {
    // 检查用户是否已登录
    isLoggedIn: (state) => !!state.user,
    
    // 获取用户全名
    fullName: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`
    },
    
    // 获取用户头像URL
    avatarUrl: (state) => {
      if (!state.user) return ''
      return state.user.avatar || `https://ui-avatars.com/api/?name=${state.user.firstName}+${state.user.lastName}&background=667eea&color=fff`
    },
    
    // 获取用户角色
    userRole: (state) => {
      if (!state.user) return 'guest'
      return state.user.role || 'user'
    },
    
    // 检查是否为管理员
    isAdmin: (state) => {
      return state.user?.role === 'admin'
    },
    
    // 获取最近登录时间
    lastLoginTime: (state) => {
      if (state.loginHistory.length === 0) return null
      return state.loginHistory[0].timestamp
    }
  },

  actions: {
    // 模拟用户登录
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
            role: 'admin',
            avatar: null,
            createdAt: new Date('2024-01-01'),
            lastLoginAt: new Date()
          }
        } else if (email === 'user@example.com' && password === 'user123') {
          this.user = {
            id: 2,
            email: 'user@example.com',
            firstName: '普通',
            lastName: '用户',
            role: 'user',
            avatar: null,
            createdAt: new Date('2024-01-02'),
            lastLoginAt: new Date()
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
    },
    
    // 用户登出
    logout() {
      this.user = null
      this.error = null
      this.addLoginHistory('logout')
    },
    
    // 更新用户信息
    updateProfile(updates) {
      if (this.user) {
        this.user = { ...this.user, ...updates }
      }
    },
    
    // 更新用户偏好设置
    updatePreferences(newPreferences) {
      this.preferences = { ...this.preferences, ...newPreferences }
    },
    
    // 切换主题
    toggleTheme() {
      this.preferences.theme = this.preferences.theme === 'light' ? 'dark' : 'light'
    },
    
    // 切换通知设置
    toggleNotifications() {
      this.preferences.notifications = !this.preferences.notifications
    },
    
    // 添加登录历史记录
    addLoginHistory(type, message = '') {
      this.loginHistory.unshift({
        id: Date.now(),
        type, // success, failed, logout
        message,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      })
      
      // 只保留最近20条记录
      if (this.loginHistory.length > 20) {
        this.loginHistory = this.loginHistory.slice(0, 20)
      }
    },
    
    // 清除登录历史
    clearLoginHistory() {
      this.loginHistory = []
    },
    
    // 模拟获取用户数据
    async fetchUserData() {
      if (!this.user) return
      
      this.isLoading = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟更新用户数据
        this.user.lastLoginAt = new Date()
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    
    // 重置错误状态
    clearError() {
      this.error = null
    }
  }
})