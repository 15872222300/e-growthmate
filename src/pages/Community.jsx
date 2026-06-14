import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Textarea, Button, Tag, MessagePlugin, Space, Dialog, Image, ImageViewer, Loading, Select } from 'tdesign-react';
import { useAuth } from '../context/AuthContext';
import AuthPage from './AuthPage';

// 模拟社区预设帖子（作为种子数据）
const SEED_POSTS = [
  {
    id: 'seed1',
    author: 'e职伴小助手',
    authorGrade: '研二',
    authorDirection: '产品经理',
    category: '心得',
    title: '从零开始准备产品经理实习，我的3个月成长计划',
    content: '刚决定走产品方向的时候其实很迷茫，不知道从哪里下手。分享一下我的经验：\n\n1️⃣ 第一个月：系统学习产品基础知识，推荐《人人都是产品经理》+ 每天用1个App做产品拆解\n2️⃣ 第二个月：用Axure画3个原型，找同学做用户访谈\n3️⃣ 第三个月：把之前的拆解+原型整理成作品集，开始投递实习\n\n最重要的心得：不要等准备好了再开始，先动手做起来！\n\n大家有什么问题欢迎留言讨论～',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    likes: 28,
    comments: [
      { id: 'c1', author: '小陈同学', content: '太有用了！请问Axure自学难吗？', createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'c2', author: 'e职伴小助手', content: '不难！B站有很多免费教程，一周就能上手基础操作', createdAt: new Date(Date.now() - 80000000).toISOString() },
    ],
  },
  {
    id: 'seed2',
    author: '前端小杨',
    authorGrade: '大三',
    authorDirection: '技术研发',
    category: '疑惑',
    title: '技术岗面试总被问项目难点，但我做的都是CRUD怎么办？',
    content: '感觉自己的项目经历都太简单了，就是增删改查。面试官一问"项目中有哪些难点"就答不上来。想问问大家是怎么包装自己的项目经历的？有没有什么好的项目方向推荐？',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    likes: 35,
    comments: [
      { id: 'c3', author: '后端小刘', content: '同感！我后来发现可以在项目中加一些优化点，比如性能优化、缓存策略，这些都是可以聊的', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 'c4', author: '已上岸学长', content: '建议做一个小而全的项目，重点是把技术方案文档写好，面试时候可以展示你的思考过程', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
  },
  {
    id: 'seed3',
    author: '数据分析-阿杰',
    authorGrade: '研一',
    authorDirection: '数据分析',
    category: '进度',
    title: '【进度打卡】数据分析学习第30天，终于跑通了第一个完整项目',
    content: '今天是个里程碑！\n\n✅ 完成了Kaggle的Titanic数据集分析\n✅ 用Python + Pandas做了数据清洗\n✅ 用Matplotlib做了可视化\n✅ 写了一份分析报告\n\n下一步计划：学习SQL，然后找一个真实的数据集做分析。\n\n想问问大家，数据分析岗除了Python和SQL，还需要掌握哪些技能？',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    likes: 42,
    comments: [
      { id: 'c5', author: '数据分析师小王', content: 'Excel也很重要！还有Tableau/Power BI这类BI工具，很多公司都在用', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    ],
  },
  {
    id: 'seed4',
    author: '运营练习生',
    authorGrade: '大二',
    authorDirection: '内容运营',
    category: '心得',
    title: '大二开始运营个人小红书，3个月涨粉2000+的复盘',
    content: '之前一直觉得运营很玄学，直到自己开始做小红书才明白：\n\n📌 选题比文笔重要 — 好的选题自带流量\n📌 封面决定点击率 — 花30%时间做封面不亏\n📌 数据复盘是核心能力 — 每条笔记都要看数据\n\n虽然粉丝不多，但这个经历写进简历真的很有用！面试时候可以聊的东西多了很多。\n\n有在做自媒体的朋友吗？一起交流～',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    likes: 56,
    comments: [],
  },
];

// 初始化种子数据到 localStorage
function initSeedPosts() {
  const existing = localStorage.getItem('growthmate_forum_posts');
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem('growthmate_forum_posts', JSON.stringify(SEED_POSTS));
  }
}

const categoryOptions = [
  { label: '📊 进度打卡', value: '进度' },
  { label: '💡 心得分享', value: '心得' },
  { label: '❓ 疑惑求助', value: '疑惑' },
  { label: '🎉 上岸报喜', value: '上岸' },
  { label: '💬 闲聊交流', value: '闲聊' },
];

const categoryColors = {
  '进度': '#10b981', '心得': '#8b5cf6', '疑惑': '#f59e0b',
  '上岸': '#ef4444', '闲聊': '#6b7280',
};

export default function Community() {
  const { user, addForumPost, getForumPosts, toggleLikeForumPost, addForumComment, isPostLiked, toggleFavoritePost, isPostFavorited, getUserCommunityStats } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [commentInputs, setCommentInputs] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());

  // 新建帖子表单
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('心得');
  const [posting, setPosting] = useState(false);
  const [newImages, setNewImages] = useState([]); // 图片base64数组
  const fileInputRef = useRef(null);

  // 帖子详情
  const [detailPost, setDetailPost] = useState(null);
  const [detailCommentInput, setDetailCommentInput] = useState('');

  // 我的主页
  const [showMyPage, setShowMyPage] = useState(false);
  const [myPageTab, setMyPageTab] = useState('myPosts'); // myPosts | liked | favorited
  const [favoritedPosts, setFavoritedPosts] = useState(new Set());
  const [communityStats, setCommunityStats] = useState({ myPosts: 0, myLikes: 0, myFavorites: 0, receivedLikes: 0, receivedFavorites: 0 });

  // 最新岗位
  const [showJobs, setShowJobs] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [jobKeyword, setJobKeyword] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [jobCity, setJobCity] = useState('');
  const [jobPage, setJobPage] = useState(1);
  const [jobTotal, setJobTotal] = useState(0);
  const [jobDetail, setJobDetail] = useState(null);
  const [jobDetailLoading, setJobDetailLoading] = useState(false);

  // 加载帖子
  useEffect(() => {
    initSeedPosts();
    refreshPosts();
  }, []);

  const refreshPosts = useCallback(() => {
    const allPosts = getForumPosts();
    setPosts(allPosts);
  }, [getForumPosts]);

  // 同步点赞状态
  useEffect(() => {
    if (user) {
      const liked = new Set();
      posts.forEach(p => {
        if (isPostLiked(p.id)) liked.add(p.id);
      });
      setLikedPosts(liked);
    }
  }, [posts, user, isPostLiked]);

  // 同步收藏状态
  useEffect(() => {
    if (user) {
      const fav = new Set();
      posts.forEach(p => {
        if (isPostFavorited(p.id)) fav.add(p.id);
      });
      setFavoritedPosts(fav);
    }
  }, [posts, user, isPostFavorited]);

  // 更新社区统计
  useEffect(() => {
    if (user) {
      setCommunityStats(getUserCommunityStats());
    }
  }, [user, posts, getUserCommunityStats]);

  // 筛选和排序
  const filteredPosts = posts
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'hot') return (b.likes || 0) - (a.likes || 0);
      return 0;
    });

  // 发帖
  const handleCreatePost = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    if (!newTitle.trim()) {
      MessagePlugin.warning('请输入帖子标题');
      return;
    }
    if (!newContent.trim()) {
      MessagePlugin.warning('请输入帖子内容');
      return;
    }

    setPosting(true);
    setTimeout(() => {
      const userGrade = user.grade || '';
      const userDirection = user.targetDirection || '';
      addForumPost({
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        authorGrade: userGrade,
        authorDirection: userDirection,
        images: [...newImages],
      });
      MessagePlugin.success('发布成功！🐧');
      setNewTitle('');
      setNewContent('');
      setNewCategory('心得');
      setNewImages([]);
      setShowCreateDialog(false);
      setPosting(false);
      refreshPosts();
    }, 400);
  };

  // 图片上传处理
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (newImages.length + files.length > 9) {
      MessagePlugin.warning('最多上传9张图片');
      return;
    }
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        MessagePlugin.warning(`${file.name} 不是图片格式`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        MessagePlugin.warning(`${file.name} 超过5MB限制`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        setNewImages(prev => [...prev, evt.target.result]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // 点赞
  const handleLike = (postId) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    const updatedPosts = toggleLikeForumPost(postId);
    if (updatedPosts) {
      setPosts(updatedPosts);
      // 同步更新详情帖子
      if (detailPost && detailPost.id === postId) {
        const dp = updatedPosts.find(p => p.id === postId);
        if (dp) setDetailPost(dp);
      }
    }
  };

  // 评论
  const handleComment = (postId) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    const comment = commentInputs[postId];
    if (!comment?.trim()) {
      MessagePlugin.warning('请输入评论内容');
      return;
    }
    const updatedPosts = addForumComment(postId, comment.trim());
    if (updatedPosts) {
      setPosts(updatedPosts);
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      // 同步更新详情帖子
      if (detailPost && detailPost.id === postId) {
        const dp = updatedPosts.find(p => p.id === postId);
        if (dp) setDetailPost(dp);
      }
      MessagePlugin.success('评论成功！');
    }
  };

  // 收藏
  const handleFavorite = (postId) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    toggleFavoritePost(postId);
    // 刷新收藏状态
    setFavoritedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
    setCommunityStats(getUserCommunityStats());
  };

  // ========== 腾讯岗位API调用 ==========
  const fetchJobs = useCallback(async (keyword = '', category = '', city = '', page = 1) => {
    setJobsLoading(true);
    setJobsError('');
    try {
      const timestamp = Date.now();
      const params = new URLSearchParams({
        timestamp: String(timestamp),
        countryId: '',
        cityId: city,
        bgIds: '',
        productId: '',
        categoryId: category,
        parentCategoryId: '',
        attrId: '',
        keyword: keyword,
        pageIndex: String(page),
        pageSize: '15',
        language: 'zh-cn',
        area: 'cn',
      });
      const url = `https://careers.tencent.com/tencentcareer/api/post/Query?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) throw new Error('API请求失败');

      const data = await response.json();
      if (data.Code === 200 && data.Data) {
        const posts = (data.Data.Posts || []).map(p => ({
          id: p.PostId,
          name: p.RecruitPostName,
          location: p.LocationName,
          bg: p.BGName,
          category: p.CategoryName,
          product: p.ProductName,
          responsibility: p.Responsibility,
          requirement: p.Requirement || '',
          url: p.PostURL,
          updateTime: p.LastUpdateTime,
          workYears: p.RequireWorkYearsName,
          isValid: p.IsValid,
        }));
        setJobs(posts);
        setJobTotal(data.Data.Count || 0);
      } else {
        throw new Error('数据格式异常');
      }
    } catch (err) {
      console.error('获取岗位失败:', err);
      setJobsError('获取岗位信息失败，请稍后重试');
      // 使用模拟数据作为回退
      setJobs(getMockJobs());
      setJobTotal(getMockJobs().length);
    } finally {
      setJobsLoading(false);
    }
  }, []);

  // 获取岗位详情
  const fetchJobDetail = async (postId) => {
    setJobDetailLoading(true);
    setJobDetail(null);
    try {
      const timestamp = Date.now();
      const url = `https://careers.tencent.com/tencentcareer/api/post/ByPostId?timestamp=${timestamp}&postId=${postId}&language=zh-cn`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('API请求失败');
      const data = await response.json();
      if (data.Code === 200 && data.Data) {
        const d = data.Data;
        setJobDetail({
          id: d.PostId,
          name: d.RecruitPostName,
          location: d.LocationName,
          bg: d.BGName,
          category: d.CategoryName,
          responsibility: d.Responsibility,
          requirement: d.Requirement || '',
          url: d.PostURL,
          workYears: d.RequireWorkYearsName,
        });
      }
    } catch (err) {
      console.error('获取岗位详情失败:', err);
      setJobDetail(null);
    } finally {
      setJobDetailLoading(false);
    }
  };

  // 打开岗位窗口
  const handleOpenJobs = () => {
    setShowJobs(true);
    setJobKeyword('');
    setJobCategory('');
    setJobCity('');
    setJobPage(1);
    fetchJobs('', '', '', 1);
  };

  // 搜索岗位
  const handleJobSearch = () => {
    setJobPage(1);
    fetchJobs(jobKeyword, jobCategory, jobCity, 1);
  };

  // 翻页
  const handleJobPageChange = (newPage) => {
    setJobPage(newPage);
    fetchJobs(jobKeyword, jobCategory, jobCity, newPage);
  };

  // 详情页评论
  const handleDetailComment = (postId) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    if (!detailCommentInput?.trim()) {
      MessagePlugin.warning('请输入评论内容');
      return;
    }
    const updatedPosts = addForumComment(postId, detailCommentInput.trim());
    if (updatedPosts) {
      setPosts(updatedPosts);
      setDetailCommentInput('');
      const dp = updatedPosts.find(p => p.id === postId);
      if (dp) setDetailPost(dp);
      MessagePlugin.success('评论成功！');
    }
  };

  // 格式化时间
  const formatTime = (isoString) => {
    const now = new Date();
    const date = new Date(isoString);
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const dirMap = { tech: '技术研发', pm: '产品经理', data: '数据分析', operation: '内容运营', game: '游戏策划', design: '设计体验' };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 16px' }}>
      {/* 页面标题 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 className="section-title" style={{ marginBottom: 4 }}>💬 成长社区</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>分享进度、交流心得、互相答疑，你不是一个人在成长</p>
        </div>
        <Space size={8}>
          <Button
            variant="outline"
            size="large"
            onClick={handleOpenJobs}
            style={{
              height: 44, fontSize: 15, fontWeight: 600, borderRadius: 12,
              borderColor: '#10b981', color: '#059669',
            }}
          >
            💼 最新岗位
          </Button>
          {user && (
            <Button
              variant="outline"
              size="large"
              onClick={() => {
                setCommunityStats(getUserCommunityStats());
                setShowMyPage(true);
              }}
              style={{
                height: 44, fontSize: 15, fontWeight: 600, borderRadius: 12,
                borderColor: '#8b5cf6', color: '#7c3aed',
              }}
            >
              👤 我的主页
            </Button>
          )}
          <Button
            theme="primary"
            size="large"
            onClick={() => {
              if (!user) { setShowAuthDialog(true); return; }
              setShowCreateDialog(true);
            }}
            style={{
              height: 44, fontSize: 15, fontWeight: 600, borderRadius: 12,
              background: 'linear-gradient(135deg, #0052d9, #7c3aed)',
            }}
          >
            ✍️ 发布帖子
          </Button>
        </Space>
      </div>

      {/* 分类筛选 + 排序 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, flexWrap: 'wrap', gap: 10,
      }}>
        <Space size={8}>
          <Tag
            style={{ cursor: 'pointer', padding: '4px 14px', fontSize: 13, fontWeight: activeCategory === 'all' ? 700 : 500 }}
            theme={activeCategory === 'all' ? 'primary' : 'default'}
            variant={activeCategory === 'all' ? 'dark' : 'light'}
            onClick={() => setActiveCategory('all')}
          >
            全部
          </Tag>
          {categoryOptions.map(cat => (
            <Tag
              key={cat.value}
              style={{ cursor: 'pointer', padding: '4px 14px', fontSize: 13, fontWeight: activeCategory === cat.value ? 700 : 500 }}
              theme={activeCategory === cat.value ? 'primary' : 'default'}
              variant={activeCategory === cat.value ? 'dark' : 'light'}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </Tag>
          ))}
        </Space>
        <Space size={8}>
          <Tag
            style={{ cursor: 'pointer', fontSize: 12 }}
            theme={sortBy === 'latest' ? 'primary' : 'default'}
            variant="light"
            onClick={() => setSortBy('latest')}
          >
            🕐 最新
          </Tag>
          <Tag
            style={{ cursor: 'pointer', fontSize: 12 }}
            theme={sortBy === 'hot' ? 'primary' : 'default'}
            variant="light"
            onClick={() => setSortBy('hot')}
          >
            🔥 最热
          </Tag>
        </Space>
      </div>

      {/* 帖子列表 */}
      {filteredPosts.length === 0 ? (
        <Card bordered style={{ borderRadius: 'var(--radius-lg)', textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>该分类下暂无帖子，快来发布第一篇吧！</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              likedPosts={likedPosts}
              favoritedPosts={favoritedPosts}
              commentInputs={commentInputs}
              setCommentInputs={setCommentInputs}
              onLike={handleLike}
              onFavorite={handleFavorite}
              onComment={handleComment}
              formatTime={formatTime}
              dirMap={dirMap}
              categoryColors={categoryColors}
              user={user}
              onRequireAuth={() => setShowAuthDialog(true)}
              onOpenDetail={() => setDetailPost(post)}
            />
          ))}
        </div>
      )}

      {/* 发布帖子弹窗 */}
      <Dialog
        visible={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        header={<span style={{ fontSize: 18, fontWeight: 700 }}>✍️ 发布新帖子</span>}
        footer={
          <Space>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
            <Button theme="primary" onClick={handleCreatePost} loading={posting}>发布</Button>
          </Space>
        }
        width={600}
        destroyOnClose
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>选择分类</div>
            <Space size={8}>
              {categoryOptions.map(cat => (
                <Tag
                  key={cat.value}
                  style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 13 }}
                  theme={newCategory === cat.value ? 'primary' : 'default'}
                  variant={newCategory === cat.value ? 'dark' : 'light'}
                  onClick={() => setNewCategory(cat.value)}
                >
                  {cat.label}
                </Tag>
              ))}
            </Space>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>帖子标题</div>
            <Input
              value={newTitle}
              onChange={setNewTitle}
              placeholder="写一个吸引人的标题..."
              maxlength={80}
              size="large"
            />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>帖子内容</div>
            <Textarea
              value={newContent}
              onChange={setNewContent}
              placeholder="分享你的进度、心得或疑惑..."
              maxlength={2000}
              autosize={{ minRows: 5, maxRows: 10 }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {newContent.length}/2000
            </div>
          </div>
          {/* 图片上传 */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
              📷 添加图片 <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>（选填，最多9张）</span>
            </div>
            {newImages.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {newImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: 80, height: 80 }}>
                    <img
                      src={img}
                      alt={`upload-${idx}`}
                      style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 20, height: 20, borderRadius: '50%',
                        background: '#ef4444', color: '#fff', border: 'none',
                        fontSize: 12, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <Button
              variant="outline"
              icon={<span>📁</span>}
              onClick={() => fileInputRef.current?.click()}
              disabled={newImages.length >= 9}
            >
              选择图片
            </Button>
          </div>
        </div>
      </Dialog>

      {/* 帖子详情弹窗 */}
      {detailPost && (
        <Dialog
          visible={!!detailPost}
          onClose={() => setDetailPost(null)}
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0052d9, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: '#fff',
              }}>
                {detailPost.author === 'e职伴小助手' ? '🐧' : '👤'}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{detailPost.author}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatTime(detailPost.createdAt)}</div>
              </div>
            </div>
          }
          width={680}
          footer={null}
        >
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 标签 */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {detailPost.category && (
                <Tag size="small" style={{ background: (categoryColors[detailPost.category] || '#6b7280') + '15', color: categoryColors[detailPost.category] || '#6b7280' }}>
                  {detailPost.category}
                </Tag>
              )}
              {detailPost.authorGrade && <Tag size="small" variant="light" theme="primary">{detailPost.authorGrade}</Tag>}
              {detailPost.authorDirection && (
                <Tag size="small" variant="light" theme="success">{dirMap[detailPost.authorDirection] || detailPost.authorDirection}</Tag>
              )}
            </div>

            {/* 标题 */}
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, margin: 0 }}>
              {detailPost.title}
            </h2>

            {/* 内容 */}
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.9, whiteSpace: 'pre-wrap', margin: 0 }}>
              {detailPost.content}
            </p>

            {/* 图片 */}
            {detailPost.images && detailPost.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                {detailPost.images.map((img, idx) => (
                  <ImageViewer
                    key={idx}
                    trigger={({ open }) => (
                      <img
                        src={img}
                        alt={`post-img-${idx}`}
                        onClick={open}
                        style={{
                          width: '100%', borderRadius: 12, cursor: 'pointer',
                          maxHeight: 240, objectFit: 'cover',
                        }}
                      />
                    )}
                    images={detailPost.images}
                    defaultIndex={idx}
                  />
                ))}
              </div>
            )}

            {/* 互动栏 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => handleLike(detailPost.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '8px 16px', borderRadius: 8,
                  border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                  background: likedPosts.has(detailPost.id) ? '#fee2e2' : 'var(--bg)',
                  color: likedPosts.has(detailPost.id) ? '#ef4444' : 'var(--text-muted)',
                }}
              >
                {likedPosts.has(detailPost.id) ? '❤️' : '🤍'} {detailPost.likes || 0} 赞
              </button>
              <button
                type="button"
                onClick={() => handleFavorite(detailPost.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '8px 16px', borderRadius: 8,
                  border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                  background: favoritedPosts.has(detailPost.id) ? '#fef3c7' : 'var(--bg)',
                  color: favoritedPosts.has(detailPost.id) ? '#f59e0b' : 'var(--text-muted)',
                }}
              >
                {favoritedPosts.has(detailPost.id) ? '⭐' : '☆'} 收藏
              </button>
              <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
                💬 {(detailPost.comments || []).length} 条评论
              </span>
            </div>

            {/* 评论区 */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
                评论 ({(detailPost.comments || []).length})
              </h4>
              {(detailPost.comments || []).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {detailPost.comments.map(comment => (
                    <div key={comment.id} style={{
                      padding: '12px 14px',
                      background: 'var(--bg)',
                      borderRadius: 10,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{comment.author}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatTime(comment.createdAt)}</span>
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                  暂无评论，快来发表第一条评论吧～
                </p>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <Input
                  value={detailCommentInput}
                  onChange={setDetailCommentInput}
                  placeholder={user ? '写下你的评论...' : '登录后参与评论'}
                  size="medium"
                  style={{ flex: 1 }}
                  onEnter={() => handleDetailComment(detailPost.id)}
                />
                <Button
                  theme="primary"
                  size="medium"
                  onClick={() => handleDetailComment(detailPost.id)}
                  style={{ fontWeight: 600 }}
                >
                  发送
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* 我的主页弹窗 */}
      {showMyPage && user && (
        <Dialog
          visible={showMyPage}
          onClose={() => setShowMyPage(false)}
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0052d9, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: '#fff',
              }}>🐧</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>👤 {user.username} 的主页</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {user.grade || ''} {user.major || ''}
                </div>
              </div>
            </div>
          }
          width={700}
          footer={null}
          destroyOnClose
        >
          <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* 统计数据卡片 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              <StatBox icon="📝" label="我的帖子" value={communityStats.myPosts} color="#0052d9" bg="#eff6ff" />
              <StatBox icon="❤️" label="获得赞" value={communityStats.receivedLikes} color="#ef4444" bg="#fee2e2" />
              <StatBox icon="⭐" label="获得收藏" value={communityStats.receivedFavorites} color="#f59e0b" bg="#fef3c7" />
              <StatBox icon="👍" label="我点赞" value={communityStats.myLikes} color="#10b981" bg="#d1fae5" />
              <StatBox icon="📌" label="我收藏" value={communityStats.myFavorites} color="#7c3aed" bg="#ede9fe" />
            </div>

            {/* Tab切换 */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border)' }}>
              {[
                { key: 'myPosts', label: '📝 我的帖子' },
                { key: 'liked', label: '❤️ 我点赞的' },
                { key: 'favorited', label: '⭐ 我收藏的' },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setMyPageTab(tab.key)}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: 14,
                    fontWeight: myPageTab === tab.key ? 700 : 500,
                    color: myPageTab === tab.key ? '#7c3aed' : 'var(--text-muted)',
                    borderBottom: myPageTab === tab.key ? '3px solid #7c3aed' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: -2,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 内容区 */}
            <MyPageContent
              tab={myPageTab}
              user={user}
              posts={posts}
              likedPosts={likedPosts}
              favoritedPosts={favoritedPosts}
              onLike={handleLike}
              onFavorite={handleFavorite}
              formatTime={formatTime}
              dirMap={dirMap}
              categoryColors={categoryColors}
              onOpenDetail={(post) => { setDetailPost(post); }}
              onRequireAuth={() => setShowAuthDialog(true)}
            />
          </div>
        </Dialog>
      )}

      {/* 最新岗位弹窗 */}
      {showJobs && (
        <Dialog
          visible={showJobs}
          onClose={() => { setShowJobs(false); setJobDetail(null); }}
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>💼</span>
              <span style={{ fontSize: 18, fontWeight: 700 }}>腾讯最新在招岗位</span>
              {jobTotal > 0 && (
                <Tag theme="primary" variant="light" size="small">共 {jobTotal} 个岗位</Tag>
              )}
            </div>
          }
          width={900}
          footer={null}
          destroyOnClose
        >
          <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 搜索栏 */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Input
                value={jobKeyword}
                onChange={setJobKeyword}
                placeholder="搜索岗位名称（如：后端、AI、产品）"
                style={{ flex: 1, minWidth: 180 }}
                onEnter={handleJobSearch}
              />
              <Select
                value={jobCategory}
                onChange={setJobCategory}
                options={jobCategoryOptions}
                placeholder="岗位类别"
                style={{ width: 130 }}
              />
              <Select
                value={jobCity}
                onChange={setJobCity}
                options={jobCityOptions}
                placeholder="工作城市"
                style={{ width: 120 }}
              />
              <Button theme="primary" onClick={handleJobSearch} style={{ fontWeight: 600, borderRadius: 8 }}>
                🔍 搜索
              </Button>
            </div>

            {/* 加载中 */}
            {jobsLoading && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Loading size="large" text="正在获取腾讯最新岗位..." />
              </div>
            )}

            {/* 错误提示 */}
            {jobsError && !jobsLoading && (
              <div style={{
                padding: '10px 16px', borderRadius: 10, fontSize: 13,
                background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d',
              }}>
                ⚠️ {jobsError}（已展示模拟数据供参考）
              </div>
            )}

            {/* 岗位列表 */}
            {!jobsLoading && jobs.length > 0 && !jobDetail && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '55vh', overflowY: 'auto', padding: '2px 0' }}>
                  {jobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onViewDetail={() => fetchJobDetail(job.id)}
                    />
                  ))}
                </div>

                {/* 分页 */}
                {jobTotal > 15 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingTop: 8 }}>
                    <Button
                      variant="outline"
                      size="small"
                      disabled={jobPage <= 1}
                      onClick={() => handleJobPageChange(jobPage - 1)}
                    >
                      上一页
                    </Button>
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--text-muted)', padding: '0 8px' }}>
                      第 {jobPage} 页 / 共 {Math.ceil(jobTotal / 15)} 页
                    </span>
                    <Button
                      variant="outline"
                      size="small"
                      disabled={jobPage >= Math.ceil(jobTotal / 15)}
                      onClick={() => handleJobPageChange(jobPage + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* 空状态 */}
            {!jobsLoading && jobs.length === 0 && !jobsError && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <p style={{ fontSize: 15 }}>暂无匹配的岗位，请尝试其他搜索条件</p>
              </div>
            )}

            {/* 岗位详情 */}
            {jobDetail && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Button
                  variant="text"
                  onClick={() => setJobDetail(null)}
                  style={{ alignSelf: 'flex-start', fontWeight: 600, padding: 0 }}
                >
                  ← 返回岗位列表
                </Button>
                {jobDetailLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}><Loading text="加载详情..." /></div>
                ) : (
                  <JobDetailCard job={jobDetail} />
                )}
              </div>
            )}

            {/* 底部提示 */}
            <div style={{
              textAlign: 'center', paddingTop: 8, borderTop: '1px solid var(--border)',
              fontSize: 12, color: 'var(--text-muted)',
            }}>
              数据来源：腾讯招聘官网 careers.tencent.com · 建议访问官网查看最新岗位并投递
            </div>
          </div>
        </Dialog>
      )}

      {/* 登录弹窗 */}
      <Dialog
        visible={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        header={<div style={{ textAlign: 'center', fontSize: 20, fontWeight: 700 }}>🐧 登录e职伴</div>}
        footer={null}
        width={520}
        destroyOnClose
      >
        <AuthPage
          embedded
          onLogin={() => {
            setShowAuthDialog(false);
            MessagePlugin.success('登录成功！现在可以参与社区互动啦 🎉');
          }}
        />
      </Dialog>
    </div>
  );
}

// ========== 模拟腾讯岗位数据（API不可用时的回退） ==========
const MOCK_JOBS = [
  { id: 'm1', name: '腾讯2026校园招聘-技术研发-后端开发', location: '深圳', bg: 'TEG', category: '技术', product: '腾讯云', responsibility: '1.负责腾讯云核心产品的后端架构设计与开发\r\n2.参与分布式系统、高并发服务的设计与优化\r\n3.与前端、产品团队协作完成产品迭代', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm2', name: '微信视频号-推荐算法工程师（校招）', location: '北京', bg: 'WXG', category: '技术', product: '微信视频号', responsibility: '1.负责视频号推荐算法的研究与优化\r\n2.利用机器学习/深度学习技术提升推荐效果\r\n3.参与大规模推荐系统的架构设计', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm3', name: '腾讯2026校园招聘-产品策划/运营', location: '深圳', bg: 'PCG', category: '产品', product: '腾讯视频', responsibility: '1.负责产品的需求分析、功能设计与迭代\r\n2.通过数据分析驱动产品优化\r\n3.协调设计、开发、测试团队推动产品落地', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm4', name: '王者荣耀-游戏客户端开发（校招）', location: '成都', bg: 'IEG', category: '技术', product: '王者荣耀', responsibility: '1.参与王者荣耀客户端功能开发\r\n2.负责游戏系统模块的设计与实现\r\n3.优化游戏性能，提升用户体验', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm5', name: '腾讯2026校园招聘-数据分析', location: '深圳', bg: 'CDG', category: '技术', product: '腾讯广告', responsibility: '1.负责业务数据的采集、清洗与分析\r\n2.构建数据指标体系，产出分析报告\r\n3.通过数据洞察驱动业务决策', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm6', name: 'QQ音乐-前端开发工程师（校招）', location: '深圳', bg: 'TME', category: '技术', product: 'QQ音乐', responsibility: '1.负责QQ音乐Web/H5端功能开发\r\n2.参与前端基础设施的建设与优化\r\n3.探索前端新技术，提升用户体验', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm7', name: '腾讯2026校园招聘-UI/UX设计师', location: '深圳', bg: 'CSIG', category: '设计', product: '腾讯会议', responsibility: '1.负责腾讯会议等产品的UI/UX设计\r\n2.参与用户研究，输出交互原型与视觉方案\r\n3.制定设计规范，推动设计系统建设', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm8', name: '腾讯2026校园招聘-人力资源', location: '深圳', bg: 'S3', category: '人力资源', product: '腾讯HR', responsibility: '1.参与招聘、培训、员工关系等HR模块工作\r\n2.协助制定并落地人力资源相关项目\r\n3.运用数据分析优化人力资源管理', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm9', name: '企业微信-Android开发工程师（校招）', location: '广州', bg: 'WXG', category: '技术', product: '企业微信', responsibility: '1.负责企业微信Android端功能开发与维护\r\n2.参与客户端架构设计与性能优化\r\n3.探索前沿移动端技术方案', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm10', name: '腾讯2026校园招聘-市场营销', location: '深圳', bg: 'IEG', category: '市场', product: '腾讯游戏', responsibility: '1.参与游戏产品的市场推广策略制定\r\n2.负责营销活动的策划与执行\r\n3.分析市场数据，优化营销效果', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm11', name: '腾讯会议-测试开发工程师（校招）', location: '深圳', bg: 'CSIG', category: '技术', product: '腾讯会议', responsibility: '1.负责产品质量保障，设计测试方案\r\n2.开发自动化测试框架与工具\r\n3.参与CI/CD流程优化', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm12', name: '腾讯2026校园招聘-游戏策划', location: '上海', bg: 'IEG', category: '产品', product: '腾讯游戏', responsibility: '1.参与游戏核心玩法的设计与迭代\r\n2.撰写策划文档，协调美术与程序落地\r\n3.分析玩家数据，优化游戏体验', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm13', name: '微信支付-安全工程师（校招）', location: '深圳', bg: 'WXG', category: '技术', product: '微信支付', responsibility: '1.负责支付安全策略的研究与实施\r\n2.参与安全攻防体系的建设\r\n3.分析安全风险，制定防护方案', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm14', name: '腾讯2026校园招聘-战略分析', location: '深圳', bg: 'CSIG', category: '市场', product: '腾讯云', responsibility: '1.跟踪云计算/AI行业动态与竞争格局\r\n2.进行市场研究与商业分析\r\n3.支持业务战略制定与决策', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
  { id: 'm15', name: '腾讯文档-全栈开发工程师（校招）', location: '深圳', bg: 'PCG', category: '技术', product: '腾讯文档', responsibility: '1.参与腾讯文档前后端功能开发\r\n2.负责协同编辑等核心功能的技术实现\r\n3.优化文档渲染性能与用户体验', workYears: '应届毕业生', updateTime: '2026年06月12日', url: 'https://join.qq.com/', isValid: true },
];

function getMockJobs() {
  return MOCK_JOBS;
}

// ========== 岗位相关的城市和类别选项 ==========
const jobCityOptions = [
  { label: '全部城市', value: '' },
  { label: '深圳', value: '深圳' },
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '成都', value: '成都' },
  { label: '杭州', value: '杭州' },
];

const jobCategoryOptions = [
  { label: '全部类别', value: '' },
  { label: '技术', value: '技术' },
  { label: '产品', value: '产品' },
  { label: '设计', value: '设计' },
  { label: '市场', value: '市场' },
  { label: '人力资源', value: '人力资源' },
];

const bgColorMap = {
  'WXG': '#07c160', 'IEG': '#fa9d3b', 'CSIG': '#0052d9', 'PCG': '#8b5cf6',
  'TEG': '#10b981', 'CDG': '#ef4444', 'TME': '#06b6d4', 'S3': '#f59e0b',
};

// ========== 帖子卡片组件 ==========
function PostCard({ post, likedPosts, favoritedPosts, commentInputs, setCommentInputs, onLike, onFavorite, onComment, formatTime, dirMap, categoryColors, user, onRequireAuth, onOpenDetail }) {
  const [showComments, setShowComments] = useState(false);
  const isLiked = likedPosts.has(post.id);
  const isFavorited = favoritedPosts && favoritedPosts.has(post.id);
  const catColor = categoryColors[post.category] || '#6b7280';

  return (
    <Card bordered style={{
      borderRadius: 'var(--radius-lg)',
      transition: 'all var(--transition)',
      cursor: 'pointer',
    }}>
      {/* 帖子头部 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }} onClick={() => onOpenDetail && onOpenDetail()}>
        <div style={{
          width: 40, height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0052d9, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: '#fff', flexShrink: 0,
        }}>
          {post.author === 'e职伴小助手' ? '🐧' : '👤'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{post.author}</span>
            {post.authorGrade && (
              <Tag size="small" variant="light" theme="primary">{post.authorGrade}</Tag>
            )}
            {post.authorDirection && (
              <Tag size="small" variant="light" theme="success">
                {dirMap[post.authorDirection] || post.authorDirection}
              </Tag>
            )}
            <Tag size="small" style={{ background: catColor + '15', color: catColor, borderColor: catColor + '30' }}>
              {post.category}
            </Tag>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatTime(post.createdAt)}</span>
        </div>
      </div>

      {/* 帖子标题和内容 — 点击进入详情 */}
      <div onClick={() => onOpenDetail && onOpenDetail()}>
        <h3 style={{
          fontSize: 16, fontWeight: 700, color: 'var(--text)',
          marginBottom: 8, lineHeight: 1.5,
        }}>
          {post.title}
        </h3>
        <p style={{
          fontSize: 14, color: 'var(--text-secondary)',
          lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: 12,
          display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.content}
        </p>
        {/* 图片缩略图 */}
        {post.images && post.images.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflow: 'hidden' }}>
            {post.images.slice(0, 4).map((img, idx) => (
              <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={img}
                  alt={`thumb-${idx}`}
                  style={{
                    width: 72, height: 72, borderRadius: 8, objectFit: 'cover',
                  }}
                />
                {idx === 3 && post.images.length > 4 && (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 8,
                    background: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 14, fontWeight: 700,
                  }}>
                    +{post.images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 互动栏 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        paddingTop: 12, borderTop: '1px solid var(--border)',
      }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!user) { onRequireAuth(); return; }
            onLike(post.id);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 12px', borderRadius: 8,
            border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            background: isLiked ? '#fee2e2' : 'var(--bg)',
            color: isLiked ? '#ef4444' : 'var(--text-muted)',
            transition: 'all var(--transition)',
          }}
        >
          {isLiked ? '❤️' : '🤍'} {post.likes || 0}
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 12px', borderRadius: 8,
            border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            background: showComments ? '#dbeafe' : 'var(--bg)',
            color: showComments ? '#3b82f6' : 'var(--text-muted)',
            transition: 'all var(--transition)',
          }}
        >
          💬 {(post.comments || []).length} 条评论
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!user) { onRequireAuth(); return; }
            onFavorite(post.id);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 12px', borderRadius: 8,
            border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            background: isFavorited ? '#fef3c7' : 'var(--bg)',
            color: isFavorited ? '#f59e0b' : 'var(--text-muted)',
            transition: 'all var(--transition)',
          }}
        >
          {isFavorited ? '⭐' : '☆'} 收藏
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenDetail && onOpenDetail(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 12px', borderRadius: 8,
            border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            background: 'var(--bg)',
            color: 'var(--text-muted)',
            transition: 'all var(--transition)',
            marginLeft: 'auto',
          }}
        >
          📖 查看详情
        </button>
      </div>

      {/* 评论区 */}
      {showComments && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          {/* 已有评论 */}
          {(post.comments || []).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              {post.comments.map(comment => (
                <div key={comment.id} style={{
                  padding: '10px 14px',
                  background: 'var(--bg)',
                  borderRadius: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{comment.author}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatTime(comment.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 评论输入框 */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              value={commentInputs[post.id] || ''}
              onChange={(v) => setCommentInputs(prev => ({ ...prev, [post.id]: v }))}
              placeholder={user ? '写下你的评论...' : '登录后参与评论'}
              size="medium"
              style={{ flex: 1 }}
              onEnter={() => onComment(post.id)}
            />
            <Button
              theme="primary"
              size="medium"
              onClick={() => onComment(post.id)}
              style={{ fontWeight: 600 }}
            >
              发送
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// ========== 统计小方块 ==========
function StatBox({ icon, label, value, color, bg }) {
  return (
    <div style={{
      background: bg,
      borderRadius: 12,
      padding: '12px 8px',
      textAlign: 'center',
      border: '1px solid ' + color + '20',
    }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ========== 我的主页内容区 ==========
function MyPageContent({ tab, user, posts, likedPosts, favoritedPosts, onLike, onFavorite, formatTime, dirMap, categoryColors, onOpenDetail, onRequireAuth }) {
  // 根据tab获取帖子列表
  let displayPosts = [];
  if (tab === 'myPosts') {
    displayPosts = posts.filter(p => p.author === user.username);
  } else if (tab === 'liked') {
    displayPosts = posts.filter(p => likedPosts.has(p.id));
  } else if (tab === 'favorited') {
    displayPosts = posts.filter(p => favoritedPosts.has(p.id));
  }

  if (displayPosts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
        <p style={{ fontSize: 15 }}>
          {tab === 'myPosts' ? '你还没有发布过帖子，快去发布第一篇吧！' :
           tab === 'liked' ? '你还没有点赞过帖子，去社区逛逛吧！' :
           '你还没有收藏过帖子，遇到好内容记得收藏哦～'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '50vh', overflowY: 'auto', padding: '4px 0' }}>
      {displayPosts.map(post => (
        <MyPagePostItem
          key={post.id}
          post={post}
          likedPosts={likedPosts}
          favoritedPosts={favoritedPosts}
          onLike={onLike}
          onFavorite={onFavorite}
          formatTime={formatTime}
          dirMap={dirMap}
          categoryColors={categoryColors}
          onOpenDetail={onOpenDetail}
          onRequireAuth={onRequireAuth}
          user={user}
        />
      ))}
    </div>
  );
}

// ========== 我的主页中的帖子卡片（精简版） ==========
function MyPagePostItem({ post, likedPosts, favoritedPosts, onLike, onFavorite, formatTime, dirMap, categoryColors, onOpenDetail, onRequireAuth, user }) {
  const isLiked = likedPosts.has(post.id);
  const isFavorited = favoritedPosts.has(post.id);
  const catColor = categoryColors[post.category] || '#6b7280';

  return (
    <Card bordered style={{ borderRadius: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0052d9, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: '#fff', flexShrink: 0,
        }}>
          {post.author === 'e职伴小助手' ? '🐧' : '👤'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{post.author}</span>
            {post.authorGrade && <Tag size="small" variant="light" theme="primary">{post.authorGrade}</Tag>}
            <Tag size="small" style={{ background: catColor + '15', color: catColor }}>{post.category}</Tag>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatTime(post.createdAt)}</span>
        </div>
      </div>
      <div
        onClick={() => onOpenDetail && onOpenDetail(post)}
        style={{ cursor: 'pointer', marginBottom: 8 }}
      >
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.4 }}>{post.title}</h4>
        <p style={{
          fontSize: 13, color: 'var(--text-secondary)',
          lineHeight: 1.6, display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', marginBottom: 0,
        }}>
          {post.content}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (!user) { onRequireAuth(); return; } onLike(post.id); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 3,
            padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600,
            background: isLiked ? '#fee2e2' : 'var(--bg)',
            color: isLiked ? '#ef4444' : 'var(--text-muted)',
          }}
        >
          {isLiked ? '❤️' : '🤍'} {post.likes || 0}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (!user) { onRequireAuth(); return; } onFavorite(post.id); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 3,
            padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600,
            background: isFavorited ? '#fef3c7' : 'var(--bg)',
            color: isFavorited ? '#f59e0b' : 'var(--text-muted)',
          }}
        >
          {isFavorited ? '⭐' : '☆'} 收藏
        </button>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>💬 {(post.comments || []).length}</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenDetail && onOpenDetail(post); }}
          style={{
            marginLeft: 'auto',
            padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600,
            background: 'var(--bg)', color: 'var(--text-muted)',
          }}
        >
          📖 详情
        </button>
      </div>
    </Card>
  );
}

// ========== 岗位卡片组件 ==========
function JobCard({ job, onViewDetail }) {
  const bgColor = bgColorMap[job.bg] || '#6b7280';

  return (
    <Card bordered style={{ borderRadius: 12, transition: 'all var(--transition)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* 事业群图标 */}
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: bgColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: '#fff', fontWeight: 700, flexShrink: 0,
        }}>
          {job.bg || 'TX'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 岗位名称 */}
          <h4 style={{
            fontSize: 15, fontWeight: 700, color: 'var(--text)',
            marginBottom: 8, lineHeight: 1.4, cursor: 'pointer',
          }} onClick={onViewDetail}>
            {job.name}
          </h4>
          {/* 标签行 */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {job.location && (
              <Tag size="small" variant="light" theme="primary">📍 {job.location}</Tag>
            )}
            {job.category && (
              <Tag size="small" variant="light" theme="success">{job.category}</Tag>
            )}
            {job.workYears && (
              <Tag size="small" variant="light" theme="warning">{job.workYears}</Tag>
            )}
            {job.product && (
              <Tag size="small" variant="outline">{job.product}</Tag>
            )}
          </div>
          {/* 职责摘要 */}
          {job.responsibility && (
            <p style={{
              fontSize: 13, color: 'var(--text-secondary)',
              lineHeight: 1.6, display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden', marginBottom: 10,
            }}>
              {job.responsibility.replace(/\r\n/g, ' ')}
            </p>
          )}
          {/* 操作行 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              variant="text"
              size="small"
              onClick={onViewDetail}
              style={{ fontWeight: 600, color: '#0052d9', padding: 0 }}
            >
              📋 查看详情
            </Button>
            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: '#059669', textDecoration: 'none', fontWeight: 600 }}
              >
                🔗 去官网投递 →
              </a>
            )}
            {job.updateTime && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                更新于 {job.updateTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ========== 岗位详情卡片 ==========
function JobDetailCard({ job }) {
  const bgColor = bgColorMap[job.bg] || '#6b7280';

  return (
    <Card bordered style={{ borderRadius: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 头部 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: bgColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#fff', fontWeight: 700, flexShrink: 0,
          }}>
            {job.bg || 'TX'}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8 }}>
              {job.name}
            </h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {job.location && <Tag variant="light" theme="primary">📍 {job.location}</Tag>}
              {job.category && <Tag variant="light" theme="success">{job.category}</Tag>}
              {job.workYears && <Tag variant="light" theme="warning">{job.workYears}</Tag>}
              {job.bg && <Tag variant="outline">{job.bg}</Tag>}
            </div>
          </div>
        </div>

        {/* 岗位职责 */}
        {job.responsibility && (
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              📋 岗位职责
            </h4>
            <div style={{
              fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2,
              whiteSpace: 'pre-wrap', background: 'var(--bg)',
              padding: '14px 16px', borderRadius: 10,
            }}>
              {job.responsibility}
            </div>
          </div>
        )}

        {/* 任职要求 */}
        {job.requirement && (
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              ✅ 任职要求
            </h4>
            <div style={{
              fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2,
              whiteSpace: 'pre-wrap', background: 'var(--bg)',
              padding: '14px 16px', borderRadius: 10,
            }}>
              {job.requirement}
            </div>
          </div>
        )}

        {/* 投递链接 */}
        {job.url && (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px 32px',
                background: 'linear-gradient(135deg, #0052d9, #059669)',
                color: '#fff',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
              }}
            >
              🚀 去腾讯官网投递简历
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
