import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Select, Textarea, Radio, Button, Progress, Tag, MessagePlugin, Space, Dialog } from 'tdesign-react';
import { CheckCircleIcon, ChevronRightIcon, UserIcon } from 'tdesign-icons-react';
import { useAuth } from '../context/AuthContext';
import AuthPage from './AuthPage';

const { FormItem } = Form;

const gradeOptions = [
  { label: '大一', value: 'freshman' },
  { label: '大二', value: 'sophomore' },
  { label: '大三', value: 'junior' },
  { label: '大四', value: 'senior' },
  { label: '大五', value: 'senior5' },
  { label: '研一', value: 'master1' },
  { label: '研二', value: 'master2' },
  { label: '研三', value: 'master3' },
  { label: '博一', value: 'doctor1' },
  { label: '博二', value: 'doctor2' },
  { label: '博三', value: 'doctor3' },
  { label: '博四', value: 'doctor4' },
  { label: '博五', value: 'doctor5' },
  { label: '博六及以上', value: 'doctor6' },
];

const majorOptions = [
  { label: '计算机/软件工程', value: 'cs' },
  { label: '新闻传播/中文', value: 'media' },
  { label: '市场营销/工商管理', value: 'marketing' },
  { label: '设计类', value: 'design' },
  { label: '金融/经济', value: 'finance' },
  { label: '医学/生物', value: 'medical' },
  { label: '法学', value: 'law' },
  { label: '城市规划/建筑', value: 'architecture' },
  { label: '其他专业', value: 'other' },
];

const directionOptions = [
  { label: '技术研发', value: 'tech' },
  { label: '产品经理', value: 'pm' },
  { label: '数据分析', value: 'data' },
  { label: '内容运营', value: 'operation' },
  { label: '游戏策划', value: 'game' },
  { label: '设计体验', value: 'design' },
  { label: '还不确定', value: 'unknown' },
];

const emotionStatusOptions = [
  { label: '😊 状态很好，想主动提升', value: 'good' },
  { label: '😵 有点迷茫，不知道方向', value: 'lost' },
  { label: '😰 有些焦虑，担心来不及', value: 'anxious' },
  { label: '😔 压力比较大，需要陪伴和鼓励', value: 'stressed' },
  { label: '💔 正在求职受挫，需要复盘', value: 'frustrated' },
];

const mbtiOptions = [
  { label: 'INTJ — 建筑师', value: 'INTJ' },
  { label: 'INTP — 逻辑学家', value: 'INTP' },
  { label: 'ENTJ — 指挥官', value: 'ENTJ' },
  { label: 'ENTP — 辩论家', value: 'ENTP' },
  { label: 'INFJ — 提倡者', value: 'INFJ' },
  { label: 'INFP — 调停者', value: 'INFP' },
  { label: 'ENFJ — 主人公', value: 'ENFJ' },
  { label: 'ENFP — 竞选者', value: 'ENFP' },
  { label: 'ISTJ — 物流师', value: 'ISTJ' },
  { label: 'ISFJ — 守卫者', value: 'ISFJ' },
  { label: 'ESTJ — 总经理', value: 'ESTJ' },
  { label: 'ESFJ — 执政官', value: 'ESFJ' },
  { label: 'ISTP — 鉴赏家', value: 'ISTP' },
  { label: 'ISFP — 探险家', value: 'ISFP' },
  { label: 'ESTP — 企业家', value: 'ESTP' },
  { label: 'ESFP — 表演者', value: 'ESFP' },
  { label: '不太了解 / 没测过', value: 'unknown' },
];

const zodiacOptions = [
  { label: '♈ 白羊座 (3.21-4.19)', value: 'aries' },
  { label: '♉ 金牛座 (4.20-5.20)', value: 'taurus' },
  { label: '♊ 双子座 (5.21-6.21)', value: 'gemini' },
  { label: '♋ 巨蟹座 (6.22-7.22)', value: 'cancer' },
  { label: '♌ 狮子座 (7.23-8.22)', value: 'leo' },
  { label: '♍ 处女座 (8.23-9.22)', value: 'virgo' },
  { label: '♎ 天秤座 (9.23-10.23)', value: 'libra' },
  { label: '♏ 天蝎座 (10.24-11.22)', value: 'scorpio' },
  { label: '♐ 射手座 (11.23-12.21)', value: 'sagittarius' },
  { label: '♑ 摩羯座 (12.22-1.19)', value: 'capricorn' },
  { label: '♒ 水瓶座 (1.20-2.18)', value: 'aquarius' },
  { label: '♓ 双鱼座 (2.19-3.20)', value: 'pisces' },
  { label: '不太想填', value: 'unknown' },
];

const aiProficiencyOptions = [
  { label: '🚀 熟练运用国内外各类大模型（GPT/Claude/文心/通义等）', value: 'expert' },
  { label: '💡 经常使用AI工具辅助学习和工作', value: 'frequent' },
  { label: '🔍 偶尔使用，有一定了解', value: 'occasional' },
  { label: '👀 接触过但不太会用', value: 'touched' },
  { label: '❌ 很少/几乎不用', value: 'none' },
];

const educationHistoryOptions = [
  { label: '🎓 本科在读', value: 'bachelor_in' },
  { label: '🎓 本科毕业', value: 'bachelor_out' },
  { label: '📚 硕士在读', value: 'master_in' },
  { label: '📚 硕士毕业', value: 'master_out' },
  { label: '🔬 博士在读', value: 'doctor_in' },
  { label: '🔬 博士毕业', value: 'doctor_out' },
  { label: '📖 专科在读', value: 'associate_in' },
  { label: '📖 专科毕业', value: 'associate_out' },
  { label: '🏫 高中毕业（即将入学）', value: 'high_school' },
];

function generateProfile(values) {
  const gradeMap = {
    freshman: '大一', sophomore: '大二', junior: '大三', senior: '大四', senior5: '大五',
    master1: '研一', master2: '研二', master3: '研三',
    doctor1: '博一', doctor2: '博二', doctor3: '博三', doctor4: '博四', doctor5: '博五', doctor6: '博六及以上',
  };
  const majorMap = { cs: '计算机/软件工程', media: '新闻传播/中文', marketing: '市场营销/工商管理', design: '设计类', finance: '金融/经济', medical: '医学/生物', law: '法学', architecture: '城市规划/建筑', other: '其他专业' };
  const dirMap = { tech: '技术研发', pm: '产品经理', data: '数据分析', operation: '内容运营', game: '游戏策划', design: '设计体验', unknown: '待探索' };

  const grade = values.grade;
  const isJunior = ['freshman', 'sophomore'].includes(grade);
  const isMid = ['junior'].includes(grade);
  const isSenior = ['senior', 'senior5'].includes(grade);
  const isMaster = ['master1', 'master2', 'master3'].includes(grade);
  const isDoctor = ['doctor1', 'doctor2', 'doctor3', 'doctor4', 'doctor5', 'doctor6'].includes(grade);

  let stage, stageDesc, advantages, weaknesses, suggestions;

  const hasExp = values.hasExperience === 'yes';
  const aiProficiency = values.aiProficiency || 'none';
  const aiLevelMap = { expert: '熟练运用国内外各类大模型', frequent: '经常使用AI工具', occasional: '偶尔使用', touched: '接触过但不太会用', none: '很少使用' };
  const aiLevelLabel = aiLevelMap[aiProficiency] || '很少使用';
  const hasAI = aiProficiency !== 'none';
  const isAIExpert = aiProficiency === 'expert' || aiProficiency === 'frequent';
  const mbti = values.mbti || 'unknown';
  const zodiac = values.zodiac || 'unknown';

  // MBTI简要分析映射
  const mbtiProfiles = {
    INTJ: { trait: '战略型思考者', desc: '擅长制定长期规划，独立、果断，适合需要深度思考和分析的岗位', color: '#6366f1' },
    INTP: { trait: '逻辑创新者', desc: '善于抽象思维和解决复杂问题，适合技术研发、数据分析等方向', color: '#8b5cf6' },
    ENTJ: { trait: '果断领导者', desc: '天生领导气质，目标导向，适合管理培训生、产品经理等岗位', color: '#0052d9' },
    ENTP: { trait: '机智辩论家', desc: '思维敏捷、善于创新，适合创业、产品创新、咨询等方向', color: '#f59e0b' },
    INFJ: { trait: '理想主义洞察者', desc: '深度共情能力，善于理解他人需求，适合用户体验、心理咨询、教育等', color: '#10b981' },
    INFP: { trait: '诗意调停者', desc: '内心丰富、价值观驱动，适合内容创作、品牌策划、公益等方向', color: '#ec4899' },
    ENFJ: { trait: '魅力引导者', desc: '善于激励他人，沟通能力突出，适合HR、运营、市场等方向', color: '#f97316' },
    ENFP: { trait: '热情探索家', desc: '充满创意和感染力，适合内容运营、品牌营销、活动策划等', color: '#e11d48' },
    ISTJ: { trait: '可靠执行者', desc: '严谨细致、责任感强，适合财务、审计、质量控制等需要精确性的岗位', color: '#0891b2' },
    ISFJ: { trait: '温暖守护者', desc: '细心周到、服务意识强，适合行政、客服、护理、教育等方向', color: '#059669' },
    ESTJ: { trait: '高效管理者', desc: '务实高效、善于组织，适合项目管理、供应链、运营管理等方向', color: '#d97706' },
    ESFJ: { trait: '热心协调者', desc: '乐于助人、善于维护关系，适合客户成功、社群运营、公共事务等', color: '#dc2626' },
    ISTP: { trait: '冷静实干家', desc: '动手能力强、善于解决实际问题，适合工程、技术、设计等方向', color: '#4f46e5' },
    ISFP: { trait: '感性艺术家', desc: '审美敏锐、追求美感，适合设计、摄影、艺术创作等方向', color: '#be185d' },
    ESTP: { trait: '精力充沛的行动派', desc: '反应迅速、敢于冒险，适合销售、商务拓展、创业等方向', color: '#ea580c' },
    ESFP: { trait: '快乐表演者', desc: '感染力强、善于活跃气氛，适合直播、活动策划、演艺等方向', color: '#c026d3' },
  };

  const zodiacMap = {
    aries: '♈ 白羊座', taurus: '♉ 金牛座', gemini: '♊ 双子座',
    cancer: '♋ 巨蟹座', leo: '♌ 狮子座', virgo: '♍ 处女座',
    libra: '♎ 天秤座', scorpio: '♏ 天蝎座', sagittarius: '♐ 射手座',
    capricorn: '♑ 摩羯座', aquarius: '♒ 水瓶座', pisces: '♓ 双鱼座',
  };

  if (isJunior) {
    stage = '🔍 职业探索期';
    stageDesc = '你正处于大学早期，这是职业认知和基础能力积累的黄金期。不用急于确定方向，重点是广泛了解和打好基础。';
    advantages = ['时间充裕，试错成本低', '学习能力强，可塑性高'];
    weaknesses = ['对行业和岗位了解不足', '缺乏实践经验和作品', '职业规划方向不够清晰'];
    suggestions = [
      '每周花2小时浏览"职业探索地图"，了解不同岗位',
      '在"技能成长中心"每天完成1张任务卡',
      '大二暑假前至少完成1个"项目工坊"的小项目',
      '参加1-2个校园社团或比赛，积累团队协作经验',
    ];
  } else if (isMid) {
    stage = '🚀 能力冲刺期';
    stageDesc = '大三是最关键的积累期。你需要开始聚焦目标岗位，通过实习和项目快速积累核心竞争力。';
    advantages = ['专业知识体系已初步建立', '对行业有一定认知'];
    weaknesses = ['专业技能深度不够', '时间紧迫需要高效规划'];
    suggestions = [
      '尽快确定1-2个目标岗位方向，集中精力准备',
      '在"项目工坊"完成2个高质量项目，充实简历',
      '大三暑假务必争取实习机会',
      '开始使用"求职准备中心"优化简历和模拟面试',
    ];
  } else if (isSenior) {
    stage = '🎯 求职冲刺期';
    stageDesc = '你已进入求职关键阶段。重点是包装已有经历、补齐短板、精准投递，同时为职场过渡做准备。';
    advantages = ['专业能力逐渐成熟', '目标方向可以明确'];
    weaknesses = ['部分岗位竞争激烈', '从校园到职场的心态转变'];
    suggestions = [
      '在"求职准备中心"进行3轮以上模拟面试',
      '利用"AI能力定制"补齐目标岗位的AI技能',
      '建立投递追踪表，每周复盘投递效果',
      '提前了解目标企业的文化和面试风格',
    ];
  } else if (isMaster) {
    stage = '🎯 求职冲刺期（硕士）';
    stageDesc = '硕士阶段是职业发展的关键跳板。你需要平衡科研与求职，用研究经历为简历加分，同时精准定位目标行业。';
    advantages = ['学历背景有竞争优势', '研究能力与专业深度突出'];
    weaknesses = ['科研与求职时间冲突', '部分行业对硕士期望更高'];
    suggestions = [
      '在"求职准备中心"进行3轮以上模拟面试',
      '将科研项目包装为简历中的亮点经历',
      '利用"AI能力定制"补齐目标行业的AI技能',
      '提前半年开始关注目标企业的校招时间线',
    ];
  } else if (isDoctor) {
    stage = '🔬 博士职业规划期';
    stageDesc = '博士阶段的职业路径更加多元。除了学术界，企业研发、技术管理、咨询等也是很好的方向。关键是尽早明确自己的偏好。';
    advantages = ['专业领域深度无人能及', '独立研究与解决问题能力极强'];
    weaknesses = ['企业求职经验相对不足', '学术与业界的信息不对称'];
    suggestions = [
      '明确自己是倾向学术界还是工业界，尽早定向准备',
      '参加行业会议或企业开放日，建立业界人脉',
      '在"求职准备中心"将科研成果转化为企业能理解的表达',
      '关注目标行业对博士的特殊招聘通道（如AI Lab、研究院等）',
    ];
  } else {
    stage = '🎯 求职冲刺期';
    stageDesc = '你已进入求职关键阶段。重点是包装已有经历、补齐短板、精准投递，同时为职场过渡做准备。';
    advantages = ['专业能力逐渐成熟', '目标方向可以明确'];
    weaknesses = ['部分岗位竞争激烈', '从校园到职场的心态转变'];
    suggestions = [
      '在"求职准备中心"进行3轮以上模拟面试',
      '利用"AI能力定制"补齐目标岗位的AI技能',
      '建立投递追踪表，每周复盘投递效果',
      '提前了解目标企业的文化和面试风格',
    ];
  }

  // 根据实际实习经验动态调整
  if (hasExp) {
    advantages.push('已有项目/实习经历，简历更有竞争力');
  } else {
    weaknesses.push('暂无项目/实习经历，简历竞争力较弱');
    suggestions.unshift('尽快在"项目工坊"完成实战项目，弥补实习空白');
  }

  // 根据AI熟练度动态调整
  if (isAIExpert) {
    advantages.push(`AI熟练度：${aiLevelLabel}，AI原生能力突出，在求职中具备显著优势`);
  } else if (aiProficiency === 'occasional') {
    advantages.push('有AI工具使用经验，具备AI思维基础');
    weaknesses.push('AI使用深度不足，建议从"偶尔用"升级到"经常用"，提升产出效率');
  } else if (aiProficiency === 'touched') {
    weaknesses.push('AI工具仅停留在"接触过"层面，建议尽快通过"AI能力定制"系统学习');
  } else {
    weaknesses.push('AI工具使用经验不足，建议尽快开始"AI能力定制"补齐短板');
  }

  const dirLabel = dirMap[values.direction] || '待探索';
  if (values.direction === 'unknown') {
    weaknesses.push('目标岗位方向尚未确定，建议优先使用"职业探索地图"');
    suggestions.unshift('优先完成"职业探索地图"全部岗位浏览，找到兴趣方向');
  }

  // ========== 情绪状态判断 ==========
  const emotionStatus = values.emotionStatus || 'good';
  const emotionInfo = {
    good: {
      label: '😊 状态良好，主动提升',
      desc: '你目前的状态很不错！保持积极心态，这是加速成长的最佳时机。',
      stressLevel: 'low',
      reliefAdvice: '保持当前节奏，可以适当增加挑战难度，主动探索更高阶的成长任务。',
    },
    lost: {
      label: '😵 有些迷茫',
      desc: '迷茫说明你在认真思考未来，这是成长的必经之路。不需要马上找到"唯一答案"，先迈出一小步。',
      stressLevel: 'mid',
      reliefAdvice: '建议减少信息摄入，不要同时看太多方向。先去"职业探索地图"随便看3个岗位，把"选方向"变成"了解方向"。',
    },
    anxious: {
      label: '😰 有些焦虑',
      desc: '焦虑是大脑在提醒你"这件事很重要"。适度的焦虑是动力，但不要让它在心里无限放大。',
      stressLevel: 'mid',
      reliefAdvice: '把焦虑的事情写下来，然后只关注"今天能控制的一件事"。去"情绪陪伴室"做一次3分钟情绪整理。',
    },
    stressed: {
      label: '😔 压力较大',
      desc: '你正在承受不小的压力。请先允许自己休息——压力大的时候，休息不是浪费时间，是必要的恢复。',
      stressLevel: 'high',
      reliefAdvice: '今天只做一件最小的事。去"情绪陪伴室"聊聊你的感受，或者给自己30分钟完全放空的时间。如果需要，学校心理咨询中心是很好的资源。',
    },
    frustrated: {
      label: '💔 求职受挫',
      desc: '被拒绝的感觉真的很痛。但请记住：每一次被拒都不是否定你这个人，只是这个岗位暂时不匹配。',
      stressLevel: 'high',
      reliefAdvice: '去"求职准备中心"做一次投递复盘，从"我不行"变成"哪里可以优化"。也欢迎去"情绪陪伴室"聊聊，把挫败感说出来会好很多。',
    },
  };

  const currentEmotion = emotionInfo[emotionStatus] || emotionInfo.good;

  // 今日最小行动任务
  const todayTask = (() => {
    if (isJunior) return '📝 去"职业探索地图"浏览3个岗位的介绍，找到1个让你心动的方向';
    if (isMid) return '🔧 在"项目工坊"选一个项目模板，完成第一步的任务拆解';
    if (values.direction === 'unknown') return '🗺️ 去"职业探索地图"随机看3个岗位，凭直觉选1个最感兴趣的';
    if (!hasExp) return '🔧 在"项目工坊"选一个和你的目标岗位相关的项目，开始第一步';
    return '📝 在"求职准备中心"优化简历中的一段项目经历描述';
  })();

  const educationHistoryMap = {
    bachelor_in: '🎓 本科在读', bachelor_out: '🎓 本科毕业',
    master_in: '📚 硕士在读', master_out: '📚 硕士毕业',
    doctor_in: '🔬 博士在读', doctor_out: '🔬 博士毕业',
    associate_in: '📖 专科在读', associate_out: '📖 专科毕业',
    high_school: '🏫 高中毕业',
  };
  const educationHistoryLabel = educationHistoryMap[values.educationHistory] || '';

  return {
    stage, stageDesc, advantages, weaknesses, suggestions,
    gradeLabel: gradeMap[grade],
    majorLabel: majorMap[values.major],
    directionLabel: dirLabel,
    hasExperience: hasExp,
    hasAI: hasAI,
    aiProficiency,
    aiLevelLabel,
    isAIExpert,
    mbti,
    mbtiProfile: mbtiProfiles[mbti] || null,
    zodiac,
    zodiacLabel: zodiacMap[zodiac] || '未填写',
    educationHistory: values.educationHistory || '',
    educationHistoryLabel,
    recommendedDir: values.direction === 'unknown' ? ['产品经理', '数据分析'] : [dirLabel],
    emotionStatus: currentEmotion,
    todayTask,
  };
}

export default function Diagnosis({ onComplete, profile }) {
  const { user, logout, addDiagnosisRecord } = useAuth();
  const [form] = Form.useForm();
  const [result, setResult] = useState(profile || null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    if (e.validateResult !== true) return;
    const values = form.getFieldsValue(true);
    const profileData = generateProfile(values);
    setResult(profileData);
    onComplete && onComplete(profileData);

    // 如果已登录，保存诊断记录
    if (user) {
      addDiagnosisRecord({
        ...profileData,
        rawInput: values,
      });
    }

    MessagePlugin.success('成长画像生成成功！');
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 32 }}>
        {/* ========== 用户登录/注册区域 ========== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 24,
          padding: user ? '12px 20px' : '0',
          background: user ? 'linear-gradient(135deg, #e3edff 0%, #ede9fe 100%)' : 'transparent',
          borderRadius: 16,
          border: user ? '1px solid #c7d2fe' : 'none',
        }}>
          <div>
            <h1 className="section-title" style={{ marginBottom: 4 }}>🔍 AI 成长诊断</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>填写基本信息，AI为你生成专属成长画像与下一步建议</p>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                textAlign: 'right',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 32, height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0052d9, #8b5cf6)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    🐧
                  </span>
                  {user.username}
                  {user.grade && (
                    <Tag theme="primary" variant="light" size="small">{user.grade}</Tag>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {user.age ? `${user.age}岁 · ` : ''}
                  诊断 {user.diagnosisHistory?.length || 0} 次 ·
                  聊天 {user.chatHistory?.length || 0} 次
                </div>
              </div>
              <Button
                size="small"
                variant="text"
                onClick={logout}
                style={{ color: 'var(--text-muted)', fontSize: 12 }}
              >
                退出
              </Button>
            </div>
          ) : (
            <Button
              theme="primary"
              onClick={() => setAuthDialogOpen(true)}
              style={{
                height: 44,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              icon={<UserIcon />}
            >
              登录 / 注册 · 保存你的成长记录
            </Button>
          )}
        </div>
      </div>

      {/* ========== 登录/注册弹窗 ========== */}
      <Dialog
        visible={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        header={
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 700 }}>
            🐧 登录e职伴
          </div>
        }
        footer={null}
        width={520}
        destroyOnClose
      >
        <AuthPage
          embedded
          onLogin={(loggedInUser) => {
            setAuthDialogOpen(false);
          }}
        />
      </Dialog>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24, maxWidth: result ? 1100 : 640, margin: '0 auto' }}>
        {/* Form */}
        <Card bordered style={{ borderRadius: 'var(--radius-lg)' }}>
          <div style={{ padding: 8 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📝 基本信息</h3>
            <Form form={form} layout="vertical" onSubmit={handleSubmit} labelAlign="top">
              <FormItem label="年级" name="grade" rules={[{ required: true, message: '请选择年级' }]}>
                <Select options={gradeOptions} placeholder="选择你的年级" />
              </FormItem>
              <FormItem label="学历经历" name="educationHistory">
                <Select options={educationHistoryOptions} placeholder="选择你当前所处的学历阶段（选填）" />
              </FormItem>
              <FormItem label="专业" name="major" rules={[{ required: true, message: '请选择专业' }]}>
                <Select options={majorOptions} placeholder="选择你的专业" />
              </FormItem>
              <FormItem label="目标岗位方向" name="direction" rules={[{ required: true, message: '请选择目标方向' }]}>
                <Select options={directionOptions} placeholder="选择感兴趣的方向（不确定也可以）" />
              </FormItem>
              <FormItem label="当前最大困惑" name="confusion">
                <Textarea placeholder="例如：不知道学什么技能、担心找不到实习..." maxlength={200} autosize={{ minRows: 2, maxRows: 4 }} />
              </FormItem>
              <FormItem label="是否有项目/实习经历？" name="hasExperience">
                <Radio.Group>
                  <Radio value="yes">有</Radio>
                  <Radio value="no">暂无</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="你的MBTI人格类型？" name="mbti">
                <Select options={mbtiOptions} placeholder="选择你的MBTI类型（选填）" />
              </FormItem>
              <FormItem label="你的星座？" name="zodiac">
                <Select options={zodiacOptions} placeholder="选择你的星座（选填）" />
              </FormItem>
              <FormItem label="你对AI工具的熟练程度？" name="aiProficiency">
                <Radio.Group>
                  {aiProficiencyOptions.map(opt => (
                    <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>
                  ))}
                </Radio.Group>
              </FormItem>
              <FormItem label="你最近的求职/成长状态是？" name="emotionStatus">
                <Radio.Group>
                  {emotionStatusOptions.map(opt => (
                    <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>
                  ))}
                </Radio.Group>
              </FormItem>
              <Button theme="primary" block onClick={() => form.submit()} style={{ height: 44, fontSize: 15, fontWeight: 600, marginTop: 8 }}>
                ✨ 生成我的成长画像
              </Button>
            </Form>
          </div>
        </Card>

        {/* Result */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.5s ease-out' }}>
            <Card bordered style={{
              borderRadius: 'var(--radius-lg)',
              background: '#e3edff',
              border: '1px solid #c7d2fe',
            }}>
              <div style={{ textAlign: 'center', padding: 8 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{result.stage}</h2>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.stageDesc}</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                  <Tag theme="primary" variant="light">{result.gradeLabel}</Tag>
                  <Tag theme="warning" variant="light">{result.majorLabel}</Tag>
                  <Tag theme="success" variant="light">{result.directionLabel}</Tag>
                </div>
              </div>
            </Card>

            {/* MBTI人格 + 星座卡片 */}
            {(result.mbtiProfile || result.zodiac !== 'unknown') && (
              <Card bordered style={{
                borderRadius: 'var(--radius-lg)',
                background: '#fdf4ff',
                border: '1px solid #e9d5ff',
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#a21caf', marginBottom: 12 }}>🔮 性格画像</h3>
                {result.mbtiProfile && (
                  <div style={{
                    marginBottom: result.zodiac !== 'unknown' ? 12 : 0,
                    padding: '12px 14px',
                    background: '#fff',
                    borderRadius: 10,
                    border: '1px solid #f0abfc',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: result.mbtiProfile.color + '15',
                        color: result.mbtiProfile.color,
                        fontSize: 13,
                        fontWeight: 700,
                      }}>{result.mbti}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{result.mbtiProfile.trait}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {result.mbtiProfile.desc}
                    </p>
                  </div>
                )}
                {result.zodiac !== 'unknown' && (
                  <div style={{
                    padding: '12px 14px',
                    background: '#fff',
                    borderRadius: 10,
                    border: '1px solid #f0abfc',
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                      {result.zodiacLabel}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>
                      — 星座特质也会影响你的职场风格哦
                    </span>
                  </div>
                )}
              </Card>
            )}

            <Card bordered style={{ borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#10b981', marginBottom: 12 }}>✅ 优势分析</h3>
              {result.advantages.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>
                  <span>{a}</span>
                </div>
              ))}
            </Card>

            <Card bordered style={{ borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f59e0b', marginBottom: 12 }}>⚠️ 短板分析</h3>
              {result.weaknesses.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: '#f59e0b', flexShrink: 0 }}>!</span>
                  <span>{w}</span>
                </div>
              ))}
            </Card>

            {/* 情绪状态卡片 */}
            <Card bordered style={{
              borderRadius: 'var(--radius-lg)',
              background: '#ede9fe',
              border: '1px solid #c4b5fd',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#7c3aed', marginBottom: 8 }}>💙 当前情绪状态</h3>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#7c3aed',
                marginBottom: 6,
                padding: '6px 12px',
                background: '#f3e8ff',
                borderRadius: 8,
                display: 'inline-block',
              }}>
                {result.emotionStatus.label}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 8 }}>
                {result.emotionStatus.desc}
              </p>
              <div style={{
                marginTop: 10,
                padding: '10px 14px',
                background: '#fff',
                borderRadius: 10,
                border: '1px solid #e9d5ff',
              }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', marginBottom: 4 }}>🌿 压力缓解建议</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {result.emotionStatus.reliefAdvice}
                </p>
              </div>
            </Card>

            {/* 今日最小行动任务 */}
            <Card bordered style={{
              borderRadius: 'var(--radius-lg)',
              background: '#d1fae5',
              border: '1px solid #a7f3d0',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#059669', marginBottom: 8 }}>🌱 今日最小行动任务</h3>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, padding: '10px 14px', background: '#fff', borderRadius: 10 }}>
                {result.todayTask}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                💡 只做这一件事就好。完成它，今天就已经很棒了。
              </p>
            </Card>

            <Card bordered style={{ borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 12 }}>💡 成长建议</h3>
              {result.suggestions.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10, fontSize: 14, padding: '8px 12px', background: 'var(--bg)', borderRadius: 8 }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span>{s}</span>
                </div>
              ))}
            </Card>

            {/* 跳转选择 */}
            <Card bordered style={{
              borderRadius: 'var(--radius-lg)',
              background: '#fef3c7',
              border: '1px solid #fcd34d',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#d97706', marginBottom: 8, textAlign: 'center' }}>
                🚀 根据画像，推荐你优先体验
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                {/* 职业探索地图 — 始终显示，诊断后可进一步探索 */}
                <Button
                  block
                  variant="outline"
                  onClick={() => navigate('/career-map')}
                  style={{
                    height: 48, fontSize: 15, fontWeight: 600,
                    borderColor: '#7c3aed', color: '#7c3aed',
                    justifyContent: 'flex-start', paddingLeft: 20,
                    background: result.directionLabel === '待探索' ? '#f3e8ff' : 'transparent',
                  }}
                  icon={<span style={{ fontSize: 20, marginRight: 4 }}>🗺️</span>}
                >
                  {result.directionLabel === '待探索'
                    ? '职业探索地图 — 了解不同岗位，找到你的方向 ⭐推荐'
                    : '职业探索地图 — 深入了解岗位细节，规划职业路径'}
                  <ChevronRightIcon style={{ marginLeft: 'auto' }} />
                </Button>
                {!result.hasExperience && (
                  <Button
                    block
                    variant="outline"
                    onClick={() => navigate('/project-workshop')}
                    style={{
                      height: 48, fontSize: 15, fontWeight: 600,
                      borderColor: '#ef4444', color: '#ef4444',
                      justifyContent: 'flex-start', paddingLeft: 20,
                    }}
                    icon={<span style={{ fontSize: 20, marginRight: 4 }}>🔧</span>}
                  >
                    项目实践工坊 — 快速产出简历作品，弥补经验空白 <ChevronRightIcon style={{ marginLeft: 'auto' }} />
                  </Button>
                )}
                <Button
                  block
                  variant="outline"
                  onClick={() => navigate('/skill-center')}
                  style={{
                    height: 48, fontSize: 15, fontWeight: 600,
                    borderColor: '#f59e0b', color: '#f59e0b',
                    justifyContent: 'flex-start', paddingLeft: 20,
                  }}
                  icon={<span style={{ fontSize: 20, marginRight: 4 }}>📚</span>}
                >
                  技能成长中心 — 每日任务卡驱动，系统化提升 <ChevronRightIcon style={{ marginLeft: 'auto' }} />
                </Button>
                {!result.isAIExpert && (
                  <Button
                    block
                    variant="outline"
                    onClick={() => navigate('/ai-skill')}
                    style={{
                      height: 48, fontSize: 15, fontWeight: 600,
                      borderColor: '#10b981', color: '#10b981',
                      justifyContent: 'flex-start', paddingLeft: 20,
                    }}
                    icon={<span style={{ fontSize: 20, marginRight: 4 }}>🤖</span>}
                  >
                    {result.aiProficiency === 'none' || result.aiProficiency === 'touched'
                      ? 'AI能力定制 — 专业差异化AI训练，补齐AI短板 ⭐推荐'
                      : 'AI能力定制 — 进一步提升AI技能，探索更多可能'}
                    <ChevronRightIcon style={{ marginLeft: 'auto' }} />
                  </Button>
                )}
                <Button
                  block
                  variant="outline"
                  onClick={() => navigate('/emotion-comfort')}
                  style={{
                    height: 48, fontSize: 15, fontWeight: 600,
                    borderColor: '#7c3aed', color: '#7c3aed',
                    justifyContent: 'flex-start', paddingLeft: 20,
                  }}
                  icon={<span style={{ fontSize: 20, marginRight: 4 }}>💙</span>}
                >
                  情绪陪伴室 — 压力缓解、情绪倾诉、获得行动建议 <ChevronRightIcon style={{ marginLeft: 'auto' }} />
                </Button>
                <Button
                  block
                  variant="outline"
                  onClick={() => navigate('/ai-chat')}
                  style={{
                    height: 48, fontSize: 15, fontWeight: 600,
                    borderColor: '#0066ff', color: '#0066ff',
                    justifyContent: 'flex-start', paddingLeft: 20,
                  }}
                  icon={<span style={{ fontSize: 20, marginRight: 4 }}>💬</span>}
                >
                  AI陪伴聊天 — 和e职伴聊聊困惑，获取求职情绪支持 <ChevronRightIcon style={{ marginLeft: 'auto' }} />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
