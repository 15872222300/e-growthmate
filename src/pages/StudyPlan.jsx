import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag, Button, Dialog, InputNumber, DatePicker, MessagePlugin, Popconfirm, Progress, Steps } from 'tdesign-react';
import { DeleteIcon, AddIcon, CalendarIcon, TimeIcon, CheckCircleIcon } from 'tdesign-icons-react';
import { useAuth } from '../context/AuthContext';

const { StepItem } = Steps;

const LEVEL_CONFIG = {
  '入门': { color: '#10b981', bg: '#d1fae5' },
  '进阶': { color: '#f59e0b', bg: '#fef3c7' },
  '高阶': { color: '#ef4444', bg: '#fee2e2' },
};

const PHASE_COLORS = ['#0052d9', '#7c3aed', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

// 根据课程时长解析天数
function parseDuration(duration) {
  if (!duration) return 30;
  const match = duration.match(/(\d+)/);
  if (!match) return 30;
  const num = parseInt(match[1]);
  if (duration.includes('周')) return num * 7;
  if (duration.includes('个月') || duration.includes('月')) return num * 30;
  if (duration.includes('天')) return num;
  return num;
}

// 根据总天数和课程列表生成详细计划
function generatePlan(courses, totalDays) {
  if (!courses || courses.length === 0) return [];

  const totalDuration = courses.reduce((sum, c) => sum + parseDuration(c.duration), 0);
  if (totalDuration === 0) return [];

  const scale = totalDays / totalDuration;

  let currentDay = 0;
  const phases = [];

  courses.forEach((course, idx) => {
    const courseDays = Math.max(7, Math.round(parseDuration(course.duration) * scale));
    const startDay = currentDay + 1;
    const endDay = currentDay + courseDays;

    // 拆分里程碑
    const milestones = [];
    const numMilestones = Math.max(2, Math.min(4, Math.floor(courseDays / 10)));

    for (let i = 1; i <= numMilestones; i++) {
      const day = Math.round(currentDay + (courseDays * i) / (numMilestones + 1));
      const pct = Math.round((i / numMilestones) * 100);
      milestones.push({
        day,
        title: i === numMilestones ? `完成《${course.title}》全部学习` : `《${course.title}》学习进度 ${pct}%`,
      });
    }

    phases.push({
      courseTitle: course.title,
      level: course.level,
      platform: course.platform,
      desc: course.desc,
      duration: course.duration,
      startDay,
      endDay,
      courseDays,
      color: PHASE_COLORS[idx % PHASE_COLORS.length],
      milestones,
    });

    currentDay = endDay;
  });

  return phases;
}

export default function StudyPlan() {
  const { user, getStudyPlans, saveStudyPlan, deleteStudyPlan } = useAuth();
  const navigate = useNavigate();
  const plans = getStudyPlans();

  const [planDialog, setPlanDialog] = useState(null); // 当前打开的plan
  const [planDays, setPlanDays] = useState(90);
  const [startDate, setStartDate] = useState('');
  const [planGenerated, setPlanGenerated] = useState(false);

  // 所有已保存的学习计划
  const allPlans = useMemo(() => plans || [], [plans]);

  const handleOpenPlan = (plan) => {
    setPlanDialog(plan);
    setPlanDays(90);
    setStartDate('');
    setPlanGenerated(false);
  };

  const handleGeneratePlan = () => {
    if (!planDays || planDays < 7) {
      MessagePlugin.warning('学习天数至少为7天哦');
      return;
    }
    if (!startDate) {
      MessagePlugin.warning('请选择开始日期');
      return;
    }
    setPlanGenerated(true);
  };

  const handleSavePlan = () => {
    if (!planDialog || !planGenerated) return;

    const phases = generatePlan(planDialog.courses, planDays);
    const updatedPlan = {
      ...planDialog,
      planDays,
      startDate,
      phases,
      planSaved: true,
    };
    saveStudyPlan(updatedPlan);
    MessagePlugin.success('详细学习计划已保存！');
    setPlanDialog(null);
    setPlanGenerated(false);
  };

  const handleDeletePlan = (planId) => {
    deleteStudyPlan(planId);
    MessagePlugin.success('学习计划已删除');
  };

  // 当前打开的plan的已生成阶段
  const generatedPhases = useMemo(() => {
    if (!planDialog || !planGenerated) return [];
    return generatePlan(planDialog.courses, planDays);
  }, [planDialog, planDays, planGenerated]);

  // 已保存的详细计划
  const savedPhases = planDialog?.phases || [];

  const displayPhases = savedPhases.length > 0 ? savedPhases : generatedPhases;

  // 计算总进度
  const totalCoursesCount = allPlans.reduce((sum, p) => sum + (p.courses?.length || 0), 0);
  const savedWithDetail = allPlans.filter(p => p.planSaved).length;

  // 日期格式化
  const formatDate = (dateStr, offsetDays = 0) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    d.setDate(d.getDate() + offsetDays);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  // 计算周进度——根据phases拆分为每周要求
  const getWeeklyBreakdown = (plan) => {
    if (!plan.phases || !plan.startDate) return [];
    const startDate = new Date(plan.startDate);
    const weeklyMap = {};

    plan.phases.forEach(phase => {
      const phaseStart = new Date(startDate);
      phaseStart.setDate(phaseStart.getDate() + phase.startDay - 1);
      const phaseEnd = new Date(startDate);
      phaseEnd.setDate(phaseEnd.getDate() + phase.endDay - 1);

      // 获取这个phase的周编号
      const daysFromStart = Math.floor((phaseStart - startDate) / (1000 * 60 * 60 * 24));
      const startWeek = Math.floor(daysFromStart / 7) + 1;
      const endDaysFromStart = Math.floor((phaseEnd - startDate) / (1000 * 60 * 60 * 24));
      const endWeek = Math.floor(endDaysFromStart / 7) + 1;

      for (let w = startWeek; w <= endWeek; w++) {
        if (!weeklyMap[w]) {
          weeklyMap[w] = { weekNum: w, tasks: [], totalDays: 0 };
        }
        // 计算该课程在本周的占比天数
        const weekStartDay = (w - 1) * 7;
        const weekEndDay = w * 7 - 1;
        const overlapStart = Math.max(phase.startDay - 1, weekStartDay);
        const overlapEnd = Math.min(phase.endDay - 1, weekEndDay);
        const overlapDays = Math.max(0, overlapEnd - overlapStart + 1);

        weeklyMap[w].tasks.push({
          courseTitle: phase.courseTitle,
          level: phase.level,
          platform: phase.platform,
          color: phase.color,
          daysThisWeek: overlapDays,
        });
        weeklyMap[w].totalDays += overlapDays;
      }
    });

    // 转为数组并排序
    return Object.values(weeklyMap).sort((a, b) => a.weekNum - b.weekNum);
  };

  // 找到第一个有详细计划的plan用于展示周进度
  const activePlan = allPlans.find(p => p.planSaved && p.phases?.length > 0);
  const weeklyBreakdown = activePlan ? getWeeklyBreakdown(activePlan) : [];
  const totalWeeks = weeklyBreakdown.length;
  const currentWeekNum = activePlan?.startDate
    ? Math.max(1, Math.min(totalWeeks, Math.floor((new Date() - new Date(activePlan.startDate)) / (1000 * 60 * 60 * 24 * 7)) + 1))
    : 1;

  return (
    <div className="page-container">
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title">📋 我的学习计划</h1>
        <p className="section-subtitle">
          {allPlans.length > 0
            ? `已制定 ${allPlans.length} 个学习计划，共 ${totalCoursesCount} 门课程`
            : '去「职业探索」页面选择感兴趣的课程，来这里制定专属学习计划'}
        </p>
      </div>

      {allPlans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>📭</div>
          <h3 style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 12 }}>还没有学习计划</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
            去职业探索页面浏览感兴趣的方向，选择课程并保存为学习计划
          </p>
          <Button theme="primary" onClick={() => navigate('/career-map')} style={{ borderRadius: 10 }}>
            🗺️ 去职业探索选课
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {allPlans.map(plan => {
            const courseCount = plan.courses?.length || 0;
            const hasDetail = !!plan.planSaved;
            return (
              <div
                key={plan.id}
                className="glass-card"
                style={{
                  padding: 24,
                  borderLeft: `4px solid ${plan.careerColor || '#0052d9'}`,
                }}
              >
                {/* 计划头部 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: '#f0f4ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22,
                    }}>
                      {plan.careerIcon || '📚'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
                        {plan.careerTitle} · 学习计划
                      </h3>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                        {courseCount} 门课程
                        {hasDetail && plan.planDays && (
                          <span style={{ marginLeft: 8 }}>
                            · 计划 {plan.planDays} 天学完
                          </span>
                        )}
                        {hasDetail && plan.startDate && (
                          <span style={{ marginLeft: 8 }}>
                            · 开始于 {formatDate(plan.startDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => handleOpenPlan(plan)}
                      style={{ borderRadius: 8 }}
                    >
                      {hasDetail ? '📝 查看/调整计划' : '📋 制定学习计划'}
                    </Button>
                    <Popconfirm
                      content="确定要删除这个学习计划吗？"
                      onConfirm={() => handleDeletePlan(plan.id)}
                    >
                      <Button
                        size="small"
                        variant="text"
                        theme="danger"
                        icon={<DeleteIcon />}
                        style={{ borderRadius: 8 }}
                      />
                    </Popconfirm>
                  </div>
                </div>

                {/* 已生成计划的时间线预览 */}
                {hasDetail && plan.phases && plan.phases.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10,
                    }}>
                      ⏱ 学习时间线
                    </div>
                    <div style={{ position: 'relative', paddingLeft: 20 }}>
                      <div style={{
                        position: 'absolute', left: 7, top: 8, bottom: 8, width: 2,
                        background: 'linear-gradient(to bottom, #0052d9, #8b5cf6, #10b981)',
                        borderRadius: 1,
                      }} />
                      {plan.phases.map((phase, idx) => (
                        <div key={idx} style={{ marginBottom: 10, position: 'relative' }}>
                          <div style={{
                            position: 'absolute', left: -17, top: 4,
                            width: 10, height: 10, borderRadius: '50%',
                            background: phase.color || PHASE_COLORS[idx % PHASE_COLORS.length],
                            border: '2px solid #fff',
                            boxShadow: '0 0 0 2px ' + (phase.color || PHASE_COLORS[idx % PHASE_COLORS.length]),
                          }} />
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {formatDate(plan.startDate, phase.startDay - 1)} — {formatDate(plan.startDate, phase.endDay - 1)}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                            {phase.courseTitle}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 课程列表 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {plan.courses?.map((course, idx) => {
                    const levelCfg = LEVEL_CONFIG[course.level] || LEVEL_CONFIG['入门'];
                    return (
                      <div key={idx} style={{
                        padding: '6px 14px',
                        background: '#f8fafc',
                        borderRadius: 20,
                        border: '1px solid var(--border)',
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}>
                        <span>{course.title}</span>
                        <span style={{
                          fontSize: 10,
                          padding: '1px 6px',
                          borderRadius: 10,
                          background: levelCfg.bg,
                          color: levelCfg.color,
                          fontWeight: 600,
                        }}>
                          {course.level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========== 周进度条 ========== */}
      {activePlan && weeklyBreakdown.length > 0 && (
        <div className="glass-card" style={{ padding: 24, marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
              📅 每周学习进度
            </h3>
            <Tag style={{ background: '#f0ebff', color: '#7c3aed', border: 'none', fontWeight: 600 }}>
              {activePlan.careerTitle} · 共{totalWeeks}周
            </Tag>
          </div>

          {/* 总进度条 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {formatDate(activePlan.startDate)}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
                第{currentWeekNum}/{totalWeeks}周
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {formatDate(activePlan.startDate, activePlan.planDays - 1)}
              </span>
            </div>
            <Progress
              percentage={Math.round((currentWeekNum / totalWeeks) * 100)}
              strokeWidth={10}
              color="#7c3aed"
              trackColor="#f1f5f9"
              label={
                <span style={{ fontSize: 12 }}>
                  {currentWeekNum > totalWeeks ? '已完成' : `${Math.round((currentWeekNum / totalWeeks) * 100)}%`}
                </span>
              }
            />
          </div>

          {/* 每周详情 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {weeklyBreakdown.map((week) => {
              const weekStartDate = new Date(activePlan.startDate);
              weekStartDate.setDate(weekStartDate.getDate() + (week.weekNum - 1) * 7);
              const weekEndDate = new Date(weekStartDate);
              weekEndDate.setDate(weekEndDate.getDate() + 6);
              const isCurrentWeek = week.weekNum === currentWeekNum;
              const isPast = week.weekNum < currentWeekNum;

              return (
                <div
                  key={week.weekNum}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 12,
                    border: isCurrentWeek ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                    background: isCurrentWeek ? '#f5f3ff' : isPast ? '#f8fafc' : '#fff',
                    opacity: isPast ? 0.7 : 1,
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: isCurrentWeek ? '#7c3aed' : isPast ? '#d1fae5' : '#e2e8f0',
                      color: isCurrentWeek ? '#fff' : isPast ? '#065f46' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {isPast ? '✓' : week.weekNum}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        第{week.weekNum}周
                        {isCurrentWeek && (
                          <span style={{
                            fontSize: 11, fontWeight: 600, color: '#7c3aed',
                            marginLeft: 8, padding: '1px 8px', background: '#ede9fe',
                            borderRadius: 10,
                          }}>
                            本周
                          </span>
                        )}
                        {isPast && (
                          <span style={{
                            fontSize: 11, fontWeight: 600, color: '#065f46',
                            marginLeft: 8, padding: '1px 8px', background: '#d1fae5',
                            borderRadius: 10,
                          }}>
                            已过
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {formatDate(activePlan.startDate, (week.weekNum - 1) * 7)} — {formatDate(activePlan.startDate, Math.min(week.weekNum * 7 - 1, activePlan.planDays - 1))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {week.totalDays}天
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {week.tasks.length}门课
                      </div>
                    </div>
                  </div>

                  {/* 每周课程要求 */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 42 }}>
                    {week.tasks.map((task, ti) => {
                      const levelCfg = LEVEL_CONFIG[task.level] || LEVEL_CONFIG['入门'];
                      return (
                        <div
                          key={ti}
                          style={{
                            padding: '5px 12px',
                            borderRadius: 16,
                            background: '#fff',
                            border: `1px solid ${task.color || '#d1d5db'}33`,
                            fontSize: 12,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: task.color || '#d1d5db',
                            flexShrink: 0,
                          }} />
                          <span style={{ fontWeight: 500 }}>{task.courseTitle}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                            {task.daysThisWeek}天
                          </span>
                          <span style={{
                            fontSize: 10,
                            padding: '1px 5px',
                            borderRadius: 8,
                            background: levelCfg.bg,
                            color: levelCfg.color,
                            fontWeight: 600,
                          }}>
                            {task.level}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 周进度微条 */}
                  <div style={{ marginTop: 10, paddingLeft: 42 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 7 }).map((_, di) => {
                        const dayNum = (week.weekNum - 1) * 7 + di + 1;
                        const hasCourse = week.tasks.some(t => {
                          const phase = activePlan.phases.find(p => p.courseTitle === t.courseTitle);
                          if (!phase) return false;
                          return dayNum >= phase.startDay && dayNum <= phase.endDay;
                        });
                        const elapsedDays = Math.floor((new Date() - new Date(activePlan.startDate)) / (1000 * 60 * 60 * 24));
                        const dayInPast = dayNum <= elapsedDays + 1;

                        // 找到对应课程的颜色
                        let courseColor = '#7c3aed';
                        if (hasCourse) {
                          const matchedPhase = activePlan.phases.find(p => dayNum >= p.startDay && dayNum <= p.endDay);
                          if (matchedPhase) courseColor = matchedPhase.color || '#7c3aed';
                        }

                        return (
                          <div
                            key={di}
                            title={`第${dayNum}天${hasCourse ? ' · 有学习任务' : ''}`}
                            style={{
                              flex: 1, height: 6, borderRadius: 2,
                              background: hasCourse
                                ? (dayInPast ? courseColor : '#d1d5db')
                                : '#f1f5f9',
                              opacity: hasCourse ? 1 : 0.4,
                            }}
                          />
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                      <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>一</span>
                      <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>三</span>
                      <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>五</span>
                      <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>日</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 制定计划 Dialog */}
      {planDialog && (
        <Dialog
          visible={!!planDialog}
          onClose={() => { setPlanDialog(null); setPlanGenerated(false); }}
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{planDialog.careerIcon}</span>
              <span style={{ fontSize: 17, fontWeight: 700 }}>{planDialog.careerTitle} · 制定学习计划</span>
            </div>
          }
          width={680}
          footer={
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => { setPlanDialog(null); setPlanGenerated(false); }}>
                取消
              </Button>
              {!planGenerated ? (
                <Button theme="primary" onClick={handleGeneratePlan}>
                  🪄 生成学习计划
                </Button>
              ) : (
                <Button theme="primary" onClick={handleSavePlan}>
                  💾 保存计划
                </Button>
              )}
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* 课程概览 */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                📚 已选课程（{planDialog.courses?.length || 0} 门）
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {planDialog.courses?.map((course, idx) => {
                  const levelCfg = LEVEL_CONFIG[course.level] || LEVEL_CONFIG['入门'];
                  return (
                    <div key={idx} style={{
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{course.title}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>
                          🏫 {course.platform}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <Tag size="small" style={{ background: levelCfg.bg, color: levelCfg.color, border: 'none' }}>
                          {course.level}
                        </Tag>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱ {course.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 计划设置 */}
            {!planGenerated && (
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%)',
                borderRadius: 14,
                border: '1px solid #e0e7ff',
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
                  ⚙️ 设定学习节奏
                </h4>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      计划多久学完？
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <InputNumber
                        value={planDays}
                        onChange={setPlanDays}
                        min={7}
                        max={365}
                        step={7}
                        style={{ width: 120 }}
                        suffix="天"
                        theme="normal"
                      />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        （建议{planDialog.courses?.reduce((sum, c) => sum + parseDuration(c.duration), 0) || 30}天以上）
                      </span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      从哪天开始？
                    </div>
                    <DatePicker
                      value={startDate}
                      onChange={setStartDate}
                      style={{ width: 180 }}
                      placeholder="选择开始日期"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 生成的详细计划 */}
            {planGenerated && displayPhases.length > 0 && (
              <div>
                <div style={{
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                  borderRadius: 12,
                  border: '1px solid #bbf7d0',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#166534' }}>
                      📅 {formatDate(startDate)} — {formatDate(startDate, planDays - 1)}
                    </div>
                    <div style={{ fontSize: 13, color: '#15803d', marginTop: 2 }}>
                      共 {planDays} 天 · {displayPhases.length} 个阶段
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 14px',
                    background: '#dcfce7',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#166534',
                  }}>
                    已生成详细计划
                  </div>
                </div>

                {/* 阶段时间线 */}
                <Steps layout="vertical" current={-1}>
                  {displayPhases.map((phase, idx) => (
                    <StepItem
                      key={idx}
                      title={
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>
                              {phase.courseTitle}
                            </span>
                            <Tag size="small" style={{
                              background: LEVEL_CONFIG[phase.level]?.bg || '#d1fae5',
                              color: LEVEL_CONFIG[phase.level]?.color || '#10b981',
                              border: 'none',
                              fontSize: 11,
                            }}>
                              {phase.level}
                            </Tag>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                              ⏱ {phase.courseDays}天
                            </span>
                          </div>
                        </div>
                      }
                      content={
                        <div>
                          <div style={{
                            fontSize: 12,
                            color: 'var(--text-muted)',
                            marginBottom: 6,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}>
                            <CalendarIcon size="14px" />
                            {formatDate(startDate, phase.startDay - 1)} — {formatDate(startDate, phase.endDay - 1)}
                            <span style={{ margin: '0 4px', color: '#d1d5db' }}>|</span>
                            🏫 {phase.platform}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                            {phase.desc}
                          </div>
                          {phase.milestones && (
                            <div style={{ paddingLeft: 12, borderLeft: '2px solid #e5e7eb' }}>
                              {phase.milestones.map((ms, mi) => (
                                <div key={mi} style={{
                                  fontSize: 12,
                                  color: 'var(--text-muted)',
                                  padding: '3px 0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                }}>
                                  <span style={{
                                    display: 'inline-block',
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: phase.color || PHASE_COLORS[idx % PHASE_COLORS.length],
                                  }} />
                                  第{ms.day}天 · {ms.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      }
                    />
                  ))}
                </Steps>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
}
