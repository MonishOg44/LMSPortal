import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Lab from './pages/Lab';
import Footer from './components/Footer';
import LogoutOverlay from './components/LogoutOverlay';
import StrangeGT from './pages/StrangeGT';
import Catalog from './pages/Catalog';
import CollabPage from './pages/CollabPage';
import RankPage from './pages/RankPage';

// Route Guard Component
function ProtectedRoute({ children }) {
  const { user } = useProgress();
  const location = useLocation();

  if (!user) {
    // Redirect to login page, preserving current location for return redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  
  // Scroll to top on route change only
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isStrangeGT = location.pathname === '/strangegt' || location.pathname === '/collab' || location.pathname === '/rank';
  const isFullScreenPage = location.pathname === '/' || location.pathname === '/catalog' || location.pathname === '/strangegt' || location.pathname === '/collab' || location.pathname === '/rank';
  const { 
    user, 
    isGlobalTransitioning, 
    globalTransitionProgress, 
    globalTransitionPhase, 
    globalTransitionLogs,
    isLoggingOut,
    logoutProgress,
    logoutPhase,
    logoutLogs,
    isDeleteTransition
  } = useProgress();

  return (
    <div className={`app-container ${isLoggingOut ? 'app-logout-active' : ''} ${logoutPhase === 'collapsing' ? 'crt-collapse-active' : ''}`}>
      {/* Show Navbar only if student is logged in AND not on StrangeGT page */}
      {user && !isStrangeGT && <Navbar />}
      <main 
        className="main-content" 
        style={{
          ...(!user ? { padding: 0 } : {}),
          ...(isFullScreenPage ? { maxWidth: '100%', width: '100%', padding: 0, margin: '0 auto' } : {})
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:id" 
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lab" 
            element={
              <ProtectedRoute>
                <Lab />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/strangegt" 
            element={
              <ProtectedRoute>
                <StrangeGT />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/catalog" 
            element={
              <ProtectedRoute>
                <Catalog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/collab" 
            element={
              <ProtectedRoute>
                <CollabPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/rank" 
            element={
              <ProtectedRoute>
                <RankPage />
              </ProtectedRoute>
            } 
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {user && !isStrangeGT && <Footer />}

      {/* Futuristic global transition overlay */}
      {isGlobalTransitioning && (
        <div className={`global-transition-overlay ${globalTransitionPhase === 'warping' ? 'warp-active' : ''}`}>
          {/* Shutter left */}
          <div className="shutter shutter-left">
            <div className="shutter-grid-content"></div>
            <div className="shutter-tech-border-left"></div>
            <div className="shutter-center-gate shutter-center-left">
              <div className="gate-lock-half"></div>
            </div>
          </div>
          {/* Shutter right */}
          <div className="shutter shutter-right">
            <div className="shutter-grid-content"></div>
            <div className="shutter-tech-border-right"></div>
            <div className="shutter-center-gate shutter-center-right">
              <div className="gate-lock-half"></div>
            </div>
          </div>
          
          {/* Central HUD scanners */}
          <div className="hud-center-group">
            <div className="hud-scanner">
              <svg className="hud-progress-svg" viewBox="0 0 200 200" width="200" height="200">
                <circle cx="100" cy="100" r="90" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="2" fill="none" />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="90" 
                  stroke="var(--primary)" 
                  strokeWidth="3.5" 
                  fill="none" 
                  strokeDasharray="565.48"
                  strokeDashoffset={565.48 - (565.48 * globalTransitionProgress) / 100}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.1s ease-out',
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%'
                  }}
                />
              </svg>
              <div className="hud-ring hud-ring-outer"></div>
              <div className="hud-ring hud-ring-mid"></div>
              <div className="hud-ring hud-ring-inner"></div>
              <div className="hud-scanner-glow"></div>
              <span className="hud-progress-text">
                {globalTransitionProgress.toString().padStart(3, '0')}%
              </span>
            </div>
            
            <div className="hud-phase-text">
              {globalTransitionPhase === 'warping' ? 'SYS // STABILIZING DIMENSIONAL NODES...' : 'SYS // INJECTING GRAPHIC ASSETS...'}
            </div>
          </div>

          {/* Terminal log panel */}
          <div className="cyber-logs-panel">
            {globalTransitionLogs.map((log, index) => (
              <div key={index} className={`cyber-log-item ${index === globalTransitionLogs.length - 1 ? 'highlight' : ''}`}>
                {log}
              </div>
            ))}
          </div>

          {/* HUD corners decor */}
          <div className="cyber-hud-decor hud-top-left">[SYS_ACCESS_09]</div>
          <div className="cyber-hud-decor hud-top-right">[NODE_5175_CONNECTED]</div>
          <div className="cyber-hud-decor hud-bottom-right">[LATENCY_12MS]</div>

          {/* Flash screen on warp */}
          <div className="warp-flash"></div>
        </div>
      )}

      {/* Futuristic global logout overlay */}
      {isLoggingOut && (
        <LogoutOverlay 
          progress={logoutProgress} 
          phase={logoutPhase} 
          logs={logoutLogs} 
          isDelete={isDeleteTransition}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ProgressProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppContent />
      </BrowserRouter>
    </ProgressProvider>
  );
}

export default App;
