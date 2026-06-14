import React, { useState } from 'react';
import { Card, Tag, Dialog, Button, Steps, Progress, Checkbox, MessagePlugin } from 'tdesign-react';
import { useAuth } from '../context/AuthContext';
import { careerCards } from '../data/mockData';

const { StepItem } = Steps;

const LEVEL_CONFIG = {
  '入门': { color: '#10b981', bg: '#d1fae5' },
  '进阶': { color: '#f59e0b', bg: '#fef3c7' },
  '高阶': { color: '#ef4444', bg: '#fee2e2' },
};

export default function CareerMap() {
  const { saveStudyPlan } = useAuth();
  const [selected, setSelected] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [coursePlanSaved, setCoursePlanSaved] = useState(false);

  return (
    <div className="page-container">
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title">🗺️ 职业探索地图</h1>
        <p className="section-subtitle">提前了解互联网/腾讯相关岗位，降低信息差，找到你的兴趣方向</p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20,
      }}>
        {careerCards.map((card, i) => (
          <div
            key={card.id}
            className="glass-card animate-fade-in-up"
            style={{
              padding: 0,
              cursor: 'pointer',
              overflow: 'hidden',
              animationDelay: `${i * 0.08}s`,
              borderTop: `4px solid ${card.color}`,
            }}
            onClick={() => setSelected(card)}
          >
            <div style={{ padding: '24px 24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: card.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                }}>{card.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{card.title}</h3>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                {card.intro}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {card.abilities.slice(0, 3).map(a => (
                  <span key={a} style={{
                    fontSize: 12, padding: '3px 10px', borderRadius: 20,
                    background: card.bg, color: card.color, fontWeight: 500,
                  }}>{a}</span>
                ))}
                <span style={{ fontSize: 12, color: 'var(--text-muted)', padding: '3px 4px' }}>+{card.abilities.length - 3}更多</span>
              </div>
            </div>
            <div style={{
              padding: '12px 24px',
              background: card.bg,
              fontSize: 13, color: card.color, fontWeight: 600,
              textAlign: 'center',
            }}>
              点击查看详情 →
            </div>
          </div>
        ))}
      </div>

      {/* Detail Dialog */}
      {selected && (
        <Dialog
          visible={!!selected}
          onClose={() => { setSelected(null); setCoursePlanSaved(false); }}
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: selected.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>{selected.icon}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>岗位详细介绍</div>
              </div>
            </div>
          }
          width={640}
          footer={<Button theme="primary" onClick={() => { setSelected(null); setCoursePlanSaved(false); }}>了解了</Button>}
        >
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: selected.color, marginBottom: 6 }}>📖 岗位介绍</h4>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selected.intro}</p>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: selected.color, marginBottom: 8 }}>🎯 核心能力要求</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.abilities.map((a, i) => (
                  <span key={i} style={{
                    fontSize: 13, padding: '4px 14px', borderRadius: 20,
                    background: selected.bg, color: selected.color, fontWeight: 500,
                  }}>{a}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: selected.color, marginBottom: 6 }}>👤 适合人群</h4>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selected.suitable}</p>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: selected.color, marginBottom: 8 }}>📋 大学四年准备建议</h4>
              <Steps layout="vertical" current={-1}>
                {selected.prep.map((p, i) => (
                  <StepItem key={i} title={p} />
                ))}
              </Steps>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: selected.color, marginBottom: 8 }}>🚀 推荐成长任务</h4>
              {selected.tasks.map((t, i) => (
                <div key={i} style={{
                  padding: '10px 14px', background: selected.bg, borderRadius: 10,
                  marginBottom: 8, fontSize: 14, color: selected.color, fontWeight: 500,
                }}>
                  📌 {t}
                </div>
              ))}
            </div>

            {/* ===== 相关课程推荐（免费） ===== */}
            {selected.courses && selected.courses.length > 0 && (
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10,
                }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: selected.color, margin: 0 }}>
                    📚 免费课程推荐
                  </h4>
                  {selectedCourses[selected.id]?.length > 0 && (
                    <Button
                      size="small"
                      theme="success"
                      variant="outline"
                      onClick={() => {
                        const chosenCourses = selectedCourses[selected.id].map(idx => selected.courses[idx]);
                        saveStudyPlan({
                          id: `plan_${selected.id}`,
                          careerId: selected.id,
                          careerTitle: selected.title,
                          careerIcon: selected.icon,
                          careerColor: selected.color,
                          courses: chosenCourses,
                        });
                        MessagePlugin.success(`已保存${chosenCourses.length}门课程到你的学习计划！`);
                        setCoursePlanSaved(true);
                      }}
                      style={{ borderRadius: 8, fontSize: 12 }}
                    >
                      💾 保存学习计划
                    </Button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selected.courses.map((course, idx) => {
                    const levelCfg = LEVEL_CONFIG[course.level] || LEVEL_CONFIG['入门'];
                    const isChecked = (selectedCourses[selected.id] || []).includes(idx);
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '14px 16px',
                          background: isChecked ? selected.bg : '#f8fafc',
                          borderRadius: 12,
                          border: `1px solid ${isChecked ? selected.color : 'var(--border)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onClick={() => {
                          setSelectedCourses(prev => {
                            const careerCourses = prev[selected.id] || [];
                            const updated = isChecked
                              ? careerCourses.filter(i => i !== idx)
                              : [...careerCourses, idx];
                            return { ...prev, [selected.id]: updated };
                          });
                          setCoursePlanSaved(false);
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <Checkbox
                            checked={isChecked}
                            onChange={() => {}}
                            style={{ marginTop: 2, flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                                {course.title}
                              </span>
                              <Tag
                                size="small"
                                style={{
                                  background: levelCfg.bg,
                                  color: levelCfg.color,
                                  border: 'none',
                                  fontSize: 11,
                                }}
                              >
                                {course.level}
                              </Tag>
                              <Tag size="small" variant="outline" style={{ fontSize: 11 }}>
                                ⏱ {course.duration}
                              </Tag>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>
                              {course.desc}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              🏫 {course.platform}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedCourses[selected.id]?.length > 0 && (
                  <div style={{
                    marginTop: 10,
                    padding: '10px 14px',
                    background: '#f0fdf4',
                    borderRadius: 10,
                    border: '1px solid #bbf7d0',
                    fontSize: 13,
                    color: '#166534',
                  }}>
                    ✅ 已选择 {selectedCourses[selected.id].length} 门课程
                    {coursePlanSaved && (
                      <span style={{ marginLeft: 6, fontWeight: 600 }}>— 学习计划已保存！</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ===== 进阶付费课程 ===== */}
            {selected.advancedCourses && selected.advancedCourses.length > 0 && (
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#7c3aed', margin: 0 }}>
                    🚀 进阶付费课程
                  </h4>
                  <Tag size="small" theme="warning" variant="light">导师1v1指导</Tag>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selected.advancedCourses.map((course, idx) => (
                    <div
                      key={`adv-${idx}`}
                      style={{
                        padding: '16px',
                        background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)',
                        borderRadius: 14,
                        border: '2px solid #c4b5fd',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* 标签 */}
                      {course.tag && (
                        <div style={{
                          position: 'absolute', top: 0, right: 0,
                          background: course.tag === '热门' ? '#ef4444' : course.tag === '限时' ? '#f59e0b' : '#7c3aed',
                          color: '#fff', fontSize: 11, fontWeight: 700,
                          padding: '4px 12px', borderRadius: '0 12px 0 12px',
                        }}>
                          🔥 {course.tag}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 20, flexShrink: 0,
                        }}>
                          🎓
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#5b21b6' }}>
                              {course.title}
                            </span>
                            <Tag size="small" style={{
                              background: '#fef3c7', color: '#92400e', border: 'none', fontSize: 11,
                            }}>
                              {course.level}
                            </Tag>
                          </div>
                          <div style={{ fontSize: 12, color: '#6d28d9', lineHeight: 1.6, marginBottom: 8 }}>
                            {course.desc}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              🏫 {course.platform}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              ⏱ {course.duration}
                            </span>
                            <span style={{
                              fontSize: 18, fontWeight: 800, color: '#ef4444',
                              marginLeft: 'auto',
                            }}>
                              {course.price}
                            </span>
                          </div>
                          <Button
                            size="small"
                            theme="warning"
                            variant="outline"
                            style={{ marginTop: 10, borderRadius: 8, fontWeight: 600 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              MessagePlugin.info(`🎉 你已关注「${course.title}」课程，开课时会通知你～`);
                            }}
                          >
                            🔔 立即关注
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
}
