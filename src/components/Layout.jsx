import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Drawer } from 'tdesign-react';
import { MenuUnfoldIcon } from 'tdesign-icons-react';
import SidePanel from './SidePanel';

const navItems = [
  { path: '/', label: '🏠 首页', icon: '🏠' },
  { path: '/study-plan', label: '📋 学习计划', icon: '📋' },
  {
    id: 'discover',
    path: null,
    label: '🔍 自我探索',
    icon: '🔍',
    children: [
      { path: '/diagnosis', label: '🔍 成长诊断', icon: '🔍' },
      { path: '/career-map', label: '🗺️ 职业探索', icon: '🗺️' },
    ],
  },
  {
    id: 'skills',
    path: null,
    label: '🚀 能力提升',
    icon: '🚀',
    children: [
      { path: '/ai-skill', label: '🗺️ AI技能地图', icon: '🗺️' },
      { path: '/skill-center', label: '📚 技能成长', icon: '📚' },
      { path: '/project-workshop', label: '🔧 项目实践', icon: '🔧' },
    ],
  },
  {
    id: 'job-prep',
    path: null,
    label: '💼 求职准备',
    icon: '💼',
    children: [
      { path: '/job-prep', label: '💼 求职准备', icon: '💼' },
      { path: '/interview-review', label: '💭 面试复盘', icon: '💭' },
    ],
  },
  {
    id: 'emotion',
    path: null,
    label: '💙 情绪关怀',
    icon: '💙',
    children: [
      { path: '/emotion-comfort', label: '💙 情绪陪伴室', icon: '💙' },
      { path: '/ai-chat', label: '💬 AI 聊天', icon: '💬' },
    ],
  },
  { path: '/community', label: '🌐 成长社区', icon: '🌐' },
];

// 扁平化导航项（用于 Drawer 侧边栏）
const flatNavItems = [
  { path: '/', label: '🏠 首页' },
  { path: '/study-plan', label: '📋 学习计划' },
  { path: '/diagnosis', label: '🔍 成长诊断' },
  { path: '/career-map', label: '🗺️ 职业探索' },
  { path: '/ai-skill', label: '🗺️ AI技能地图' },
  { path: '/skill-center', label: '📚 技能成长' },
  { path: '/project-workshop', label: '🔧 项目实践' },
  { path: '/job-prep', label: '💼 求职准备' },
  { path: '/interview-review', label: '💭 面试复盘' },
  { path: '/emotion-comfort', label: '💙 情绪陪伴室' },
  { path: '/ai-chat', label: '💬 AI 聊天' },
  { path: '/community', label: '🌐 成长社区' },
];

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const discoverRef = useRef(null);
  const skillsRef = useRef(null);
  const jobPrepRef = useRef(null);
  const emotionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const refMap = { discover: discoverRef, skills: skillsRef, 'job-prep': jobPrepRef, emotion: emotionRef };

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (e) => {
      const anyOpen = Object.entries(refMap).find(([, ref]) =>
        ref.current && ref.current.contains(e.target)
      );
      if (!anyOpen) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 所有下拉子路径
  const allChildPaths = navItems
    .filter(item => item.children)
    .flatMap(item => item.children.map(c => c.path));

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div
            onClick={() => navigate('/')}
            className="brand"
            style={{ cursor: 'pointer' }}
          >
            <span className="brand-mark">🐧</span>
            <span className="brand-name gradient-text">鹅伴 GrowthMate</span>
          </div>

          <nav className="desktop-nav" aria-label="主导航">
            {navItems.map(item => {
              // 带 children 的下拉菜单项
              if (item.children) {
                const isOpen = openDropdown === item.id;
                const active = allChildPaths.includes(location.pathname) &&
                  item.children.some(c => c.path === location.pathname);
                return (
                  <div
                    key={item.id}
                    ref={refMap[item.id]}
                    style={{ position: 'relative' }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                      className={`nav-item${active ? ' nav-item-active' : ''}`}
                      title={item.label.replace(item.icon, '').trim()}
                      style={{ gap: 4 }}
                    >
                      <span aria-hidden="true">{item.icon}</span>
                      <span className="nav-label">{item.label.replace(item.icon, '').trim()}</span>
                      <span style={{
                        fontSize: 10,
                        transition: 'transform var(--transition)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}>▼</span>
                    </button>
                    {isOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: 6,
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,.12)',
                        border: '1px solid var(--border)',
                        padding: 6,
                        minWidth: 160,
                        zIndex: 200,
                        animation: 'fadeIn 0.2s ease-out',
                      }}>
                        {item.children.map(child => {
                          const childActive = location.pathname === child.path;
                          return (
                            <button
                              key={child.path}
                              type="button"
                              onClick={() => {
                                navigate(child.path);
                                setOpenDropdown(null);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                width: '100%',
                                padding: '9px 14px',
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: childActive ? 700 : 500,
                                color: childActive ? 'var(--primary)' : 'var(--text)',
                                background: childActive ? 'var(--primary-light)' : 'transparent',
                                transition: 'all var(--transition)',
                                textAlign: 'left',
                              }}
                              onMouseEnter={e => { if (!childActive) e.currentTarget.style.background = 'var(--bg)'; }}
                              onMouseLeave={e => { if (!childActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                              <span>{child.icon}</span>
                              <span>{child.label.replace(child.icon, '').trim()}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // 普通导航项
              const active = location.pathname === item.path;
              return (
                <button
                  type="button"
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-item${active ? ' nav-item-active' : ''}`}
                  title={item.label.replace(item.icon, '').trim()}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span className="nav-label">{item.label.replace(item.icon, '').trim()}</span>
                </button>
              );
            })}
          </nav>

          <Button
            className="mobile-menu-button"
            variant="text"
            shape="circle"
            icon={<MenuUnfoldIcon />}
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </header>

      <div className="app-body">
        <main className="app-main">
          {children}
        </main>
        <SidePanel />
      </div>

      <footer className="app-footer">
        <div className="app-footer-title">🐧 鹅伴 GrowthMate</div>
        <div>陪你从校园拿到心仪Offer · 求职陪伴 Demo</div>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
          本 Demo 为 AI 求职成长陪伴产品原型，数据为模拟展示
        </div>
      </footer>

      <Drawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        header={<span className="gradient-text" style={{ fontWeight: 700 }}>🐧 e职伴</span>}
        size="300px"
      >
        <div className="drawer-nav">
          {flatNavItems.map(item => (
            <button
              type="button"
              key={item.path}
              onClick={() => { navigate(item.path); setDrawerOpen(false); }}
              className={`drawer-nav-item${location.pathname === item.path ? ' drawer-nav-item-active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
