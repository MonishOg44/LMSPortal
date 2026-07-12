import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { getCourseProgress, getLessonCount } = useProgress();

  const progress = getCourseProgress(course.id);
  const totalLessons = getLessonCount(course.id);
  const [isEnrolled, setIsEnrolled] = useState(false);

const handleCardClick = (resume = false) => {
  const isResume = resume === true;
  console.log("Navigating to course:", course.id);
  navigate(`/course/${course.id}`, {
    state: { resume: isResume }
  });
};
  const handleEnroll = async (e) => {
    e.stopPropagation();

    const username = localStorage.getItem("username");

    if (!username) {
        alert("Please login first.");
        return;
    }

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/Enrollment`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    username,
                    courseId: course.id
                })
            }
        );

        const result = await response.text();

        if (response.ok) {
            alert(result);
            setIsEnrolled(true);
        } else {
            alert(result);
        }
    } catch (error) {
        alert("Unable to connect to the server.");
    }
};

  return (
    <div className="course-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="course-image-wrapper">
        <img src={course.image} alt={course.title} className="course-image" loading="lazy" />
        <span className="course-badge">{course.category}</span>
      </div>

      <div className="course-card-content">
        <div className="course-card-meta">
          <span style={{ color: '#a855f7', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
            {course.level}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{course.rating}</span>
          </div>
        </div>

        <h3 className="course-card-title">{course.title}</h3>
        
        <div className="course-instructor">
          <span>By {course.instructor}</span>
        </div>

        {/* Progress Bar (if started) */}
        {progress > 0 && (
          <div className="progress-container" onClick={(e) => e.stopPropagation()}>
            <div className="progress-label-row">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className={`progress-bar-fill ${progress === 100 ? 'completed' : ''}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="course-stats">
          <div className="course-stat-item">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
          <div className="course-stat-item">
            <BookOpen size={14} />
            <span>{totalLessons} lessons</span>
          </div>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          {progress === 100 ? (
            <button 
              className="btn btn-secondary btn-full" 
              style={{ borderColor: '#10b981', color: '#10b981', display: 'flex', gap: '0.4rem', justifyContent: 'center', alignItems: 'center' }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(true);
              }}
            >
              <CheckCircle2 size={16} />
              <span>Completed</span>
            </button>
          ) : progress > 0 ? (
            <button 
              className="btn btn-primary btn-full"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(false);
              }}
            >
              Resume Learning
            </button>
          ) : (
            <button 
              className="btn btn-secondary btn-full"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              Start Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
