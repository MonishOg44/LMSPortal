import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { courses } from '../data/courses';
import { useProgress } from '../context/ProgressContext';
import { Search, BookOpen, Clock, Award, Play, ArrowLeft, Star, CheckCircle2, Cpu, Terminal, Compass, Layers } from 'lucide-react';

export default function Catalog() {
  const navigate = useNavigate();
  const { enrolledCourses, getCourseProgress, getLessonCount, theme } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [courses, setCourses] = useState([]);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/Courses`, {
    headers: { 'ngrok-skip-browser-warning': 'true' }
  })
    .then(res => res.json())
    .then(data => {
      console.log("Courses:", data);
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

  const getCategoryCount = (category) => {
    if (category === 'All') return courses.length;
    return courses.filter(c => c.category === category).length;
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="catalog-root">
      <div className="catalog-inner-pad">
      {/* Background grids and glowing nodes */}
      <div className="catalog-bg-grid" />
      <div className="catalog-scanline" />
      <div className="catalog-glow-node node-1" />
      <div className="catalog-glow-node node-2" />

      {/* Holographic Header */}
      <div className="catalog-header-capsule fade-in-up-staggered" style={{ '--delay': '50ms' }}>
        <div className="catalog-header-tech-row">
          <div className="tech-badge">
            <span className="tech-status-dot active"></span>
            <span>SECURE_NODE // CATALOG_ONLINE</span>
          </div>
          <div className="tech-meta-item">
            <Terminal size={12} />
            <span>SYS_VERSION // v4.2.1</span>
          </div>
          <div className="tech-meta-item">
            <Cpu size={12} />
            <span>ENROLLED // {enrolledCourses.length} MODULES</span>
          </div>
        </div>

        <div className="catalog-header-title-group">
          <button className="catalog-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            <span>RETURN TO MENU</span>
          </button>
          <h1 className="catalog-title glitch-title" data-text="EXPLORE CATALOG">
            EXPLORE CATALOG
          </h1>
          <p className="catalog-subtitle">
            Access strangegt engineering modules, UI/UX systems, and rapid prototyping workflows.
          </p>
        </div>
      </div>

      {/* Control Center: Search & Categories */}
      <div className="catalog-controls fade-in-up-staggered" style={{ '--delay': '120ms' }}>
        <div className="catalog-search-wrapper">
          <Search className="catalog-search-icon" size={18} />
          <input 
            type="text" 
            placeholder="FILTER BY COURSE TITLE" 
            className="catalog-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="catalog-search-hint">
            <span>SYS // SEARCH_DB</span>
          </div>
        </div>

        <div className="catalog-filter-grid">
          {categories.map((cat, index) => {
            const isActive = activeCategory === cat;
            const prefix = index.toString().padStart(2, '0');
            return (
              <button
                key={cat}
                className={`catalog-filter-pill ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span className="pill-index">[{prefix}]</span>
                <span className="pill-label">{cat.toUpperCase()}</span>
                <span className="pill-count">{getCategoryCount(cat)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cyber Grid Content */}
      {filteredCourses.length > 0 ? (
        <div className="catalog-grid fade-in-up-staggered" style={{ '--delay': '200ms' }}>
          {filteredCourses.map((course, idx) => {
            const progress = getCourseProgress(course.id);
            const totalLessons = getLessonCount(course.id);
            const indexStr = (idx + 1).toString().padStart(3, '0');

            return (
              <div 
                key={course.id} 
                className={`cyber-card ${progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : ''}`}
                onClick={() => handleCourseClick(course.id)}
              >
                {/* Tech card borders */}
                <div className="card-corner tl" />
                <div className="card-corner tr" />
                <div className="card-corner bl" />
                <div className="card-corner br" />
                <div className="card-index">// {indexStr}</div>

                <div className="cyber-card-img-container">
                  <img src={course.image} alt={course.title} className="cyber-card-img" />
                  <div className="cyber-card-img-overlay" />
                  <span className="cyber-card-category-badge">{course.category.toUpperCase()}</span>
                </div>

                <div className="cyber-card-body">
                  <div className="cyber-card-meta-row">
                    <span className="cyber-card-level">[{course.level.toUpperCase()}]</span>
                    <div className="cyber-card-rating">
                      <Star size={12} fill="var(--primary)" color="var(--primary)" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 className="cyber-card-title">{course.title}</h3>
                  <p className="cyber-card-desc">{course.description}</p>

                  <div className="cyber-card-stats-row">
                    <div className="stat-pill">
                      <Clock size={12} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="stat-pill">
                      <Layers size={12} />
                      <span>{totalLessons} LESSONS</span>
                    </div>
                  </div>

                  {/* Cyber progress indicator */}
                  {progress > 0 && (
                    <div className="cyber-progress-box" onClick={(e) => e.stopPropagation()}>
                      <div className="progress-details">
                        <span>MODULE_SYNC</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="progress-track">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="cyber-card-action">
                    {progress === 100 ? (
                      <button className="cyber-action-btn completed">
                        <CheckCircle2 size={14} />
                        <span>SESSION COMPLETE</span>
                      </button>
                    ) : progress > 0 ? (
                      <button className="cyber-action-btn active">
                        <Play size={14} fill="currentColor" />
                        <span>RESUME STREAM</span>
                      </button>
                    ) : (
                      <button className="cyber-action-btn">
                        <span>INITIALIZE SESSION</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="catalog-empty-state fade-in-up-staggered" style={{ '--delay': '200ms' }}>
          <Compass size={48} className="empty-icon animate-pulse" />
          <h3>NO DATA NODES FOUND</h3>
          <p>We couldn't retrieve any courses matching your search token. Re-verify search credentials.</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
            }}
          >
            RESET SYSTEM FILTER
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
