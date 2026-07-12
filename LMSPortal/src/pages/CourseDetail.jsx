import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useProgress } from '../context/ProgressContext';
import { 
  ArrowLeft, Play, Clock, 
  FileText, Download, Send, Award
} from 'lucide-react';
export default function CourseDetail() {
  const { id } = useParams();
  console.log("URL ID:", id, typeof id);
  const location = useLocation();
const resume = location.state?.resume;
  const { 
    completedLessons, toggleLessonCompleted, markLessonComplete,
    getCourseProgress, enrollInCourse, user 
  } = useProgress();
  const userName = user?.name || 'monish';
  const [activeLesson, setActiveLesson] = useState(null);
  const [prevCourseId, setPrevCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [course, setCourse] = useState(null);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/Courses/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log("Course from API:", data);
      setCourse(data);
    })
    .catch(err => console.error(err));
}, [id]);
  
  // Discussion state
  const [comments, setComments] = useState([
    { id: 1, user: "Sarah Jenkins", role: "Instructor", text: "Welcome to the course! Feel free to ask any questions here.", date: "2 days ago" },
    { id: 2, user: "Daniel K.", role: "Student", text: "This is exactly what I was looking for. The compound component design is so clean.", date: "1 day ago" }
  ]);
  const [newComment, setNewComment] = useState('');

  const videoRef = useRef(null);

useEffect(() => {
  if (!course) return;

  if (!course.modules || course.modules.length === 0) {
    console.log("No modules found");
    return;
  }

  if (!course.modules[0].lessons || course.modules[0].lessons.length === 0) {
    console.log("No lessons found");
    return;
  }

  if (!resume) {
    setActiveLesson(course.modules[0].lessons[0]);
    return;
  }


  const completed = completedLessons[course.id] || [];

  let nextLesson = null;

  for (const module of course.modules) {
    const lesson = module.lessons.find(
      lesson => !completed.includes(lesson.id)
    );

    if (lesson) {
      nextLesson = lesson;
      break;
    }
  }


  if (!nextLesson) {
    const lastModule = course.modules[course.modules.length - 1];
    nextLesson = lastModule.lessons[lastModule.lessons.length - 1];
  }


  setActiveLesson(nextLesson);

}, [course, completedLessons, resume]);



  if (course && !activeLesson) {
  return (
    <div className="empty-state" style={{ margin: "4rem 0" }}>
      <h2>Loading Course Details...</h2>
    </div>
  );
}

  if (!course) {
    return (
      <div className="empty-state" style={{ margin: '4rem 0' }}>
        <h2>Course Not Found</h2>
        <p>The course you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  // Video progress event listener for ReactPlayer
  const handleProgress = (state) => {
    // If progress is greater than 90%, mark lesson as complete automatically
    if (state.played > 0.9) {
      markLessonComplete(course.id, activeLesson.id);
    }
  };

  const handleVideoEnded = () => {
    markLessonComplete(course.id, activeLesson.id);
  };

  // Check if a lesson is completed
  const isCompleted = (lessonId) => {
    return completedLessons[String(course.id)]?.includes(String(lessonId)) || false;
  };

  // Add a new comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const post = {
      id: comments.length + 1,
      user: userName,
      role: "Student",
      text: newComment,
      date: "Just now"
    };

    setComments(prev => [post, ...prev]);
    setNewComment('');
  };

  const currentProgress = getCourseProgress(course.id);

  return (
    <div className="page-container">
      {/* Back Button */}
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignSelf: 'flex-start' }}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ color: '#a855f7', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            {course.category} • {course.level}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', marginBottom: '0.25rem' }}>
            {course.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Taught by <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{course.instructor}</span>
          </p>
        </div>

        {currentProgress === 100 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.6rem 1.2rem', borderRadius: '12px', color: '#10b981', fontWeight: 700 }}>
            <Award size={20} />
            <span>Course Completed!</span>
          </div>
        )}
      </div>

      {/* Main Grid: Video Player + Sidebar */}
      <div className="course-detail-container">
        
        {/* Left Side: Video Player & Tabs */}
        <div className="video-section">
          
          {/* Custom Video Player */}
          <div className="player-container">
            <ReactPlayer 
              src={activeLesson.videoUrl} 
              controls
              playing={false}
              onProgress={handleProgress}
              onEnded={handleVideoEnded}
              width="100%"
              height="100%"
              style={{ display: 'block' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Now Playing</span>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700 }}>{activeLesson.title}</h3>
            </div>
         <button
    className={`btn ${isCompleted(activeLesson.id) ? 'btn-secondary' : 'btn-primary'}`}
    style={
        isCompleted(activeLesson.id)
            ? { borderColor: '#10b981', color: '#10b981' }
            : {}
    }
    onClick={() => {
        console.log("Button clicked");
        toggleLessonCompleted(course.id, activeLesson.id);
    }}
>
    {isCompleted(activeLesson.id)
        ? "Completed ✓"
        : "Mark as Complete"}
</button>
          </div>

          {/* Navigation Tabs */}
          <div className="detail-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              Resources ({course.resources?.length || 0})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`}
              onClick={() => setActiveTab('discussion')}
            >
              Discussion
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="tab-content-panel">
            {activeTab === 'overview' && (
              <div>
                <h3>About this Course</h3>
                <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>{course.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.9rem' }}>Total Duration</strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{course.duration}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.9rem' }}>Difficulty</strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{course.level}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <h3>Course Resources</h3>
                <p>Download cheatsheets, code templates, and project materials to follow along.</p>
                <div className="resources-list">
                  {course.resources?.map(res => (
                    <div className="resource-item" key={res.id}>
                      <div className="resource-info">
                        <FileText size={18} style={{ color: '#6366f1' }} />
                        <span>{res.title}</span>
                      </div>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', gap: '0.25rem' }}>
                        <Download size={14} />
                        <span>{res.size}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="discussion-board">
                <h3>Class Discussion</h3>
                <form className="discussion-form" onSubmit={handleCommentSubmit}>
                  <input 
                    type="text" 
                    placeholder="Ask a question or share your progress..." 
                    className="discussion-input"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
                    <Send size={16} />
                  </button>
                </form>

                <div className="posts-list">
                  {comments.map(post => (
                    <div className="post-card" key={post.id}>
                      <div className="post-header">
                        <div className="post-user">
                          <div className="avatar" style={{ width: '22px', height: '22px', fontSize: '0.7rem' }}>
                            {post.user[0]}
                          </div>
                          <span>{post.user}</span>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            padding: '0.1rem 0.4rem', 
                            borderRadius: '4px',
                            background: post.role === 'Instructor' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                            color: post.role === 'Instructor' ? '#a855f7' : '#6366f1',
                            fontWeight: 700
                          }}>
                            {post.role}
                          </span>
                        </div>
                        <span className="post-date">{post.date}</span>
                      </div>
                      <p className="post-content">{post.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Syllabus Sidebar */}
        <div className="sidebar-syllabus">
          <div className="syllabus-title-row">
            <h2>Course Outline</h2>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              {currentProgress}% complete
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', maxHeight: '500px', paddingRight: '0.25rem' }}>
            {(course.modules || []).map((mod, modIdx) => (
              <div className="module-container" key={modIdx}>
                <div className="module-header">{mod.title}</div>
                <div className="lesson-list">
                  {mod.lessons.map(lesson => {
                    const active = activeLesson.id === lesson.id;
                    const complete = isCompleted(lesson.id);

                    return (
                      <div 
                        className={`lesson-item ${active ? 'active' : ''}`}
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                      >
                        {/* Interactive Checkbox */}
                        <div 
                          className={`lesson-checkbox ${complete ? 'completed' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLessonCompleted(course.id, lesson.id);
                          }}
                        >
                          {complete && <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>✓</span>}
                        </div>
                        
                        <div className="lesson-info">
                          <span className="lesson-title">{lesson.title}</span>
                          <span className="lesson-dur">
                            <Clock size={10} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                            {lesson.duration}
                          </span>
                        </div>

                        {active && <Play size={12} fill="#6366f1" style={{ color: '#6366f1' }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
