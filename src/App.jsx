import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Diagnosis from './pages/Diagnosis';
import CareerMap from './pages/CareerMap';
import AiSkill from './pages/AiSkill';
import SkillCenter from './pages/SkillCenter';
import ProjectWorkshop from './pages/ProjectWorkshop';
import JobPrep from './pages/JobPrep';
import InterviewReview from './pages/InterviewReview';
import EmotionComfort from './pages/EmotionComfort';
import StudyPlan from './pages/StudyPlan';
import Community from './pages/Community';
import AiChat from './pages/AiChat';
import ABTestLab from './pages/ABTestLab';

export default function App() {
  const [userProfile, setUserProfile] = useState(null);

  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnosis" element={<Diagnosis onComplete={setUserProfile} profile={userProfile} />} />
          <Route path="/career-map" element={<CareerMap profile={userProfile} />} />
          <Route path="/ai-skill" element={<AiSkill profile={userProfile} />} />
          <Route path="/skill-center" element={<SkillCenter profile={userProfile} />} />
          <Route path="/project-workshop" element={<ProjectWorkshop profile={userProfile} />} />
          <Route path="/job-prep" element={<JobPrep profile={userProfile} />} />
          <Route path="/interview-review" element={<InterviewReview profile={userProfile} />} />
          <Route path="/emotion-comfort" element={<EmotionComfort profile={userProfile} />} />
          <Route path="/study-plan" element={<StudyPlan profile={userProfile} />} />
          <Route path="/community" element={<Community />} />
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/ab-test-lab" element={<ABTestLab />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}
