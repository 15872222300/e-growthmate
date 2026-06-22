import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Progress, Tag } from 'tdesign-react';
import { ChevronRightIcon } from 'tdesign-icons-react';

const features = [
  { icon: '🔍', title: 'AI成长诊断', desc: '精准评估你的当前阶段，生成个性化成长画像与建议', to: '/diagnosis', color: '#E8927C' },
  { icon: '🗺️', title: '职业探索地图', desc: '提前了解岗位与企业文化，打破信息差', to: '/career-map', color: '#8CB89F' },
  { icon: '🤖', title: '专业AI能力定制', desc: '根据专业背景生成差异化的AI能力培养路径', to: '/ai-skill', color: '#A8C8E8' },
  { icon: '📚', title: '技能成长中心', desc: '每日任务卡驱动，覆盖职场全维度技能', to: '/skill-center', color: '#B8A9C9' },
  { icon: '🔧', title: '项目实践工坊', desc: '完成可写入简历的实战项目', to: '/project-workshop', color: '#E8C46A' },
  { icon: '💼', title: '求职准备中心', desc: '简历优化、模拟面试、岗位匹配', to: '/job-prep', color: '#A68A3C' },
  { icon: '🧪', title: 'A/B 测试实验室', desc: '数据驱动体验优化，模拟 A/B 测试验证产品迭代方向', to: '/ab-test-lab', color: '#D4C08A' },
];

const growthPath = [
  { step: '职业认知', icon: '👀', desc: '了解行业与岗位' },
  { step: 'AI能力培养', icon: '🤖', desc: '专业AI技能训练' },
  { step: '职场技能', icon: '📚', desc: '通用与专业能力' },
  { step: '项目实践', icon: '🔧', desc: '产出真实作品' },
  { step: '求职准备', icon: '💼', desc: '简历与面试' },
  { step: '职场适应', icon: '🚀', desc: '持续成长陪伴' },
];

export default function Home() {
  const navigate = useNavigate();
  const [activeVersion, setActiveVersion] = useState(null);

  return (
    <div className="page-container">
      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
        position: 'relative',
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: 24,
          border: '2px solid var(--border-color)',
          background: 'var(--brand-yellow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
          fontSize: 44,
          boxShadow: 'var(--shadow)',
        }}>🐧</div>
        <h1 style={{
          fontSize: 48, fontWeight: 800, letterSpacing: -1,
          marginBottom: 6, color: 'var(--text-primary)',
        }}>
          鹅伴 GrowthMate
        </h1>
        <p style={{
          fontSize: 17, color: 'var(--text-secondary)',
          maxWidth: 620, margin: '0 auto 36px',
          lineHeight: 1.9,
        }}>
          一只懂求职的 AI 企鹅 🐧，从大一到研究生，帮你诊断短板、定制技能、打磨简历、模拟面试，
          陪你一步步拿到心仪 Offer，完成从校园到职场的平滑过渡。
        </p>

        {/* A/B 版本选择区 */}
        <div style={{ marginBottom: 8 }}>
          <div style={{
            display: 'inline-block', padding: '4px 12px', borderRadius: 6,
            border: '1px solid #222222', background: 'transparent',
            color: '#777777', fontSize: 12, fontWeight: 600, marginBottom: 16,
          }}>
            🧪 A/B 测试进行中 — 选择你感兴趣的版本体验
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap',
        }}>
          {/* A 版本 */}
          <div className="glass-card animate-fade-in-up" style={{
            width: 340, padding: '28px 24px 24px', textAlign: 'center',
            cursor: 'pointer', transition: 'all 0.3s',
            border: activeVersion === 'a' ? '3px solid var(--brand-sky)' : '2px solid var(--border-color)',
          }} onClick={() => setActiveVersion('a')}>
            <div style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: '50px',
              border: '2px solid var(--brand-sky)', color: '#5A7A9A',
              fontSize: 12, fontWeight: 600, marginBottom: 14,
            }}>
              A 版本
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              AI 求职成长陪伴平台
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              功能导向 · 理性表达
            </div>
            <button
              className="btn-primary"
              onClick={(e) => { e.stopPropagation(); navigate('/diagnosis'); }}
              style={{ fontSize: 15, padding: '12px 32px', background: '#A8C8E8', color: '#3A5A7A', borderColor: '#7BA3CC' }}
            >
              开始我的成长诊断 <ChevronRightIcon />
            </button>
          </div>

          {/* B 版本 */}
          <div className="glass-card animate-fade-in-up" style={{
            width: 340, padding: '28px 24px 24px', textAlign: 'center',
            cursor: 'pointer', transition: 'all 0.3s',
            border: activeVersion === 'b' ? '3px solid var(--brand-coral)' : '2px solid var(--border-color)',
            animationDelay: '0.1s',
          }} onClick={() => setActiveVersion('b')}>
            <div style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: '50px',
              border: '2px solid var(--brand-coral)', color: '#C07060',
              fontSize: 12, fontWeight: 600, marginBottom: 14,
            }}>
              B 版本
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              陪你从校园走向职场
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              情感导向 · 共鸣表达
            </div>
            <button
              className="btn-primary"
              onClick={(e) => { e.stopPropagation(); navigate('/diagnosis'); }}
              style={{ fontSize: 15, padding: '12px 32px' }}
            >
              立即开启求职陪伴 <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Growth Path */}
      <div style={{ marginBottom: 52 }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>🎯 陪伴成长路径</h2>
        <p className="section-subtitle" style={{ textAlign: 'center' }}>
          职业认知 → AI能力培养 → 职场技能 → 项目实践 → 求职准备 → 职场适应
        </p>
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20,
          marginTop: 28,
        }}>
          {growthPath.map((item, i) => (
            <div key={item.step} className="glass-card animate-fade-in-up" style={{
              padding: '24px 28px',
              textAlign: 'center',
              minWidth: 160,
              animationDelay: `${i * 0.08}s`,
              flex: '1 1 160px',
              maxWidth: 200,
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: 'var(--text-primary)' }}>
                {i + 1}. {item.step}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: 52 }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>✨ 核心功能</h2>
        <p className="section-subtitle" style={{ textAlign: 'center' }}>
          六大功能模块，全方位陪伴你的成长之旅
        </p>
        <div className="card-grid-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card animate-fade-in-up"
              style={{
                padding: '32px 28px',
                cursor: 'pointer',
                animationDelay: `${i * 0.08}s`,
                borderTop: `4px solid ${f.color}`,
              }}
              onClick={() => navigate(f.to)}
            >
              <div style={{ fontSize: 40, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 14 }}>
                {f.desc}
              </p>
              <span style={{ fontSize: 15, color: 'var(--brand-brown)', fontWeight: 600, cursor: 'pointer' }}>
                立即体验 →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Why GrowthMate */}
      <div style={{
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '48px 40px',
        textAlign: 'center',
        marginBottom: 28,
        border: '2px solid var(--border-color)',
      }}>
        <h2 className="section-title">💡 为什么选择e职伴？</h2>
        <div className="card-grid-3" style={{ marginTop: 36 }}>
          {[
            { icon: '🎓', title: '分年级定制', desc: '大一到大四/研究生，每个阶段都有专属成长建议，不做一刀切' },
            { icon: '🤖', title: 'AI能力差异化', desc: '计算机学编程AI、新闻学创作AI、金融学分析AI，让AI真正为你所用' },
            { icon: '💝', title: '温暖陪伴式', desc: '不只提供信息，更提供陪伴感、进度感和成就感，像一位懂你的学长' },
          ].map((item, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.12}s`, padding: 24 }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>{item.icon}</div>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>{item.title}</h3>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '40px 0 20px' }}>
        <p style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 500 }}>
          准备好开始你的成长之旅了吗？
        </p>
        <button className="btn-primary" onClick={() => navigate('/diagnosis')} style={{ fontSize: 17, padding: '16px 40px' }}>
          🔍 开始成长诊断
        </button>
      </div>

      {/* Demo 声明 */}
      <div style={{
        textAlign: 'center',
        padding: '20px 24px',
        marginTop: 8,
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius)',
        border: '2px dashed var(--border-color)',
        fontSize: 13,
        color: 'var(--text-secondary)',
        lineHeight: 1.8,
      }}>
        <p>
          🐧 <strong>本 Demo 为 AI 求职成长陪伴产品原型，数据为模拟展示。</strong>
        </p>
        <p style={{ marginTop: 4 }}>
          鹅伴 GrowthMate 致力于为大学生提供从校园到职场的全周期成长陪伴服务。
        </p>
      </div>
    </div>
  );
}
