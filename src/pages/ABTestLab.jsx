import React, { useState } from 'react';
import { Card, Tag, Progress, Drawer, Button } from 'tdesign-react';

const abTestData = {
  headline: {
    title: '首页文案 A/B 测试',
    description: '测试不同首页文案对学生吸引力的影响，帮助确定最能传达产品价值的表述。',
    variantA: { text: 'AI 求职成长陪伴平台', subtitle: '功能导向 · 理性表达', impressions: 1560, clicks: 187, ctr: '12.0%' },
    variantB: { text: '陪你从校园走向职场', subtitle: '情感导向 · 共鸣表达', impressions: 1542, clicks: 248, ctr: '16.1%' },
    conclusion: 'B 版本"陪你从校园走向职场"点击率高出 34%，情感化表达更能打动学生用户，建议作为正式首页文案。',
    recommendation: '建议在首页同时保留 A 版本的功能定位说明，作为 B 版本下方的小字副标题，兼顾情感共鸣与功能传达。',
    preference: { a: 38, b: 62 },
  },
  button: {
    title: '按钮文案 A/B 测试',
    description: '测试不同 CTA 按钮文案对用户行动意愿的影响，找到最能激发学生开启成长诊断的表达。',
    variantA: { text: '开始我的成长诊断', subtitle: '任务导向 · 诊断感强', impressions: 2480, clicks: 312, ctr: '12.6%' },
    variantB: { text: '立即开启求职陪伴', subtitle: '陪伴导向 · 即时感强', impressions: 2504, clicks: 435, ctr: '17.4%' },
    conclusion: 'B 版本"立即开启求职陪伴"点击率高出 38%，"陪伴"比"诊断"更能降低学生的心理压力，建议正式采用 B 版本。',
    recommendation: '可在按钮下方增加一行小字"AI 帮你诊断成长短板"，让用户在点击时明确知道接下来会得到什么。',
    preference: { a: 31, b: 69 },
  },
  emotion: {
    title: '情绪陪伴入口 A/B 测试',
    description: '测试不同入口文案对情绪陪伴功能使用率的影响，帮助降低学生表达压力的心理门槛。',
    variantA: { text: '情绪陪伴室', subtitle: '功能命名 · 中性表达', impressions: 1980, clicks: 218, ctr: '11.0%' },
    variantB: { text: '我想聊聊压力', subtitle: '场景化 · 共情表达', impressions: 1965, clicks: 351, ctr: '17.9%' },
    conclusion: 'B 版本"我想聊聊压力"点击率高出 63%，第一人称场景化表达大幅降低学生寻求帮助的心理门槛。',
    recommendation: '建议采用 B 版本作为主要入口文案，同时在进入后展示温馨的情绪陪伴室环境，形成"低门槛进入 + 深度体验"的组合策略。',
    preference: { a: 27, b: 73 },
  },
};

function BarChart({ valueA, valueB, labelA, labelB, colorA = '#4A86E8', colorB = '#FFD149' }) {
  const total = valueA + valueB;
  const pctA = total > 0 ? Math.round((valueA / total) * 100) : 50;
  const pctB = 100 - pctA;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#777777' }}>
        <span>{labelA}</span>
        <span style={{ fontWeight: 600, color: '#333333' }}>{pctA}%</span>
      </div>
      <div style={{ height: 24, background: '#F5F5F5', borderRadius: 4, overflow: 'hidden', marginBottom: 10, border: '1px solid #E0E0E0' }}>
        <div style={{
          height: '100%', width: `${pctA}%`, background: colorA,
          borderRadius: 3, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: pctA > 12 ? 10 : 0,
        }}>
          <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{pctA > 10 ? `${pctA}%` : ''}</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, color: '#777777' }}>
        <span>{labelB}</span>
        <span style={{ fontWeight: 600, color: '#333333' }}>{pctB}%</span>
      </div>
      <div style={{ height: 24, background: '#F5F5F5', borderRadius: 4, overflow: 'hidden', border: '1px solid #E0E0E0' }}>
        <div style={{
          height: '100%', width: `${pctB}%`, background: colorB,
          borderRadius: 3, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: pctB > 12 ? 10 : 0,
        }}>
          <span style={{ fontSize: 12, color: '#333333', fontWeight: 600 }}>{pctB > 10 ? `${pctB}%` : ''}</span>
        </div>
      </div>
    </div>
  );
}

function VariantCard({ variant, isWinner, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 220, padding: 20, borderRadius: 8,
      background: isWinner ? `${color}08` : '#FFFFFF',
      border: `2px solid ${isWinner ? color : '#222222'}`,
      position: 'relative', transition: 'all 0.3s',
    }}>
      {isWinner && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '2px 10px', borderRadius: 6,
          border: '1px solid #222222', background: '#FFFFFF',
          fontSize: 12, fontWeight: 600, color: '#333333',
        }}>
          🏆 胜出方案
        </div>
      )}
      <div style={{ fontSize: 18, fontWeight: 700, color: '#333333', marginBottom: 6, paddingRight: isWinner ? 80 : 0 }}>
        「{variant.text}」
      </div>
      <div style={{ fontSize: 13, color: '#777777', marginBottom: 16 }}>
        {variant.subtitle}
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#333333' }}>{variant.impressions.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: '#777777' }}>曝光人数</div>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#333333' }}>{variant.clicks.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: '#777777' }}>点击人数</div>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: isWinner ? color : '#333333' }}>{variant.ctr}</div>
          <div style={{ fontSize: 12, color: '#777777' }}>点击率</div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, valueA, valueB, highlight }) {
  return (
    <tr style={{ borderBottom: '1px solid #E0E0E0' }}>
      <td style={{ padding: '12px 16px', fontSize: 14, color: '#333333', fontWeight: 500 }}>{label}</td>
      <td style={{ padding: '12px 16px', fontSize: 14, color: highlight === 'b' ? '#FFD149' : '#777777', fontWeight: highlight === 'b' ? 700 : 400 }}>
        {valueA}
      </td>
      <td style={{ padding: '12px 16px', fontSize: 14, color: highlight === 'b' ? '#FFD149' : '#777777', fontWeight: highlight === 'b' ? 700 : 400 }}>
        {valueB}
        {highlight === 'b' && <span style={{ marginLeft: 6, fontSize: 12 }}>▲</span>}
      </td>
    </tr>
  );
}

function DataTable({ variantA, variantB, winnerB }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, border: '1px solid #E0E0E0', borderRadius: 8 }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #222222', background: '#FAFAFA' }}>
          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#777777', fontWeight: 500 }}>指标</th>
          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#777777', fontWeight: 500 }}>
            A 版本<div style={{ fontSize: 11, color: '#777777', fontWeight: 400, marginTop: 2 }}>{variantA.text}</div>
          </th>
          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#777777', fontWeight: 500 }}>
            B 版本<div style={{ fontSize: 11, color: '#777777', fontWeight: 400, marginTop: 2 }}>{variantB.text}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <MetricRow label="曝光人数" valueA={variantA.impressions.toLocaleString()} valueB={variantB.impressions.toLocaleString()} />
        <MetricRow label="点击人数" valueA={variantA.clicks.toLocaleString()} valueB={variantB.clicks.toLocaleString()} highlight={winnerB ? 'b' : ''} />
        <MetricRow label="点击率 (CTR)" valueA={variantA.ctr} valueB={variantB.ctr} highlight={winnerB ? 'b' : ''} />
      </tbody>
    </table>
  );
}

function TestSection({ data }) {
  const [showDetail, setShowDetail] = useState(false);
  const winnerB = parseFloat(data.variantB.ctr) > parseFloat(data.variantA.ctr);
  const improvement = Math.round(((parseFloat(data.variantB.ctr) - parseFloat(data.variantA.ctr)) / parseFloat(data.variantA.ctr)) * 100);

  return (
    <div className="glass-card animate-fade-in-up" style={{ padding: 28, marginBottom: 28 }}>
      {/* 标题区 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#333333', margin: 0 }}>{data.title}</h2>
        <div style={{ padding: '2px 10px', borderRadius: 6, border: '1px solid #222222', fontSize: 12, fontWeight: 600, color: '#777777' }}>
          A/B 测试
        </div>
        {winnerB && (
          <div style={{ padding: '2px 10px', borderRadius: 6, border: '1px solid #FFD149', fontSize: 12, fontWeight: 600, color: '#B8860B' }}>
            B 版本胜出 · 提升 {improvement}%
          </div>
        )}
      </div>
      <p style={{ fontSize: 14, color: '#777777', margin: '0 0 20px 0', lineHeight: 1.6 }}>
        {data.description}
      </p>

      {/* 两版卡片 */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <VariantCard variant={data.variantA} isWinner={!winnerB} color="#4A86E8" />
        <VariantCard variant={data.variantB} isWinner={winnerB} color="#FFD149" />
      </div>

      {/* 数据表格 */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333333', marginBottom: 4 }}>📊 实验数据对比</h3>
        <DataTable variantA={data.variantA} variantB={data.variantB} winnerB={winnerB} />
      </div>

      {/* 用户偏好柱状图 */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333333', marginBottom: 12 }}>📈 用户偏好分布</h3>
        <div style={{ maxWidth: 480 }}>
          <BarChart
            valueA={data.preference.a}
            valueB={data.preference.b}
            labelA={`A 版本 · ${data.preference.a}%`}
            labelB={`B 版本 · ${data.preference.b}%`}
          />
        </div>
      </div>

      {/* 结论 & 建议 */}
      <div style={{
        background: '#FAFAFA',
        borderRadius: 8, padding: 20, marginBottom: 12,
        border: '1px solid #E0E0E0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333333', margin: 0 }}>实验结论</h3>
        </div>
        <p style={{ fontSize: 14, color: '#333333', margin: 0, lineHeight: 1.8 }}>{data.conclusion}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontSize: 16, color: '#FFD149', marginTop: 2 }}>🔧</span>
        <Button
          variant="text"
          size="small"
          onClick={() => setShowDetail(true)}
          style={{ padding: 0, fontSize: 14, fontWeight: 500, color: '#FFD149' }}
        >
          查看后续优化建议 →
        </Button>
      </div>

      <Drawer
        visible={showDetail}
        onClose={() => setShowDetail(false)}
        header="🔧 后续优化建议"
        size="420px"
        footer={<Button theme="primary" onClick={() => setShowDetail(false)}>知道了</Button>}
      >
        <div style={{ padding: '0 4px' }}>
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: '#333333', margin: '0 0 8px 0' }}>📌 优化建议</h4>
            <p style={{ fontSize: 14, color: '#333333', lineHeight: 1.8, margin: 0 }}>{data.recommendation}</p>
          </div>
          <div style={{
            background: '#FAFAFA', borderRadius: 8, padding: 16,
            border: '1px solid #E0E0E0',
          }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: '#333333', margin: '0 0 8px 0' }}>🔬 下一步实验方向</h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#777777', lineHeight: 2 }}>
              <li>增加样本量至 5000+ 人，验证结论的统计显著性</li>
              <li>结合用户年级、专业维度进行细分分析</li>
              <li>测试 C 版本文案，探索更优表达</li>
              <li>正式接入真实用户行为数据，替代模拟数据</li>
            </ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default function ABTestLab() {
  return (
    <div className="page-container">
      {/* 页面标题 */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title">🧪 A/B 测试实验室</h1>
        <p className="section-subtitle">
          通过轻量级 A/B 测试，用数据驱动产品体验优化
        </p>
      </div>

      {/* Demo 阶段说明 */}
      <div style={{
        background: '#FAFAFA',
        borderRadius: 8, padding: '16px 20px', marginBottom: 28,
        display: 'flex', alignItems: 'flex-start', gap: 12,
        border: '1px solid #E0E0E0',
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>📢</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#333333', marginBottom: 4 }}>
            当前为 Demo 阶段
          </div>
          <div style={{ fontSize: 13, color: '#777777', lineHeight: 1.6 }}>
            A/B 测试采用模拟数据和小范围用户体验反馈，用于展示产品迭代思路；正式上线后可接入真实用户行为数据。
          </div>
        </div>
      </div>

      {/* 实验概览 */}
      <div className="card-grid-3" style={{ marginBottom: 28 }}>
        {[
          { icon: '🧪', label: '进行中实验', value: 3, color: '#4A86E8' },
          { icon: '👥', label: '累计参与用户', value: '7,549', color: '#FFD149' },
          { icon: '✅', label: '已完成优化', value: '2 项', color: '#4A86E8' },
        ].map((item, i) => (
          <div key={i} className="glass-card animate-fade-in-up" style={{
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 8,
              border: '1px solid #222222',
              display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#333333' }}>{item.value}</div>
              <div style={{ fontSize: 13, color: '#777777' }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 三个测试 */}
      <TestSection data={abTestData.headline} />
      <TestSection data={abTestData.button} />
      <TestSection data={abTestData.emotion} />

      {/* 底部说明 */}
      <div style={{
        textAlign: 'center', padding: '32px 0 16px',
        borderTop: '1px solid #E0E0E0', marginTop: 12,
      }}>
        <p style={{ fontSize: 13, color: '#777777', margin: 0 }}>
          🐧 鹅伴 GrowthMate · A/B 测试实验室 · Demo 演示版本
        </p>
        <p style={{ fontSize: 12, color: '#777777', margin: '8px 0 0', opacity: 0.7 }}>
          数据为模拟生成，仅用于产品迭代方法论展示
        </p>
      </div>
    </div>
  );
}
