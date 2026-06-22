import React from 'react';

/**
 * 人物形象系统
 * 根据专业、年级、性别生成不同可爱手绘风格的人物形象
 * 
 * 专业影响：服装颜色和配饰
 * 年级影响：身高/成熟度
 * 性别影响：发型和面部特征
 */

// 专业色系映射
const MAJOR_COLORS = {
  cs: { primary: '#A8C8E8', secondary: '#7BA3CC', accent: '#5A7A9A', name: '计算机' },
  media: { primary: '#F5E6C8', secondary: '#D4C08A', accent: '#8B6914', name: '新闻传播' },
  marketing: { primary: '#B8A9C9', secondary: '#9B8AB5', accent: '#7A6B8A', name: '市场营销' },
  design: { primary: '#E8927C', secondary: '#D07060', accent: '#B05848', name: '设计' },
  finance: { primary: '#8CB89F', secondary: '#6A9A7E', accent: '#4A7A5E', name: '金融' },
  medical: { primary: '#A8C8E8', secondary: '#88B0D8', accent: '#6898B8', name: '医学' },
  law: { primary: '#D4C08A', secondary: '#B8A060', accent: '#8B6914', name: '法学' },
  architecture: { primary: '#E8C46A', secondary: '#D4A84A', accent: '#B08830', name: '建筑' },
  other: { primary: '#F5E6C8', secondary: '#D4C08A', accent: '#8B6914', name: '通用' },
};

// 年级对应的人物大小/风格
const GRADE_STYLES = {
  freshman: { scale: 0.85, vibe: '青涩新人', hat: null },
  sophomore: { scale: 0.88, vibe: '成长探索', hat: null },
  junior: { scale: 0.92, vibe: '蓄力冲刺', hat: null },
  senior: { scale: 0.95, vibe: '自信登场', hat: '🎓' },
  senior5: { scale: 0.95, vibe: '自信登场', hat: '🎓' },
  master1: { scale: 0.97, vibe: '深耕专业', hat: '🎓' },
  master2: { scale: 0.97, vibe: '深耕专业', hat: '🎓' },
  master3: { scale: 0.97, vibe: '深耕专业', hat: '🎓' },
  doctor1: { scale: 1.0, vibe: '学术专家', hat: '🎓' },
  doctor2: { scale: 1.0, vibe: '学术专家', hat: '🎓' },
  doctor3: { scale: 1.0, vibe: '学术专家', hat: '🎓' },
  doctor4: { scale: 1.0, vibe: '学术专家', hat: '🎓' },
  doctor5: { scale: 1.0, vibe: '学术专家', hat: '🎓' },
  doctor6: { scale: 1.0, vibe: '学术专家', hat: '🎓' },
};

// 各专业的专属配饰
const MAJOR_ACCESSORIES = {
  cs: '💻',
  media: '📝',
  marketing: '📊',
  design: '🎨',
  finance: '💼',
  medical: '🔬',
  law: '⚖️',
  architecture: '📐',
  other: '📚',
};

// ============ 可爱的SVG人物组件 ============

function MaleCharacter({ colors, scale, hat }) {
  const s = scale || 1;
  return (
    <svg viewBox="0 0 200 260" width={180 * s} height={234 * s} style={{ display: 'block' }}>
      {/* 身体 */}
      <ellipse cx="100" cy="220" rx="48" ry="30" fill={colors.primary} stroke={colors.accent} strokeWidth="2.5" />
      {/* 上衣 */}
      <rect x="62" y="165" width="76" height="60" rx="16" fill={colors.primary} stroke={colors.accent} strokeWidth="2.5" />
      {/* 领口 */}
      <path d="M82 170 Q100 185 118 170" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
      {/* 左臂 */}
      <path d="M64 180 Q48 195 52 215" fill="none" stroke={colors.accent} strokeWidth="8" strokeLinecap="round" />
      {/* 右臂 */}
      <path d="M136 180 Q152 195 148 215" fill="none" stroke={colors.accent} strokeWidth="8" strokeLinecap="round" />
      {/* 左手 */}
      <circle cx="52" cy="218" r="9" fill="#FFDBB5" stroke={colors.accent} strokeWidth="2" />
      {/* 右手 */}
      <circle cx="148" cy="218" r="9" fill="#FFDBB5" stroke={colors.accent} strokeWidth="2" />
      {/* 腿 */}
      <rect x="74" y="230" width="22" height="26" rx="8" fill="#8B7648" stroke={colors.accent} strokeWidth="2" />
      <rect x="104" y="230" width="22" height="26" rx="8" fill="#8B7648" stroke={colors.accent} strokeWidth="2" />
      {/* 鞋子 */}
      <ellipse cx="85" cy="258" rx="14" ry="7" fill="#C4A55A" stroke={colors.accent} strokeWidth="2" />
      <ellipse cx="115" cy="258" rx="14" ry="7" fill="#C4A55A" stroke={colors.accent} strokeWidth="2" />
      {/* 头部 */}
      <circle cx="100" cy="120" r="42" fill="#FFDBB5" stroke={colors.accent} strokeWidth="2.5" />
      {/* 头发 — 男生短发 */}
      <path d="M58 120 Q58 80 100 78 Q142 80 142 120" fill="#5C3A1E" stroke={colors.accent} strokeWidth="2" />
      <path d="M58 120 Q62 95 80 85" fill="none" stroke="#5C3A1E" strokeWidth="8" strokeLinecap="round" />
      <path d="M142 120 Q138 95 120 85" fill="none" stroke="#5C3A1E" strokeWidth="8" strokeLinecap="round" />
      {/* 刘海 */}
      <path d="M72 88 Q80 80 100 78 Q120 80 128 88" fill="#5C3A1E" stroke={colors.accent} strokeWidth="1.5" />
      {/* 眼睛 */}
      <ellipse cx="84" cy="118" rx="6" ry="7" fill="#FFFFFF" stroke={colors.accent} strokeWidth="1.5" />
      <ellipse cx="116" cy="118" rx="6" ry="7" fill="#FFFFFF" stroke={colors.accent} strokeWidth="1.5" />
      <circle cx="86" cy="118" r="3.5" fill="#3A2A10" />
      <circle cx="118" cy="118" r="3.5" fill="#3A2A10" />
      {/* 高光 */}
      <circle cx="88" cy="115" r="1.5" fill="#FFFFFF" />
      <circle cx="120" cy="115" r="1.5" fill="#FFFFFF" />
      {/* 腮红 */}
      <ellipse cx="74" cy="128" rx="8" ry="5" fill={colors.primary} opacity="0.3" />
      <ellipse cx="126" cy="128" rx="8" ry="5" fill={colors.primary} opacity="0.3" />
      {/* 微笑 */}
      <path d="M90 132 Q100 142 110 132" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
      {/* 耳朵 */}
      <ellipse cx="56" cy="118" rx="8" ry="10" fill="#FFDBB5" stroke={colors.accent} strokeWidth="1.5" />
      <ellipse cx="144" cy="118" rx="8" ry="10" fill="#FFDBB5" stroke={colors.accent} strokeWidth="1.5" />
      {/* 帽子（毕业生） */}
      {hat && (
        <g>
          <rect x="75" y="70" width="50" height="6" rx="2" fill={colors.accent} />
          <polygon points="88,76 112,76 100,95" fill={colors.accent} />
          <line x1="112" y1="76" x2="125" y2="65" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="127" cy="63" r="3" fill="#E8C46A" />
        </g>
      )}
    </svg>
  );
}

function FemaleCharacter({ colors, scale, hat }) {
  const s = scale || 1;
  return (
    <svg viewBox="0 0 200 260" width={180 * s} height={234 * s} style={{ display: 'block' }}>
      {/* 身体 */}
      <ellipse cx="100" cy="220" rx="46" ry="28" fill={colors.primary} stroke={colors.accent} strokeWidth="2.5" />
      {/* 上衣/裙子 */}
      <path d="M62 165 Q60 175 56 225 Q80 240 100 242 Q120 240 144 225 Q140 175 138 165 Z" fill={colors.primary} stroke={colors.accent} strokeWidth="2.5" />
      {/* 领口 */}
      <path d="M84 170 Q100 182 116 170" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
      {/* 左臂 */}
      <path d="M64 180 Q48 195 52 215" fill="none" stroke={colors.accent} strokeWidth="7" strokeLinecap="round" />
      {/* 右臂 */}
      <path d="M136 180 Q152 195 148 215" fill="none" stroke={colors.accent} strokeWidth="7" strokeLinecap="round" />
      {/* 左手 */}
      <circle cx="52" cy="218" r="8" fill="#FFDBB5" stroke={colors.accent} strokeWidth="2" />
      {/* 右手 */}
      <circle cx="148" cy="218" r="8" fill="#FFDBB5" stroke={colors.accent} strokeWidth="2" />
      {/* 腿 */}
      <rect x="74" y="230" width="20" height="26" rx="8" fill="#FFDBB5" stroke={colors.accent} strokeWidth="1.5" />
      <rect x="106" y="230" width="20" height="26" rx="8" fill="#FFDBB5" stroke={colors.accent} strokeWidth="1.5" />
      {/* 鞋子 */}
      <ellipse cx="84" cy="258" rx="13" ry="6" fill="#E8927C" stroke={colors.accent} strokeWidth="2" />
      <ellipse cx="116" cy="258" rx="13" ry="6" fill="#E8927C" stroke={colors.accent} strokeWidth="2" />
      {/* 头部 */}
      <circle cx="100" cy="120" r="40" fill="#FFDBB5" stroke={colors.accent} strokeWidth="2.5" />
      {/* 头发 — 女生中长发 */}
      <path d="M60 120 Q58 80 100 76 Q142 80 140 120" fill="#3A2A10" stroke={colors.accent} strokeWidth="2" />
      <path d="M60 120 Q58 140 62 155 Q68 165 72 170" fill="#3A2A10" stroke={colors.accent} strokeWidth="2" />
      <path d="M140 120 Q142 140 138 155 Q132 165 128 170" fill="#3A2A10" stroke={colors.accent} strokeWidth="2" />
      {/* 刘海 */}
      <path d="M68 85 Q80 78 100 76 Q120 78 132 85" fill="#3A2A10" stroke={colors.accent} strokeWidth="1.5" />
      <path d="M72 90 Q88 85 100 85" fill="none" stroke="#4A3A20" strokeWidth="3" strokeLinecap="round" />
      {/* 发饰 */}
      <circle cx="135" cy="95" r="5" fill="#E8927C" stroke={colors.accent} strokeWidth="1.5" />
      {/* 眼睛 */}
      <ellipse cx="85" cy="118" rx="6" ry="7.5" fill="#FFFFFF" stroke={colors.accent} strokeWidth="1.5" />
      <ellipse cx="115" cy="118" rx="6" ry="7.5" fill="#FFFFFF" stroke={colors.accent} strokeWidth="1.5" />
      <circle cx="87" cy="118" r="3.5" fill="#3A2A10" />
      <circle cx="117" cy="118" r="3.5" fill="#3A2A10" />
      {/* 睫毛 */}
      <path d="M79 112 Q82 110 85 112" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M109 112 Q112 110 115 112" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" />
      {/* 高光 */}
      <circle cx="89" cy="115" r="1.5" fill="#FFFFFF" />
      <circle cx="119" cy="115" r="1.5" fill="#FFFFFF" />
      {/* 腮红 */}
      <ellipse cx="72" cy="128" rx="9" ry="5" fill="#E8927C" opacity="0.3" />
      <ellipse cx="128" cy="128" rx="9" ry="5" fill="#E8927C" opacity="0.3" />
      {/* 微笑 */}
      <path d="M92 133 Q100 142 108 133" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
      {/* 耳朵 */}
      <ellipse cx="58" cy="118" rx="7" ry="9" fill="#FFDBB5" stroke={colors.accent} strokeWidth="1.5" />
      <ellipse cx="142" cy="118" rx="7" ry="9" fill="#FFDBB5" stroke={colors.accent} strokeWidth="1.5" />
      {/* 帽子（毕业生） */}
      {hat && (
        <g>
          <rect x="75" y="68" width="50" height="6" rx="2" fill={colors.accent} />
          <polygon points="88,74 112,74 100,93" fill={colors.accent} />
          <line x1="112" y1="74" x2="125" y2="63" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="127" cy="61" r="3" fill="#E8C46A" />
        </g>
      )}
    </svg>
  );
}

/**
 * 主组件：根据用户画像生成人物形象
 * @param {Object} profile - 用户画像数据
 * @param {string} profile.major - 专业ID
 * @param {string} profile.grade - 年级
 * @param {string} profile.gender - 性别 'male' | 'female'
 * @param {number} size - 尺寸（px）
 * @param {boolean} showName - 是否显示名称
 */
export default function CharacterAvatar({ profile = {}, size = 180, showName = true, className = '' }) {
  const majorId = profile?.major || 'other';
  const grade = profile?.grade || 'freshman';
  const gender = profile?.gender || 'male';

  const colors = MAJOR_COLORS[majorId] || MAJOR_COLORS.other;
  const gradeStyle = GRADE_STYLES[grade] || GRADE_STYLES.freshman;
  const accessory = MAJOR_ACCESSORIES[majorId] || '📚';

  const Character = gender === 'female' ? FemaleCharacter : MaleCharacter;

  return (
    <div 
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        animation: 'bounceIn 0.5s ease-out',
      }}
    >
      {/* 人物形象 */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--border-color)',
        padding: '12px 16px 4px',
        boxShadow: 'var(--shadow)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          top: 8, right: 8,
          fontSize: 20,
          opacity: 0.3,
        }}>
          {accessory}
        </div>
        <div style={{
          position: 'absolute',
          bottom: 8, left: 8,
          fontSize: 14,
          opacity: 0.2,
        }}>
          ✨
        </div>
        
        <Character colors={colors} scale={gradeStyle.scale} hat={gradeStyle.hat} />
      </div>
      
      {showName && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 2,
          }}>
            {profile?.name || '小鹅同学'}
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            background: 'var(--brand-yellow-light)',
            padding: '2px 10px',
            borderRadius: '50px',
            border: '1px solid var(--border-color)',
            display: 'inline-block',
          }}>
            {gradeStyle.vibe}
          </div>
        </div>
      )}
    </div>
  );
}

// 导出工具函数
export { MAJOR_COLORS, GRADE_STYLES, MAJOR_ACCESSORIES };
