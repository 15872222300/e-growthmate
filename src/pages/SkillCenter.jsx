import React, { useState, useRef } from 'react';
import { Card, Dialog, Button, Tag, Progress, MessagePlugin, Upload, Textarea, Collapse } from 'tdesign-react';
import { CheckCircleIcon, PlayIcon, CloudUploadIcon, CheckIcon } from 'tdesign-icons-react';
import { skillModules } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const { Panel } = Collapse;

export default function SkillCenter() {
  const { user, addSkillRecord } = useAuth();
  const [activeModule, setActiveModule] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  // 作业提交状态
  const [homeworkText, setHomeworkText] = useState('');
  const [homeworkFiles, setHomeworkFiles] = useState([]);
  const [showHomeworkSection, setShowHomeworkSection] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState({});
  const fileInputRef = useRef(null);

  const handleStartTask = (task) => {
    setActiveTask(task);
    setShowFeedback(false);
    setHomeworkText('');
    setHomeworkFiles([]);
    setShowHomeworkSection(false);
  };

  const handleComplete = () => {
    if (!activeTask) return;
    setCompletedTasks(prev => new Set([...prev, activeTask.title]));
    setCurrentFeedback(activeTask.feedback);
    setShowFeedback(true);

    // 如果有提交作业内容，记录到用户技能记录中
    if (homeworkText || homeworkFiles.length > 0) {
      const record = {
        taskTitle: activeTask.title,
        moduleTitle: activeModule?.title || '',
        homeworkText,
        files: homeworkFiles.map(f => f.name),
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      };
      addSkillRecord(record);

      // 本地记录提交历史
      setSubmissionHistory(prev => ({
        ...prev,
        [activeTask.title]: [...(prev[activeTask.title] || []), record],
      }));
    }

    MessagePlugin.success('任务完成！AI已生成反馈');
  };

  // 处理文件上传
  const handleFileChange = (files) => {
    setHomeworkFiles(files);
  };

  // 处理文件移除
  const handleFileRemove = (file) => {
    setHomeworkFiles(prev => prev.filter(f => f.name !== file.name));
  };

  // 检查某任务是否有作业提交
  const hasSubmission = (taskTitle) => {
    return submissionHistory[taskTitle] && submissionHistory[taskTitle].length > 0;
  };

  const totalTasks = skillModules.reduce((s, m) => s + m.tasks.length, 0);
  const doneCount = completedTasks.size;
  const progressPercent = Math.round((doneCount / totalTasks) * 100);

  return (
    <div className="page-container">
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title">📚 技能成长中心</h1>
        <p className="section-subtitle">每天一张任务卡，覆盖职场全维度能力训练，AI即时反馈陪伴成长</p>
      </div>

      {/* Progress */}
      <Card bordered style={{ borderRadius: 'var(--radius-lg)', marginBottom: 24 }}>
        <div style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>📊 成长进度</div>
            <Progress percentage={progressPercent} strokeWidth={10} />
          </div>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{doneCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>已完成/{totalTasks}任务</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#7c3aed' }}>Lv.{Math.floor(doneCount / 3) + 1}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>成长等级</div>
          </div>
        </div>
      </Card>

      {/* Skill Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {skillModules.map((mod, i) => (
          <Card key={mod.id} bordered style={{
            borderRadius: 'var(--radius-lg)',
            borderTop: `3px solid ${mod.color}`,
            animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both`,
          }}>
            <div style={{ padding: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: mod.color + '15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>{mod.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{mod.title}</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {mod.skills.map(s => (
                  <span key={s} style={{
                    fontSize: 12, padding: '3px 10px', borderRadius: 20,
                    background: '#f1f5f9', color: 'var(--text-secondary)', fontWeight: 500,
                  }}>{s}</span>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mod.tasks.map(task => {
                  const done = completedTasks.has(task.title);
                  const submitted = hasSubmission(task.title);
                  return (
                    <div
                      key={task.title}
                      onClick={() => { setActiveModule(mod); handleStartTask(task); }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: done ? '#f0fdf4' : submitted ? '#fff7ed' : '#f8fafc',
                        border: `1px solid ${done ? '#bbf7d0' : submitted ? '#fed7aa' : 'var(--border)'}`,
                        cursor: 'pointer',
                        transition: 'all var(--transition)',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}
                      onMouseEnter={e => { if (!done) e.currentTarget.style.borderColor = mod.color; }}
                      onMouseLeave={e => { if (!done) e.currentTarget.style.borderColor = submitted ? '#fed7aa' : 'var(--border)'; }}
                    >
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        border: `2px solid ${done ? '#10b981' : submitted ? '#f59e0b' : '#cbd5e1'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: 12, color: done ? '#10b981' : 'transparent',
                        background: done ? '#d1fae5' : submitted ? '#fef3c7' : 'transparent',
                      }}>
                        {done ? '✓' : submitted ? '📝' : ''}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 600,
                          textDecoration: done ? 'line-through' : 'none',
                          color: done ? 'var(--text-muted)' : 'var(--text)',
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                          {task.title}
                          {submitted && !done && (
                            <Tag size="small" theme="warning" variant="light" style={{ fontSize: 10, padding: '0 4px' }}>
                              已提交
                            </Tag>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{task.desc.slice(0, 40)}...</div>
                      </div>
                      <span style={{ fontSize: 18 }}>{done ? '✅' : submitted ? '📤' : '▶️'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Task Detail Dialog */}
      <Dialog
        visible={!!activeTask}
        onClose={() => { setActiveTask(null); setShowFeedback(false); setShowHomeworkSection(false); }}
        header={<div style={{ fontSize: 16, fontWeight: 700 }}>📋 今日任务卡</div>}
        width={600}
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => { setActiveTask(null); setShowFeedback(false); setShowHomeworkSection(false); }}>关闭</Button>
            {!showFeedback && (
              <Button theme="primary" onClick={handleComplete}>✅ 完成任务</Button>
            )}
          </div>
        }
      >
        {activeTask && (
          <div style={{ padding: '8px 0' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{activeTask.title}</h3>
            <div style={{
              padding: '16px',
              background: '#f8fafc',
              borderRadius: 10,
              marginBottom: 16,
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>📝 任务描述</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{activeTask.desc}</p>
            </div>

            {/* ===== 提交作业区域 ===== */}
            {!showFeedback && (
              <div style={{ marginBottom: 16 }}>
                <div
                  onClick={() => setShowHomeworkSection(!showHomeworkSection)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: showHomeworkSection ? '#f0fdf4' : '#f8fafc',
                    borderRadius: 10,
                    border: `1px solid ${showHomeworkSection ? '#bbf7d0' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>📎</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: showHomeworkSection ? '#10b981' : 'var(--text)' }}>
                      提交作业
                    </span>
                    <Tag size="small" theme={showHomeworkSection ? 'success' : 'default'} variant="light">
                      {showHomeworkSection ? '展开中' : '可选'}
                    </Tag>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {showHomeworkSection ? '收起 ▲' : '展开 ▼'}
                  </span>
                </div>

                {showHomeworkSection && (
                  <div style={{
                    marginTop: 12,
                    padding: '16px',
                    background: '#fff',
                    borderRadius: 10,
                    border: '1px solid #bbf7d0',
                    animation: 'fadeIn 0.3s ease-out',
                  }}>
                    {/* 文字提交 */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                        ✏️ 文字作业
                      </div>
                      <Textarea
                        value={homeworkText}
                        onChange={(val) => setHomeworkText(val)}
                        placeholder="在这里写下你的作业内容、思考过程或学习笔记..."
                        autosize={{ minRows: 3, maxRows: 8 }}
                        style={{ borderRadius: 8 }}
                      />
                    </div>

                    {/* 文件上传 */}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                        📁 上传附件（支持文档、图片、代码等）
                      </div>
                      <Upload
                        theme="file-flow"
                        files={homeworkFiles}
                        onChange={handleFileChange}
                        onRemove={handleFileRemove}
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.py,.js,.html,.css,.json,.zip"
                        placeholder="点击或拖拽上传作业文件"
                        tips="支持 PDF/Word/图片/代码文件，单个文件不超过10MB"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== 提交历史 ===== */}
            {submissionHistory[activeTask.title] && submissionHistory[activeTask.title].length > 0 && (
              <div style={{
                marginBottom: 16,
                padding: '14px 16px',
                background: '#fffbeb',
                borderRadius: 10,
                border: '1px solid #fde68a',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#d97706', marginBottom: 8 }}>
                  📋 历史提交记录 ({submissionHistory[activeTask.title].length}次)
                </div>
                {submissionHistory[activeTask.title].slice(0, 3).map((sub, idx) => (
                  <div key={sub.id} style={{
                    padding: '10px 12px',
                    background: '#fff',
                    borderRadius: 8,
                    marginBottom: 6,
                    border: '1px solid #fde68a',
                    fontSize: 12,
                  }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                      📅 {new Date(sub.timestamp).toLocaleString('zh-CN')}
                    </div>
                    {sub.homeworkText && (
                      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>
                        {sub.homeworkText.slice(0, 100)}{sub.homeworkText.length > 100 ? '...' : ''}
                      </div>
                    )}
                    {sub.files && sub.files.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {sub.files.map(f => (
                          <Tag key={f} size="small" theme="warning" variant="light">📄 {f}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showFeedback && (
              <div style={{
                padding: '16px',
                background: '#eff6ff',
                borderRadius: 10,
                border: '1px solid #bfdbfe',
                animation: 'fadeIn 0.4s ease-out',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 6 }}>🤖 AI 反馈</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{currentFeedback}</p>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 30 }}>🦢</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>🐧 e职伴一直在这里陪你拿到心仪Offer 💪</span>
                </div>
              </div>
            )}

            {!showFeedback && (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📝</div>
                <p>阅读任务要求，完成后可提交作业并点击"完成任务"获取AI反馈</p>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
