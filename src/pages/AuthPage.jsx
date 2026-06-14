import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Input, Button, Tabs, Select, Form, Radio, MessagePlugin } from 'tdesign-react';
import { CheckCircleIcon, UserIcon, LockOnIcon, MailIcon, CalendarIcon } from 'tdesign-icons-react';

const { FormItem } = Form;
const { TabPanel } = Tabs;

const MAJOR_OPTIONS = [
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

const DIRECTION_OPTIONS = [
  { label: '技术研发', value: 'tech' },
  { label: '产品经理', value: 'pm' },
  { label: '数据分析', value: 'data' },
  { label: '内容运营', value: 'operation' },
  { label: '游戏策划', value: 'game' },
  { label: '设计体验', value: 'design' },
  { label: '还不确定', value: 'unknown' },
];

// 生成年份选项
const currentYear = new Date().getFullYear();
const yearOptions = [];
for (let y = currentYear; y >= currentYear - 40; y--) {
  yearOptions.push({ label: `${y}年`, value: y });
}

const monthOptions = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}月`, value: i + 1 }));
const dayOptions = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}日`, value: i + 1 }));

const DEGREE_OPTIONS = [
  { label: '🎓 本科生', value: 'bachelor' },
  { label: '📚 硕士研究生', value: 'master' },
  { label: '🔬 博士研究生', value: 'doctor' },
];

// 学历经历选项：涵盖大学以来的所有学历层次
const EDUCATION_HISTORY_OPTIONS = [
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

// 入学年份范围：本科生约8年，硕士约5年，博士约8年（取最大范围）
const enrollmentYearOptions = [];
for (let y = currentYear; y >= currentYear - 12; y--) {
  enrollmentYearOptions.push({ label: `${y}年入学`, value: y });
}

export default function AuthPage({ onLogin, embedded = false }) {
  const { user, register, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  // ===== 登录表单 =====
  const [loginForm] = Form.useForm();
  const [loginLoading, setLoginLoading] = useState(false);

  // ===== 注册表单 =====
  const [registerForm] = Form.useForm();
  const [registerLoading, setRegisterLoading] = useState(false);

  // 如果用户已登录，显示个人信息面板
  if (user && !embedded) {
    return <LoggedInPanel user={user} onLogout={logout} />;
  }

  const handleLogin = (e) => {
    if (e.validateResult !== true) return;
    setLoginLoading(true);
    const values = loginForm.getFieldsValue(true);
    setTimeout(() => {
      const result = login({ username: values.username, password: values.password });
      setLoginLoading(false);
      if (result.success) {
        MessagePlugin.success(`欢迎回来，${result.user.username}！🐧`);
        onLogin && onLogin(result.user);
      } else {
        MessagePlugin.error(result.error);
      }
    }, 600);
  };

  const handleRegister = (e) => {
    if (e.validateResult !== true) return;
    setRegisterLoading(true);
    const values = registerForm.getFieldsValue(true);
    setTimeout(() => {
      const result = register({
        username: values.username,
        password: values.password,
        birthYear: values.birthYear,
        birthMonth: values.birthMonth,
        birthDay: values.birthDay,
        enrollmentYear: values.enrollmentYear,
        degreeType: values.degreeType || 'bachelor',
        educationHistory: values.educationHistory || '',
        major: values.major,
        targetDirection: values.direction,
        email: values.email,
      });
      setRegisterLoading(false);
      if (result.success) {
        MessagePlugin.success('注册成功！欢迎加入e职伴 🐧');
        onLogin && onLogin(result.user);
      } else {
        MessagePlugin.error(result.error);
      }
    }, 600);
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      padding: embedded ? 0 : '40px 20px',
    }}>
      {!embedded && (
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🐧</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }} className="gradient-text">
            e职伴 GrowthMate
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            陪你从校园拿到心仪Offer
          </p>
        </div>
      )}

      <Card bordered style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          style={{ padding: '0 8px' }}
        >
          <TabPanel value="login" label="🔑 登录">
            <div style={{ padding: '16px 8px' }}>
              <Form form={loginForm} layout="vertical" onSubmit={handleLogin} labelAlign="top">
                <FormItem label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                  <Input
                    prefixIcon={<UserIcon />}
                    placeholder="请输入用户名"
                    size="large"
                  />
                </FormItem>
                <FormItem label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                  <Input
                    prefixIcon={<LockOnIcon />}
                    type="password"
                    placeholder="请输入密码"
                    size="large"
                  />
                </FormItem>
                <Button
                  theme="primary"
                  block
                  size="large"
                  onClick={() => loginForm.submit()}
                  loading={loginLoading}
                  style={{ height: 48, fontSize: 16, fontWeight: 600, marginTop: 8 }}
                >
                  🐧 登录e职伴
                </Button>
              </Form>
              <div style={{
                textAlign: 'center',
                marginTop: 16,
                fontSize: 13,
                color: 'var(--text-muted)',
              }}>
                还没有账号？
                <span
                  onClick={() => setActiveTab('register')}
                  style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, marginLeft: 4 }}
                >
                  立即注册
                </span>
              </div>
            </div>
          </TabPanel>

          <TabPanel value="register" label="✨ 注册">
            <div style={{ padding: '16px 8px' }}>
              <Form form={registerForm} layout="vertical" onSubmit={handleRegister} labelAlign="top">
                <FormItem label="用户名" name="username" rules={[
                  { required: true, message: '请输入用户名' },
                  { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,16}$/, message: '2-16位字母/数字/中文/下划线' },
                ]}>
                  <Input prefixIcon={<UserIcon />} placeholder="2-16位，支持中英文" size="large" />
                </FormItem>

                <FormItem label="密码" name="password" rules={[
                  { required: true, message: '请设置密码' },
                  { min: 6, message: '密码至少6位' },
                ]}>
                  <Input prefixIcon={<LockOnIcon />} type="password" placeholder="至少6位密码" size="large" />
                </FormItem>

                <FormItem label="邮箱（选填）" name="email">
                  <Input prefixIcon={<MailIcon />} placeholder="用于找回密码" size="large" />
                </FormItem>

                {/* ===== 学历类型选择 ===== */}
                <div style={{
                  background: '#fef9c3',
                  borderRadius: 12,
                  padding: '14px 16px',
                  marginBottom: 16,
                  border: '1px solid #fde047',
                }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#a16207', marginBottom: 10 }}>
                    🎓 你的学历类型
                  </p>
                  <Radio.Group
                    defaultValue="bachelor"
                    onChange={(v) => registerForm.setFieldsValue({ degreeType: v })}
                  >
                    {DEGREE_OPTIONS.map(opt => (
                      <Radio key={opt.value} value={opt.value} style={{ marginBottom: 8 }}>
                        {opt.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                    💡 选对学历类型，系统才能正确计算你的年级
                  </p>
                </div>

                {/* ===== 学历经历选择 ===== */}
                <div style={{
                  background: '#ede9fe',
                  borderRadius: 12,
                  padding: '14px 16px',
                  marginBottom: 16,
                  border: '1px solid #c4b5fd',
                }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#6d28d9', marginBottom: 10 }}>
                    📜 你的学历经历（涵盖大学以来所有经历）
                  </p>
                  <Select
                    options={EDUCATION_HISTORY_OPTIONS}
                    placeholder="选择你当前所处的学历阶段"
                    size="large"
                    onChange={(v) => registerForm.setFieldsValue({ educationHistory: v })}
                  />
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                    💡 涵盖大学以来的学历阶段，帮助我们更精准地了解你的背景
                  </p>
                </div>

                <div style={{
                  background: '#f0f9ff',
                  borderRadius: 12,
                  padding: '14px 16px',
                  marginBottom: 16,
                  border: '1px solid #bae6fd',
                }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0369a1', marginBottom: 10 }}>
                    🎂 出生日期（用于自动计算年龄）
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Select
                      options={yearOptions}
                      placeholder="年"
                      style={{ flex: 1 }}
                      onChange={(v) => registerForm.setFieldsValue({ birthYear: v })}
                    />
                    <Select
                      options={monthOptions}
                      placeholder="月"
                      style={{ flex: 1 }}
                      onChange={(v) => registerForm.setFieldsValue({ birthMonth: v })}
                    />
                    <Select
                      options={dayOptions}
                      placeholder="日"
                      style={{ flex: 1 }}
                      onChange={(v) => registerForm.setFieldsValue({ birthDay: v })}
                    />
                  </div>
                </div>

                <div style={{
                  background: '#f0fdf4',
                  borderRadius: 12,
                  padding: '14px 16px',
                  marginBottom: 16,
                  border: '1px solid #bbf7d0',
                }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 10 }}>
                    🎓 入学年份（用于自动更新年级）
                  </p>
                  <Select
                    options={enrollmentYearOptions}
                    placeholder="选择你当前学历的入学年份"
                    size="large"
                    onChange={(v) => registerForm.setFieldsValue({ enrollmentYear: v })}
                  />
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                    💡 系统会根据学历类型 + 当前时间自动更新年级，无需手动修改
                  </p>
                </div>

                <FormItem label="专业（选填）" name="major">
                  <Select options={MAJOR_OPTIONS} placeholder="选择你的专业" size="large" />
                </FormItem>

                <FormItem label="目标岗位方向（选填）" name="direction">
                  <Select options={DIRECTION_OPTIONS} placeholder="感兴趣的方向" size="large" />
                </FormItem>

                <Button
                  theme="primary"
                  block
                  size="large"
                  onClick={() => registerForm.submit()}
                  loading={registerLoading}
                  style={{ height: 48, fontSize: 16, fontWeight: 600, marginTop: 8 }}
                >
                  🐧 注册并加入e职伴
                </Button>
              </Form>
              <div style={{
                textAlign: 'center',
                marginTop: 16,
                fontSize: 13,
                color: 'var(--text-muted)',
              }}>
                已有账号？
                <span
                  onClick={() => setActiveTab('login')}
                  style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, marginLeft: 4 }}
                >
                  去登录
                </span>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </Card>
    </div>
  );
}

// ========== 已登录面板 ==========
function LoggedInPanel({ user, onLogout }) {
  const { refreshUserInfo } = useAuth();
  const [refreshedUser, setRefreshedUser] = useState(user);

  useEffect(() => {
    const updated = refreshUserInfo(user);
    if (updated) setRefreshedUser(updated);
  }, []);

  const gradeLabel = refreshedUser.grade || '未设置';
  const ageLabel = refreshedUser.age ? `${refreshedUser.age}岁` : '未设置';
  const degreeMap = { bachelor: '🎓 本科', master: '📚 硕士', doctor: '🔬 博士' };
  const degreeLabel = degreeMap[refreshedUser.degreeType] || '🎓 本科';
  const educationHistoryMap = {
    bachelor_in: '🎓 本科在读', bachelor_out: '🎓 本科毕业',
    master_in: '📚 硕士在读', master_out: '📚 硕士毕业',
    doctor_in: '🔬 博士在读', doctor_out: '🔬 博士毕业',
    associate_in: '📖 专科在读', associate_out: '📖 专科毕业',
    high_school: '🏫 高中毕业',
  };
  const educationHistoryLabel = educationHistoryMap[refreshedUser.educationHistory] || '';

  const majorMap = { cs: '计算机/软件工程', media: '新闻传播/中文', marketing: '市场营销/工商管理', design: '设计类', finance: '金融/经济', medical: '医学/生物', law: '法学', architecture: '城市规划/建筑', other: '其他专业' };
  const dirMap = { tech: '技术研发', pm: '产品经理', data: '数据分析', operation: '内容运营', game: '游戏策划', design: '设计体验', unknown: '待探索' };

  const createdAt = refreshedUser.createdAt ? new Date(refreshedUser.createdAt).toLocaleDateString('zh-CN') : '未知';

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px' }}>
      <Card bordered style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        {/* 头像区域 */}
        <div style={{
          background: 'linear-gradient(135deg, #0052d9 0%, #8b5cf6 100%)',
          padding: '32px 24px',
          textAlign: 'center',
          color: '#fff',
        }}>
          <div style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: 'rgba(255,255,255,.2)',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
          }}>
            🐧
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{refreshedUser.username}</h2>
          <p style={{ fontSize: 13, opacity: 0.85 }}>e职伴会员 · {createdAt} 加入</p>
        </div>

        {/* 信息卡片 */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 20,
          }}>
            <InfoItem icon="🎂" label="年龄" value={ageLabel} bg="#eff6ff" />
            <InfoItem icon="🎓" label="学历" value={degreeLabel} bg="#f0fdf4" />
            <InfoItem icon="📅" label="年级" value={gradeLabel} bg="#d1fae5" />
            <InfoItem icon="📚" label="专业" value={majorMap[refreshedUser.major] || refreshedUser.major || '未设置'} bg="#fef3c7" />
            <InfoItem icon="🎯" label="方向" value={dirMap[refreshedUser.targetDirection] || refreshedUser.targetDirection || '未设置'} bg="#ede9fe" />
            <InfoItem icon="📜" label="学历经历" value={educationHistoryLabel || '未设置'} bg="#f0f9ff" />
            <InfoItem icon="💙" label="最近心情" value={refreshedUser.recentMood?.mood || '暂无记录'} bg="#fce7f3" />
          </div>

          {/* 数据统计 */}
          <div style={{
            background: '#f8fafc',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>📊 成长数据</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <StatItem label="诊断次数" value={(refreshedUser.diagnosisHistory || []).length} />
              <StatItem label="聊天会话" value={(refreshedUser.chatHistory || []).length} />
              <StatItem label="技能训练" value={(refreshedUser.skillProgress || []).length} />
              <StatItem label="项目实践" value={(refreshedUser.projectHistory || []).length} />
              <StatItem label="求职准备" value={(refreshedUser.jobPrepHistory || []).length} />
              <StatItem label="加入天数" value={Math.max(1, Math.floor((Date.now() - new Date(refreshedUser.createdAt)) / 86400000))} />
            </div>
          </div>

          {/* 年级更新提示 */}
          {refreshedUser.enrollmentYear && (
            <div style={{
              background: '#d1fae5',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 16,
              border: '1px solid #a7f3d0',
              fontSize: 13,
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span>🔄</span>
              <span>
                年级已自动更新为 <strong>{gradeLabel}</strong>（入学年份：{refreshedUser.enrollmentYear}年）
              </span>
            </div>
          )}

          <Button
            block
            variant="outline"
            onClick={onLogout}
            style={{
              height: 44,
              fontSize: 15,
              fontWeight: 600,
              color: '#ef4444',
              borderColor: '#fecaca',
            }}
          >
            🚪 退出登录
          </Button>
        </div>
      </Card>
    </div>
  );
}

function InfoItem({ icon, label, value, bg }) {
  return (
    <div style={{
      background: bg,
      borderRadius: 10,
      padding: '10px 14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{value}</div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}
