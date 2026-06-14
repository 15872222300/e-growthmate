import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'growthmate_users';
const CURRENT_USER_KEY = 'growthmate_current_user';

// ========== 工具函数：从 localStorage 读写用户数据 ==========

function loadAllUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveAllUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function loadCurrentUserId() {
  return localStorage.getItem(CURRENT_USER_KEY) || null;
}

function saveCurrentUserId(id) {
  if (id) {
    localStorage.setItem(CURRENT_USER_KEY, id);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

// ========== 计算年龄/年级随时间推移自动更新 ==========

function computeAgeFromBirth(birthYear, birthMonth, birthDay) {
  const now = new Date();
  const birth = new Date(birthYear, birthMonth - 1, birthDay);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function computeGradeFromEnrollment(enrollmentYear, degreeType = 'bachelor') {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  // 9月是新学年开始
  let academicYear;
  if (currentMonth >= 9) {
    academicYear = currentYear - enrollmentYear + 1;
  } else {
    academicYear = currentYear - enrollmentYear;
  }

  if (academicYear <= 0) return '即将入学';

  if (degreeType === 'bachelor') {
    if (academicYear === 1) return '大一';
    if (academicYear === 2) return '大二';
    if (academicYear === 3) return '大三';
    if (academicYear === 4) return '大四';
    if (academicYear >= 5) return '大五/已毕业';
  } else if (degreeType === 'master') {
    if (academicYear === 1) return '研一';
    if (academicYear === 2) return '研二';
    if (academicYear === 3) return '研三';
    if (academicYear >= 4) return '已毕业';
  } else if (degreeType === 'doctor') {
    if (academicYear === 1) return '博一';
    if (academicYear === 2) return '博二';
    if (academicYear === 3) return '博三';
    if (academicYear === 4) return '博四';
    if (academicYear === 5) return '博五';
    if (academicYear >= 6) return '博六+/已毕业';
  }

  return '未知';
}

// ========== Provider ==========

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化：检查是否有已登录用户
  useEffect(() => {
    const uid = loadCurrentUserId();
    if (uid) {
      const allUsers = loadAllUsers();
      if (allUsers[uid]) {
        const stored = allUsers[uid];

        // 自动更新年龄和年级
        const updatedUser = refreshUserInfo(stored);

        setUser(updatedUser);

        // 如果数据有变化，自动保存
        if (JSON.stringify(updatedUser) !== JSON.stringify(stored)) {
          allUsers[uid] = updatedUser;
          saveAllUsers(allUsers);
        }
      } else {
        // 用户数据丢失，清除登录状态
        saveCurrentUserId(null);
      }
    }
    setLoading(false);
  }, []);

  // 刷新用户年龄和年级信息
  const refreshUserInfo = useCallback((userData) => {
    if (!userData) return userData;
    const updated = { ...userData };

    if (updated.birthYear && updated.birthMonth && updated.birthDay) {
      updated.age = computeAgeFromBirth(updated.birthYear, updated.birthMonth, updated.birthDay);
    }
    if (updated.enrollmentYear) {
      updated.grade = computeGradeFromEnrollment(updated.enrollmentYear, updated.degreeType || 'bachelor');
    }

    // 更新最后活跃时间
    updated.lastActiveAt = new Date().toISOString();

    return updated;
  }, []);

  // ========== 注册 ==========
  const register = useCallback(({ username, password, birthYear, birthMonth, birthDay, enrollmentYear, degreeType, educationHistory, major, targetDirection, email }) => {
    const allUsers = loadAllUsers();

    // 检查用户名是否已存在
    if (allUsers[username]) {
      return { success: false, error: '该用户名已被注册，请换一个试试' };
    }

    const dt = degreeType || 'bachelor';
    const age = birthYear ? computeAgeFromBirth(birthYear, birthMonth, birthDay) : null;
    const grade = enrollmentYear ? computeGradeFromEnrollment(enrollmentYear, dt) : null;

    const newUser = {
      id: username,
      username,
      password, // 实际项目应加密，此处为 demo
      email: email || '',
      birthYear: birthYear || null,
      birthMonth: birthMonth || null,
      birthDay: birthDay || null,
      age: age,
      enrollmentYear: enrollmentYear || null,
      degreeType: dt,
      educationHistory: educationHistory || '',
      grade: grade,
      major: major || '',
      targetDirection: targetDirection || '',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      // ========== 用户情绪状态 ==========
      recentMood: null,        // 最近心情
      // ========== 用户历史记录 ==========
      diagnosisHistory: [],    // 成长诊断历史
      chatHistory: [],         // AI聊天记录
      skillProgress: [],       // 技能训练记录
      projectHistory: [],      // 项目实践记录
      jobPrepHistory: [],      // 求职准备记录
      interviewReviews: [],    // 面试复盘记录
      studyPlans: [],          // 学习计划
      forumPosts: [],          // 论坛帖子
    };

    allUsers[username] = newUser;
    saveAllUsers(allUsers);
    saveCurrentUserId(username);
    setUser(newUser);

    return { success: true, user: newUser };
  }, []);

  // ========== 登录 ==========
  const login = useCallback(({ username, password }) => {
    const allUsers = loadAllUsers();
    const found = allUsers[username];

    if (!found) {
      return { success: false, error: '用户不存在，请先注册' };
    }
    if (found.password !== password) {
      return { success: false, error: '密码错误，请重试' };
    }

    // 自动更新年龄和年级
    const updatedUser = refreshUserInfo(found);

    if (JSON.stringify(updatedUser) !== JSON.stringify(found)) {
      allUsers[username] = updatedUser;
      saveAllUsers(allUsers);
    }

    saveCurrentUserId(username);
    setUser(updatedUser);

    return { success: true, user: updatedUser };
  }, [refreshUserInfo]);

  // ========== 退出登录 ==========
  const logout = useCallback(() => {
    saveCurrentUserId(null);
    setUser(null);
  }, []);

  // ========== 更新用户资料 ==========
  const updateProfile = useCallback((updates) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const updated = { ...user, ...updates, lastActiveAt: new Date().toISOString() };
    allUsers[user.username] = updated;
    saveAllUsers(allUsers);
    setUser(updated);
  }, [user]);

  // ========== 添加诊断记录 ==========
  const addDiagnosisRecord = useCallback((record) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const currentUser = allUsers[user.username];
    if (!currentUser) return;

    const diagnosisRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    currentUser.diagnosisHistory = [diagnosisRecord, ...(currentUser.diagnosisHistory || [])].slice(0, 50);
    currentUser.lastActiveAt = new Date().toISOString();

    allUsers[user.username] = currentUser;
    saveAllUsers(allUsers);
    setUser({ ...currentUser });
  }, [user]);

  // ========== 保存聊天记录 ==========
  const saveChatHistory = useCallback((sessionId, messages, mode) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const currentUser = allUsers[user.username];
    if (!currentUser) return;

    const session = {
      sessionId,
      mode,
      messages,
      timestamp: new Date().toISOString(),
    };

    // 更新或添加会话
    const existingIndex = currentUser.chatHistory.findIndex(s => s.sessionId === sessionId);
    if (existingIndex >= 0) {
      currentUser.chatHistory[existingIndex] = session;
    } else {
      currentUser.chatHistory.unshift(session);
    }
    // 最多保留30个会话
    currentUser.chatHistory = currentUser.chatHistory.slice(0, 30);
    currentUser.lastActiveAt = new Date().toISOString();

    allUsers[user.username] = currentUser;
    saveAllUsers(allUsers);
    setUser({ ...currentUser });
  }, [user]);

  // ========== 获取聊天记录 ==========
  const getChatHistory = useCallback((sessionId) => {
    if (!user) return null;
    return (user.chatHistory || []).find(s => s.sessionId === sessionId) || null;
  }, [user]);

  // ========== 添加技能训练记录 ==========
  const addSkillRecord = useCallback((record) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const currentUser = allUsers[user.username];
    if (!currentUser) return;

    currentUser.skillProgress = [record, ...(currentUser.skillProgress || [])].slice(0, 100);
    currentUser.lastActiveAt = new Date().toISOString();

    allUsers[user.username] = currentUser;
    saveAllUsers(allUsers);
    setUser({ ...currentUser });
  }, [user]);

  // ========== 添加项目记录 ==========
  const addProjectRecord = useCallback((record) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const currentUser = allUsers[user.username];
    if (!currentUser) return;

    currentUser.projectHistory = [record, ...(currentUser.projectHistory || [])].slice(0, 50);
    currentUser.lastActiveAt = new Date().toISOString();

    allUsers[user.username] = currentUser;
    saveAllUsers(allUsers);
    setUser({ ...currentUser });
  }, [user]);

  // ========== 学习计划管理 ==========
  const saveStudyPlan = useCallback((plan) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const currentUser = allUsers[user.username];
    if (!currentUser) return;

    const newPlan = {
      ...plan,
      id: plan.id || Date.now().toString(),
      createdAt: plan.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 更新或新增计划
    const existingIndex = (currentUser.studyPlans || []).findIndex(p => p.id === newPlan.id);
    if (existingIndex >= 0) {
      currentUser.studyPlans[existingIndex] = newPlan;
    } else {
      currentUser.studyPlans = [newPlan, ...(currentUser.studyPlans || [])];
    }
    currentUser.lastActiveAt = new Date().toISOString();

    allUsers[user.username] = currentUser;
    saveAllUsers(allUsers);
    setUser({ ...currentUser });
  }, [user]);

  const deleteStudyPlan = useCallback((planId) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const currentUser = allUsers[user.username];
    if (!currentUser) return;

    currentUser.studyPlans = (currentUser.studyPlans || []).filter(p => p.id !== planId);
    currentUser.lastActiveAt = new Date().toISOString();

    allUsers[user.username] = currentUser;
    saveAllUsers(allUsers);
    setUser({ ...currentUser });
  }, [user]);

  const getStudyPlans = useCallback(() => {
    if (!user) return [];
    return user.studyPlans || [];
  }, [user]);

  // ========== 面试复盘管理 ==========
  const saveInterviewReview = useCallback((record) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const currentUser = allUsers[user.username];
    if (!currentUser) return;

    const newRecord = {
      ...record,
      id: record.id || Date.now().toString(),
      createdAt: record.createdAt || new Date().toISOString(),
    };

    const existingIndex = (currentUser.interviewReviews || []).findIndex(r => r.id === newRecord.id);
    if (existingIndex >= 0) {
      currentUser.interviewReviews[existingIndex] = newRecord;
    } else {
      currentUser.interviewReviews = [newRecord, ...(currentUser.interviewReviews || [])];
    }
    // 最多保留50条
    currentUser.interviewReviews = currentUser.interviewReviews.slice(0, 50);
    currentUser.lastActiveAt = new Date().toISOString();

    allUsers[user.username] = currentUser;
    saveAllUsers(allUsers);
    setUser({ ...currentUser });
  }, [user]);

  const getInterviewReviews = useCallback(() => {
    if (!user) return [];
    return user.interviewReviews || [];
  }, [user]);

  const deleteInterviewReview = useCallback((recordId) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const currentUser = allUsers[user.username];
    if (!currentUser) return;

    currentUser.interviewReviews = (currentUser.interviewReviews || []).filter(r => r.id !== recordId);
    currentUser.lastActiveAt = new Date().toISOString();

    allUsers[user.username] = currentUser;
    saveAllUsers(allUsers);
    setUser({ ...currentUser });
  }, [user]);

  // ========== 论坛帖子管理 ==========
  const addForumPost = useCallback((post) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const currentUser = allUsers[user.username];
    if (!currentUser) return;

    const newPost = {
      ...post,
      id: post.id || Date.now().toString(),
      author: user.username,
      createdAt: post.createdAt || new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    currentUser.forumPosts = [newPost, ...(currentUser.forumPosts || [])].slice(0, 200);
    currentUser.lastActiveAt = new Date().toISOString();

    // 同时保存到全局帖子池
    const allPosts = JSON.parse(localStorage.getItem('growthmate_forum_posts') || '[]');
    allPosts.unshift(newPost);
    localStorage.setItem('growthmate_forum_posts', JSON.stringify(allPosts.slice(0, 500)));

    allUsers[user.username] = currentUser;
    saveAllUsers(allUsers);
    setUser({ ...currentUser });
    return newPost;
  }, [user]);

  const getForumPosts = useCallback(() => {
    const allPosts = JSON.parse(localStorage.getItem('growthmate_forum_posts') || '[]');
    return allPosts;
  }, []);

  const toggleLikeForumPost = useCallback((postId) => {
    const allPosts = JSON.parse(localStorage.getItem('growthmate_forum_posts') || '[]');
    const idx = allPosts.findIndex(p => p.id === postId);
    if (idx === -1) return allPosts;

    const likedPosts = JSON.parse(localStorage.getItem('growthmate_liked_posts') || '[]');
    const likedIdx = likedPosts.indexOf(postId);

    if (likedIdx >= 0) {
      allPosts[idx].likes = Math.max(0, (allPosts[idx].likes || 0) - 1);
      likedPosts.splice(likedIdx, 1);
    } else {
      allPosts[idx].likes = (allPosts[idx].likes || 0) + 1;
      likedPosts.push(postId);
    }

    localStorage.setItem('growthmate_forum_posts', JSON.stringify(allPosts));
    localStorage.setItem('growthmate_liked_posts', JSON.stringify(likedPosts));
    return allPosts;
  }, []);

  const addForumComment = useCallback((postId, comment) => {
    const allPosts = JSON.parse(localStorage.getItem('growthmate_forum_posts') || '[]');
    const idx = allPosts.findIndex(p => p.id === postId);
    if (idx === -1) return allPosts;

    const newComment = {
      id: Date.now().toString(),
      author: user?.username || '匿名',
      content: comment,
      createdAt: new Date().toISOString(),
    };

    allPosts[idx].comments = [...(allPosts[idx].comments || []), newComment];
    localStorage.setItem('growthmate_forum_posts', JSON.stringify(allPosts));
    return allPosts;
  }, [user]);

  const isPostLiked = useCallback((postId) => {
    const likedPosts = JSON.parse(localStorage.getItem('growthmate_liked_posts') || '[]');
    return likedPosts.includes(postId);
  }, []);

  // ========== 收藏帖子管理 ==========
  const toggleFavoritePost = useCallback((postId) => {
    const favorites = JSON.parse(localStorage.getItem('growthmate_favorite_posts') || '[]');
    const idx = favorites.indexOf(postId);
    if (idx >= 0) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(postId);
    }
    localStorage.setItem('growthmate_favorite_posts', JSON.stringify(favorites));
    return favorites;
  }, []);

  const getFavoritePosts = useCallback(() => {
    const favorites = JSON.parse(localStorage.getItem('growthmate_favorite_posts') || '[]');
    const allPosts = JSON.parse(localStorage.getItem('growthmate_forum_posts') || '[]');
    return allPosts.filter(p => favorites.includes(p.id));
  }, []);

  const isPostFavorited = useCallback((postId) => {
    const favorites = JSON.parse(localStorage.getItem('growthmate_favorite_posts') || '[]');
    return favorites.includes(postId);
  }, []);

  // ========== 用户社区统计数据 ==========
  const getUserCommunityStats = useCallback(() => {
    if (!user) return { myPosts: 0, myLikes: 0, myFavorites: 0, receivedLikes: 0, receivedFavorites: 0 };
    const allPosts = JSON.parse(localStorage.getItem('growthmate_forum_posts') || '[]');
    const favorites = JSON.parse(localStorage.getItem('growthmate_favorite_posts') || '[]');

    // 我的帖子
    const myPosts = allPosts.filter(p => p.author === user.username);

    // 我点赞的帖子数
    const likedPosts = JSON.parse(localStorage.getItem('growthmate_liked_posts') || '[]');
    const myLikes = likedPosts.length;

    // 我收藏的帖子数
    const myFavorites = favorites.length;

    // 我收到的赞（所有我的帖子被点赞的总和）
    const receivedLikes = myPosts.reduce((sum, p) => sum + (p.likes || 0), 0);

    // 我收到的收藏（被收藏的帖子中，作者是我的）
    const receivedFavorites = allPosts.filter(p => p.author === user.username && favorites.includes(p.id)).length;

    return { myPosts: myPosts.length, myLikes, myFavorites, receivedLikes, receivedFavorites };
  }, [user]);

  // ========== 更新最近心情 ==========
  const updateMood = useCallback((mood) => {
    if (!user) return;
    const allUsers = loadAllUsers();
    const currentUser = allUsers[user.username];
    if (!currentUser) return;

    currentUser.recentMood = {
      mood,
      timestamp: new Date().toISOString(),
    };
    currentUser.lastActiveAt = new Date().toISOString();

    allUsers[user.username] = currentUser;
    saveAllUsers(allUsers);
    setUser({ ...currentUser });
  }, [user]);

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    addDiagnosisRecord,
    saveChatHistory,
    getChatHistory,
    addSkillRecord,
    addProjectRecord,
    refreshUserInfo,
    updateMood,
    saveStudyPlan,
    deleteStudyPlan,
    getStudyPlans,
    saveInterviewReview,
    getInterviewReviews,
    deleteInterviewReview,
    addForumPost,
    getForumPosts,
    toggleLikeForumPost,
    addForumComment,
    isPostLiked,
    toggleFavoritePost,
    getFavoritePosts,
    isPostFavorited,
    getUserCommunityStats,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用');
  return ctx;
}
