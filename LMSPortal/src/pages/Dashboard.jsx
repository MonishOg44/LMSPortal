import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
//import { courses } from '../data/courses';
import CourseCard from '../components/CourseCard';
import WireframeSphere from '../components/WireframeSphere';
import { useProgress } from '../context/ProgressContext';
import { Search, BookOpen, Clock, Award, Play, Cpu, Layers, Terminal, Compass, Star } from 'lucide-react';
export default function Dashboard() {
  const navigate = useNavigate();
  const { enrolledCourses, getCourseProgress, timeSpent, getCertificates, user } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
 const [profile, setProfile] = useState(null);
const [courses, setCourses] = useState([]);

useEffect(() => {
    const user = JSON.parse(localStorage.getItem("strange_user"));

    if (!user?.username) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/Auth/profile/${user.username}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
    })
        .then(res => {
            if (!res.ok) throw new Error("Profile request failed");
            return res.json();
        })
        .then(data => setProfile(data))
        .catch(err => console.error("Profile fetch:", err));
}, []);

useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/Courses`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
    })
        .then(res => res.json())
        .then(data => {
            console.log("Courses from API:", data);
            setCourses(data);
        })
        .catch(err => console.error(err));
}, []);

  // Categories list
  const categories = ['All', 'Development', 'Design', 'Business', 'Marketing'];

  // Filter courses based on search & category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get in-progress course
  const inProgressCourses = courses.filter(course => {
    const progress = getCourseProgress(course.id);
    return progress > 0 && progress < 100;
  });

  const completedCoursesCount = getCertificates().length;
  const activeEnrolledCount = enrolledCourses.length - completedCoursesCount;

  // Format study time spent
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;
  };

// Find the first course to resume, or default to first course
const courseToResume =
  inProgressCourses.length > 0
    ? inProgressCourses[0]
    : courses.length > 0
      ? courses[0]
      : null;

const resumeProgress = courseToResume
  ? getCourseProgress(courseToResume.id)
  : 0;
  return (
    <div className="dashboard-root">
      {/* FABRIC Hero Banner */}
      <div className="fabric-hero-banner fade-in-up-staggered" style={{ '--delay': '80ms' }}>
        {/* Left Side: 3D Wireframe Sphere — full-height, no border card */}
        <div className="fabric-hero-left">
          <WireframeSphere />
        </div>
        
        {/* Right Side: Large Typography and Subsections */}
        <div className="fabric-hero-right">
          <div className="fabric-hero-title-group">
            <span className="fabric-hero-sub">STRANGEGT ACADEMY // MASTERPIECE ENGINEERING</span>
            <h1 className="fabric-hero-title glitch-title">
              CREATIVE<br/>
              DEVELOPMENT<br/>
              STUDIO FOR<br/>
              SMART LEARNING
            </h1>
          </div>

          {/* Quick stats row beneath the title */}
          <div className="fabric-hero-stats-row">
            <div className="fabric-hero-stat">
              <span className="fabric-hero-stat-num">{courses.length}</span>
              <span className="fabric-hero-stat-lbl">MODULES</span>
            </div>
            <div className="fabric-hero-stat-divider" />
            <div className="fabric-hero-stat">
              <span className="fabric-hero-stat-num">{enrolledCourses.length}</span>
              <span className="fabric-hero-stat-lbl">ENROLLED</span>
            </div>
            <div className="fabric-hero-stat-divider" />
            <div className="fabric-hero-stat">
              <span className="fabric-hero-stat-num">{completedCoursesCount}</span>
              <span className="fabric-hero-stat-lbl">COMPLETED</span>
            </div>
          </div>

          <div className="fabric-hero-links">
            <div 
              className="fabric-hero-link-item"
              onClick={() => navigate('/catalog')}
            >
              <div className="fabric-link-content">
                <span className="fabric-link-title">EXPLORE CATALOG</span>
                <span className="fabric-link-subtitle">Discover engineering modules</span>
              </div>
              <span className="fabric-link-arrow">&rarr;</span>
            </div>

            <div 
              className="fabric-hero-link-item"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (!courseToResume) return;
                navigate(`/course/${courseToResume.id}`, { state: { resume: true } });
              }}
            >
              <div className="fabric-link-content">
                <span className="fabric-link-title">
                {courseToResume
  ? (resumeProgress > 0
      ? `RESUME: ${courseToResume.title.split(':')[0]}`
      : 'START YOUR FIRST COURSE')
  : 'Loading Courses...'}
                </span>
                <span className="fabric-link-subtitle">
                  {courseToResume
  ? (resumeProgress > 0
      ? `${resumeProgress}% completed • Continue learning`
      : 'Begin path in Web Engineering')
  : 'Please wait...'}
                </span>
              </div>
              <span className="fabric-link-arrow">&rarr;</span>
            </div>
          </div>
        </div>

        {/* Giant clipped text running across the bottom */}
        <div className="fabric-giant-footer">STRANGEGT</div>
      </div>

      {/* Centered Dashboard Content */}
      <div className="dashboard-content-container">
        {/* Stats Divider Grid */}
        <div className="fabric-stats-container fade-in-up-staggered" style={{ '--delay': '200ms' }}>
          <div className="fabric-stat-cell">
            <div className="fabric-stat-icon-text">
              <Play size={16} style={{ color: 'var(--sphere-color)' }} />
              <span className="fabric-stat-label">ACTIVE COURSES</span>
            </div>
            <span className="fabric-stat-value">{activeEnrolledCount}</span>
          </div>
          <div className="fabric-stat-cell">
            <div className="fabric-stat-icon-text">
              <Clock size={16} style={{ color: 'var(--sphere-color)' }} />
              <span className="fabric-stat-label">HOURS LEARNED</span>
            </div>
            <span className="fabric-stat-value">{formatTime(timeSpent)}</span>
          </div>
          <div className="fabric-stat-cell">
            <div className="fabric-stat-icon-text">
              <Award size={16} style={{ color: 'var(--sphere-color)' }} />
              <span className="fabric-stat-label">CERTIFICATES EARNED</span>
            </div>
            <span className="fabric-stat-value">{completedCoursesCount}</span>
          </div>
        </div>

        {/* In Progress Row */}
        {inProgressCourses.length > 0 && (
          <div className="fade-in-up-staggered" style={{ marginBottom: '2.5rem', '--delay': '320ms' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--sphere-color)' }}></span>
              Resume Learning
            </h2>
            <div className="course-grid">
              {inProgressCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Creative Section (Collage & Wave) */}
      <div className="dynamic-creative-section fade-in-up-staggered" style={{ '--delay': '350ms' }}>
        
        {/* Background collage vectors and text streams */}
        <div className="creative-bg-canvas-container">
          <svg className="creative-wave-svg" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="wave-path-1" d="M0,220 Q360,120 720,220 T1440,220" stroke="var(--primary)" strokeWidth="2.5" strokeDasharray="6 6" />
            <path className="wave-path-2" d="M0,280 Q360,380 720,280 T1440,280" stroke="var(--border-highlight)" strokeWidth="1.5" opacity="0.6" />
            <path className="wave-path-3" d="M0,170 Q360,70 720,170 T1440,170" stroke="var(--accent)" strokeWidth="3" opacity="0.3" />
          </svg>
          
          <div className="creative-bg-text-stream left-stream">
            <span>SYS_CONNECTED // COGNITIVE_UP_LOAD // SYNAPTIC_FIRE // NODE_789 // </span>
            <span>SYS_CONNECTED // COGNITIVE_UP_LOAD // SYNAPTIC_FIRE // NODE_789 // </span>
          </div>
          <div className="creative-bg-text-stream right-stream">
            <span>DECENTRALIZED_LMS // METAMATERIAL_LABS // ACCELERATION // </span>
            <span>DECENTRALIZED_LMS // METAMATERIAL_LABS // ACCELERATION // </span>
          </div>
          <div className="creative-grid-overlay"></div>
        </div>

        {/* Foreground Typography */}
        <div className="creative-typography-container">
          <h2 className="creative-main-title">
            <span className="title-row-1">ACCELERATING</span>
            <span className="title-accent-word">COGNITIVE</span>
            <span className="title-row-2">SYSTEMS</span>
            <span className="title-row-3">FOR ALL</span>
          </h2>
          
          <div className="creative-divider-line"></div>

          <h4 className="creative-subtitle">
            Harnessing Neural Models for Collective Prototyping
          </h4>
          
          <p className="creative-desc">
            Our nodes process educational telemetry in real-time. This system equips creative engineers with tools to synchronize cognitive assets, navigate computational complexity, and build decentralized frameworks grounded in truth and raw performance.
          </p>
        </div>

      </div>
    </div>
  );
}

