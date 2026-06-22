import React, { useState, useMemo } from 'react';
import { Card, Select, Button, Tag, Dialog } from 'tdesign-react';

// ============ 专业数据 ============
const MAJOR_DATA = {
  'cs': {
    name: '计算机/软件工程',
    icon: '💻',
    color: '#A8C8E8',
    desc: '掌握AI辅助编程与模型开发能力',
  },
  'media': {
    name: '新闻传播/中文',
    icon: '✍️',
    color: '#D4C08A',
    desc: '用AI赋能内容创作与舆情分析',
  },
  'marketing': {
    name: '市场营销/工商管理',
    icon: '📈',
    color: '#B8A9C9',
    desc: 'AI驱动营销策略与数据洞察',
  },
  'design': {
    name: '设计类',
    icon: '🎨',
    color: '#E8927C',
    desc: 'AI创意设计与视觉生成',
  },
  'finance': {
    name: '金融/经济',
    icon: '💰',
    color: '#8CB89F',
    desc: 'AI金融分析与智能投研',
  },
  'medical': {
    name: '医学/生物',
    icon: '🔬',
    color: '#A8C8E8',
    desc: 'AI科研辅助与数据分析',
  },
  'law': {
    name: '法学',
    icon: '⚖️',
    color: '#D4C08A',
    desc: 'AI法律研究与文书处理',
  },
  'architecture': {
    name: '城市规划/建筑',
    icon: '🏗️',
    color: '#E8C46A',
    desc: 'AI空间设计与方案表达',
  },
};

// ============ 技能节点（每个专业下的学习路径节点） ============
const PATHWAY_NODES = {
  'cs': [
    { id: 'start', label: '🚀 起点', x: 10, y: 50, type: 'start', desc: '掌握Python/JS基础编程能力' },
    { id: 'copilot', label: '🤖 AI编码', x: 28, y: 28, type: 'skill', desc: '使用Copilot/Cursor提升开发效率', tools: ['GitHub Copilot', 'Cursor', 'Claude Code'] },
    { id: 'prompt', label: '🎯 Prompt工程', x: 28, y: 68, type: 'skill', desc: '学会编写高质量Prompt驱动AI', tools: ['Prompt Templates', 'Few-shot Learning'] },
    { id: 'rag', label: '📚 RAG架构', x: 50, y: 40, type: 'core', desc: '构建检索增强生成知识库应用', tools: ['LangChain', 'VectorDB', 'Embedding'] },
    { id: 'finetune', label: '🔧 模型微调', x: 50, y: 60, type: 'core', desc: 'Fine-tune开源模型适配业务', tools: ['Hugging Face', 'LoRA', 'QLoRA'] },
    { id: 'agent', label: '🧠 AI Agent', x: 72, y: 35, type: 'advanced', desc: '构建自主决策的AI智能体系统', tools: ['LangGraph', 'AutoGPT', 'Function Calling'] },
    { id: 'deploy', label: '🚢 部署上线', x: 72, y: 58, type: 'advanced', desc: '将AI应用部署到生产环境', tools: ['Docker', 'K8s', 'API Gateway'] },
    { id: 'master', label: '🏆 AI全栈', x: 90, y: 48, type: 'end', desc: '独立完成AI驱动的全栈项目，具备AI开发完整能力' },
  ],
  'media': [
    { id: 'start', label: '🚀 起点', x: 10, y: 50, type: 'start', desc: '具备基础写作与内容策划能力' },
    { id: 'ai-writing', label: '✍️ AI写作', x: 30, y: 30, type: 'skill', desc: '用AI高效生成各类文案与脚本', tools: ['ChatGPT', 'Claude', 'Kimi'] },
    { id: 'content-strategy', label: '📋 内容策略', x: 30, y: 68, type: 'skill', desc: 'AI辅助选题策划与内容日历', tools: ['Notion AI', 'AI模板'] },
    { id: 'multi-platform', label: '🌐 多平台运营', x: 52, y: 42, type: 'core', desc: 'AI驱动跨平台内容风格迁移', tools: ['文心一言', 'AI改写'] },
    { id: 'sentiment', label: '📊 舆情分析', x: 52, y: 62, type: 'core', desc: 'AI社交媒体情感分析与趋势洞察', tools: ['Python基础', 'AI分析'] },
    { id: 'automation', label: '⚡ 内容中台', x: 74, y: 38, type: 'advanced', desc: '搭建AI自动化内容生产流水线', tools: ['Zapier', 'Make', 'API'] },
    { id: 'personalize', label: '🎯 个性化推荐', x: 74, y: 60, type: 'advanced', desc: 'AI驱动个性化内容推荐策略', tools: ['用户画像', '推荐算法'] },
    { id: 'master', label: '🏆 AI内容专家', x: 90, y: 50, type: 'end', desc: '掌握AI全链路内容创作与运营能力' },
  ],
  'marketing': [
    { id: 'start', label: '🚀 起点', x: 10, y: 50, type: 'start', desc: '具备市场营销基础理论' },
    { id: 'user-insight', label: '👥 用户洞察', x: 30, y: 32, type: 'skill', desc: 'AI辅助用户画像与行为分析', tools: ['ChatGPT', '数据分析'] },
    { id: 'copywriting', label: '✍️ 营销文案', x: 30, y: 65, type: 'skill', desc: 'AI生成多渠道营销文案', tools: ['Claude', 'AI写作'] },
    { id: 'strategy', label: '🎯 营销策略', x: 52, y: 48, type: 'core', desc: 'AI辅助制定数据驱动的营销方案', tools: ['Notion AI', '竞品分析'] },
    { id: 'optimization', label: '📈 投放优化', x: 72, y: 38, type: 'advanced', desc: 'AI驱动的广告投放与ROI优化', tools: ['数据分析', 'A/B测试'] },
    { id: 'growth', label: '🚀 增长策略', x: 72, y: 60, type: 'advanced', desc: 'AI预测性用户增长分析', tools: ['增长模型', 'AI预测'] },
    { id: 'master', label: '🏆 AI营销专家', x: 90, y: 50, type: 'end', desc: '独立制定AI驱动的完整营销方案' },
  ],
  'design': [
    { id: 'start', label: '🚀 起点', x: 10, y: 50, type: 'start', desc: '具备设计基础（色彩/排版/构图）' },
    { id: 'moodboard', label: '🎨 灵感生成', x: 30, y: 30, type: 'skill', desc: 'AI辅助灵感板与概念探索', tools: ['Midjourney', 'DALL·E'] },
    { id: 'ui-assets', label: '🧩 UI素材', x: 30, y: 68, type: 'skill', desc: 'AI生成图标/插画/界面元素', tools: ['Figma AI', 'Stable Diffusion'] },
    { id: 'design-system', label: '📐 设计系统', x: 52, y: 45, type: 'core', desc: 'AI生成和扩展设计系统组件', tools: ['Design Tokens', 'AI组件库'] },
    { id: 'control-net', label: '🎯 精准控图', x: 52, y: 65, type: 'core', desc: 'ControlNet精准控制AI图像生成', tools: ['ControlNet', 'IP-Adapter'] },
    { id: 'style-model', label: '🖌️ 风格模型', x: 74, y: 40, type: 'advanced', desc: '训练专属品牌风格AI模型', tools: ['LoRA训练', 'DreamBooth'] },
    { id: 'workflow', label: '⚡ 设计流水线', x: 74, y: 60, type: 'advanced', desc: 'AI+设计全流程自动化工作流', tools: ['ComfyUI', '自动化'] },
    { id: 'master', label: '🏆 AI设计大师', x: 90, y: 50, type: 'end', desc: '独立完成AI驱动的完整品牌设计' },
  ],
  'finance': [
    { id: 'start', label: '🚀 起点', x: 10, y: 50, type: 'start', desc: '具备金融/经济学基础知识' },
    { id: 'report-reading', label: '📖 财报解读', x: 30, y: 35, type: 'skill', desc: 'AI辅助快速阅读和分析财报', tools: ['ChatGPT', '文档分析'] },
    { id: 'brief', label: '📝 行业简报', x: 30, y: 65, type: 'skill', desc: 'AI自动生成行业研究报告', tools: ['AI写作', '数据整合'] },
    { id: 'quant', label: '📊 量化分析', x: 52, y: 48, type: 'core', desc: 'AI驱动的量化投资分析模型', tools: ['Python Pandas', 'AI模型'] },
    { id: 'risk', label: '⚠️ 风险预警', x: 72, y: 38, type: 'advanced', desc: 'AI构建多维度风险识别系统', tools: ['风险模型', '异常检测'] },
    { id: 'advisor', label: '🧠 投研助手', x: 72, y: 60, type: 'advanced', desc: '构建AI投研知识库与决策支持', tools: ['RAG', '知识图谱'] },
    { id: 'master', label: '🏆 AI金融分析师', x: 90, y: 50, type: 'end', desc: '独立产出AI辅助的深度投研报告' },
  ],
  'medical': [
    { id: 'start', label: '🚀 起点', x: 10, y: 50, type: 'start', desc: '具备医学/生物学专业知识' },
    { id: 'lit-review', label: '📚 文献检索', x: 30, y: 32, type: 'skill', desc: 'AI辅助高效检索与总结文献', tools: ['Consensus', 'Elicit', 'Zotero'] },
    { id: 'experiment', label: '🧪 实验设计', x: 30, y: 65, type: 'skill', desc: 'AI辅助优化实验方案设计', tools: ['ChatGPT', 'AI分析'] },
    { id: 'meta', label: '📊 Meta分析', x: 52, y: 48, type: 'core', desc: 'AI辅助系统性综述与Meta分析', tools: ['Python', 'R语言', 'AI工具'] },
    { id: 'kg', label: '🕸️ 知识图谱', x: 72, y: 40, type: 'advanced', desc: '构建生物医学知识图谱', tools: ['Neo4j', 'GraphRAG'] },
    { id: 'multi-modal', label: '🔬 多模态分析', x: 72, y: 60, type: 'advanced', desc: 'AI驱动多模态医学数据整合', tools: ['影像AI', '基因组学'] },
    { id: 'master', label: '🏆 AI科研专家', x: 90, y: 50, type: 'end', desc: '独立运用AI完成完整科研工作流' },
  ],
  'law': [
    { id: 'start', label: '🚀 起点', x: 10, y: 50, type: 'start', desc: '具备法学基础知识' },
    { id: 'statute', label: '📜 法条检索', x: 30, y: 35, type: 'skill', desc: 'AI辅助快速精准法条检索', tools: ['北大法宝', 'ChatGPT'] },
    { id: 'case', label: '📋 案例分析', x: 30, y: 65, type: 'skill', desc: 'AI生成案例摘要与类案对比', tools: ['AI法律助手', '案例库'] },
    { id: 'opinion', label: '📝 法律意见书', x: 52, y: 48, type: 'core', desc: 'AI辅助撰写法律意见书', tools: ['AI写作', '模板库'] },
    { id: 'compliance', label: '🛡️ 合规审查', x: 72, y: 40, type: 'advanced', desc: 'AI自动化合规审查与风险识别', tools: ['规则引擎', 'AI审核'] },
    { id: 'contract', label: '📑 智能合同', x: 72, y: 60, type: 'advanced', desc: '构建AI智能合同审查系统', tools: ['NLP', '合同知识库'] },
    { id: 'master', label: '🏆 AI法律顾问', x: 90, y: 50, type: 'end', desc: '独立运用AI完成法律研究与文书工作' },
  ],
  'architecture': [
    { id: 'start', label: '🚀 起点', x: 10, y: 50, type: 'start', desc: '具备建筑设计/规划基础' },
    { id: 'concept', label: '🎨 概念方案', x: 30, y: 35, type: 'skill', desc: 'AI生成概念设计方案图', tools: ['Midjourney', 'Stable Diffusion'] },
    { id: 'site', label: '🗺️ 场地分析', x: 30, y: 65, type: 'skill', desc: 'AI辅助场地与环境分析', tools: ['GIS', 'AI分析'] },
    { id: 'compare', label: '⚖️ 方案比选', x: 52, y: 48, type: 'core', desc: 'AI生成多方案自动比选', tools: ['Rhino+AI', '参数化'] },
    { id: 'parametric', label: '🔮 参数化设计', x: 72, y: 40, type: 'advanced', desc: '参数化+AI融合设计工作流', tools: ['Grasshopper', 'AI优化'] },
    { id: 'urban', label: '🏙️ 城市建模', x: 72, y: 60, type: 'advanced', desc: 'AI驱动的城市数据建模分析', tools: ['Urban Data', 'AI建模'] },
    { id: 'master', label: '🏆 AI建筑设计师', x: 90, y: 50, type: 'end', desc: '独立运用AI完成完整设计方案' },
  ],
};

// 连接线定义（节点之间的路径）
function getConnections(majorId) {
  const base = [
    ['start', 'skill1'], ['start', 'skill2'],
    ['skill1', 'core1'], ['skill2', 'core1'], ['skill2', 'core2'],
    ['core1', 'advanced1'], ['core2', 'advanced2'],
    ['advanced1', 'master'], ['advanced2', 'master'],
  ];
  const nodeIds = (PATHWAY_NODES[majorId] || []).map(n => n.id);
  if (nodeIds.length < 7) {
    return [
      [nodeIds[0], nodeIds[1]], [nodeIds[0], nodeIds[2]],
      [nodeIds[1], nodeIds[3]], [nodeIds[2], nodeIds[3]],
      [nodeIds[3], nodeIds[4]], [nodeIds[3], nodeIds[5]],
      [nodeIds[4], nodeIds[6]], [nodeIds[5], nodeIds[6]],
    ].filter(Boolean);
  }
  return [
    [nodeIds[0], nodeIds[1]], [nodeIds[0], nodeIds[2]],
    [nodeIds[1], nodeIds[3]], [nodeIds[2], nodeIds[3]], [nodeIds[2], nodeIds[4]],
    [nodeIds[3], nodeIds[5]], [nodeIds[4], nodeIds[5]], [nodeIds[3], nodeIds[6]],
    [nodeIds[5], nodeIds[6]], [nodeIds[5], nodeIds[7]],
    [nodeIds[6], nodeIds[7]], [nodeIds[7], nodeIds[8]],
  ].filter(p => p[0] && p[1]);
}

const majorOptions = Object.entries(MAJOR_DATA).map(([k, v]) => ({
  label: `${v.icon} ${v.name}`,
  value: k,
}));

// ============ 地图节点组件 ============
function MapNode({ node, isSelected, isHovered, onSelect, onHover, color, scale = 1 }) {
  const size = node.type === 'start' ? 52 : node.type === 'end' ? 58 : node.type === 'advanced' ? 50 : 44;
  const actualSize = size * scale;

  const typeStyles = {
    start: { bg: '#FFFDF7', border: color, shadow: `3px 3px 0 ${color}30` },
    skill: { bg: '#FFFDF7', border: color + '60' },
    core: { bg: '#FFFDF7', border: color, shadow: `3px 3px 0 ${color}20` },
    advanced: { bg: '#FFFDF7', border: color, shadow: `3px 3px 0 ${color}30` },
    end: { bg: color, border: color, shadow: `4px 4px 0 ${color}50` },
  };

  const s = typeStyles[node.type] || typeStyles.skill;

  return (
    <div
      onClick={() => onSelect(node)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        position: 'absolute',
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: `translate(-50%, -50%) scale(${isSelected ? 1.15 : isHovered ? 1.08 : 1})`,
        width: actualSize,
        height: actualSize,
        borderRadius: node.type === 'end' ? '50%' : node.type === 'start' ? '50%' : '16px',
        background: node.type === 'end' ? s.bg : s.bg,
        border: `2.5px solid ${s.border}`,
        boxShadow: isSelected ? `4px 4px 0 ${color}40` : s.shadow || '2px 2px 0 rgba(139,105,20,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: node.type === 'end' ? 10 : node.type === 'start' ? 9 : isSelected ? 8 : 5,
        transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
        fontSize: Math.max(14, actualSize * 0.36),
        color: node.type === 'end' ? '#5C4A1E' : '#5C4A1E',
        fontWeight: 700,
        userSelect: 'none',
      }}
      title={node.desc}
    >
      {node.label.length > 4 ? node.label.slice(0, 3) : node.label.replace(/[^\u4e00-\u9fa5]/g, '')}
    </div>
  );
}

// ============ SVG连接线 ============
function ConnectionLines({ nodes, connections, color, hoveredNode }) {
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  return (
    <svg style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 1,
    }}>
      {connections.map(([fromId, toId], i) => {
        const from = nodeMap[fromId];
        const to = nodeMap[toId];
        if (!from || !to) return null;
        const isActive = hoveredNode === fromId || hoveredNode === toId;

        // 贝塞尔曲线路径
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const cx = midX;
        const cy = midY - Math.min(15, dist * 0.15);
        const d = `M ${from.x}% ${from.y}% Q ${cx}% ${cy}% ${to.x}% ${to.y}%`;

        return (
          <g key={i}>
            {/* 发光底层 */}
            <path d={d} fill="none"
              stroke={color + (isActive ? '30' : '10')}
              strokeWidth={isActive ? 6 : 4}
              strokeLinecap="round"
            />
            {/* 主线 */}
            <path d={d} fill="none"
              stroke={color + (isActive ? '80' : '35')}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeLinecap="round"
              strokeDasharray={isActive ? '0' : '6 4'}
              style={{ transition: 'all 0.3s' }}
            />
            {/* 动态流动点 */}
            {isActive && (
              <circle r="3" fill={color} opacity="0.9">
                <animateMotion dur="1.5s" repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ============ 图例 ============
const LEGEND = [
  { type: 'start', label: '起点', color: '#6366f1' },
  { type: 'skill', label: '技能点', color: '#6366f1' },
  { type: 'core', label: '核心能力', color: '#6366f1' },
  { type: 'advanced', label: '高阶技能', color: '#6366f1' },
  { type: 'end', label: '终极目标', color: '#6366f1' },
];

export default function AiSkill({ profile }) {
  const [selectedMajor, setSelectedMajor] = useState(profile?.major || '');
  const [showMap, setShowMap] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [nodeDetail, setNodeDetail] = useState(null);

  const nodes = useMemo(() => PATHWAY_NODES[selectedMajor] || [], [selectedMajor]);
  const connections = useMemo(() => getConnections(selectedMajor), [selectedMajor]);
  const majorInfo = MAJOR_DATA[selectedMajor];

  const handleExplore = () => {
    if (!selectedMajor) return;
    setShowMap(true);
    setSelectedNode(null);
    setNodeDetail(null);
  };

  const handleNodeSelect = (node) => {
    setSelectedNode(node.id);
    setNodeDetail(node);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <h1 className="section-title" style={{ fontSize: 34 }}>🗺️ AI 技能探索地图</h1>
        <p className="section-subtitle" style={{ maxWidth: 640, margin: '0 auto 0' }}>
          选择你的专业，开启一张真实的 AI 技能成长地图 —— 从起点出发，点亮每个技能节点，抵达你的终极目标
        </p>
      </div>

      {/* 专业选择器 */}
      <Card bordered style={{
        borderRadius: 'var(--radius-lg)',
        marginBottom: 24,
        background: '#fff',
        border: '1px solid var(--border)',
      }}>
        <div style={{ padding: 12 }}>
          <div style={{
            display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <div style={{ minWidth: 260, flex: '0 1 360px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textAlign: 'center' }}>
                🎓 选择你的专业背景
              </div>
              <Select
                options={majorOptions}
                value={selectedMajor}
                onChange={(v) => { setSelectedMajor(v); setShowMap(false); }}
                placeholder="选择专业..."
                style={{ width: '100%' }}
                size="large"
              />
            </div>
            <Button
              theme="primary"
              size="large"
              onClick={handleExplore}
              disabled={!selectedMajor}
              style={{ fontWeight: 700, fontSize: 16, height: 48, padding: '0 36px', borderRadius: 12 }}
            >
              🗺️ 探索技能地图
            </Button>
          </div>
        </div>
      </Card>

      {/* 快捷专业入口（未选择时显示） */}
      {!showMap && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}>
          {Object.entries(MAJOR_DATA).map(([id, m]) => (
            <div
              key={id}
              onClick={() => { setSelectedMajor(id); setShowMap(true); }}
              style={{
                padding: '18px 16px',
                borderRadius: 14,
                background: '#fff',
                border: `2px solid ${selectedMajor === id ? m.color : 'var(--border)'}`,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.25s',
                boxShadow: selectedMajor === id ? `0 4px 20px ${m.color}20` : 'none',
                transform: selectedMajor === id ? 'scale(1.03)' : 'scale(1)',
              }}
              onMouseEnter={e => {
                if (selectedMajor !== id) {
                  e.currentTarget.style.borderColor = m.color + '60';
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 4px 16px ${m.color}15`;
                }
              }}
              onMouseLeave={e => {
                if (selectedMajor !== id) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* ============ 交互式地图 ============ */}
      {showMap && majorInfo && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          {/* 地图标题栏 */}
          <Card bordered style={{
            borderRadius: 'var(--radius-lg)',
            marginBottom: 20,
            background: '#fff',
            borderTop: `4px solid ${majorInfo.color}`,
          }}>
            <div style={{ padding: 4, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: majorInfo.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32,
              }}>{majorInfo.icon}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{majorInfo.name}</h2>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{majorInfo.desc}</p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {LEGEND.map(l => (
                  <div key={l.type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: l.type === 'end' || l.type === 'start' ? '50%' : '4px',
                      background: l.type === 'end' ? majorInfo.color : '#fff',
                      border: `2px solid ${majorInfo.color}`,
                    }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 地图主体 */}
          <Card bordered style={{
            borderRadius: 'var(--radius-lg)',
            marginBottom: 20,
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(180deg, #FFFDF7 0%, #FDF8EC 50%, #F5ECD7 100%)',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '45%',
              minHeight: 380,
            }}>
              {/* 背景网格 */}
              <svg style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 0,
              }}>
                <defs>
                  <pattern id="grid" width="8%" height="25%" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#D4C08A" strokeWidth="0.5" opacity="0.4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* 装饰性地标 */}
              <div style={{
                position: 'absolute', left: '3%', top: '8%',
                fontSize: 11, color: 'var(--text-muted)', opacity: 0.5,
                zIndex: 0, fontWeight: 600,
              }}>🧭 技能地图 · {majorInfo.name}专属路线</div>

              {/* 连接线 */}
              <ConnectionLines
                nodes={nodes}
                connections={connections}
                color={majorInfo.color}
                hoveredNode={hoveredNode}
              />

              {/* 节点 */}
              {nodes.map(node => (
                <MapNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  isHovered={hoveredNode === node.id}
                  onSelect={handleNodeSelect}
                  onHover={setHoveredNode}
                  color={majorInfo.color}
                />
              ))}

              {/* 浮动提示 */}
              {hoveredNode && !selectedNode && (() => {
                const node = nodes.find(n => n.id === hoveredNode);
                if (!node) return null;
                return (
                  <div style={{
                    position: 'absolute',
                    left: `${node.x + 6}%`,
                    top: `${node.y - 10}%`,
                    transform: 'translateY(-100%)',
                    background: '#5C4A1E',
                    color: '#FFFDF7',
                    padding: '10px 14px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    zIndex: 100,
                    pointerEvents: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  }}>
                    {node.label}
                    <div style={{
                      position: 'absolute', bottom: -6, left: 20,
                      width: 0, height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid #5C4A1E',
                    }} />
                  </div>
                );
              })()}
            </div>
          </Card>

          {/* 节点详情面板 */}
          {nodeDetail && (
            <Card bordered style={{
              borderRadius: 'var(--radius-lg)',
              marginBottom: 20,
              borderLeft: `4px solid ${majorInfo.color}`,
              animation: 'fadeInUp 0.35s ease-out',
            }}>
              <div style={{ padding: 4 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '4px 14px', borderRadius: 20,
                      background: majorInfo.color + '15',
                      color: majorInfo.color,
                      fontSize: 13, fontWeight: 700,
                      marginBottom: 10,
                    }}>
                      {nodeDetail.type === 'start' ? '🚩 起点' :
                       nodeDetail.type === 'end' ? '🏆 终极目标' :
                       nodeDetail.type === 'advanced' ? '⭐ 高阶技能' :
                       nodeDetail.type === 'core' ? '🔑 核心能力' : '📌 技能点'}
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{nodeDetail.label}</h3>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 600 }}>
                      {nodeDetail.desc}
                    </p>
                  </div>
                  {nodeDetail.tools && nodeDetail.tools.length > 0 && (
                    <div style={{
                      padding: '16px 20px',
                      background: '#FDF8EC',
                      borderRadius: 12,
                      minWidth: 180,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>
                        🛠️ 推荐工具
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {nodeDetail.tools.map(t => (
                          <Tag key={t} theme="primary" variant="light" style={{ fontSize: 13, fontWeight: 500 }}>
                            {t}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* 底部操作 */}
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Button
              variant="outline"
              size="large"
              onClick={() => { setShowMap(false); setNodeDetail(null); }}
              style={{
                borderRadius: 12,
                borderColor: majorInfo.color,
                color: majorInfo.color,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              🔄 换一个专业
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
