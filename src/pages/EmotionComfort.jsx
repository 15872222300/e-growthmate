import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Tag, Progress, Dialog, Textarea, MessagePlugin } from 'tdesign-react';
import { ChevronRightCircleIcon as SendIcon } from 'tdesign-icons-react';
import { chatPresets } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

// ============ 情绪状态选项 ============
const EMOTION_STATES = [
  { id: 'anxious', label: '😰 有点焦虑', color: '#f59e0b', bg: '#fef3c7', desc: '心里有点不踏实，担心未来' },
  { id: 'lost', label: '😵 很迷茫', color: '#6366f1', bg: '#e0e7ff', desc: '不知道方向在哪，看不清前路' },
  { id: 'fear_interview', label: '😨 害怕面试', color: '#ef4444', bg: '#fee2e2', desc: '一想到面试就紧张不安' },
  { id: 'rejected', label: '😞 投递失败后很沮丧', color: '#ec4899', bg: '#fce7f3', desc: '被拒绝了好几次，信心受挫' },
  { id: 'compare', label: '😣 被同学进度影响', color: '#8b5cf6', bg: '#ede9fe', desc: '看到别人拿offer，自己很焦虑' },
  { id: 'unsure', label: '🤔 不知道适合什么', color: '#06b6d4', bg: '#cffafe', desc: '对自己缺乏了解，选什么都犹豫' },
  { id: 'inadequate', label: '😔 感觉自己能力不够', color: '#f97316', bg: '#fff7ed', desc: '总觉得自己不够好，配不上好机会' },
  { id: 'multi_pressure', label: '💥 多重压力叠加', color: '#dc2626', bg: '#fee2e2', desc: '毕业/论文/求职一起压过来' },
  { id: 'talk', label: '💙 想找人聊聊', color: '#0066ff', bg: '#e8f0fe', desc: '就是想有人说说话，被倾听' },
];

// ============ 情绪问卷题库（每个状态 ≤10 题） ============
const EMOTION_QUESTIONNAIRES = {
  anxious: {
    title: '焦虑来源定位问卷',
    desc: '帮你更精确地找到焦虑的根源',
    questions: [
      { id: 'q1', text: '你的焦虑主要出现在什么时候？', type: 'single', options: ['投递简历前', '等待面试通知时', '面试当天', '看到别人有进展时', '深夜独处时', '整天都焦虑'] },
      { id: 'q2', text: '焦虑时身体会有哪些反应？', type: 'multi', options: ['心跳加速', '失眠/早醒', '食欲不振', '注意力不集中', '坐立不安', '没有明显身体反应'] },
      { id: 'q3', text: '你最担心的事情是什么？', type: 'single', options: ['找不到好工作', '面试表现不好', '简历不够出色', '比不上同龄人', '让家人失望', '浪费了大学时间'] },
      { id: 'q4', text: '当你焦虑时，你通常会做什么？', type: 'single', options: ['刷更多招聘信息', '反复修改简历', '找人倾诉', '逃避/刷手机', '默默承受', '运动/散步放松'] },
      { id: 'q5', text: '焦虑对你的日常生活影响有多大？', type: 'single', options: ['几乎不影响，还能正常做事', '有点影响，效率降低了', '影响较大，经常分心', '严重影响，很多事情做不了'] },
      { id: 'q6', text: '你是否已经投递了足够多的简历？', type: 'single', options: ['还没开始投递', '投了不到10家', '投了10-30家', '投了30家以上'] },
      { id: 'q7', text: '你有明确的求职方向吗？', type: 'single', options: ['很明确，知道想去哪', '大概有方向，但不具体', '有几个方向在纠结', '完全没有方向'] },
      { id: 'q8', text: '你的焦虑是否影响到了睡眠？', type: 'single', options: ['睡眠正常', '偶尔睡不着', '经常失眠', '每晚都难以入睡'] },
    ],
  },
  lost: {
    title: '迷茫程度评估问卷',
    desc: '了解你的迷茫来自哪里',
    questions: [
      { id: 'q1', text: '你对未来有清晰的职业规划吗？', type: 'single', options: ['有明确规划', '有大致想法', '只有模糊概念', '完全没有'] },
      { id: 'q2', text: '你迷茫的主要原因是？', type: 'multi', options: ['专业方向不喜欢', '不知道行业前景', '不了解自己的优势', '选项太多无法抉择', '怕选错后悔', '没有信息来源'] },
      { id: 'q3', text: '你对自己所学的专业兴趣如何？', type: 'single', options: ['非常喜欢', '还算喜欢', '不太喜欢但能接受', '完全不喜欢'] },
      { id: 'q4', text: '你尝试过探索不同方向吗？', type: 'single', options: ['尝试过很多', '尝试过一两个', '想过但没行动', '没有尝试过'] },
      { id: 'q5', text: '你更看重工作的哪个方面？', type: 'multi', options: ['薪资待遇', '发展空间', '工作内容有趣', '工作生活平衡', '公司氛围', '地理位置'] },
      { id: 'q6', text: '家人或朋友对你求职方向有影响吗？', type: 'single', options: ['家人有明确期望，压力大', '朋友的选择让我比较', '没有外界压力，纯自己迷茫', '不确定自己想要什么'] },
      { id: 'q7', text: '你愿意花时间探索不同职业吗？', type: 'single', options: ['愿意，正在探索', '愿意但不知从何开始', '不太愿意，想快速确定', '无所谓'] },
      { id: 'q8', text: '你觉得当前最缺乏的是什么？', type: 'single', options: ['职业信息', '自我认知', '行动勇气', '试错机会', '有人指导'] },
    ],
  },
  fear_interview: {
    title: '面试恐惧来源分析',
    desc: '找到面试紧张的真正原因',
    questions: [
      { id: 'q1', text: '你最害怕面试的哪个环节？', type: 'single', options: ['自我介绍', '技术问题', '行为面试题', '群面/无领导小组', '反问环节', '所有环节都怕'] },
      { id: 'q2', text: '你参加过的面试次数？', type: 'single', options: ['0次，还没面过', '1-3次', '4-10次', '10次以上'] },
      { id: 'q3', text: '面试前你会做什么准备？', type: 'multi', options: ['刷面试题', '研究公司背景', '准备自我介绍', '模拟面试', '几乎不准备', '过度准备反而更紧张'] },
      { id: 'q4', text: '面试时最担心发生什么？', type: 'single', options: ['答不上来问题', '被面试官否定', '表现紧张被看低', '专业知识不够', '临时忘词', '不知道问什么'] },
      { id: 'q5', text: '你对自己专业能力的自信程度？', type: 'single', options: ['很自信', '比较自信', '一般般', '很不自信'] },
      { id: 'q6', text: '你的表达能力如何？', type: 'single', options: ['很擅长表达', '还不错', '一般', '不太好，容易紧张'] },
      { id: 'q7', text: '你是否有过不好的面试经历？', type: 'single', options: ['没有面试过', '有，被严重打击过', '有，但还好', '没有不好的经历'] },
    ],
  },
  rejected: {
    title: '投递失败情绪评估',
    desc: '一起分析投递失败的可能原因',
    questions: [
      { id: 'q1', text: '你被拒了多少次？', type: 'single', options: ['1-2次', '3-5次', '5-10次', '10次以上'] },
      { id: 'q2', text: '被拒后你的第一反应是？', type: 'single', options: ['怀疑自己能力', '觉得是运气不好', '反思简历问题', '想放弃不找了', '更加努力投递'] },
      { id: 'q3', text: '你觉得被拒的主要原因是什么？', type: 'multi', options: ['简历不够好', '岗位不匹配', '竞争太激烈', '面试表现不好', '缺乏实习经历', '学历/学校原因'] },
      { id: 'q4', text: '你是否收到过面试邀请？', type: 'single', options: ['收到很多', '收到几个', '收到过一两个', '一个都没收到'] },
      { id: 'q5', text: '你的简历是否经过他人修改或建议？', type: 'single', options: ['请人改过很多次', '改过一两次', '自己改过', '基本没改过'] },
      { id: 'q6', text: '投递失败后你会做什么？', type: 'single', options: ['复盘并调整策略', '继续海投', '降低期望岗位', '暂停投递休息', '找朋友/老师求助'] },
      { id: 'q7', text: '你对自己的简历满意吗？', type: 'single', options: ['很满意', '还行', '不太满意', '很不满意'] },
      { id: 'q8', text: '被拒后你的信心变化？', type: 'single', options: ['信心没变，继续努力', '有点受挫但还行', '信心大幅下降', '已经不想找了'] },
    ],
  },
  compare: {
    title: '同辈压力来源分析',
    desc: '了解比较心理对你的影响',
    questions: [
      { id: 'q1', text: '你主要和谁比较？', type: 'multi', options: ['同班同学', '室友', '朋友圈的人', '学长学姐', '社交平台上的同龄人', '家人亲戚中的同龄人'] },
      { id: 'q2', text: '你在哪些方面感到被比下去了？', type: 'multi', options: ['offer数量/质量', '薪资待遇', '面试进度', '实习经历', '技术能力', '综合素质'] },
      { id: 'q3', text: '你每天花多少时间看别人的求职动态？', type: 'single', options: ['几乎不看', '偶尔看看（<30分钟）', '经常看（30分钟-2小时）', '一直在刷（>2小时）'] },
      { id: 'q4', text: '看到别人拿offer你的感受？', type: 'single', options: ['真心为他高兴', '高兴但也有压力', '很焦虑', '觉得自己很差劲'] },
      { id: 'q5', text: '你觉得自己的求职进度和别人比？', type: 'single', options: ['比别人快', '差不多', '稍微落后', '远远落后'] },
      { id: 'q6', text: '你是否会主动回避看别人的求职分享？', type: 'single', options: ['不会，坦然面对', '有时候会', '经常避开', '已经屏蔽了相关群'] },
      { id: 'q7', text: '你对自己的评价是否容易受他人影响？', type: 'single', options: ['完全不受影响', '偶尔受影响', '经常受影响', '完全被影响'] },
    ],
  },
  unsure: {
    title: '自我认知探索问卷',
    desc: '帮你发现自己真正适合的方向',
    questions: [
      { id: 'q1', text: '你做过职业兴趣测评吗？', type: 'single', options: ['做过，结果有帮助', '做过，但没参考', '没做过', '不知道有这种测评'] },
      { id: 'q2', text: '你喜欢的课程/科目类型？', type: 'multi', options: ['编程/技术类', '数据分析/数学类', '设计/创意类', '沟通/管理类', '写作/内容类', '没有特别喜欢的'] },
      { id: 'q3', text: '你觉得自己擅长什么？', type: 'multi', options: ['逻辑思维', '沟通表达', '创意设计', '数据分析', '组织协调', '不太清楚自己擅长什么'] },
      { id: 'q4', text: '你更倾向于哪种工作方式？', type: 'single', options: ['独立完成工作', '团队协作', '领导和统筹', '跟随指导完成', '都可以'] },
      { id: 'q5', text: '你对加班/高强度工作的态度？', type: 'single', options: ['可以接受，成长更重要', '可以接受但有限度', '不太能接受', '完全不能接受'] },
      { id: 'q6', text: '你理想中的工作节奏是？', type: 'single', options: ['快节奏，挑战性强', '稳定节奏，稳步成长', '慢节奏，生活为重', '不确定'] },
      { id: 'q7', text: '你是否了解不同岗位的工作内容？', type: 'single', options: ['很了解', '了解一些', '不太了解', '完全不了解'] },
      { id: 'q8', text: '如果让你选一个方向先尝试，你会？', type: 'single', options: ['选最赚钱的', '选自己最感兴趣的', '选门槛最低的', '选别人推荐最多的', '完全不知道选什么'] },
    ],
  },
  inadequate: {
    title: '自我能力认知评估',
    desc: '客观评估你的真实能力水平',
    questions: [
      { id: 'q1', text: '你觉得自己的能力和同龄人比？', type: 'single', options: ['优于大多数人', '中等偏上', '中等', '中等偏下', '远不如人'] },
      { id: 'q2', text: '你有哪些已经掌握的技能？', type: 'multi', options: ['编程语言', '数据分析工具', '设计软件', '办公软件', '外语能力', '项目管理', '似乎没什么拿得出手的'] },
      { id: 'q3', text: '你是否有过实习或项目经历？', type: 'single', options: ['有2段以上', '有1-2段', '只有课程项目', '完全没有'] },
      { id: 'q4', text: '你是否经常否定自己？', type: 'single', options: ['从不', '偶尔', '经常', '几乎每次都会'] },
      { id: 'q5', text: '你觉得自己不够好的原因？', type: 'multi', options: ['和JD要求差距大', '没有实习经历', '技术能力不足', '表达能力差', '学历背景不好', '性格内向'] },
      { id: 'q6', text: '你有没有被他人肯定过能力？', type: 'single', options: ['经常被肯定', '偶尔被肯定', '很少被肯定', '从没被肯定过'] },
      { id: 'q7', text: '你是否愿意从基础岗位做起？', type: 'single', options: ['愿意，慢慢积累', '看情况', '不太愿意', '完全不愿意'] },
      { id: 'q8', text: '你觉得自己最大的优势是什么？', type: 'single', options: ['学习能力强', '踏实肯干', '有创意', '沟通能力好', '逻辑思维好', '说不出来'] },
    ],
  },
  multi_pressure: {
    title: '多重压力来源分解',
    desc: '帮你梳理当前面临的各种压力',
    questions: [
      { id: 'q1', text: '你目前同时面临哪些压力？', type: 'multi', options: ['毕业论文/设计', '课程考试', '求职投递', '实习工作', '家庭期望', '经济压力', '人际关系'] },
      { id: 'q2', text: '哪一项压力最让你喘不过气？', type: 'single', options: ['毕业论文', '求职', '课业负担', '家庭压力', '经济问题', '感情/人际关系'] },
      { id: 'q3', text: '你每天的有效工作时间有多少？', type: 'single', options: ['8小时以上', '5-8小时', '3-5小时', '不到3小时'] },
      { id: 'q4', text: '你是否有时间管理方面的困难？', type: 'single', options: ['有很好的时间管理', '基本能管理', '经常感觉时间不够', '完全无法管理'] },
      { id: 'q5', text: '你是否经常感到身心疲惫？', type: 'single', options: ['很少疲惫', '偶尔疲惫', '经常疲惫', '几乎每天都筋疲力尽'] },
      { id: 'q6', text: '你是否有人可以分担或倾诉？', type: 'single', options: ['有很好的支持系统', '有一两个可以倾诉的人', '偶尔有人说说话', '完全一个人扛'] },
      { id: 'q7', text: '你最希望先解决哪个问题？', type: 'single', options: ['完成毕业论文', '找到工作', '减轻课业负担', '缓解经济压力', '改善心理状态'] },
      { id: 'q8', text: '你最近一周的睡眠质量如何？', type: 'single', options: ['很好', '还行', '不太好', '很差'] },
      { id: 'q9', text: '你觉得自己还能撑多久？', type: 'single', options: ['能撑很久', '还能撑一段时间', '快撑不住了', '已经撑不住了'] },
    ],
  },
  talk: {
    title: '倾诉需求了解',
    desc: '让我更好地倾听你的故事',
    questions: [
      { id: 'q1', text: '你今天最想聊什么？', type: 'single', options: ['求职压力', '学业烦恼', '人际关系', '家庭问题', '感情问题', '就是想说说话'] },
      { id: 'q2', text: '你最近一次和人深入聊天是什么时候？', type: 'single', options: ['今天', '几天前', '一周前', '很久了，不记得了'] },
      { id: 'q3', text: '你现在身边有可以聊天的人吗？', type: 'single', options: ['有，关系很好', '有几个朋友但不好意思打扰', '身边没有人可以聊', '不想和认识的人聊'] },
      { id: 'q4', text: '你平时会跟谁分享心事？', type: 'multi', options: ['好朋友', '家人', '恋人', '同学', '老师/辅导员', '不跟任何人说'] },
      { id: 'q5', text: '你现在感到孤独吗？', type: 'single', options: ['不孤独', '偶尔孤独', '经常孤独', '非常孤独'] },
      { id: 'q6', text: '你希望从聊天中获得什么？', type: 'multi', options: ['被倾听和理解', '实用的建议', '情绪上的安慰', '找到方向', '只是有人陪着'] },
      { id: 'q7', text: '你最近有没有特别开心或特别难过的事？', type: 'single', options: ['有开心的事想分享', '有难过的事想倾诉', '都有', '好像什么都没有'] },
    ],
  },
};

// 问卷结果分析——根据答案给出个性化建议
function analyzeQuestionnaireResults(emotionId, answers) {
  const allKeywords = Object.values(answers).flatMap(v => Array.isArray(v) ? v : [v]).join('');

  const analyzers = {
    anxious: () => {
      if (allKeywords.includes('深夜')) return '你的焦虑在深夜最明显——白天的忙碌让你没空想，晚上静下来所有不安就涌上来了。建议睡前1小时放下手机，写下"今天完成了什么"。';
      if (allKeywords.includes('失眠') || allKeywords.includes('睡不着')) return '失眠是焦虑的放大器。如果连续多天睡不好，建议去学校心理咨询中心聊聊，这不是小事。';
      if (allKeywords.includes('没有方向') || allKeywords.includes('完全不')) return '焦虑往往源于不确定性。建议先去"成长诊断"锁定2-3个方向，焦虑会大幅降低。';
      if (allKeywords.includes('还没开始')) return '你的焦虑可能来自"还没开始行动"的内疚感。今天只投一家公司，启动比完美重要。';
      return '你的焦虑是求职路上正常的情绪反应。建议把目标分解成小步骤，每完成一步就给自己正反馈。';
    },
    lost: () => {
      if (allKeywords.includes('不喜欢')) return '专业不喜欢不代表没有出路。很多岗位不限制专业背景，关键是找到你愿意投入的方向。';
      if (allKeywords.includes('不了解') || allKeywords.includes('不太清楚')) return '迷茫的核心往往是自我认知不足。建议从"成长诊断"开始，花5分钟了解自己的优势短板。';
      if (allKeywords.includes('没有行动') || allKeywords.includes('不知从何')) return '选项多不是坏事。选一个最不排斥的方向，先走一个月试试，不合适再换。';
      return '迷茫是成长的必经之路。你愿意面对这个不确定性，本身就很勇敢。去"职业探索"随便看看，可能会有惊喜。';
    },
    fear_interview: () => {
      if (allKeywords.includes('0次') || allKeywords.includes('没面过')) return '第一次面试的恐惧最大，但也是最容易克服的——面过一次你就会发现"不过如此"。建议先找小公司练手。';
      if (allKeywords.includes('技术') || allKeywords.includes('专业知识')) return '技术面试的恐惧来源于"怕暴露无知"。准备3个最熟悉的项目，面试时主动引导到你擅长的领域。';
      if (allKeywords.includes('表达') || allKeywords.includes('紧张')) return '表达能力可以练习。每天对着手机录1分钟自我介绍，听回放改进。一周后会有明显变化。';
      return '面试恐惧人人都有。把心态从"被挑选"调整到"互相了解"，压力会小很多。';
    },
    rejected: () => {
      if (allKeywords.includes('一个都没收到')) return '如果简历关都过不了，优先优化简历。用STAR法则重写项目经历，让每段经历都量化成果。';
      if (allKeywords.includes('信心大幅') || allKeywords.includes('已经不想')) return '连续被拒对信心的打击是真实的。允许自己难过，但不要让"被拒"定义你是谁。每一次被拒都是一次排雷。';
      if (allKeywords.includes('简历') && allKeywords.includes('没改过')) return '你的简历可能是短板。找有经验的人帮你看看，有时候一个表达的改动就能提升通过率。';
      return '投递是数字游戏。复盘每一次失败，调整一个点再继续。量变会带来质变。';
    },
    compare: () => {
      if (allKeywords.includes('社交平台') || allKeywords.includes('朋友圈') || allKeywords.includes('一直在刷')) return '你看到的都是别人精心剪辑的"高光时刻"。建议减少刷社交媒体，你的节奏不需要和别人一样。';
      if (allKeywords.includes('远远落后') || allKeywords.includes('很差劲')) return '比较最大的伤害是让你忽略了自己的进步。写下你这周做成的事，不管多小——你在你自己的赛道上。';
      return '比较是人的本能，但请拿今天的自己和昨天的自己比。每个人的花期不同。';
    },
    unsure: () => {
      if (allKeywords.includes('没做过') || allKeywords.includes('没尝试')) return '适合不是想出来的，是试出来的。去"项目工坊"做一个小项目，行动会给你答案。';
      if (allKeywords.includes('完全不知道')) return '不知道选什么的时候，先排除最不想做的。排除法也能帮你缩小范围。';
      return '自我认知需要时间和尝试。别着急，先去"成长诊断"做一次评估。';
    },
    inadequate: () => {
      if (allKeywords.includes('没有实习') || allKeywords.includes('完全没有')) return '没有实习不等于没有能力。课程项目、社团活动、自学的小项目都可以写在简历上。包装已有的经历更重要。';
      if (allKeywords.includes('经常') && allKeywords.includes('否定')) return '你很可能陷入了"冒名顶替综合征"。列出你已经掌握的技能，你会惊讶于自己拥有的远比想象的多。';
      if (allKeywords.includes('说不出来') || allKeywords.includes('没什么拿得出手')) return '试着从另一个角度想：你坚持到了大学求职这一步，本身就是一种能力。先从小事开始积累正反馈。';
      return '自我怀疑是最消耗能量的情绪。从基础岗位做起，每一步都在积累。';
    },
    multi_pressure: () => {
      if (allKeywords.includes('完全无法') || allKeywords.includes('不到3小时')) return '多重压力的核心解法是"不要同时解决所有问题"。把所有事情写下来，只圈本周必须完成的一件。';
      if (allKeywords.includes('完全一个人') || allKeywords.includes('没有人')) return '一个人扛着太累了。务必找到一个人——朋友、老师、辅导员——说出来本身就是解压。';
      if (allKeywords.includes('已经撑不住') || allKeywords.includes('快撑不住')) return '你现在的情况需要认真对待。请立即联系学校心理咨询中心或拨打心理援助热线，你不需要一个人面对。';
      return '先处理最紧迫的一件事，其他的允许自己放一放。专注解决一件，掌控感就会回来。';
    },
    talk: () => {
      if (allKeywords.includes('非常孤独') || allKeywords.includes('没有人可以聊')) return '谢谢你愿意和e职伴聊聊。孤独感被说出来的时候就已经减轻了一半。我在这里认真听你的故事。';
      if (allKeywords.includes('不跟任何人') || allKeywords.includes('不好意思打扰')) return '有时候和陌生人聊天反而更轻松。我就是一个很好的倾听者，想说多久都可以。';
      return '倾诉本身就是一种疗愈。不管是开心还是难过的事，我都在这里认真听。';
    },
  };

  const analyzer = analyzers[emotionId];
  return analyzer ? analyzer() : '根据你的回答，建议你针对当前状态，先从一件小事开始行动。每一步都很重要。';
}

// ============ 年级选项 ============
const GRADE_OPTIONS = ['大一', '大二', '大三', '大四', '研一', '研二', '研三'];

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

// ============ 情绪回应生成逻辑 ============
function generateEmotionResponse(emotionId, userInput) {
  const emotion = EMOTION_STATES.find(e => e.id === emotionId);
  const emotionLabel = emotion ? emotion.label : '当前感受';

  const holdEmotion = {
    anxious: '我听到了你心里的不安。焦虑不是你的敌人，它只是你的大脑在提醒你"这件事很重要"。很多人都会在求职路上感到焦虑，这恰恰说明你在认真对待自己的未来。',
    lost: '迷茫的感觉确实不好受——像走在雾里，不知道下一步踩到的是平地还是坑。但迷茫其实是一个信号：你正在从"被安排"转向"自己选择"，这是成长的必经之路。',
    fear_interview: '面试前的紧张，几乎是每个人的本能反应。你害怕的不是面试本身，而是"被评价"的感觉。这太正常了，因为我们都不喜欢被审视。',
    rejected: '被拒绝的感觉真的很痛。每一次投递都是一次"把自己交出去"，然后被退回。这种反复的失落，任何人都会沮丧。先允许自己难过一会儿，这不丢人。',
    compare: '比较是人类的本能，但社交媒体把这种本能放大到了不健康的程度。你看到的别人的进度，只是冰山浮出水面的那一角——水面下的挣扎，没有人会发朋友圈。',
    unsure: '"不知道适合什么"其实是大多数人的常态。那些看起来很确定的人，要么是真的很幸运很早就找到了，要么是还没认真想过这个问题。你愿意面对这个不确定性，已经很勇敢了。',
    inadequate: '自我怀疑是最消耗能量的情绪。但我想告诉你一个事实：越是优秀的人，越容易觉得自己不够好——这在心理学上叫"冒名顶替综合征"。你的"不够好"很可能只是你对自己要求太高。',
    multi_pressure: '多重压力同时压过来，就像被好几座山同时压着——论文、毕业、求职，每一件都是大事。你现在还能撑着，本身就已经非常非常了不起了。',
    talk: '谢谢你愿意来找我聊聊。很多时候，情绪最难受的不是问题本身，而是一个人扛着所有。说出来本身，就是一种疗愈。我在这里认真听。',
  }[emotionId] || '我感受到了你的情绪。不管是什么感受，它都是真实的、值得被认真对待的。';

  const breakdown = {
    anxious: {
      analysis: '焦虑往往是多个不确定性的叠加。我们可以试着把你的焦虑拆开：是担心简历不够好？还是不确定投递方向？还是害怕面试？当我们把一团模糊的焦虑拆成具体问题，它就变小了。',
      action: '今天只做一件事：打开一个求职App，只收藏3个你觉得"如果拿到了会开心"的岗位。不用投递，只是看看。给自己一个"我还可以选择"的感觉。',
    },
    lost: {
      analysis: '迷茫通常有两种：一种是"选项太少"，一种是"选项太多不知道选哪个"。大学生更多的是后者——面前有太多可能，反而不知道该往哪走。这不是能力问题，是信息过载。',
      action: '今天只做一件事：去"职业探索地图"随便看3个岗位的介绍。不需要做决定，只是看看。你可能会发现某个方向让你眼睛一亮。',
    },
    fear_interview: {
      analysis: '面试焦虑的核心是"害怕被否定"。但面试本质上不是考试，是双向选择——你也在看这家公司适不适合你。把心态从"被挑选"调整到"互相了解"，压力会小很多。',
      action: '今天只做一件事：去"求职准备中心"选一道面试题，对着手机录一段1分钟的回答。不用完美，录完自己听一遍就好。熟悉自己的声音，就是克服恐惧的第一步。',
    },
    rejected: {
      analysis: '投递失败不等于你不行。可能是岗位匹配度不够、简历表达不够精准、投递节奏不对、甚至只是运气不好。我们需要把"我不行"这个笼统的结论，拆成可以改进的具体问题。',
      action: '今天只做一件事：把你最近投递的一个岗位JD和你的一段项目经历发给我（或者写下来），我们看看是不是表达上可以更贴合。只改一处就好。',
    },
    compare: {
      analysis: '比较压力最可怕的地方是——你拿自己的"全部"和别人的"高光时刻"在比。你不知道那个拿了offer的同学可能也经历了十几轮失败，不知道那个绩点很高的人可能也在焦虑其他事。',
      action: '今天只做一件事：写下你自己最近做成的3件小事（不管多小——坚持早起、完成一次作业、帮了朋友一个忙）。把注意力从"别人有什么"拉回到"我做了什么"。',
    },
    unsure: {
      analysis: '不知道自己适合什么，往往是因为"试得太少"。适合不是想出来的，是试出来的。就像你不会知道一道菜好不好吃，除非你尝一口。',
      action: '今天只做一件事：去"成长诊断"页面花3分钟填一下基本信息。不需要想得很清楚，凭第一感觉选就好。AI会帮你生成一个初步方向。',
    },
    inadequate: {
      analysis: '"能力不够"这个判断，很多时候是我们把"现在的自己"和"理想中的自己"在比较。但你忽略了一个事实：你已经在路上了。大一的时候你也觉得自己什么都不会，但现在回头看，你其实已经走了很远。',
      action: '今天只做一件事：列出你已经掌握的3个技能（哪怕是"会用Excel做表格""写过课程论文""会做PPT"）。你会发现你拥有的比你想象的多。',
    },
    multi_pressure: {
      analysis: '多重压力叠加时，最危险的不是压力本身，而是你试图同时解决所有问题。人的大脑不是多核处理器，同时处理多个重大任务只会让每个都做不好，然后更焦虑——这是一个恶性循环。',
      action: '今天只做一件事：把所有压力写在一张纸上，然后只圈出"本周必须完成的一件事"。其他事情，允许自己先放一放。专注解决一件，你的掌控感就会回来。',
    },
    talk: {
      analysis: '有时候我们需要的不是解决方案，而是一个能理解的人在身边。孤独感会放大所有负面情绪，而连接感——哪怕只是和一个AI聊聊天——都能让心里的石头轻一点。',
      action: '今天只做一件事：如果你愿意，给一个信任的人发一条消息，不用说什么大事，就说"最近在忙求职，有空聊聊天吗"。或者继续和我聊，我一直都在。',
    },
  }[emotionId] || {
    analysis: '每一个情绪背后都有一个没有被满足的需求。焦虑可能是对"确定性"的需求，迷茫可能是对"方向感"的需求，沮丧可能是对"被认可"的需求。',
    action: '今天只做一件事：深呼吸10次，然后写下"我现在最需要的是什么"。不需要答案，只需要把这个问题摆在面前。',
  };

  const closing = '\n\n🐧 **e职伴想对你说**：\n你不是一个人在面对这些。求职路上的每一个情绪都是正常的、值得被理解的。今天不用解决所有问题，只往前走一小步就好。我在这里陪你。';

  return `**${emotionLabel}** — 我听到了 💙\n\n${holdEmotion}\n\n🔍 **我们一起看看**：\n${breakdown.analysis}\n\n🌱 **今天的微小行动**：\n${breakdown.action}${closing}`;
}

// ============ 通用AI回复（来自AiChat的预设匹配逻辑） ============
function findPresetReply(userMsg) {
  const lowerMsg = userMsg.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const preset of chatPresets) {
    let score = 0;
    const lowerPreset = preset.user.toLowerCase();

    if (preset.grade && preset.grade !== '通用' && lowerMsg.includes(preset.grade.toLowerCase())) {
      score += 5;
    }

    const presetWords = lowerPreset.replace(/[？?，,。.！!]/g, ' ').split(/\s+/).filter(w => w.length >= 2);
    for (const word of presetWords) {
      if (lowerMsg.includes(word)) {
        score += 1;
      }
    }

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

  // 情绪安抚通用回复
  const emotionWords = ['压力', '焦虑', '崩溃', '撑不住', '放弃', '不行', '不够好', '失败', '难过', '害怕', '担心', 'emo', '抑郁', '累'];
  const hasEmotion = emotionWords.some(w => lowerMsg.includes(w));

  if (hasEmotion) {
    return '同学，我能感受到你现在情绪很低落 💙\n\n先停下来，深呼吸。你不需要一直那么坚强。\n\n🌿 **e职伴想对你说**：\n• 感到压力不是你的错，求职和学业本身就很难兼顾\n• 你看到的别人的光鲜，只是他们愿意展示的一面\n• 今天如果太累了，就允许自己休息\n\n🐧 任何时候想聊聊，我都在这里。\n\n💡 也可以试试选择你的情绪状态，e职伴会给你更贴心的回应。';
  }

  const genericReplies = [
    '谢谢你的分享！🌟\n\n我理解你的困惑。大学阶段的迷茫其实很正常，关键在于行动起来。\n\n建议你先去"成长诊断"页面做个评估，了解自己的优势短板，然后根据建议一步步推进。\n\n需要我帮你具体分析一下吗？',
    '这是个很好的问题！🤔\n\n每个同学的成长路径都不一样，最重要的是找到适合自己的节奏。\n\n我建议你可以：\n1. 先去"职业探索地图"了解不同岗位\n2. 在"AI能力定制"页面生成你的专属路线\n3. 每天在"技能中心"完成一张任务卡\n\n一步一步来，不用焦虑！需要我详细说说哪一步吗？',
    '我理解你的感受 💙\n\n求职路上确实有很多不确定性，但你已经迈出了最重要的一步——主动思考未来。\n\ne职伴的建议是：不要一个人闷头想，去试试看。去"项目工坊"做一个小项目，去"求职准备中心"练一道面试题，行动会给你答案。\n\n你想先尝试哪个方向？',
  ];
  return genericReplies[Math.floor(Math.random() * genericReplies.length)];
}

// ============ 小工具数据 ============
const TOOLS = [
  {
    id: 'emotion_sort',
    title: '🧘 3分钟情绪整理',
    desc: '写下你的担忧、你能控制的事、你今天能做的事',
    icon: '🧘',
    color: '#10b981',
    bg: '#d1fae5',
  },
  {
    id: 'fail_review',
    title: '📋 投递失败复盘卡',
    desc: '复盘岗位匹配、简历表达、投递数量、面试准备',
    icon: '📋',
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    id: 'encourage',
    title: '💪 面试前鼓励卡',
    desc: '生成面试前的鼓励话语和注意事项',
    icon: '💪',
    color: '#7c3aed',
    bg: '#f3e8ff',
  },
  {
    id: 'low_pressure_task',
    title: '🌿 今日低压力任务',
    desc: '只生成一个简单可完成的小任务',
    icon: '🌿',
    color: '#06b6d4',
    bg: '#cffafe',
  },
];

// ============ 压力等级判断 ============
function getStressLevel(emotionId) {
  const lowStress = ['unsure', 'talk'];
  const midStress = ['anxious', 'lost', 'compare'];
  const highStress = ['fear_interview', 'rejected', 'inadequate', 'multi_pressure'];

  if (lowStress.includes(emotionId)) return { level: 'low', label: '低压力', color: '#10b981', percent: 25, advice: '可以继续学习和探索，保持当前节奏' };
  if (midStress.includes(emotionId)) return { level: 'mid', label: '中压力', color: '#f59e0b', percent: 55, advice: '建议减少任务量，先完成一个小目标' };
  return { level: 'high', label: '高压力', color: '#ef4444', percent: 82, advice: '建议先休息、倾诉、寻求朋友或老师的支持' };
}

// ============ 小工具内容生成 ============
function getToolContent(toolId) {
  switch (toolId) {
    case 'emotion_sort':
      return {
        title: '🧘 3分钟情绪整理',
        steps: [
          { label: '✍️ 我现在担心什么？', placeholder: '写下你此刻最担心的事情...', hint: '不用修饰，想到什么写什么' },
          { label: '🎯 我能控制什么？', placeholder: '哪些是你能够影响的？...', hint: '只写你能直接行动的部分' },
          { label: '🌱 我今天能做什么？', placeholder: '今天可以做的一件小事...', hint: '只需要一件，很小的也可以' },
        ],
        closing: '很棒！你已经把模糊的焦虑变成了具体的问题和行动。每次感到压力大的时候，都可以做这个小练习。',
      };
    case 'fail_review':
      return {
        title: '📋 投递失败复盘卡',
        steps: [
          { label: '🎯 岗位匹配度（1-5分）', placeholder: '你的能力和JD要求的匹配程度如何？...', hint: '诚实打分，不用追求满分' },
          { label: '📝 简历表达（1-5分）', placeholder: '简历是否清晰地展示了你的匹配点？...', hint: 'HR平均只看6秒简历' },
          { label: '📊 投递数量', placeholder: '你投递了多少家？行业平均水平是50+...', hint: '投递是数字游戏，量也很重要' },
          { label: '🎤 面试准备（1-5分）', placeholder: '如果有面试，你的准备程度如何？...', hint: '包括自我介绍、项目讲述、常见问题' },
        ],
        closing: '复盘不是为了自责，而是为了下一次更好。找到最需要改进的一项，集中精力突破它。',
      };
    case 'encourage':
      return {
        title: '💪 面试前鼓励卡',
        content: `🌟 **面试前，请记住**：\n\n✨ **你已经准备好了**：你投递的每一份简历、学习的每一个知识点、练习的每一次自我介绍，都在为你积蓄力量。\n\n💡 **面试是双向选择**：不仅公司在面试你，你也在面试这家公司。你有选择的权利。\n\n🎯 **专注你能控制的**：你不能控制面试官问什么，但你能控制自己的态度——真诚、积极、展示真实的自己。\n\n🌿 **面试小贴士**：\n• 提前10分钟到达（线上面试提前测试设备）\n• 准备3个"我想问面试官的问题"\n• 面试结束后给自己一个小奖励，不管结果如何\n\n🐧 **e职伴的祝福**：\n你已经走了很远的路才来到这个面试间。深呼吸，微笑，做自己。不管结果如何，每一次面试都是一次成长。加油！`,
      };
    case 'low_pressure_task':
      const tasks = [
        { task: '📝 修改一段项目经历的描述，让它更贴合目标岗位', time: '约10分钟' },
        { task: '⭐ 在求职App上收藏3个感兴趣的岗位', time: '约5分钟' },
        { task: '🎤 对着镜子练习1分钟自我介绍', time: '约5分钟' },
        { task: '📖 阅读一篇你目标岗位的行业文章', time: '约10分钟' },
        { task: '✍️ 写下你最近做成的一件事，不管多小', time: '约5分钟' },
        { task: '🌿 整理你的简历，只改一处表达', time: '约10分钟' },
        { task: '💬 给一个朋友发消息聊聊近况', time: '约5分钟' },
      ];
      const picked = tasks[Math.floor(Math.random() * tasks.length)];
      return {
        title: '🌿 今日低压力任务',
        content: `**今天的任务只有一个，不用多想，做就对了：**\n\n### ${picked.task}\n\n⏱️ 预计时间：${picked.time}\n\n💡 **为什么只给一个任务？**\n当压力大的时候，最重要的不是"做更多"，而是"找回掌控感"。完成一件小事，就能打破"我什么都做不了"的无力感。\n\n🐧 做完之后，记得给自己点个赞！你已经比昨天的自己进步了。`,
      };
    default:
      return { title: '', content: '' };
  }
}

export default function EmotionComfort() {
  const { user, saveChatHistory, getChatHistory } = useAuth();
  const sessionIdRef = useRef(Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8));

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [toolDialogVisible, setToolDialogVisible] = useState(false);
  const [toolInputs, setToolInputs] = useState({});
  const [toolResult, setToolResult] = useState(null);

  // ===== 问卷相关 =====
  const [questionnaireVisible, setQuestionnaireVisible] = useState(false);
  const [questionnaireEmotion, setQuestionnaireEmotion] = useState(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const [questionnaireResult, setQuestionnaireResult] = useState(null);
  const [questionnaireStep, setQuestionnaireStep] = useState(0);

  // ===== 来自 AiChat 的功能 =====
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // 消息自动保存
  const saveMessages = useCallback((msgs) => {
    if (user && msgs.length > 0) {
      saveChatHistory(sessionIdRef.current, msgs, 'emotion');
    }
  }, [user, saveChatHistory]);

  useEffect(() => {
    if (chatMessages.length > 1) {
      saveMessages(chatMessages);
    }
  }, [chatMessages.length]);

  const stressLevel = selectedEmotion ? getStressLevel(selectedEmotion) : null;

  const handleEmotionSelect = (emotionId) => {
    setSelectedEmotion(emotionId);
    // 弹出问卷
    const qData = EMOTION_QUESTIONNAIRES[emotionId];
    if (qData) {
      setQuestionnaireEmotion(emotionId);
      setQuestionnaireAnswers({});
      setQuestionnaireResult(null);
      setQuestionnaireStep(0);
      setQuestionnaireVisible(true);
    }
  };

  // 问卷作答
  const handleQAnswer = (qId, option, isMulti) => {
    setQuestionnaireAnswers(prev => {
      if (isMulti) {
        const current = prev[qId] || [];
        const next = current.includes(option)
          ? current.filter(o => o !== option)
          : [...current, option];
        return { ...prev, [qId]: next };
      }
      return { ...prev, [qId]: option };
    });
  };

  const handleQNext = () => {
    const qData = EMOTION_QUESTIONNAIRES[questionnaireEmotion];
    if (!qData) return;
    if (questionnaireStep < qData.questions.length - 1) {
      setQuestionnaireStep(s => s + 1);
    } else {
      // 完成问卷，生成分析结果
      const result = analyzeQuestionnaireResults(questionnaireEmotion, questionnaireAnswers);
      setQuestionnaireResult(result);
    }
  };

  const handleQPrev = () => {
    if (questionnaireStep > 0) {
      setQuestionnaireStep(s => s - 1);
    }
  };

  const handleCloseQuestionnaire = () => {
    setQuestionnaireVisible(false);
    setQuestionnaireEmotion(null);
    setQuestionnaireAnswers({});
    setQuestionnaireResult(null);
    setQuestionnaireStep(0);
  };

  const handleSend = () => {
    const text = userInput.trim();
    if (!text) return;

    const userMsg = { role: 'user', content: text, time: new Date().toISOString() };
    const updatedMsgs = [...chatMessages, userMsg];
    setChatMessages(updatedMsgs);
    setUserInput('');
    setIsTyping(true);
    saveMessages(updatedMsgs);

    setTimeout(() => {
      // 如果选了情绪状态，优先用情绪专属回复；否则用通用AI匹配
      let reply;
      if (selectedEmotion) {
        reply = generateEmotionResponse(selectedEmotion, text);
      } else {
        reply = findPresetReply(text);
      }
      const finalMsgs = [...updatedMsgs, { role: 'ai', content: reply, time: new Date().toISOString() }];
      setChatMessages(finalMsgs);
      setIsTyping(false);
      saveMessages(finalMsgs);
    }, 1200 + Math.random() * 800);
  };

  const handleQuickAsk = (question) => {
    const userMsg = { role: 'user', content: question, time: new Date().toISOString() };
    const updatedMsgs = [...chatMessages, userMsg];
    setChatMessages(updatedMsgs);
    setIsTyping(true);
    saveMessages(updatedMsgs);

    setTimeout(() => {
      let reply;
      if (selectedEmotion) {
        reply = generateEmotionResponse(selectedEmotion, question);
      } else {
        reply = findPresetReply(question);
      }
      const finalMsgs = [...updatedMsgs, { role: 'ai', content: reply, time: new Date().toISOString() }];
      setChatMessages(finalMsgs);
      setIsTyping(false);
      saveMessages(finalMsgs);
    }, 1200 + Math.random() * 800);
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
  };

  // 加载历史会话
  const loadSession = (session) => {
    if (session && session.messages) {
      setChatMessages(session.messages);
      sessionIdRef.current = session.sessionId;
      MessagePlugin.success('已加载历史对话');
    }
  };

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
    setToolInputs({});
    setToolResult(null);
    setToolDialogVisible(true);
  };

  const handleToolSubmit = () => {
    const tool = getToolContent(activeTool);
    setToolResult(tool);
  };

  const currentTool = activeTool ? getToolContent(activeTool) : null;

  return (
    <div className="page-container" style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="section-title" style={{ fontSize: 28, marginBottom: 4 }}>💙 情绪陪伴室</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              在这里，你的每一种情绪都被允许、被理解、被认真对待
            </p>
          </div>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', background: 'var(--primary-light)',
                borderRadius: 20, fontSize: 13, fontWeight: 600, color: 'var(--primary)',
              }}>
                <span>🐧</span>
                {user.username}
                {user.grade && <span style={{ opacity: 0.7 }}>· {user.grade}</span>}
              </div>
              <Button
                size="small"
                variant="outline"
                onClick={() => setHistoryOpen(!historyOpen)}
                style={{ fontSize: 12, borderRadius: 20 }}
              >
                📋 历史 ({(user.chatHistory || []).length})
              </Button>
            </div>
          )}
        </div>

        {/* 历史会话列表 */}
        {historyOpen && user && (
          <div style={{
            marginTop: 12, padding: '16px', background: '#fff',
            borderRadius: 14, border: '1px solid var(--border)',
            maxHeight: 220, overflow: 'auto',
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📋 历史对话记录</p>
            {(user.chatHistory || []).length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>暂无历史记录，开始聊天吧！</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(user.chatHistory || []).map((session, i) => (
                  <div
                    key={session.sessionId}
                    onClick={() => loadSession(session)}
                    style={{
                      padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                      background: session.sessionId === sessionIdRef.current ? '#e3edff' : '#f8fafc',
                      border: session.sessionId === sessionIdRef.current ? '1px solid #93c5fd' : '1px solid transparent',
                      transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                    onMouseEnter={e => { if (session.sessionId !== sessionIdRef.current) e.currentTarget.style.background = '#f0f7ff'; }}
                    onMouseLeave={e => { if (session.sessionId !== sessionIdRef.current) e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        💙 情绪陪伴
                        {session.sessionId === sessionIdRef.current && (
                          <Tag theme="primary" size="small" variant="light">当前</Tag>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {session.messages?.length || 0} 条消息 · {new Date(session.timestamp).toLocaleString('zh-CN')}
                      </div>
                    </div>
                    <div style={{ fontSize: 18, color: 'var(--text-muted)' }}>→</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========== 情绪状态选择 ========== */}
      <Card bordered style={{
        borderRadius: 'var(--radius-lg)',
        marginBottom: 16,
        background: '#e8f0fe',
        border: '1px solid #c7d2fe',
      }}>
        <div style={{ padding: 4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, textAlign: 'center', color: '#6366f1' }}>
            我现在的状态是...
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16 }}>
            点击选择你此刻最贴近的感受
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 10,
          }}>
            {EMOTION_STATES.map(emotion => (
              <div
                key={emotion.id}
                onClick={() => handleEmotionSelect(emotion.id)}
                style={{
                  padding: '14px 12px', borderRadius: 14, cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                  background: selectedEmotion === emotion.id ? emotion.bg : '#fff',
                  border: selectedEmotion === emotion.id ? `2px solid ${emotion.color}` : '2px solid transparent',
                  boxShadow: selectedEmotion === emotion.id ? `0 4px 16px ${emotion.color}22` : '0 1px 3px rgba(0,0,0,.04)',
                  textAlign: 'center',
                  transform: selectedEmotion === emotion.id ? 'scale(1.03)' : 'scale(1)',
                }}
                onMouseEnter={e => {
                  if (selectedEmotion !== emotion.id) {
                    e.currentTarget.style.borderColor = emotion.color + '66';
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${emotion.color}15`;
                  }
                }}
                onMouseLeave={e => {
                  if (selectedEmotion !== emotion.id) {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)';
                  }
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: emotion.color, marginBottom: 2 }}>
                  {emotion.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {emotion.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ========== 年级选择（来自AiChat） ========== */}
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
                  cursor: 'pointer', transition: 'all 0.2s',
                  ...(selectedGrade === g ? {} : { opacity: 0.75 }),
                }}
              >
                {g}
              </Tag>
            ))}
          </div>
          {selectedGrade && (
            <span
              onClick={() => setSelectedGrade(null)}
              style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              重置年级
            </span>
          )}
        </div>

        {/* 年级快捷问题 */}
        {selectedGrade && GRADE_QUICK_ASKS[selectedGrade] && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
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
                    cursor: 'pointer', transition: 'all 0.2s',
                    borderColor: '#c4b5fd', color: '#7c3aed', background: '#f5f3ff',
                  }}
                >
                  {item.label}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ========== 压力等级展示 ========== */}
      {stressLevel && (
        <Card bordered style={{
          borderRadius: 'var(--radius-lg)',
          marginBottom: 16,
          background: '#fff',
          animation: 'fadeIn 0.4s ease-out',
        }}>
          <div style={{ padding: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>📊 当前压力感知</h3>
              <Tag style={{
                background: stressLevel.color + '18',
                color: stressLevel.color,
                border: `1px solid ${stressLevel.color}33`,
                fontWeight: 600, fontSize: 13,
              }}>
                {stressLevel.label}
              </Tag>
            </div>
            <Progress
              percentage={stressLevel.percent}
              strokeWidth={10}
              color={stressLevel.color}
              trackColor="#f1f5f9"
              style={{ marginBottom: 10 }}
            />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              💡 {stressLevel.advice}
            </p>
            <p style={{
              fontSize: 11, color: 'var(--text-muted)', marginTop: 6,
              padding: '6px 10px', background: '#f8fafc', borderRadius: 8,
            }}>
              ⚠️ 本提示仅用于自我觉察参考，不构成任何医学诊断。如需专业心理支持，请咨询学校心理咨询中心或专业机构。
            </p>
          </div>
        </Card>
      )}

      {/* ========== 倾诉 + AI回应（聊天区域） ========== */}
      <Card bordered style={{
        borderRadius: 'var(--radius-lg)',
        marginBottom: 16,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 480,
        maxHeight: 'calc(100vh - 400px)',
        overflow: 'hidden',
      }}>
        {/* 聊天消息区域 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          {chatMessages.length === 0 && !isTyping && (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.6 }}>🐧</div>
                <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                  选择你的情绪状态，选好年级，<br />
                  或直接写下你想说的话 💙
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  e职伴会认真听、用心回
                </p>
              </div>
            </div>
          )}
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeInUp 0.3s ease-out',
              }}
            >
              <div style={{
                display: 'flex', gap: 10,
                maxWidth: '82%',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: 16,
                  background: msg.role === 'ai' ? '#7c3aed' : '#e2e8f0',
                  color: msg.role === 'ai' ? '#fff' : 'var(--text)',
                }}>
                  {msg.role === 'ai' ? '🐧' : '👤'}
                </div>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  background: msg.role === 'ai' ? '#f5f3ff' : '#7c3aed',
                  color: msg.role === 'ai' ? 'var(--text)' : '#fff',
                  fontSize: 14,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  border: msg.role === 'ai' ? '1px solid #ede9fe' : 'none',
                }}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: '#7c3aed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: '#fff',
              }}>🐧</div>
              <div style={{
                padding: '12px 20px', borderRadius: '4px 16px 16px 16px',
                background: '#f5f3ff', border: '1px solid #ede9fe',
                display: 'flex', gap: 4,
              }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#a78bfa',
                    animation: `pulse 1s ease-in-out ${j * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* 快捷问题行 */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 6, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 4, alignSelf: 'center' }}>快捷：</span>
          {chatPresets.filter(p => p.grade === '通用').slice(0, 4).map((preset, i) => (
            <div
              key={i}
              onClick={() => handleQuickAsk(preset.user)}
              style={{
                padding: '4px 10px', borderRadius: 16, fontSize: 11,
                cursor: 'pointer', background: '#f5f3ff', color: '#7c3aed',
                fontWeight: 500, transition: 'all var(--transition)',
                maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ede9fe'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f5f3ff'; }}
            >
              {preset.user.slice(0, 25)}...
            </div>
          ))}
        </div>

        {/* 输入区 */}
        <div style={{
          padding: '12px 20px 16px',
          borderTop: '1px solid #e9d5ff',
          display: 'flex', gap: 10,
        }}>
          <Input
            value={userInput}
            onChange={setUserInput}
            placeholder={
              selectedEmotion
                ? '写下你的感受，e职伴会认真听... 💙'
                : (selectedGrade ? `作为${selectedGrade}同学，你想和e职伴聊什么...` : '写下你想说的话，e职伴在这里陪你... 💙')
            }
            onEnter={handleSend}
            style={{ flex: 1 }}
          />
          <Button
            theme="primary"
            icon={<SendIcon />}
            onClick={handleSend}
            disabled={!userInput.trim()}
            shape="circle"
            style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
          />
        </div>
      </Card>

      {/* ========== 求职压力小工具 ========== */}
      <Card bordered style={{
        borderRadius: 'var(--radius-lg)',
        marginBottom: 16,
        background: '#fff',
      }}>
        <div style={{ padding: 4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>
            🛠️ 求职压力小工具
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16 }}>
            选一个小工具，花几分钟关照一下自己
          </p>
          <div className="card-grid-4">
            {TOOLS.map(tool => (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className="glass-card"
                style={{
                  padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
                  borderTop: `3px solid ${tool.color}`,
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{tool.icon}</div>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: tool.color }}>
                  {tool.title}
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ========== 小工具弹窗 ========== */}
      <Dialog
        visible={toolDialogVisible}
        onClose={() => { setToolDialogVisible(false); setToolResult(null); }}
        header={currentTool?.title || '小工具'}
        width={560}
        footer={null}
        style={{ borderRadius: 'var(--radius-lg)' }}
      >
        {!toolResult ? (
          <div style={{ padding: '8px 0' }}>
            {currentTool?.steps ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {currentTool.steps.map((step, i) => (
                  <div key={i}>
                    <label style={{
                      display: 'block', fontSize: 14, fontWeight: 600,
                      color: 'var(--text)', marginBottom: 6,
                    }}>
                      {step.label}
                    </label>
                    <Textarea
                      value={toolInputs[`step${i}`] || ''}
                      onChange={v => setToolInputs(prev => ({ ...prev, [`step${i}`]: v }))}
                      placeholder={step.placeholder}
                      autosize={{ minRows: 2, maxRows: 3 }}
                      style={{ borderRadius: 10 }}
                    />
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {step.hint}
                    </p>
                  </div>
                ))}
                <Button
                  theme="primary"
                  block
                  onClick={handleToolSubmit}
                  style={{ height: 40, fontSize: 14, fontWeight: 600, borderRadius: 10, marginTop: 8 }}
                >
                  ✅ 完成整理
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{currentTool?.icon || '🛠️'}</div>
                <Button
                  theme="primary"
                  size="large"
                  onClick={handleToolSubmit}
                  style={{ borderRadius: 10, fontWeight: 600 }}
                >
                  生成{currentTool?.title?.slice(0, 6)}...
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '8px 0', animation: 'fadeIn 0.3s ease-out' }}>
            {toolResult.content ? (
              <div style={{
                whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.9,
                color: 'var(--text)', padding: '16px',
                background: '#f0f4ff', borderRadius: 12,
              }}>
                {toolResult.content}
              </div>
            ) : (
              <div>
                <div style={{
                  whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.9,
                  color: 'var(--text)', padding: '16px',
                  background: '#f0f4ff', borderRadius: 12, marginBottom: 12,
                }}>
                  {toolResult.closing}
                </div>
              </div>
            )}
            <Button
              variant="outline"
              block
              onClick={() => { setToolResult(null); setToolInputs({}); }}
              style={{ marginTop: 12, borderRadius: 10 }}
            >
              🔄 再来一次
            </Button>
          </div>
        )}
      </Dialog>

      {/* ========== 情绪问卷弹窗 ========== */}
      <Dialog
        visible={questionnaireVisible}
        onClose={handleCloseQuestionnaire}
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📋</span>
            <span style={{ fontSize: 17, fontWeight: 700 }}>
              {EMOTION_QUESTIONNAIRES[questionnaireEmotion]?.title || '情绪问卷'}
            </span>
          </div>
        }
        width={560}
        footer={null}
        style={{ borderRadius: 'var(--radius-lg)' }}
      >
        {!questionnaireResult ? (
          <div style={{ padding: '8px 0' }}>
            {/* 进度条 */}
            {questionnaireEmotion && EMOTION_QUESTIONNAIRES[questionnaireEmotion] && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {EMOTION_QUESTIONNAIRES[questionnaireEmotion].desc}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
                      {questionnaireStep + 1} / {EMOTION_QUESTIONNAIRES[questionnaireEmotion].questions.length}
                    </span>
                  </div>
                  <Progress
                    percentage={Math.round(((questionnaireStep + 1) / EMOTION_QUESTIONNAIRES[questionnaireEmotion].questions.length) * 100)}
                    strokeWidth={6}
                    color="#7c3aed"
                    trackColor="#f1f5f9"
                  />
                </div>

                {/* 当前题目 */}
                {(() => {
                  const q = EMOTION_QUESTIONNAIRES[questionnaireEmotion].questions[questionnaireStep];
                  if (!q) return null;
                  const isMulti = q.type === 'multi';
                  const currentAnswer = questionnaireAnswers[q.id];
                  const hasAnswer = isMulti
                    ? (currentAnswer || []).length > 0
                    : !!currentAnswer;

                  return (
                    <div style={{
                      padding: '20px',
                      background: '#f8fafc',
                      borderRadius: 14,
                      border: '1px solid #e2e8f0',
                    }}>
                      <h4 style={{
                        fontSize: 15, fontWeight: 700, color: 'var(--text)',
                        marginBottom: 16, lineHeight: 1.6,
                      }}>
                        {q.text}
                      </h4>
                      {isMulti && (
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                          （可多选）
                        </p>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {q.options.map((opt, oi) => {
                          const isSelected = isMulti
                            ? (currentAnswer || []).includes(opt)
                            : currentAnswer === opt;
                          return (
                            <div
                              key={oi}
                              onClick={() => handleQAnswer(q.id, opt, isMulti)}
                              style={{
                                padding: '12px 16px',
                                borderRadius: 10,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: isSelected ? '#f0ebff' : '#fff',
                                border: isSelected ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                                color: isSelected ? '#5b21b6' : 'var(--text)',
                                fontWeight: isSelected ? 600 : 400,
                                display: 'flex', alignItems: 'center', gap: 10,
                                fontSize: 14,
                              }}
                              onMouseEnter={e => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = '#faf5ff';
                                  e.currentTarget.style.borderColor = '#c4b5fd';
                                }
                              }}
                              onMouseLeave={e => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = '#fff';
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                }
                              }}
                            >
                              <span style={{
                                width: 20, height: 20, borderRadius: isMulti ? 6 : '50%',
                                border: isSelected ? '2px solid #7c3aed' : '2px solid #d1d5db',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, flexShrink: 0,
                                background: isSelected ? '#7c3aed' : '#fff',
                                color: isSelected ? '#fff' : 'transparent',
                                transition: 'all 0.2s',
                              }}>
                                {isSelected ? '✓' : ''}
                              </span>
                              {opt}
                            </div>
                          );
                        })}
                      </div>

                      {/* 导航按钮 */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 12,
                      }}>
                        <Button
                          variant="outline"
                          onClick={handleQPrev}
                          disabled={questionnaireStep === 0}
                          style={{ borderRadius: 8, visibility: questionnaireStep === 0 ? 'hidden' : 'visible' }}
                        >
                          ← 上一题
                        </Button>
                        <Button
                          theme="primary"
                          onClick={handleQNext}
                          disabled={!hasAnswer}
                          style={{ borderRadius: 8, background: '#7c3aed', borderColor: '#7c3aed' }}
                        >
                          {questionnaireStep < EMOTION_QUESTIONNAIRES[questionnaireEmotion].questions.length - 1
                            ? '下一题 →'
                            : '✅ 提交问卷'}
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        ) : (
          /* 问卷结果 */
          <div style={{ padding: '8px 0', animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📊</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#7c3aed', marginBottom: 4 }}>
                分析结果
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                根据你的回答，以下是针对性建议
              </p>
            </div>
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%)',
              borderRadius: 14,
              border: '1px solid #e0e7ff',
              fontSize: 14,
              lineHeight: 1.9,
              color: 'var(--text)',
              whiteSpace: 'pre-wrap',
              marginBottom: 16,
            }}>
              {questionnaireResult}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button
                variant="outline"
                block
                onClick={() => {
                  setQuestionnaireResult(null);
                  setQuestionnaireAnswers({});
                  setQuestionnaireStep(0);
                }}
                style={{ borderRadius: 10 }}
              >
                🔄 重新作答
              </Button>
              <Button
                theme="primary"
                block
                onClick={handleCloseQuestionnaire}
                style={{ borderRadius: 10, background: '#7c3aed', borderColor: '#7c3aed' }}
              >
                👍 知道了，谢谢
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* ========== 底部引导 ========== */}
      <Card bordered style={{
        borderRadius: 'var(--radius-lg)',
        background: '#e3edff',
        border: '1px solid #c7d2fe',
      }}>
        <div style={{ padding: 8, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
            需要更深入的求职帮助？试试这些功能 👇
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              onClick={() => navigate('/diagnosis')}
              style={{ borderRadius: 20, borderColor: '#7c3aed', color: '#7c3aed', fontWeight: 600 }}
            >
              🔍 成长诊断
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/job-prep')}
              style={{ borderRadius: 20, borderColor: '#10b981', color: '#10b981', fontWeight: 600 }}
            >
              💼 求职准备
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/career-map')}
              style={{ borderRadius: 20, borderColor: '#0066ff', color: '#0066ff', fontWeight: 600 }}
            >
              🗺️ 职业探索
            </Button>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <div style={{
        marginTop: 16,
        padding: '12px 16px',
        background: '#f8fafc',
        borderRadius: 8,
        fontSize: 11,
        color: 'var(--text-muted)',
        textAlign: 'center',
        border: '1px dashed var(--border)',
      }}>
        💙 情绪陪伴室提供情绪陪伴和压力缓解支持，不构成任何医学诊断或心理治疗。
        如持续感到严重焦虑或情绪低落，请及时联系学校心理咨询中心或拨打心理援助热线。
      </div>
    </div>
  );
}
