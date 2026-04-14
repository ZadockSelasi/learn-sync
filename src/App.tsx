/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import Planner from './pages/Planner';
import Chatbot from './pages/Chatbot';
import Settings from './pages/Settings';
import CareerHub from './pages/CareerHub';
import CareerProfile from './pages/CareerProfile';
import CareerOpportunities from './pages/CareerOpportunities';
import CareerCompanies from './pages/CareerCompanies';
import CVBuilder from './pages/CVBuilder';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import StickyNotes from './pages/StickyNotes';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: 'red', color: 'white' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="study-buddy-theme">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/chat" element={<Chatbot />} />
                <Route path="/career" element={<CareerHub />} />
                <Route path="/career/profile" element={<CareerProfile />} />
                <Route path="/career/opportunities" element={<CareerOpportunities />} />
                <Route path="/career/companies" element={<CareerCompanies />} />
                <Route path="/career/cv-builder" element={<CVBuilder />} />
                <Route path="/career/skill-gap" element={<SkillGapAnalysis />} />
                <Route path="/notes" element={<StickyNotes />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Onboarding Route (Protected but no Layout) */}
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
