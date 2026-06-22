import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, Input, Button, Tag, MessagePlugin } from 'tdesign-react';
import { ChevronRightCircleIcon as SendIcon } from 'tdesign-icons-react';
import { chatPresets } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const GRADE_OPTIONS = ['大一', '大二', '大三', '大四', '研一', '研二', '研三'];

const CHAT_MODES = [
  { id: 'growth', label: '🚀 我要规划成长', desc: '岗位探索、技能学习、项目实践、简历优化、面试准备' },
  { id: 'emotion', label: '💙 我想聊聊压力', desc: '情绪倾诉、压力缓解、获得鼓励、把焦虑变成行动' },
];

const EMOTION_QUICK_ASKS = [
  { label: '😔 压力好大', q: '压力好大，快撑不住了' },
  { label: '😞 想放弃了', q: '努力了很久还是没有结果，想放弃了' },
  { label: '🤕 自我怀疑', q: '我是不是不够好？为什么别人都那么厉害？' },
  { label: '😰 秋招焦虑', q: '我大三了还没有实习经历，秋招还来得及吗？' },
  { label: '😵 方向迷茫', q: '我是大二计算机专业，不知道适合开发还是产品怎么办？' },
];

const GRADE_QUICK_ASKS = {
  '大一': [
    { label: '🌱 大一好迷茫', q: '大一，感觉很迷茫，不知道大学四年该做什么' },
    { label: '🔄 想转专业', q: '大一，选的专业不喜欢，要不要转专业？' },
  ],
  '大二': [
    { label: '🏃 大家都在卷', q: '大二了，身边同学都在卷实习，我好焦虑' },
    { label: '🤔 方向纠结', q: '我是大二计算机专业，不知道适合开发还是产品怎么办？' },
  ],
  '大三': [
    { label: '😰 没实习经历', q: '我大三了还没有实习经历，秋招还来得及吗？' },
    { label: '😞 觉得自己不行', q: '大三，感觉自己什么都不会，是不是来不及了？' },
    { label: '⚖️ 考研vs求职', q: '大三，秋招和考研怎么选？好纠结' },
  ],
  '大四': [
    { label: '💔 秋招零offer', q: '大四秋招零offer，是不是没希望了？' },
    { label: '🎉 offer怎么选', q: '大四，拿了几个offer不知道怎么选' },
  ],
  '研一': [
    { label: '😞 研究生落差', q: '研一，感觉研究生生活和想象中不一样，很失落' },
    { label: '🕊️ 导师放养', q: '研一，导师很忙没空管我，感觉很迷茫' },
  ],
  '研二': [
    { label: '📝 论文发不出', q: '研二，论文发不出来，毕业都成问题' },
    { label: '🤔 实习vs科研', q: '研二，应该去实习还是专心做科研？' },
  ],
  '研三': [
    { label: '💥 论文+秋招', q: '研三，论文和秋招同时进行，快崩溃了' },
    { label: '🤷 读研有意义吗', q: '研三，硕士找工作还不如本科生，读研的意义在哪？' },
  ],
};

export default function AiChat() {
  const { user, saveChatHistory, getChatHistory } = useAuth();
  const sessionIdRef = useRef(Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8));

  const [chatMode, setChatMode] = useState('growth');
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: '同学你好！我是e职伴 🐧，一只懂求职、更懂你的 AI 企鹅。\n\n不管你是大一还是研三，无论你在焦虑、迷茫还是自我怀疑——我都会在这里陪着你，帮你找到属于自己的职业方向。\n\n💡 **你可以**：\n• 选择你的年级，看看同龄人都在问什么求职问题\n• 点击情绪标签，找到和你感同身受的回答\n• 直接输入你想说的话，我会认真听\n\n记住，求职路上你不需要一个人扛着所有压力。来吧，和我聊聊 💙',
      time: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showGradePanel, setShowGradePanel] = useState(true);
  const chatEndRef = useRef(null);

  // 尝试加载用户之前未完成的会话
  useEffect(() => {
    if (user) {
      const saved = getChatHistory(sessionIdRef.current);
      // 如果有之前未完成的会话（超过2条消息），恢复它
      if (saved && saved.messages && saved.messages.length > 1) {
        // 不自动恢复，但可以提示用户
      }
    }
  }, [user]);

  // 消息变化时自动保存（仅已登录用户）
  const saveMessages = useCallback((msgs) => {
    if (user && msgs.length > 0) {
      saveChatHistory(sessionIdRef.current, msgs, chatMode);
    }
  }, [user, chatMode, saveChatHistory]);

  // 当消息更新时保存
  useEffect(() => {
    if (messages.length > 1) {
      saveMessages(messages);
    }
  }, [messages.length]);

  // 切换模式时更新欢迎语
  const handleModeSwitch = (mode) => {
    setChatMode(mode);
    if (mode === 'growth') {
      setMessages([{
        role: 'ai',
        content: '🚀 **成长规划模式已开启！**\n\n在这个模式下，我会帮你解决：\n• 🗺️ 岗位探索与方向选择\n• 📚 技能学习路径规划\n• 🔧 项目实践经验积累\n• 📝 简历优化与面试准备\n\n💡 选择你的年级，或直接问我求职相关的问题吧！',
        time: new Date().toISOString(),
      }]);
    } else {
      setMessages([{
        role: 'ai',
        content: '💙 **情绪陪伴模式已开启！**\n\n在这个模式下，我是你的倾听者和陪伴者：\n• 🫂 你可以尽情表达焦虑、迷茫和压力\n• 🌿 我会先接住你的情绪，再陪你一起想办法\n• 🎯 把模糊的压力拆成具体的小行动\n\n这里没有评判，只有理解。想说什么，我都认真听。\n\n🐧 你今天心情怎么样？',
        time: new Date().toISOString(),
      }]);
    }
    setSelectedGrade(null);
    setShowGradePanel(true);
    setInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 关键词权重匹配：按匹配到的关键词数量和质量排序，找最佳回复
  const findPresetReply = (userMsg) => {
    const lowerMsg = userMsg.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const preset of chatPresets) {
      let score = 0;
      const lowerPreset = preset.user.toLowerCase();

      // 年级匹配加分
      if (preset.grade && preset.grade !== '通用' && lowerMsg.includes(preset.grade.toLowerCase())) {
        score += 5;
      }

      // 关键词逐词匹配
      const presetWords = lowerPreset.replace(/[？?，,。.！!]/g, ' ').split(/\s+/).filter(w => w.length >= 2);
      for (const word of presetWords) {
        if (lowerMsg.includes(word)) {
          score += 1;
        }
      }

      // 完整短句匹配高分
      if (lowerMsg.includes(lowerPreset.slice(0, 10)) || lowerMsg.includes(lowerPreset.slice(-10))) {
        score += 3;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = preset;
      }
    }

    if (bestMatch && bestScore >= 3) {
      return bestMatch.ai;
    }

    // ========== 情绪陪伴模式专属回复 ==========
    if (chatMode === 'emotion') {
      return generateEmotionModeReply(userMsg);
    }

    // 情绪安抚通用回复（成长规划模式下的情绪检测）
    const emotionWords = ['压力', '焦虑', '崩溃', '撑不住', '放弃', '不行', '不够好', '失败', '难过', '害怕', '担心', 'emo', '抑郁', '累'];
    const hasEmotion = emotionWords.some(w => lowerMsg.includes(w));

    if (hasEmotion) {
      return '同学，我能感受到你现在情绪很低落 💙\n\n先停下来，深呼吸。你不需要一直那么坚强。\n\n🌿 **e职伴想对你说**：\n• 感到压力不是你的错，求职和学业本身就很难兼顾\n• 你看到的别人的光鲜，只是他们愿意展示的一面\n• 今天如果太累了，就允许自己休息\n\n🐧 任何时候想聊聊，我都在这里。\n\n💡 需要更深入的情绪陪伴？试试切换到"💙 我想聊聊压力"模式，或者去"情绪陪伴室"页面。';
    }

    // 通用回复
    const genericReplies = [
      '谢谢你的分享！🌟\n\n我理解你的困惑。大学阶段的迷茫其实很正常，关键在于行动起来。\n\n建议你先去"成长诊断"页面做个评估，了解自己的优势短板，然后根据建议一步步推进。\n\n需要我帮你具体分析一下吗？',
      '这是个很好的问题！🤔\n\n每个同学的成长路径都不一样，最重要的是找到适合自己的节奏。\n\n我建议你可以：\n1. 先去"职业探索地图"了解不同岗位\n2. 在"AI能力定制"页面生成你的专属路线\n3. 每天在"技能中心"完成一张任务卡\n\n一步一步来，不用焦虑！需要我详细说说哪一步吗？',
      '我理解你的感受 💙\n\n求职路上确实有很多不确定性，但你已经迈出了最重要的一步——主动思考未来。\n\ne职伴的建议是：不要一个人闷头想，去试试看。去"项目工坊"做一个小项目，去"求职准备中心"练一道面试题，行动会给你答案。\n\n你想先尝试哪个方向？',
    ];
    return genericReplies[Math.floor(Math.random() * genericReplies.length)];
  };

  // 情绪陪伴模式专属回复生成
  const generateEmotionModeReply = (userMsg) => {
    const lowerMsg = userMsg.toLowerCase();

    // 检测不同情绪类型
    const emotionPatterns = {
      rejected: ['简历', '投递', '没有回应', '被拒', '石沉大海', '没消息', '回复'],
      interview: ['面试', '紧张', '说不出话', '害怕面试', '群面'],
      compare: ['同学', '别人', '身边', '朋友圈', '他们', '都拿到', '就我'],
      lost: ['迷茫', '不知道', '方向', '适合', '做什么', '怎么办'],
      inadequate: ['不够好', '不行', '差', '能力不够', '配不上', '不如', '什么都不会'],
      pressure: ['压力', '崩溃', '撑不住', '累', '喘不过气', '论文', '毕业'],
    };

    let detectedEmotion = 'general';
    let maxMatches = 0;
    for (const [key, words] of Object.entries(emotionPatterns)) {
      const matches = words.filter(w => lowerMsg.includes(w)).length;
      if (matches > maxMatches) { maxMatches = matches; detectedEmotion = key; }
    }

    const emotionReplies = {
      rejected: `亲爱的同学，我感受到了你的失落 💙\n\n投递简历没有回应，那种"把自己交出去然后被沉默"的感觉，真的很难受。但我想告诉你：**没有回应 ≠ 你不够好。**\n\n校招中简历没有回应，常见的原因有：\n• 简历关键词没有匹配JD（HR用系统筛选）\n• 投递时间不对（非招聘季/太晚）\n• 岗位竞争比太高（热门岗位1:500+）\n\n🌱 **今天只做一件事**：\n把你最近投的一个岗位JD复制出来，对比你的简历——看看有没有3个以上的关键词重合。如果没有，我们就从这里开始改。\n\n🐧 不是你不行，是你的好还没被正确的方式呈现。我陪你一起调整。`,
      interview: `面试紧张太正常了，几乎每个人都会 💙\n\n你知道吗？适度的紧张其实能让你表现更好——它会让你更专注。\n\n🌿 **面试紧张的核心原因**：\n• 把面试当成"考试"而不是"对话"\n• 害怕暴露自己"不会"的部分\n• 对未知的恐惧\n\n🎯 **今天只做一件事**：\n去"求职准备中心"选一道面试题，用手机录音回答1分钟。录完自己听一遍——不是为了批评自己，而是熟悉"自己的声音"。\n\n🐧 面试官也是人，他们也紧张过。真诚比完美更重要。`,
      compare: `比较的压力我太懂了 💙\n\n但你知道吗？你看到的是别人的"精选集"，却拿自己的"完整版"在对比。\n\n朋友圈里晒offer的同学，不会晒他们被拒的几十次。那个"大三就进大厂"的学长，可能已经焦虑到失眠。\n\n🌱 **今天只做一件事**：\n写下你自己最近做成的3件事——不管多小。坚持早起了、帮了朋友一个忙、完成了一次作业。\n\n🐧 人生不是百米冲刺，是各自在不同跑道的马拉松。你的节奏，就是最好的节奏。`,
      lost: `迷茫说明你在认真思考 💙\n\n那些从不迷茫的人，要么是还没开始想，要么是被安排好了不需要想。而你愿意面对"不确定"，这本身就很有勇气。\n\n🔍 **迷茫通常不是"选项太少"，而是"试得太少"**：\n• 你可能看了很多岗位描述，但没真正尝试过\n• 你可能听了很多建议，但没动手做过\n\n🌱 **今天只做一件事**：\n去"职业探索地图"随机看3个岗位的详细介绍。不用做决定，只是看看。也许某个方向会让你眼睛一亮。\n\n🐧 方向不是想出来的，是走出来的。先迈一小步，路就慢慢清晰了。`,
      inadequate: `"觉得自己不够好"——这句话我听到太多太多次了 💙\n\n但你知道吗？心理学上有个现象叫"达克效应"：能力越强的人，越容易低估自己。那些觉得自己"什么都不会"的人，往往只是对自己的要求太高了。\n\n🌱 **今天只做一件事**：\n列出你已经掌握的3个技能——哪怕是"会做PPT""写过课程论文""会用Excel做表格"。你拥有的，比你认为的多得多。\n\n🐧 你不是不够好，你只是还没学会看见自己已经拥有的。`,
      pressure: `我听到了你的累 💙\n\n多重压力同时压过来的时候，最消耗人的不是事情本身，而是"我必须同时搞定所有事"的念头。\n\n🌿 **先做一个深呼吸，然后试试这个**：\n把所有压力写在一张纸上，然后只圈出"本周必须完成的一件事"。其他的，允许自己先放一放。\n\n🌱 **今天只做一件事**：\n给自己30分钟"什么都不想"的时间。去操场走一圈、听几首歌、看一集喜欢的剧。\n\n🐧 能扛到现在，你已经非常了不起了。休息不是放弃，是为了走更远的路。`,
      general: `我在这里，认真听你说 💙\n\n不管是什么感受，它都是真实的、值得被认真对待的。求职路上的焦虑、迷茫、自我怀疑——这些情绪不是你的错，是这条路本身就充满挑战。\n\n🌱 **今天只做一件事**：\n不需要解决所有问题，只需要做一件很小的事——修改一行简历、收藏一个岗位、或者给自己泡杯热茶。\n\n🐧 e职伴一直在这里。任何时候你想聊聊，我都认真听。`,
    };

    return emotionReplies[detectedEmotion] || emotionReplies.general;
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: 'user', content: text, time: new Date().toISOString() };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput('');
    setIsTyping(true);

    // 保存用户消息
    saveMessages(updatedMsgs);

    setTimeout(() => {
      const reply = findPresetReply(text);
      const finalMsgs = [...updatedMsgs, { role: 'ai', content: reply, time: new Date().toISOString() }];
      setMessages(finalMsgs);
      setIsTyping(false);
      // 保存完整对话
      saveMessages(finalMsgs);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAsk = (question) => {
    setInput(question);
    setTimeout(() => {
      const userMsg = { role: 'user', content: question, time: new Date().toISOString() };
      const updatedMsgs = [...messages, userMsg];
      setMessages(updatedMsgs);
      setInput('');
      setIsTyping(true);
      saveMessages(updatedMsgs);
      setTimeout(() => {
        const reply = findPresetReply(question);
        const finalMsgs = [...updatedMsgs, { role: 'ai', content: reply, time: new Date().toISOString() }];
        setMessages(finalMsgs);
        setIsTyping(false);
        saveMessages(finalMsgs);
      }, 1000);
    }, 100);
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setShowGradePanel(false);
  };

  // 加载历史会话
  const [historyOpen, setHistoryOpen] = useState(false);
  const loadSession = (session) => {
    if (session && session.messages) {
      setMessages(session.messages);
      setChatMode(session.mode || 'growth');
      sessionIdRef.current = session.sessionId;
      MessagePlugin.success('已加载历史对话');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="section-title" style={{ marginBottom: 4 }}>💬 AI 陪伴聊天</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>和e职伴聊聊你的困惑与想法，懂求职的AI企鹅随时在线陪你</p>
          </div>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                background: 'rgba(255,209,73,0.08)',
                borderRadius: 8,
                border: '1px solid #222222',
                fontSize: 13,
                fontWeight: 600,
                color: '#333333',
              }}>
                <span>🐧</span>
                {user.username}
                {user.grade && <span style={{ opacity: 0.7 }}>· {user.grade}</span>}
              </div>
              <Button
                size="small"
                variant="outline"
                onClick={() => setHistoryOpen(!historyOpen)}
                style={{ fontSize: 12, borderRadius: 6 }}
              >
                📋 历史 ({user.chatHistory?.length || 0})
              </Button>
            </div>
          )}
          {!user && (
            <div style={{
              padding: '8px 16px',
              background: '#FAFAFA',
              borderRadius: 8,
              fontSize: 12,
              color: '#777777',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid #E0E0E0',
            }}>
              💡 登录后可保存聊天记录，随时回顾成长历程
            </div>
          )}
        </div>

        {/* 历史会话列表 */}
        {historyOpen && user && (
          <div style={{
            marginTop: 12,
            padding: '16px',
            background: '#FFFFFF',
            borderRadius: 8,
            border: '1px solid #222222',
            maxHeight: 220,
            overflow: 'auto',
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#333333' }}>📋 历史对话记录</p>
            {(user.chatHistory || []).length === 0 ? (
              <p style={{ fontSize: 13, color: '#777777' }}>暂无历史记录，开始聊天吧！</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(user.chatHistory || []).map((session, i) => (
                  <div
                    key={session.sessionId}
                    onClick={() => loadSession(session)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      background: session.sessionId === sessionIdRef.current ? 'rgba(255,209,73,0.08)' : '#FAFAFA',
                      border: session.sessionId === sessionIdRef.current ? '1px solid #FFD149' : '1px solid transparent',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onMouseEnter={e => { if (session.sessionId !== sessionIdRef.current) e.currentTarget.style.background = '#F5F5F5'; }}
                    onMouseLeave={e => { if (session.sessionId !== sessionIdRef.current) e.currentTarget.style.background = '#FAFAFA'; }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, color: '#333333' }}>
                        {session.mode === 'emotion' ? '💙' : '🚀'}
                        {session.mode === 'emotion' ? '情绪陪伴' : '成长规划'}
                        {session.sessionId === sessionIdRef.current && (
                          <Tag theme="primary" size="small" variant="light">当前</Tag>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#777777', marginTop: 2 }}>
                        {session.messages?.length || 0} 条消息 · {new Date(session.timestamp).toLocaleString('zh-CN')}
                      </div>
                    </div>
                    <div style={{ fontSize: 18, color: '#AAAAAA' }}>→</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========== 模式切换 ========== */}
      <Card bordered style={{
        borderRadius: 8,
        marginBottom: 16,
        background: '#FAFAFA',
        border: '1px solid #222222',
        padding: '8px',
      }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {CHAT_MODES.map(mode => (
            <div
              key={mode.id}
              onClick={() => handleModeSwitch(mode.id)}
              style={{
                flex: 1,
                maxWidth: 260,
                padding: '14px 16px',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
                textAlign: 'center',
                background: chatMode === mode.id
                  ? (mode.id === 'growth' ? '#FFD149' : '#4A86E8')
                  : '#FFFFFF',
                color: chatMode === mode.id ? '#333333' : '#333333',
                border: chatMode === mode.id
                  ? '1px solid #222222'
                  : '1px solid #E0E0E0',
              }}
              onMouseEnter={e => {
                if (chatMode !== mode.id) {
                  e.currentTarget.style.borderColor = '#222222';
                }
              }}
              onMouseLeave={e => {
                if (chatMode !== mode.id) {
                  e.currentTarget.style.borderColor = '#E0E0E0';
                }
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                {mode.label}
              </div>
              <div style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>
                {mode.desc}
              </div>
              {chatMode === mode.id && (
                <div style={{
                  marginTop: 6,
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,.6)',
                  border: '1px solid rgba(0,0,0,.15)',
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  当前模式
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Grade Selector */}
      <Card bordered style={{
        borderRadius: 'var(--radius-lg)',
        marginBottom: 16,
        padding: '16px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>🎓 我的年级：</span>
            {GRADE_OPTIONS.map(g => (
              <Tag
                key={g}
                theme={selectedGrade === g ? 'primary' : 'default'}
                variant={selectedGrade === g ? 'dark' : 'light'}
                size="medium"
                onClick={() => handleGradeSelect(g)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  ...(selectedGrade === g ? {} : { opacity: 0.75 }),
                }}
              >
                {g}
              </Tag>
            ))}
          </div>
          {selectedGrade && (
            <span
              onClick={() => { setSelectedGrade(null); setShowGradePanel(true); }}
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              重置年级
            </span>
          )}
        </div>

        {/* Grade-specific Quick Asks */}
        {selectedGrade && GRADE_QUICK_ASKS[selectedGrade] && (
          <div style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid var(--border)',
          }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
              💡 {selectedGrade}同学常问的问题：
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {GRADE_QUICK_ASKS[selectedGrade].map((item, i) => (
                <Tag
                  key={i}
                  theme="default"
                  variant="outline"
                  size="medium"
                  onClick={() => handleQuickAsk(item.q)}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                  }}
                >
                  {item.label}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Emotion Quick Panel - 情绪陪伴模式专用 */}
      <Card bordered style={{
        borderRadius: 8,
        marginBottom: 16,
        padding: '14px 20px',
        background: '#FAFAFA',
        border: '1px solid #E0E0E0',
      }}>
        <p style={{
          fontSize: 12,
          color: '#777777',
          marginBottom: 8,
          fontWeight: 600,
        }}>
          💙 情绪陪伴 · 点击标签和e职伴聊聊心里话：
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {EMOTION_QUICK_ASKS.map((item, i) => (
            <Tag
              key={i}
              theme="default"
              variant="outline"
              size="medium"
              onClick={() => handleQuickAsk(item.q)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderColor: '#4A86E8',
                color: '#4A86E8',
              }}
            >
              {item.label}
            </Tag>
          ))}
        </div>
      </Card>

      {/* Chat Container */}
      <Card bordered style={{
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 560px)',
        minHeight: 420,
        overflow: 'hidden',
        border: '1px solid #222222',
      }}>
        {/* Messages */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeInUp 0.3s ease-out',
              }}
            >
              <div style={{
                display: 'flex',
                gap: 10,
                maxWidth: '80%',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: 18,
                  background: msg.role === 'ai'
                    ? (chatMode === 'emotion' ? '#4A86E8' : '#FFD149')
                    : '#F5F5F5',
                  border: '1px solid #222222',
                  color: msg.role === 'ai' ? '#FFFFFF' : '#333333',
                }}>
                  {msg.role === 'ai' ? '🐧' : '👤'}
                </div>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                  background: msg.role === 'ai'
                    ? (chatMode === 'emotion' ? '#FAFAFA' : '#FAFAFA')
                    : (chatMode === 'emotion' ? '#4A86E8' : '#FFD149'),
                  color: msg.role === 'ai' ? '#333333' : '#333333',
                  fontSize: 15,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  border: msg.role === 'ai'
                    ? '1px solid #E0E0E0'
                    : '1px solid #222222',
                }}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: chatMode === 'emotion' ? '#4A86E8' : '#FFD149',
                border: '1px solid #222222',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: '#FFFFFF',
              }}>🐧</div>
              <div style={{
                padding: '12px 20px',
                borderRadius: '4px 12px 12px 12px',
                background: '#FAFAFA',
                border: '1px solid #E0E0E0',
                display: 'flex', gap: 4,
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#CCCCCC',
                    animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Questions Row */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid #E0E0E0',
          display: 'flex', gap: 6, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 11, color: '#777777', marginRight: 4, alignSelf: 'center' }}>快捷：</span>
          {chatPresets.filter(p => p.grade === '通用').slice(0, 4).map((preset, i) => (
            <div
              key={i}
              onClick={() => handleQuickAsk(preset.user)}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                cursor: 'pointer',
                background: '#FAFAFA',
                border: '1px solid #E0E0E0',
                color: '#333333',
                fontWeight: 500,
                transition: 'all var(--transition)',
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F5F5F5'; e.currentTarget.style.borderColor = '#222222'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FAFAFA'; e.currentTarget.style.borderColor = '#E0E0E0'; }}
            >
              {preset.user.slice(0, 25)}...
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 20px 16px',
          borderTop: '1px solid #E0E0E0',
          display: 'flex', gap: 10,
        }}>
          <Input
            value={input}
            onChange={setInput}
            placeholder={
              chatMode === 'emotion'
                ? '在这里写下你的感受，我会认真听... 💙'
                : (selectedGrade ? `作为${selectedGrade}同学，你想问e职伴什么...` : '输入你想问的问题...')
            }
            onEnter={handleSend}
            style={{ flex: 1 }}
          />
          <Button
            theme="primary"
            icon={<SendIcon />}
            onClick={handleSend}
            disabled={!input.trim()}
            shape="circle"
          />
        </div>
      </Card>

      {/* API placeholder note */}
      <div style={{
        marginTop: 16,
        padding: '12px 16px',
        background: '#FAFAFA',
        borderRadius: 6,
        fontSize: 12,
        color: '#777777',
        textAlign: 'center',
        border: '1px dashed #E0E0E0',
      }}>
        💡 当前为模拟对话模式。如需接入真实AI API，请在 <code style={{ background: '#F5F5F5', padding: '1px 4px', borderRadius: 3, border: '1px solid #E0E0E0' }}>AiChat.jsx</code> 的 <code style={{ background: '#F5F5F5', padding: '1px 4px', borderRadius: 3, border: '1px solid #E0E0E0' }}>handleSend</code> 函数中替换为API调用。
      </div>
    </div>
  );
}
