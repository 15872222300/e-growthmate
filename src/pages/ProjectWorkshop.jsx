import React, { useState } from 'react';
import { Card, Dialog, Button, Tag, Steps, MessagePlugin } from 'tdesign-react';
import { projectTemplates } from '../data/mockData';

const { StepItem } = Steps;

export default function ProjectWorkshop() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="page-container">
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title">🔧 项目实践工坊</h1>
        <p className="section-subtitle">根据你的专业和目标岗位，完成可写入简历的实战项目，让经历更有说服力</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {projectTemplates.map((proj, i) => (
          <Card key={proj.id} bordered style={{
            borderRadius: 'var(--radius-lg)',
            animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both`,
            cursor: 'pointer',
          }}
            onClick={() => setSelected(proj)}
          >
            <div style={{ padding: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>{proj.icon}</div>
                <div>
                  <Tag size="small" variant="light" theme="primary">{proj.direction}</Tag>
                </div>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{proj.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                🎯 {proj.goal}
              </p>
              <div style={{
                padding: '8px 14px',
                background: 'var(--bg)',
                borderRadius: 8,
                fontSize: 13,
                color: 'var(--primary)',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                查看项目详情 →
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Project Detail Dialog */}
      <Dialog
        visible={!!selected}
        onClose={() => setSelected(null)}
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>{selected?.icon}</span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>{selected?.title}</span>
          </div>
        }
        width={640}
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setSelected(null)}>关闭</Button>
            <Button theme="primary" onClick={() => { MessagePlugin.success('项目已加入你的成长计划！'); setSelected(null); }}>
              🚀 开始这个项目
            </Button>
          </div>
        }
      >
        {selected && (
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>🎯 项目目标</div>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{selected.goal}</p>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>📋 完成步骤</div>
              <Steps layout="vertical" current={-1}>
                {selected.steps.map((s, i) => (
                  <StepItem key={i} title={s} />
                ))}
              </Steps>
            </div>

            <div style={{
              padding: '14px 16px',
              background: '#f0fdf4',
              borderRadius: 10,
              border: '1px solid #bbf7d0',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#10b981', marginBottom: 4 }}>📦 产出物</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selected.output}</div>
            </div>

            <div style={{
              padding: '14px 16px',
              background: '#eff6ff',
              borderRadius: 10,
              border: '1px solid #bfdbfe',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>💼 可写入简历的表达方式</div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text)' }}>{selected.resume}</p>
              <Button
                size="small"
                variant="text"
                theme="primary"
                style={{ marginTop: 8 }}
                onClick={() => {
                  navigator.clipboard.writeText(selected.resume);
                  MessagePlugin.success('已复制到剪贴板');
                }}
              >
                📋 复制简历表达
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
