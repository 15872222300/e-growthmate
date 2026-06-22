import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Tag, Dialog, Textarea, Progress, MessagePlugin, Input } from 'tdesign-react';
import { useAuth } from '../context/AuthContext';

// 预设分析模板 — 根据常见面试问题类型给出针对性复盘维度
const REVIEW_TEMPLATES = {
  selfIntro: {
    title: '自我介绍',
    dimensions: ['结构清晰度', '亮点突出', '时间控制', '与岗位匹配度', '表达自信度'],
    tips: '关注是否有"我是谁-我能做什么-为什么选我"的清晰结构，是否在1-2分钟内完成。',
  },
  project: {
    title: '项目经历',
    dimensions: ['STAR法则运用', '技术深度', '成果量化', '个人贡献明确', '难点描述'],
    tips: '检查是否遵循STAR法则（情境-任务-行动-结果），是否有具体数据支撑。',
  },
  behavior: {
    title: '行为面试',
    dimensions: ['情境描述', '行动逻辑', '结果反思', '价值观体现', '真诚度'],
    tips: '关注回答中是否有具体的行动细节和反思，而非泛泛而谈。',
  },
  tech: {
    title: '技术问题',
    dimensions: ['知识点准确', '思路清晰', '深度拓展', '实战结合', '诚实度'],
    tips: '技术回答是否准确、是否有自己的理解延展、不会的问题是否诚实说明。',
  },
  hr: {
    title: 'HR面/综合',
    dimensions: ['职业规划清晰', '对公司了解', '价值观匹配', '沟通表达', '问题准备'],
    tips: '是否展现了清晰的职业规划和对公司的了解，反问环节是否有深度。',
  },
  general: {
    title: '通用复盘',
    dimensions: ['整体表现', '亮点发挥', '失误分析', '改进方向', '下次策略'],
    tips: '全面回顾整场面试，从多个维度进行系统性复盘。',
  },
};

// 模拟AI分析函数 — 根据输入内容生成结构化复盘报告
function analyzeInterview(type, content, templateKey) {
  const template = REVIEW_TEMPLATES[templateKey] || REVIEW_TEMPLATES.general;
  const wordCount = content.length;
  const hasKeywords = {
    star: /(?:情景|任务|行动|结果|STAR|背景|目标|方案|数据|成果|优化)/.test(content),
    data: /(?:\d+%|\d+人|\d+万|\d+次|\d+天|提升|增长|降低|减少)/.test(content),
    reflection: /(?:反思|不足|改进|下次|学习|成长|教训|总结)/.test(content),
    structure: /(?:首先|其次|最后|第一|第二|第三|总结|综上)/.test(content),
  };

  const dimScores = template.dimensions.map((dim) => {
    let base = 55 + Math.floor(Math.random() * 35);
    if (hasKeywords.star && (dim.includes('STAR') || dim.includes('成果'))) base += 15;
    if (hasKeywords.data && (dim.includes('量化') || dim.includes('数据'))) base += 12;
    if (hasKeywords.reflection && (dim.includes('反思') || dim.includes('改进'))) base += 10;
    if (hasKeywords.structure && dim.includes('结构')) base += 10;
    return { name: dim, score: Math.min(base, 98) };
  });

  const avgScore = Math.round(dimScores.reduce((s, d) => s + d.score, 0) / dimScores.length);

  const strengths = [];
  const improvements = [];
  dimScores.forEach((d) => {
    if (d.score >= 75) strengths.push(d.name);
    if (d.score < 65) improvements.push(d.name);
  });

  const suggestions = [
    hasKeywords.star ? null : '💡 建议用STAR法则组织项目回答，让表达更有说服力。',
    hasKeywords.data ? null : '📊 尝试在回答中增加量化数据，如"提升了30%"、"服务了2000+用户"。',
    hasKeywords.reflection ? null : '🪞 面试结束后及时记录反思点，形成个人面试复盘笔记。',
    wordCount < 80 ? '📝 回答内容偏短，建议补充更多细节和具体事例。' : null,
    '🎯 面试前做1-2次模拟练习，录音回听可以发现很多表达问题。',
    '📋 准备3-5个万能案例，覆盖不同能力维度，灵活调用。',
  ].filter(Boolean).slice(0, 4);

  return {
    templateKey,
    templateName: template.title,
    dimScores,
    avgScore,
    strengths,
    improvements,
    suggestions,
    wordCount,
    hasKeywords,
    analyzedAt: new Date().toISOString(),
  };
}

// 格式化时间
function formatTime(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function InterviewReview() {
  const { user, saveInterviewReview, getInterviewReviews, deleteInterviewReview } = useAuth();

  // 上传和输入状态
  const [activeTab, setActiveTab] = useState('memory'); // 'memory' | 'voice'
  const [reviewType, setReviewType] = useState('general');
  const [inputContent, setInputContent] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [positionName, setPositionName] = useState('');
  const [voiceFile, setVoiceFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  // 历史记录
  const [reviews, setReviews] = useState([]);

  // 文件上传 ref
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setReviews(getInterviewReviews());
    }
  }, [user]);

  // 上传语音文件
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/mp3'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|ogg|webm|flac)$/i)) {
      MessagePlugin.warning('请上传音频文件（mp3/wav/m4a/ogg等格式）');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      MessagePlugin.warning('文件大小不能超过50MB');
      return;
    }
    setVoiceFile(file);
    // 模拟语音转文字
    setIsAnalyzing(true);
    setTimeout(() => {
      const simulated = `[语音转文字模拟]\n\n面试官：请做一个简单的自我介绍。\n候选人：您好，我是XX大学计算机专业的大三学生，在校期间主修数据结构、操作系统等核心课程。我曾在XX公司做过一段暑期实习，负责前端开发工作，独立完成了用户管理模块的迭代优化，将页面加载速度提升了约40%。我熟练掌握React和TypeScript，对前端工程化有一定理解。\n\n面试官：能详细说说你在实习中遇到的最大技术挑战吗？\n候选人：最大的挑战是处理大量数据的渲染性能问题。我们有一个列表页面需要展示5000+条数据，初始渲染非常卡顿。我研究了虚拟列表方案，最终采用react-window实现了只渲染可视区域的数据，将首屏渲染时间从3秒降到了200毫秒以内。\n\n面试官：你有什么问题想问我吗？\n候选人：想了解一下团队目前的技术栈和未来半年的技术规划，以及新人入职后的成长路径是怎样的。`;
      setInputContent(simulated);
      setIsAnalyzing(false);
      MessagePlugin.success('语音转文字完成！（模拟）');
    }, 2000);
  };

  // 提交分析
  const handleAnalyze = () => {
    if (!inputContent.trim()) {
      MessagePlugin.warning('请先输入或上传面试内容');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeInterview(reviewType, inputContent, reviewType);
      setCurrentResult(result);
      setIsAnalyzing(false);
      setShowResultDialog(true);

      // 保存到历史记录
      const record = {
        id: Date.now().toString(),
        type: activeTab,
        reviewType,
        companyName: companyName || '未填写',
        positionName: positionName || '未填写',
        content: inputContent.slice(0, 2000),
        result,
        createdAt: new Date().toISOString(),
      };
      saveInterviewReview(record);
      setReviews((prev) => [record, ...prev]);
      MessagePlugin.success('复盘分析完成！');
    }, 2500);
  };

  // 删除记录
  const handleDelete = (id) => {
    deleteInterviewReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    MessagePlugin.success('已删除');
  };

  // 查看历史详情
  const handleViewDetail = (review) => {
    setCurrentResult(review.result);
    setShowResultDialog(true);
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title">💭 面试复盘</h1>
        <p className="section-subtitle">上传面试记忆版或录音版，AI帮你系统复盘，发现亮点与改进点</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        {/* 左侧：输入区域 */}
        <Card bordered style={{ borderRadius: 8, border: '1px solid #E0E0E0' }}>
          <div style={{ padding: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>🎙️</span>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#333333' }}>新建复盘</h3>
            </div>

            {/* 输入方式切换 */}
            <div style={{
              display: 'flex',
              background: '#FAFAFA',
              borderRadius: 8,
              border: '1px solid #E0E0E0',
              padding: 4,
              marginBottom: 16,
            }}>
              {[
                { key: 'memory', icon: '🧠', label: '记忆版（文字输入）' },
                { key: 'voice', icon: '🎤', label: '录音版（上传音频）' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: activeTab === tab.key ? '1px solid #222222' : '1px solid transparent',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    background: activeTab === tab.key ? '#FFFFFF' : 'transparent',
                    color: activeTab === tab.key ? '#333333' : '#777777',
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* 录音版：上传区域 */}
            {activeTab === 'voice' && (
              <div style={{ marginBottom: 16 }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #E0E0E0',
                    borderRadius: 8,
                    padding: '28px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: voiceFile ? '#FAFAFA' : '#FFFFFF',
                    borderColor: voiceFile ? '#222222' : '#E0E0E0',
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  {voiceFile ? (
                    <div>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>🎵</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#333333' }}>{voiceFile.name}</div>
                      <div style={{ fontSize: 12, color: '#777777', marginTop: 4 }}>
                        {(voiceFile.size / 1024 / 1024).toFixed(1)} MB · 点击重新上传
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>🎤</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#333333' }}>点击上传面试录音</div>
                      <div style={{ fontSize: 12, color: '#777777', marginTop: 4 }}>
                        支持 mp3 / wav / m4a / ogg 格式，最大50MB
                      </div>
                    </div>
                  )}
                </div>
                {isAnalyzing && activeTab === 'voice' && (
                  <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: '#777777' }}>
                    <span className="animate-pulse">⏳ 正在模拟语音转文字...</span>
                  </div>
                )}
              </div>
            )}

            {/* 公司和职位信息 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#333333' }}>🏢 面试公司</div>
                <Input
                  value={companyName}
                  onChange={setCompanyName}
                  placeholder="如：腾讯"
                  size="small"
                />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#333333' }}>💼 面试岗位</div>
                <Input
                  value={positionName}
                  onChange={setPositionName}
                  placeholder="如：前端开发实习生"
                  size="small"
                />
              </div>
            </div>

            {/* 复盘类型选择 */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333333' }}>📂 面试类型</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Object.entries(REVIEW_TEMPLATES).map(([key, tpl]) => (
                  <button
                    key={key}
                    onClick={() => setReviewType(key)}
                    style={{
                      padding: '6px 14px',
                      border: `1px solid ${reviewType === key ? '#222222' : '#E0E0E0'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      background: reviewType === key ? 'rgba(255,209,73,0.1)' : '#FFFFFF',
                      color: reviewType === key ? '#333333' : '#777777',
                    }}
                  >
                    {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 内容输入 */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333333' }}>
                {activeTab === 'voice' ? '📝 转文字内容（可编辑）' : '✍️ 面试内容回忆'}
              </div>
              <Textarea
                value={inputContent}
                onChange={setInputContent}
                placeholder={
                  activeTab === 'voice'
                    ? '上传音频后自动填充...'
                    : '尽量回忆面试中的问答内容：\n\n面试官问了什么问题？\n我是怎么回答的？\n哪里回答得比较好？\n哪里感觉不太满意？\n面试官的追问是什么？\n...'
                }
                autosize={{ minRows: 8, maxRows: 16 }}
                maxlength={5000}
              />
              <div style={{ fontSize: 11, color: '#777777', marginTop: 4, textAlign: 'right' }}>
                {inputContent.length}/5000
              </div>
            </div>

            {/* 提交按钮 */}
            <Button
              theme="primary"
              block
              size="large"
              loading={isAnalyzing}
              onClick={handleAnalyze}
              disabled={!inputContent.trim() || isAnalyzing}
            >
              {isAnalyzing ? '🔄 AI正在分析中...' : '🔍 AI复盘分析'}
            </Button>

            <div style={{
              marginTop: 12,
              padding: 10,
              background: '#FAFAFA',
              borderRadius: 8,
              border: '1px solid #E0E0E0',
              fontSize: 12,
              color: '#777777',
              textAlign: 'center',
            }}>
              🐧 小贴士：越详细的回忆越有助于AI给出精准的复盘建议哦
            </div>
          </div>
        </Card>

        {/* 右侧：历史记录 */}
        <Card bordered style={{ borderRadius: 8, border: '1px solid #E0E0E0' }}>
          <div style={{ padding: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>📋</span>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#333333' }}>复盘历史</h3>
              <span style={{
                marginLeft: 'auto',
                fontSize: 12,
                color: '#777777',
                background: '#FAFAFA',
                padding: '2px 10px',
                borderRadius: 8,
                border: '1px solid #E0E0E0',
              }}>
                {reviews.length} 条记录
              </span>
            </div>

            {reviews.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 20px',
                color: '#777777',
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#333333' }}>暂无复盘记录</div>
                <div style={{ fontSize: 12 }}>输入面试内容开始第一次复盘吧</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 520, overflowY: 'auto' }}>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      padding: '14px 16px',
                      cursor: 'pointer',
                      background: '#FFFFFF',
                      border: '1px solid #E0E0E0',
                      borderRadius: 8,
                      transition: 'all 0.2s',
                    }}
                    onClick={() => handleViewDetail(review)}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#222222';
                      e.currentTarget.style.background = '#FAFAFA';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#E0E0E0';
                      e.currentTarget.style.background = '#FFFFFF';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <Tag size="small" theme={review.reviewType === 'general' ? 'default' : 'primary'}>
                            {REVIEW_TEMPLATES[review.reviewType]?.title || '通用复盘'}
                          </Tag>
                          <Tag size="small" theme="warning" variant="light">
                            {review.type === 'voice' ? '🎤 录音' : '🧠 记忆'}
                          </Tag>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: '#333333' }}>
                          {review.companyName} · {review.positionName}
                        </div>
                        <div style={{ fontSize: 12, color: '#777777', marginBottom: 4 }}>
                          {review.content.slice(0, 60)}{review.content.length > 60 ? '...' : ''}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#777777' }}>
                          <span>📅 {formatTime(review.createdAt)}</span>
                          <span style={{
                            color: review.result.avgScore >= 75 ? '#333333' : review.result.avgScore >= 60 ? '#333333' : '#333333',
                            fontWeight: 700,
                          }}>
                            综合 {review.result.avgScore} 分
                          </span>
                        </div>
                      </div>
                      <Button
                        size="small"
                        variant="text"
                        theme="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(review.id);
                        }}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 复盘结果 Dialog */}
      <Dialog
        visible={showResultDialog}
        onClose={() => setShowResultDialog(false)}
        header={
          <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            🔍 面试复盘报告
          </div>
        }
        width={680}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setShowResultDialog(false)}>
              关闭
            </Button>
            <Button
              theme="primary"
              onClick={() => {
                setShowResultDialog(false);
                MessagePlugin.success('报告已保存到历史记录');
              }}
            >
              ✅ 我知道了
            </Button>
          </div>
        }
      >
        {currentResult && (
          <div style={{ padding: '8px 0' }}>
            {/* 总分卡片 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 20,
              background: '#FAFAFA',
              borderRadius: 8,
              border: '1px solid #E0E0E0',
              marginBottom: 20,
            }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: currentResult.avgScore >= 75
                  ? '#FFD149'
                  : currentResult.avgScore >= 60
                    ? '#FFD149'
                    : '#F5F5F5',
                border: '1px solid #222222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#333333',
                fontSize: 24,
                fontWeight: 800,
                flexShrink: 0,
              }}>
                {currentResult.avgScore}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: '#333333' }}>
                  {currentResult.templateName} · 综合评分
                </div>
                <div style={{ fontSize: 13, color: '#777777' }}>
                  {currentResult.avgScore >= 80 ? '表现优秀！继续保持' :
                    currentResult.avgScore >= 65 ? '表现良好，有提升空间' :
                      '需要重点关注和改进'}
                </div>
                <div style={{ fontSize: 11, color: '#777777', marginTop: 2 }}>
                  分析时间：{formatTime(currentResult.analyzedAt)}
                </div>
              </div>
            </div>

            {/* 各维度得分 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#333333' }}>📊 维度得分</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentResult.dimScores.map((dim, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 80, fontSize: 13, fontWeight: 600, flexShrink: 0, color: '#333333' }}>{dim.name}</div>
                    <div style={{ flex: 1 }}>
                      <Progress
                        percentage={dim.score}
                        theme={dim.score >= 75 ? 'success' : dim.score >= 60 ? 'warning' : 'danger'}
                        label={false}
                      />
                    </div>
                    <div style={{
                      width: 32,
                      fontSize: 13,
                      fontWeight: 700,
                      textAlign: 'right',
                      color: dim.score >= 75 ? '#333333' : dim.score >= 60 ? '#333333' : '#333333',
                    }}>
                      {dim.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 亮点 & 待改进 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{
                padding: 16,
                background: '#FAFAFA',
                borderRadius: 8,
                border: '1px solid #E0E0E0',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 8 }}>✅ 表现亮点</div>
                {currentResult.strengths.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.8, color: '#777777' }}>
                    {currentResult.strengths.map((s, i) => (
                      <li key={i}>{s}方面表现较好</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: 13, color: '#777777' }}>暂无突出亮点，继续加油！</div>
                )}
              </div>
              <div style={{
                padding: 16,
                background: '#FAFAFA',
                borderRadius: 8,
                border: '1px solid #E0E0E0',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 8 }}>⚠️ 需要改进</div>
                {currentResult.improvements.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.8, color: '#777777' }}>
                    {currentResult.improvements.map((s, i) => (
                      <li key={i}>{s}需要加强</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: 13, color: '#777777' }}>各方面表现均衡，保持住！</div>
                )}
              </div>
            </div>

            {/* 改进建议 */}
            <div style={{
              padding: 16,
              background: '#FAFAFA',
              borderRadius: 8,
              border: '1px solid #E0E0E0',
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#333333', marginBottom: 8 }}>💡 改进建议</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 2, color: '#777777' }}>
                {currentResult.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* 内容统计 */}
            <div style={{
              display: 'flex',
              gap: 16,
              fontSize: 12,
              color: '#777777',
              justifyContent: 'center',
              padding: 10,
              background: '#FAFAFA',
              borderRadius: 8,
              border: '1px solid #E0E0E0',
            }}>
              <span>📝 内容字数：{currentResult.wordCount}</span>
              <span>📋 分析维度：{currentResult.dimScores.length}项</span>
              <span>📅 分析时间：{formatTime(currentResult.analyzedAt)}</span>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
