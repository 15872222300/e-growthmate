import React, { useState } from 'react';
import { Card, Textarea, Button, Tag, Dialog, MessagePlugin } from 'tdesign-react';
import { interviewQuestions } from '../data/mockData';

const resumeExamples = {
  before: '我在学校做了一个小程序，可以让同学在上面发布二手物品，我负责前端开发，用了React框架。',
  after: '独立开发校园二手交易小程序前端，基于React+TypeScript技术栈，实现商品发布、搜索筛选、IM即时通讯等核心功能。上线后累计用户1,200+，促成交易300+笔，获校级优秀项目。项目过程中独立完成技术选型、架构设计和性能优化，页面加载速度优化40%。',
};

export default function JobPrep() {
  const [resumeInput, setResumeInput] = useState('');
  const [resumeResult, setResumeResult] = useState('');
  const [showInterview, setShowInterview] = useState(false);
  const [currentQ, setCurrentQ] = useState(null);

  const handleOptimize = () => {
    if (!resumeInput.trim()) {
      MessagePlugin.warning('请先输入项目经历');
      return;
    }
    // Simulate AI optimization
    const enhanced = resumeInput
      .replace(/做了/g, '独立开发/主导')
      .replace(/用了/g, '基于')
      + '\n\n✨ 优化建议：量化成果数据，补充技术细节，使用STAR法则组织表达。';
    setResumeResult(enhanced);
    MessagePlugin.success('简历优化完成！');
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title">💼 求职准备中心</h1>
        <p className="section-subtitle">简历优化、项目润色、模拟面试、岗位匹配，一站式求职备战</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        {/* Resume Optimizer */}
        <Card bordered style={{ borderRadius: 'var(--radius-lg)' }}>
          <div style={{ padding: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>📝</span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>简历项目经历优化</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
              输入一段项目经历，AI帮你优化为专业、量化的简历表达
            </p>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>📥 输入原始经历</div>
              <Textarea
                value={resumeInput}
                onChange={setResumeInput}
                placeholder="例如：我在学校做了一个小程序，可以让同学在上面发布二手物品..."
                maxlength={500}
                autosize={{ minRows: 3, maxRows: 5 }}
              />
            </div>

            <Button theme="primary" block onClick={handleOptimize} style={{ marginBottom: 16 }}>
              ✨ AI优化简历表达
            </Button>

            {resumeResult && (
              <div style={{
                padding: 16,
                background: '#eff6ff',
                borderRadius: 10,
                border: '1px solid #bfdbfe',
                animation: 'fadeIn 0.4s ease-out',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 8 }}>📤 优化结果</div>
                <p style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{resumeResult}</p>
                <Button
                  size="small"
                  variant="text"
                  theme="primary"
                  style={{ marginTop: 8 }}
                  onClick={() => { navigator.clipboard.writeText(resumeResult); MessagePlugin.success('已复制'); }}
                >
                  📋 复制
                </Button>
              </div>
            )}

            <div style={{ marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>💡 优化示例</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                <div>
                  <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 4 }}>优化前 ❌</div>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{resumeExamples.before}</div>
                </div>
                <div>
                  <div style={{ color: '#10b981', fontWeight: 600, marginBottom: 4 }}>优化后 ✅</div>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{resumeExamples.after}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Mock Interview */}
        <Card bordered style={{ borderRadius: 'var(--radius-lg)' }}>
          <div style={{ padding: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>🎤</span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>模拟面试训练</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
              精选高频面试题，点击开始模拟练习，查看AI参考回答
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {interviewQuestions.map((item, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                  }}
                  onClick={() => { setCurrentQ(item); setShowInterview(true); }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--primary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontSize: 13, fontWeight: 700, color: 'var(--primary)',
                    }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.q}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>💡 {item.hint}</div>
                    </div>
                    <span style={{ color: 'var(--primary)', fontSize: 16 }}>→</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16,
              padding: 14,
              background: '#f0f4ff',
              borderRadius: 10,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>🎯 面试准备建议</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                建议每天练习2-3道面试题，录制自己的回答并回看，重点改进表达逻辑和案例数据。
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Interview Detail Dialog */}
      <Dialog
        visible={showInterview}
        onClose={() => setShowInterview(false)}
        header={<div style={{ fontSize: 16, fontWeight: 700 }}>🎤 模拟面试</div>}
        width={560}
        footer={<Button onClick={() => setShowInterview(false)}>关闭</Button>}
      >
        {currentQ && (
          <div style={{ padding: '8px 0' }}>
            <div style={{
              padding: 16,
              background: '#f8fafc',
              borderRadius: 10,
              marginBottom: 16,
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>❓ 面试问题</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{currentQ.q}</div>
            </div>

            <div style={{
              padding: 16,
              background: '#fff7ed',
              borderRadius: 10,
              marginBottom: 16,
              border: '1px solid #fed7aa',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>💡 回答提示</div>
              <div style={{ fontSize: 14, lineHeight: 1.7 }}>{currentQ.hint}</div>
            </div>

            <div style={{
              padding: 16,
              background: '#eff6ff',
              borderRadius: 10,
              border: '1px solid #bfdbfe',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 6 }}>🤖 AI参考回答</div>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>{currentQ.example}</div>
            </div>

            <div style={{
              marginTop: 16,
              padding: 12,
              background: '#f0fdf4',
              borderRadius: 10,
              border: '1px solid #bbf7d0',
              textAlign: 'center',
              fontSize: 13,
              color: '#10b981',
            }}>
              🐧 e职伴提示：用自己的语言重新组织回答，结合真实经历更有说服力！
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
