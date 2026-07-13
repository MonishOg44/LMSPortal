import React from 'react';
import { useProgress } from '../context/ProgressContext';
import StatCard from '../components/StatCard';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Award, Clock, Flame, BookOpen, ShieldAlert, 
  Download, Calendar, CheckCircle,
  Camera, Upload, X, Trash2
} from 'lucide-react';

export default function Profile() {
  const { 
    enrolledCourses, 
    getCourseProgress, 
    timeSpent, 
    streak, 
    getCertificates, 
    user, 
    logout,
    addStudyTime,
    resetProgress,
    triggerNotification,
    updateProfile,
    deleteAccount,
    completedLessons,
    courses,
    manualLogs,
    saveManualLog
  } = useProgress();

  const navigate = useNavigate();
  const userName = user?.name || 'monish';
  const initial = userName.slice(0, 2).toUpperCase();

  const [showAvatarModal, setShowAvatarModal] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerNotification("SYS_ERROR // FILE_SIZE_LIMIT_EXCEEDED (MAX 2MB)");
        return;
      }
      updateProfile(null, null, file);
    }
  };

  const renderAvatar = () => {
    if (user?.avatar) {
      if (user.avatar.startsWith('linear-gradient') || user.avatar.startsWith('radial-gradient')) {
        return (
          <div className="profile-avatar-lg" style={{ background: user.avatar }}>
            {initial}
          </div>
        );
      }
      const avatarUrl = user.avatar.startsWith('/') 
        ? `${import.meta.env.VITE_API_URL}${user.avatar}` 
        : user.avatar;
      return (
        <img src={avatarUrl} className="profile-avatar-lg" style={{ objectFit: 'cover' }} alt="Profile" />
      );
    }
    return <div className="profile-avatar-lg">{initial}</div>;
  };

  const PRESET_AVATARS = [
    { name: 'Cyber Purple', value: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #f472b6 100%)' },
    { name: 'Neon Emerald', value: 'linear-gradient(135deg, #0d9488 0%, #10b981 50%, #34d399 100%)' },
    { name: 'Solar Aura', value: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #fef08a 100%)' },
    { name: 'Deep Space', value: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #93c5fd 100%)' },
    { name: 'Cosmic Indigo', value: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 50%, #c084fc 100%)' },
    { name: 'Obsidian Void', value: 'linear-gradient(135deg, #0f172a 0%, #334155 50%, #64748b 100%)' },
  ];

  const certificates = getCertificates();
  const completedCount = certificates.length;

  // Rank panel state — now navigates to /rank
  const openRankPanel = () => navigate('/rank');

  const handleDownloadCertificate = async (cert) => {
    try {
      const url = `${import.meta.env.BASE_URL}certificates/${cert.courseId}.png`;
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${cert.courseTitle.replace(/[^a-z0-9]/gi, '_')}_Certificate.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: direct navigation
      const link = document.createElement('a');
      link.href = `${import.meta.env.BASE_URL}certificates/${cert.courseId}.png`;
      link.download = `${cert.courseTitle.replace(/[^a-z0-9]/gi, '_')}_Certificate.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    triggerNotification(`SYS // DOWNLOADING_CERTIFICATE // FILE: "${cert.courseTitle.toUpperCase()}"`);
  };

  // Custom badges list with unlock conditions
  const achievements = [
    { 
      id: "badge-first", 
      title: "First Step", 
      desc: "Enrolled in your first course", 
      icon: BookOpen,
      unlocked: enrolledCourses.length > 0 
    },
    { 
      id: "badge-streak", 
      title: "Hot Streak", 
      desc: "Maintain a study streak of 5+ days", 
      icon: Flame,
      unlocked: streak >= 5 
    },
    { 
      id: "badge-hours", 
      title: "Deep Focus", 
      desc: "Learn for more than 3 hours", 
      icon: Clock,
      unlocked: timeSpent >= 180 
    },
    { 
      id: "badge-grad", 
      title: "Graduate", 
      desc: "Earn at least one certificate", 
      icon: Award,
      unlocked: completedCount > 0 
    }
  ];

  // Helper to format time
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;
  };

  // State-driven interactive weekly activity logger
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDayIndex = new Date().getDay();
  const currentDayLabel = daysOfWeek[currentDayIndex];

  const [selectedDay, setSelectedDay] = React.useState(currentDayLabel);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  
  const weeklyActivity = React.useMemo(() => {
    const activity = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0
    };

    // 1. Distribute completed lessons' durations to the days of the week deterministically
    if (courses && completedLessons) {
      Object.keys(completedLessons).forEach(courseIdStr => {
        const completedIds = completedLessons[courseIdStr] || [];
        const course = courses.find(c => String(c.id) === courseIdStr);
        if (course) {
          course.modules.forEach(mod => {
            mod.lessons.forEach(lesson => {
              if (completedIds.includes(String(lesson.id))) {
                const idStr = String(lesson.id);
                let hash = 0;
                for (let i = 0; i < idStr.length; i++) {
                  hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
                }
                const dayIndex = Math.abs(hash) % 7;
                const dayLabel = daysOfWeek[dayIndex];
                
                const match = (lesson.duration || "").match(/\d+/);
                const mins = match ? parseInt(match[0], 10) : 10;
                activity[dayLabel] += mins / 60;
              }
            });
          });
        }
      });
    }

    // 2. Add manual logs from context
    if (manualLogs) {
      Object.keys(manualLogs).forEach(day => {
        if (activity[day] !== undefined) {
          activity[day] += manualLogs[day];
        }
      });
    }

    return daysOfWeek.map(day => ({
      day,
      hours: Number(activity[day].toFixed(1))
    }));
  }, [completedLessons, courses, manualLogs]);

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours), 1);
  const formattedWeeklyData = weeklyActivity.map(d => ({
    ...d,
    pct: Math.min((d.hours / maxHours) * 100, 100)
  }));

  const selectedDayData = formattedWeeklyData.find(d => d.day === selectedDay) || formattedWeeklyData[0];

  const handleLogStudyTime = async (minsToAdd) => {
    // Add to backend SQL database via saveManualLog
    await saveManualLog(selectedDay, minsToAdd);
    
    // Trigger notification
    triggerNotification(`ACTIVITY_LOG // +${minsToAdd} MINS // Target: [${selectedDay.toUpperCase()}]`);
  };

  const getActivitiesForDay = (dayName) => {
    if (enrolledCourses.length === 0) {
      return ["No active courses enrolled. Visit the catalog to start learning."];
    }
    const hash = dayName.charCodeAt(0) + dayName.charCodeAt(1);
    const courseIndex = hash % enrolledCourses.length;
    const course = enrolledCourses[courseIndex];
    
    if (dayName === 'Wed' || dayName === 'Sat') {
      return [
        `Sync status: accessed curriculum matrix for ${course.title}`,
        `Compiled resource packets: reviewed lectures & reference documents`
      ];
    } else if (dayName === 'Thu' || dayName === 'Tue') {
      return [
        `Executed video playback: watched 3 lessons in ${course.title}`,
        `Environment verification: completed sector lab & validated codes`
      ];
    } else {
      return [
        `Milestone test: passed course unit assessment`,
        `Saved snapshot: updated personal study logs in dashboard`
      ];
    }
  };

  return (
    <>
      <div className="page-container">
      
      {/* Profile Header */}
      <div className="profile-hero">
        <div className="profile-avatar-container" onClick={() => setShowAvatarModal(true)}>
          {renderAvatar()}
          <div className="profile-avatar-overlay">
            <Camera size={20} />
            <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>EDIT</span>
          </div>
        </div>
        <div className="profile-details">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <h2>{userName}</h2>
            <button 
              className="btn-cyber-deauth" 
              onClick={logout}
            >
              <svg className="cyber-deauth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              <span className="cyber-deauth-text">DE-AUTH SESSION</span>
              <span className="cyber-deauth-status">[ONLINE]</span>
            </button>

            <button 
              className="btn-cyber-reset" 
              onClick={() => setShowResetConfirm(true)}
            >
              <svg className="cyber-reset-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span className="cyber-reset-text">RESET SYSTEMS</span>
              <span className="cyber-reset-status">[WIPE]</span>
            </button>

            <button 
              className="btn-cyber-delete" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="cyber-delete-icon" size={14} />
              <span className="cyber-delete-text">DELETE ACCOUNT</span>
              <span className="cyber-delete-status">[PURGE]</span>
            </button>

            <button
              className="btn-cyber-rank"
              onClick={openRankPanel}
            >
              <span className="cyber-rank-icon">◈</span>
              <span className="cyber-rank-text">RANK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics stats */}
      <div className="stats-grid">
        <StatCard 
          title="Total Study Time" 
          value={formatTime(timeSpent)} 
          icon={Clock} 
          theme="default" 
        />
        <StatCard 
          title="Current Streak" 
          value={`${streak} days`} 
          icon={Flame} 
          theme="warning" 
        />
        <StatCard 
          title="Completed Courses" 
          value={completedCount} 
          icon={CheckCircle} 
          theme="success" 
        />
      </div>

      {/* Two Column Layout: Analytics Chart + Achievements */}
      <div className="dashboard-section">
        
        {/* Weekly Activity Chart */}
        <div className="analytics-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Learning Activity</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={14} />
              <span>This Week</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track your daily study hour breakdown. Select a bar to log new sessions or view logs.</p>
          
          <div className="chart-container">
            {/* Background grid lines */}
            <div className="chart-grid-line" style={{ bottom: '130px' }}><span className="chart-grid-label">4.0h</span></div>
            <div className="chart-grid-line" style={{ bottom: '80px' }}><span className="chart-grid-label">2.0h</span></div>
            <div className="chart-grid-line" style={{ bottom: '30px' }}><span className="chart-grid-label">0.0h</span></div>

            {formattedWeeklyData.map((d, index) => (
              <div 
                className="chart-bar-wrapper" 
                key={index}
                onClick={() => setSelectedDay(d.day)}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: d.day === selectedDay ? 'var(--primary)' : 'var(--text-primary)', transition: 'color 0.3s' }}>
                  {d.hours}h
                </span>
                <div className={`chart-bar-bg ${d.day === selectedDay ? 'selected' : ''}`}>
                  <div 
                    className="chart-bar-fill"
                    style={{ height: `${d.pct}%` }}
                    title={`${d.hours} hours`}
                  >
                    {/* Head cursor glow dot */}
                    {d.hours > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: 0, left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 8, height: 8,
                        borderRadius: '50%',
                        background: '#ffffff',
                        boxShadow: '0 0 8px #ffffff, 0 0 15px var(--primary-glow)',
                        zIndex: 5,
                      }} />
                    )}
                  </div>
                </div>
                <span className="chart-label">{d.day}</span>
              </div>
            ))}
          </div>

          {/* Futuristic Telemetry HUD */}
          <div className="activity-detail-hud">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '0.55rem', color: 'var(--primary)', letterSpacing: '0.15em', fontWeight: 700 }}>
                  // DAILY TELEMETRY REPORT
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 800, margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
                  {selectedDay === currentDayLabel ? `Today's Log [${selectedDay}]` : `${selectedDay} Study Log`}
                </h4>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn-hud-log" 
                  onClick={() => handleLogStudyTime(30)}
                >
                  +30m Log
                </button>
                <button 
                  className="btn-hud-log" 
                  onClick={() => handleLogStudyTime(60)}
                >
                  +1h Log
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: "'Space Grotesk', monospace", color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span>RECORDED STUDY: <strong style={{ color: 'var(--text-primary)' }}>{selectedDayData.hours} hours</strong></span>
                <span>STATUS: <strong style={{ color: selectedDayData.hours > 0 ? 'var(--success)' : 'var(--text-muted)' }}>{selectedDayData.hours > 0 ? 'LOG_ACTIVE' : 'NO_DATA'}</strong></span>
              </div>
              
              <div>
                {getActivitiesForDay(selectedDay).map((act, i) => (
                  <div className="hud-activity-item" key={i}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontFamily: 'monospace', marginRight: '6px' }}>&gt;</span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Badges Achievements */}
        <div className="analytics-card">
          <h3>Achievements & Badges</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unlock special badges as you watch lessons, complete courses, and build learning habits.</p>
          
          <div className="badges-container">
            {achievements.map(badge => {
              const Icon = badge.icon;
              return (
                <div 
                  key={badge.id} 
                  className={`badge-item ${badge.unlocked ? 'active' : 'locked'}`}
                >
                  <div className="badge-icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <div className="badge-info">
                    <span className="badge-title">
                      {badge.title}
                    </span>
                    <span className="badge-desc">
                      {badge.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Telemetry Milestones */}
          <div className="telemetry-milestones">
            <div className="milestones-header">
              <span>// SYSTEM PROGRESSION TELEMETRY</span>
              <span className="blink-dot" />
            </div>

            <div className="milestone-item">
              <div className="milestone-label-row">
                <span className="milestone-name">Daily Focus Target</span>
                <span className="milestone-value">
                  {selectedDayData.hours}h / 4.0h
                </span>
              </div>
              <div className="milestone-progress-bg">
                <div 
                  className="milestone-progress-fill focus"
                  style={{ width: `${Math.min((selectedDayData.hours / 4.0) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="milestone-item">
              <div className="milestone-label-row">
                <span className="milestone-name">Habit Streak Progression</span>
                <span className="milestone-value">
                  {streak}d / 10d
                </span>
              </div>
              <div className="milestone-progress-bg">
                <div 
                  className="milestone-progress-fill streak"
                  style={{ width: `${Math.min((streak / 10) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="milestone-item">
              <div className="milestone-label-row">
                <span className="milestone-name">Syllabus Completion</span>
                <span className="milestone-value">
                  {enrolledCourses.length > 0 ? `${Math.round(enrolledCourses.reduce((acc, courseId) => acc + getCourseProgress(courseId), 0) / enrolledCourses.length)}%` : '0%'}
                </span>
              </div>
              <div className="milestone-progress-bg">
                <div 
                  className="milestone-progress-fill syllabus"
                  style={{ 
                    width: `${enrolledCourses.length > 0 ? Math.min(Math.round(enrolledCourses.reduce((acc, courseId) => acc + getCourseProgress(courseId), 0) / enrolledCourses.length), 100) : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Certificates Shelf */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={22} style={{ color: 'var(--primary)' }} />
          Verified Certificates
        </h2>
        
        {certificates.length > 0 ? (
          <div className="certificates-grid">
            {certificates.map(cert => (
              <div className="certificate-card" key={cert.courseId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="certificate-badge-icon">
                    <Award size={24} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {cert.certId}
                  </span>
                </div>

                <div className="certificate-details">
                  <span className="certificate-title">{cert.courseTitle}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Issued to: {userName}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instructor: {cert.instructor}</span>
                  <span className="certificate-date">Granted on {cert.date}</span>
                </div>

                <div className="certificate-action" onClick={() => handleDownloadCertificate(cert)} style={{ cursor: 'pointer' }}>
                  <Download size={14} />
                  <span>Download Certificate</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Award size={48} style={{ color: 'var(--text-muted)' }} />
            <h3>No Certificates Earned Yet</h3>
            <p>You will receive an official verifiable certificate immediately when you complete 100% of any course's video lessons.</p>
            <Link to="/" className="btn btn-primary btn-profile-browse">
              <BookOpen size={14} />
              <span>Browse Courses & Start Learning</span>
              <span className="cyber-deauth-status" style={{ marginLeft: 'auto', opacity: 0.6 }}>[ACCESS_GRID]</span>
            </Link>
          </div>
        )}
      </div>

      </div>

      {/* Futuristic Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="cyber-modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="cyber-modal-content" onClick={e => e.stopPropagation()}>
            {/* Corner tech decals */}
            <div className="cyber-modal-decal top-left" />
            <div className="cyber-modal-decal top-right" />
            <div className="cyber-modal-decal bottom-left" />
            <div className="cyber-modal-decal bottom-right" />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div className="cyber-modal-icon-container">
                <ShieldAlert size={36} className="cyber-modal-icon" />
              </div>
              
              <div>
                <div className="cyber-modal-tag">// CRITICAL WARNING PROTOCOL</div>
                <h3 className="cyber-modal-title">MEM_PURGE_CONFIRMATION</h3>
              </div>

              <p className="cyber-modal-desc">
                You are about to execute a complete database wipe. This action will clear all enrolled courses, completed lessons, certificates, and daily study history. This process cannot be undone.
              </p>

              <div className="cyber-modal-actions">
                <button 
                  className="btn-cyber-modal cancel"
                  onClick={() => setShowResetConfirm(false)}
                >
                  [ CANCEL_ABORT ]
                </button>
                <button 
                  className="btn-cyber-modal confirm"
                  onClick={() => {
                    resetProgress();
                    setSelectedDay(currentDayLabel);
                    setShowResetConfirm(false);
                  }}
                >
                  [ CONFIRM_PURGE ]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Futuristic Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="cyber-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="cyber-modal-content" onClick={e => e.stopPropagation()}>
            {/* Corner tech decals */}
            <div className="cyber-modal-decal top-left" />
            <div className="cyber-modal-decal top-right" />
            <div className="cyber-modal-decal bottom-left" />
            <div className="cyber-modal-decal bottom-right" />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div className="cyber-modal-icon-container" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                <ShieldAlert size={36} className="cyber-modal-icon" style={{ color: '#ef4444' }} />
              </div>
              
              <div>
                <div className="cyber-modal-tag" style={{ color: '#ef4444' }}>// IDENTITY_TERMINATION_PROTOCOL</div>
                <h3 className="cyber-modal-title" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.3)' }}>ACCOUNT_SHRED_CONFIRMATION</h3>
              </div>

              <p className="cyber-modal-desc">
                CRITICAL: You are about to initiate total identity termination. This action will permanently shred your credentials, student profile, achievements, progress statistics, and certificates from the local matrix. This process is immediate and irreversible.
              </p>

              <div className="cyber-modal-actions">
                <button 
                  className="btn-cyber-modal cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  [ CANCEL_ABORT ]
                </button>
                <button 
                  className="btn-cyber-modal confirm"
                  style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444', color: '#ef4444' }}
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    deleteAccount();
                  }}
                >
                  [ SHRED_IDENTITY ]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Futuristic Avatar Selector Modal */}
      {showAvatarModal && (
        <div className="cyber-modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="cyber-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            {/* Corner tech decals */}
            <div className="cyber-modal-decal top-left" />
            <div className="cyber-modal-decal top-right" />
            <div className="cyber-modal-decal bottom-left" />
            <div className="cyber-modal-decal bottom-right" />

            {/* Close Button */}
            <button 
              className="cyber-modal-close"
              onClick={() => setShowAvatarModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div style={{ textAlign: 'left' }}>
                <div className="cyber-modal-tag">// IDENTITY_MATRIX_CONFIGURATION</div>
                <h3 className="cyber-modal-title" style={{ margin: '0.25rem 0 0 0' }}>MUTATE_AVATAR</h3>
              </div>

              {/* Current Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                <div style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', boxShadow: '0 0 15px var(--primary-glow)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderAvatar()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>Avatar Preview</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif" }}>Format: JPG, PNG, GIF, SVG (Max 2MB)</span>
                  {user?.avatar && (
                    <button 
                      onClick={() => updateProfile(null, null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                        textAlign: 'left',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: "'Space Grotesk', sans-serif"
                      }}
                    >
                      [ Remove Custom Avatar ]
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>Upload Custom File</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <button 
                  className="btn btn-secondary" 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '100%', justifyContent: 'center', height: '48px' }}
                >
                  <Upload size={16} />
                  <span>UPLOAD IMAGE</span>
                </button>
              </div>

              {/* Preset Gradients */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>Select Neural Preset</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = user?.avatar === preset.value;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => updateProfile(null, preset.value)}
                        style={{
                          height: '64px',
                          borderRadius: 'var(--radius-md)',
                          background: preset.value,
                          border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: isSelected ? '0 0 10px var(--primary-glow)' : 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'transform 0.2s, border-color 0.2s',
                          overflow: 'hidden'
                        }}
                        title={preset.name}
                        className="preset-avatar-btn"
                      >
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff'
                          }}>
                            <CheckCircle size={20} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAvatarModal(false)}
                  style={{ height: '40px', padding: '0 1.5rem' }}
                >
                  <span>CLOSE CONFIG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
