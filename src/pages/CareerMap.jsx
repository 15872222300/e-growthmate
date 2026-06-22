import React, { useState } from 'react';
import { Card, Tag, Dialog, Button, Steps, Progress, Checkbox, MessagePlugin } from 'tdesign-react';
import { useAuth } from '../context/AuthContext';
import { careerCards } from '../data/mockData';

const { StepItem } = Steps;

const LEVEL_CONFIG = {
  '入门': { color: '#333333', bg: '#FAFAFA' },
  '进阶': { color: '#333333', bg: '#FAFAFA' },
  '高阶': { color: '#333333', bg: '#FAFAFA' },
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
            className="animate-fade-in-up"
            style={{
              padding: 0,
              cursor: 'pointer',
              overflow: 'hidden',
              animationDelay: `${i * 0.08}s`,
              borderTop: '3px solid #222222',
              border: '1px solid #E0E0E0',
              borderRadius: 8,
              background: '#FFFFFF',
            }}
            onClick={() => setSelected(card)}
          >
            <div style={{ padding: '24px 24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 8,
                  background: 'rgba(255,209,73,0.1)',
                  border: '1px solid #222222',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                }}>{card.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#333333' }}>{card.title}</h3>
              </div>
              <p style={{ fontSize: 14, color: '#777777', lineHeight: 1.7, marginBottom: 12 }}>
                {card.intro}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {card.abilities.slice(0, 3).map(a => (
                  <span key={a} style={{
                    fontSize: 12, padding: '3px 10px', borderRadius: 8,
                    background: '#FAFAFA', color: '#333333', fontWeight: 500,
                    border: '1px solid #E0E0E0',
                  }}>{a}</span>
                ))}
                <span style={{ fontSize: 12, color: '#777777', padding: '3px 4px' }}>+{card.abilities.length - 3}更多</span>
              </div>
            </div>
            <div style={{
              padding: '12px 24px',
              background: '#FAFAFA',
              fontSize: 13, color: '#333333', fontWeight: 600,
              textAlign: 'center',
              borderTop: '1px solid #E0E0E0',
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
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 6 }}>📖 岗位介绍</h4>
              <p style={{ fontSize: 14, color: '#777777', lineHeight: 1.7 }}>{selected.intro}</p>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 8 }}>🎯 核心能力要求</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.abilities.map((a, i) => (
                  <span key={i} style={{
                    fontSize: 13, padding: '4px 14px', borderRadius: 8,
                    background: '#FAFAFA', color: '#333333', fontWeight: 500,
                    border: '1px solid #E0E0E0',
                  }}>{a}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 6 }}>👤 适合人群</h4>
              <p style={{ fontSize: 14, color: '#777777', lineHeight: 1.7 }}>{selected.suitable}</p>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 8 }}>📋 大学四年准备建议</h4>
              <Steps layout="vertical" current={-1}>
                {selected.prep.map((p, i) => (
                  <StepItem key={i} title={p} />
                ))}
              </Steps>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 8 }}>🚀 推荐成长任务</h4>
              {selected.tasks.map((t, i) => (
                <div key={i} style={{
                  padding: '10px 14px', background: '#FAFAFA', borderRadius: 8,
                  marginBottom: 8, fontSize: 14, color: '#333333', fontWeight: 500,
                  border: '1px solid #E0E0E0',
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
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#333333', margin: 0 }}>
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
                          background: isChecked ? 'rgba(255,209,73,0.08)' : '#FFFFFF',
                          borderRadius: 8,
                          border: `1px solid ${isChecked ? '#222222' : '#E0E0E0'}`,
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
                              <span style={{ fontSize: 14, fontWeight: 600, color: '#333333' }}>
                                {course.title}
                              </span>
                              <Tag
                                size="small"
                                style={{
                                  background: '#FAFAFA',
                                  color: '#333333',
                                  border: '1px solid #E0E0E0',
                                  fontSize: 11,
                                }}
                              >
                                {course.level}
                              </Tag>
                              <Tag size="small" variant="outline" style={{ fontSize: 11 }}>
                                ⏱ {course.duration}
                              </Tag>
                            </div>
                            <div style={{ fontSize: 12, color: '#777777', lineHeight: 1.5, marginBottom: 4 }}>
                              {course.desc}
                            </div>
                            <div style={{ fontSize: 11, color: '#777777' }}>
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
                    background: '#FAFAFA',
                    borderRadius: 8,
                    border: '1px solid #E0E0E0',
                    fontSize: 13,
                    color: '#333333',
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
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#333333', margin: 0 }}>
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
                        background: '#FAFAFA',
                        borderRadius: 8,
                        border: '1px solid #E0E0E0',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* 标签 */}
                      {course.tag && (
                        <div style={{
                          position: 'absolute', top: 0, right: 0,
                          background: '#FFD149',
                          color: '#333333', fontSize: 11, fontWeight: 700,
                          padding: '4px 12px', borderRadius: '0 8px 0 8px',
                          border: '1px solid #222222',
                        }}>
                          🔥 {course.tag}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 8,
                          background: '#FFD149',
                          border: '1px solid #222222',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 20, flexShrink: 0,
                        }}>
                          🎓
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#333333' }}>
                              {course.title}
                            </span>
                            <Tag size="small" style={{
                              background: '#FAFAFA', color: '#333333', border: '1px solid #E0E0E0', fontSize: 11,
                            }}>
                              {course.level}
                            </Tag>
                          </div>
                          <div style={{ fontSize: 12, color: '#777777', lineHeight: 1.6, marginBottom: 8 }}>
                            {course.desc}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, color: '#777777' }}>
                              🏫 {course.platform}
                            </span>
                            <span style={{ fontSize: 11, color: '#777777' }}>
                              ⏱ {course.duration}
                            </span>
                            <span style={{
                              fontSize: 18, fontWeight: 800, color: '#333333',
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
