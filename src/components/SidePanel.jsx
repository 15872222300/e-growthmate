import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Tag, Progress, MessagePlugin } from 'tdesign-react';
import { useAuth } from '../context/AuthContext';

// 心情选项
const MOOD_OPTIONS = [
  { emoji: '😊', label: '开心', color: '#10b981' },
  { emoji: '😌', label: '平静', color: '#6366f1' },
  { emoji: '😐', label: '一般', color: '#94a3b8' },
  { emoji: '😔', label: '低落', color: '#f59e0b' },
  { emoji: '😰', label: '焦虑', color: '#ef4444' },
  { emoji: '💪', label: '加油', color: '#0052d9' },
];

// 任务模块定义
const TASK_MODULES = [
  { key: 'diagnosisHistory', label: '成长诊断', icon: '🔍', route: '/diagnosis', target: 1 },
  { key: 'skillProgress', label: '技能训练', icon: '📚', route: '/skill-center', target: 5 },
  { key: 'projectHistory', label: '项目实践', icon: '🔧', route: '/project-workshop', target: 2 },
  { key: 'jobPrepHistory', label: '求职准备', icon: '💼', route: '/job-prep', target: 3 },
];

export default function SidePanel() {
  const { user, logout, updateMood } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [moodOpen, setMoodOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null; // 未登录不显示

  const degreeMap = { bachelor: '本科', master: '硕士', doctor: '博士' };
  const degreeLabel = degreeMap[user.degreeType] || '本科';

  const majorMap = { cs: '计算机/软件工程', media: '新闻传播/中文', marketing: '市场营销/工商管理', design: '设计类', finance: '金融/经济', medical: '医学/生物', law: '法学', architecture: '城市规划/建筑', other: '其他专业' };

  const totalTasks = TASK_MODULES.reduce((sum, m) => sum + (user[m.key]?.length || 0), 0);
  const maxTasks = 11;
  const overallProgress = Math.min(100, Math.round((totalTasks / maxTasks) * 100));

  const handleMoodSelect = (mood) => {
    updateMood(mood.label);
    setMoodOpen(false);
    MessagePlugin.success(`心情已记录：${mood.emoji} ${mood.label}`);
  };

  if (collapsed) {
    return (
      <aside className="side-panel side-panel-collapsed">
        <button className="side-panel-toggle" onClick={() => setCollapsed(false)} title="展开个人面板">
          👤
        </button>
        <div className="side-panel-mini-avatar">
          🐧
        </div>
      </aside>
    );
  }

  return (
    <aside className="side-panel">
      {/* 折叠按钮 */}
      <button className="side-panel-toggle" onClick={() => setCollapsed(true)} title="收起面板">
        ✕
      </button>

      {/* 用户头像区 */}
      <div className="side-panel-header">
        <div className="side-panel-avatar">
          <span>🐧</span>
        </div>
        <div className="side-panel-name">{user.username}</div>
        <div className="side-panel-degree">
          <Tag size="small" theme="primary" variant="light">{degreeLabel}</Tag>
          {user.grade && <Tag size="small" theme="success" variant="light">{user.grade}</Tag>}
        </div>
        {user.age && (
          <div className="side-panel-age">{user.age}岁</div>
        )}
        {user.major && (
          <div className="side-panel-major">{majorMap[user.major] || user.major}</div>
        )}
      </div>

      {/* 总体进度 */}
      <div className="side-panel-section">
        <div className="side-panel-section-title">📊 成长总进度</div>
        <Progress
          percentage={overallProgress}
          strokeWidth={8}
          theme="plump"
          color={{ from: '#0052d9', to: '#8b5cf6' }}
        />
        <div className="side-panel-progress-text">
          已完成 {totalTasks} 项任务
        </div>
      </div>

      {/* 各项任务进度 */}
      <div className="side-panel-section">
        <div className="side-panel-section-title">🎯 各模块进度</div>
        <div className="side-panel-task-list">
          {TASK_MODULES.map(mod => {
            const count = user[mod.key]?.length || 0;
            const pct = Math.min(100, Math.round((count / mod.target) * 100));
            const isActive = location.pathname === mod.route;
            return (
              <div
                key={mod.key}
                className={`side-panel-task-item${isActive ? ' side-panel-task-active' : ''}`}
                onClick={() => navigate(mod.route)}
                title={`前往${mod.label}`}
              >
                <div className="side-panel-task-header">
                  <span className="side-panel-task-icon">{mod.icon}</span>
                  <span className="side-panel-task-label">{mod.label}</span>
                  <span className="side-panel-task-count">{count}/{mod.target}</span>
                </div>
                <Progress
                  percentage={pct}
                  strokeWidth={4}
                  theme="line"
                  color={pct >= 100 ? '#10b981' : pct >= 50 ? '#0052d9' : '#94a3b8'}
                  trackColor="#f1f5f9"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 最近心情 */}
      <div className="side-panel-section">
        <div className="side-panel-section-title">
          💙 最近心情
          <button
            className="side-panel-mood-btn"
            onClick={() => setMoodOpen(!moodOpen)}
          >
            {moodOpen ? '收起' : '记录'}
          </button>
        </div>
        {user.recentMood ? (
          <div className="side-panel-mood-display">
            <span style={{ fontSize: 24 }}>
              {MOOD_OPTIONS.find(m => m.label === user.recentMood.mood)?.emoji || '😊'}
            </span>
            <div>
              <div className="side-panel-mood-label">{user.recentMood.mood}</div>
              <div className="side-panel-mood-time">
                {new Date(user.recentMood.timestamp).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>
        ) : (
          <div className="side-panel-mood-empty">点击"记录"标记今天的心情</div>
        )}
        {moodOpen && (
          <div className="side-panel-mood-grid">
            {MOOD_OPTIONS.map(mood => (
              <button
                key={mood.label}
                className="side-panel-mood-item"
                onClick={() => handleMoodSelect(mood)}
                title={mood.label}
                style={{ '--mood-color': mood.color }}
              >
                <span style={{ fontSize: 22 }}>{mood.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: mood.color }}>{mood.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 快捷操作 */}
      <div className="side-panel-section">
        <Button
          block
          variant="outline"
          onClick={() => navigate('/diagnosis')}
          style={{
            height: 38,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 8,
            borderRadius: 10,
          }}
        >
          🔍 重新诊断
        </Button>
        <Button
          block
          variant="text"
          onClick={logout}
          style={{
            height: 34,
            fontSize: 12,
            color: '#94a3b8',
          }}
        >
          🚪 退出登录
        </Button>
      </div>
    </aside>
  );
}
