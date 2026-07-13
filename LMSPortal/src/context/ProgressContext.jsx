import { createContext, useContext, useState, useEffect } from 'react';
//import { courses } from '../data/courses';

const ProgressContext = createContext();

const ACCENT_PRESETS = {
  orange: {
    light: {
      primary: '#ff6b35',
      primaryGlow: 'rgba(255, 107, 53, 0.15)',
      primaryHover: '#ff5415',
      accent: '#f59e0b',
      gradPrimary: 'linear-gradient(135deg, #ff6b35 0%, #ff8c32 50%, #f59e0b 100%)',
      gradPrimaryHover: 'linear-gradient(135deg, #ff5415 0%, #ff7715 50%, #d97706 100%)',
      borderGlow: 'rgba(255, 107, 53, 0.12)',
      shadowGlow: '0 0 25px rgba(255, 107, 53, 0.15)',
      sphereColor: '#ff6b35'
    },
    dark: {
      primary: '#ff7d4d',
      primaryGlow: 'rgba(255, 125, 77, 0.25)',
      primaryHover: '#ff6b35',
      accent: '#fbbf24',
      gradPrimary: 'linear-gradient(135deg, #ff7d4d 0%, #fbbf24 50%, #f59e0b 100%)',
      gradPrimaryHover: 'linear-gradient(135deg, #ff6b35 0%, #f59e0b 50%, #d97706 100%)',
      borderGlow: 'rgba(255, 125, 77, 0.18)',
      shadowGlow: '0 0 25px rgba(255, 125, 77, 0.2)',
      sphereColor: '#ff7d4d'
    }
  },
  blue: {
    light: {
      primary: '#0066cc',
      primaryGlow: 'rgba(0, 102, 204, 0.15)',
      primaryHover: '#0052a3',
      accent: '#00b4d8',
      gradPrimary: 'linear-gradient(135deg, #0066cc 0%, #0096c7 50%, #00b4d8 100%)',
      gradPrimaryHover: 'linear-gradient(135deg, #0052a3 0%, #0077b6 50%, #0096c7 100%)',
      borderGlow: 'rgba(0, 102, 204, 0.12)',
      shadowGlow: '0 0 25px rgba(0, 102, 204, 0.15)',
      sphereColor: '#0066cc'
    },
    dark: {
      primary: '#3a86ff',
      primaryGlow: 'rgba(58, 134, 255, 0.25)',
      primaryHover: '#2b76ea',
      accent: '#00f5d4',
      gradPrimary: 'linear-gradient(135deg, #3a86ff 0%, #00b4d8 50%, #00f5d4 100%)',
      gradPrimaryHover: 'linear-gradient(135deg, #2b76ea 0%, #0096c7 50%, #00dda3 100%)',
      borderGlow: 'rgba(58, 134, 255, 0.18)',
      shadowGlow: '0 0 25px rgba(58, 134, 255, 0.2)',
      sphereColor: '#3a86ff'
    }
  },
  green: {
    light: {
      primary: '#059669',
      primaryGlow: 'rgba(5, 150, 105, 0.15)',
      primaryHover: '#047857',
      accent: '#10b981',
      gradPrimary: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
      gradPrimaryHover: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
      borderGlow: 'rgba(5, 150, 105, 0.12)',
      shadowGlow: '0 0 25px rgba(5, 150, 105, 0.15)',
      sphereColor: '#059669'
    },
    dark: {
      primary: '#10b981',
      primaryGlow: 'rgba(16, 185, 129, 0.25)',
      primaryHover: '#059669',
      accent: '#52b788',
      gradPrimary: 'linear-gradient(135deg, #10b981 0%, #52b788 50%, #74c69d 100%)',
      gradPrimaryHover: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #52b788 100%)',
      borderGlow: 'rgba(16, 185, 129, 0.18)',
      shadowGlow: '0 0 25px rgba(16, 185, 129, 0.2)',
      sphereColor: '#10b981'
    }
  },
  pink: {
    light: {
      primary: '#db2777',
      primaryGlow: 'rgba(219, 39, 119, 0.15)',
      primaryHover: '#be185d',
      accent: '#f472b6',
      gradPrimary: 'linear-gradient(135deg, #db2777 0%, #ec4899 50%, #f472b6 100%)',
      gradPrimaryHover: 'linear-gradient(135deg, #be185d 0%, #db2777 50%, #ec4899 100%)',
      borderGlow: 'rgba(219, 39, 119, 0.12)',
      shadowGlow: '0 0 25px rgba(219, 39, 119, 0.15)',
      sphereColor: '#db2777'
    },
    dark: {
      primary: '#ff007f',
      primaryGlow: 'rgba(255, 0, 127, 0.25)',
      primaryHover: '#e60072',
      accent: '#ff73c2',
      gradPrimary: 'linear-gradient(135deg, #ff007f 0%, #ff73c2 50%, #ffa6df 100%)',
      gradPrimaryHover: 'linear-gradient(135deg, #e60072 0%, #ff007f 50%, #ff73c2 100%)',
      borderGlow: 'rgba(255, 0, 127, 0.18)',
      shadowGlow: '0 0 25px rgba(255, 0, 127, 0.2)',
      sphereColor: '#ff007f'
    }
  },
  purple: {
    light: {
      primary: '#7c3aed',
      primaryGlow: 'rgba(124, 58, 237, 0.15)',
      primaryHover: '#6d28d9',
      accent: '#a78bfa',
      gradPrimary: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)',
      gradPrimaryHover: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%)',
      borderGlow: 'rgba(124, 58, 237, 0.12)',
      shadowGlow: '0 0 25px rgba(124, 58, 237, 0.15)',
      sphereColor: '#7c3aed'
    },
    dark: {
      primary: '#9d4edd',
      primaryGlow: 'rgba(157, 78, 221, 0.25)',
      primaryHover: '#7b2cbf',
      accent: '#e0aaff',
      gradPrimary: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 50%, #e0aaff 100%)',
      gradPrimaryHover: 'linear-gradient(135deg, #7b2cbf 0%, #9d4edd 50%, #c77dff 100%)',
      borderGlow: 'rgba(157, 78, 221, 0.18)',
      shadowGlow: '0 0 25px rgba(157, 78, 221, 0.2)',
      sphereColor: '#9d4edd'
    }
  }
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 107, b: 53 };
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/Courses`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => {
        console.log("ProgressContext Courses:", data);
        setCourses(data);
      })
      .catch(err => console.error(err));
  }, []);

  
  // User authentication state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('strange_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.name.toLowerCase() === '') {
          parsed.name = '';
          localStorage.setItem('strange_user', JSON.stringify(parsed));
        }
        if (parsed && !parsed.username) {
          parsed.username = localStorage.getItem('username') || '';
          localStorage.setItem('strange_user', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [completedLessons, setCompletedLessons] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [streak, setStreak] = useState(0);
  const [manualLogs, setManualLogs] = useState({ Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 });

  const [activeNotification, setActiveNotification] = useState(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('strange_theme');
    return saved || 'light';
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('strange_accent_color') || 'orange';
  });

  const [customColor, setCustomColor] = useState(() => {
    return localStorage.getItem('strange_custom_color') || '#ff6b35';
  });

  const [savedUsername, setSavedUsername] = useState(() => {
    const savedUser = localStorage.getItem('strange_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.username) return parsed.username;
      } catch (e) {}
    }
    return localStorage.getItem('username') || localStorage.getItem('strange_username') || 'monish';
  });

  const [savedPassword, setSavedPassword] = useState(() => {
    const saved = localStorage.getItem('strange_password');
    if (!saved || saved === 'onsih123' || saved === 'monish252005') return 'monish25';
    return saved;
  });

  // Global futuristic transition states
  const [isGlobalTransitioning, setIsGlobalTransitioning] = useState(false);
  const [globalTransitionProgress, setGlobalTransitionProgress] = useState(0);
  const [globalTransitionPhase, setGlobalTransitionPhase] = useState('idle'); // 'idle' | 'booting' | 'warping'
  const [globalTransitionLogs, setGlobalTransitionLogs] = useState([]);

  // Logout transition states
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutProgress, setLogoutProgress] = useState(0);
  const [logoutPhase, setLogoutPhase] = useState('idle'); // 'idle' | 'disconnecting' | 'collapsing'
  const [logoutLogs, setLogoutLogs] = useState([]);
  const [isDeleteTransition, setIsDeleteTransition] = useState(false);

  useEffect(() => {
    localStorage.setItem('strange_username', savedUsername);
  }, [savedUsername]);

  useEffect(() => {
    localStorage.setItem('strange_password', savedPassword);
  }, [savedPassword]);

  // Sync theme with document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('strange_theme', theme);
  }, [theme]);

  // Sync profile details with backend database on load/identity validation
  useEffect(() => {
    if (!user?.username) return;

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Auth/profile/${user.username}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.ok) {
          const profileData = await res.json();
          setUser(prev => {
            if (!prev) return prev;
            // Only update state if profile picture or name has changed to prevent infinite loops
            if (prev.avatar !== profileData.profilePicture || prev.name !== profileData.fullName) {
              const updated = {
                ...prev,
                name: profileData.fullName,
                avatar: profileData.profilePicture
              };
              localStorage.setItem('strange_user', JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Error syncing user profile:", err);
      }
    };

    fetchUserProfile();
  }, [user?.username]);

  const parseDurationToMinutes = (durationStr) => {
    if (!durationStr) return 0;
    let total = 0;
    const hoursMatch = durationStr.match(/(\d+)\s*h/);
    const minsMatch = durationStr.match(/(\d+)\s*m/);
    if (hoursMatch) {
      total += parseInt(hoursMatch[1], 10) * 60;
    }
    if (minsMatch) {
      total += parseInt(minsMatch[1], 10);
    }
    if (!hoursMatch && !minsMatch) {
      const singleMatch = durationStr.match(/\d+/);
      if (singleMatch) {
        total += parseInt(singleMatch[0], 10);
      }
    }
    return total;
  };

  // Load progress and calculate user statistics from backend data
  useEffect(() => {
    if (!user || courses.length === 0) return;

    const loadProgress = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Progress/${user.id}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await res.json();
        
        const completed = {};
        const activeCourses = [];
        let totalMinutes = 0;
        let totalLessonsCount = 0;
        const tempManualLogs = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

        data.forEach(item => {
          if (item.completed) {
            if (item.courseId === -1) {
              // Manual study log format: "manual_[Day]_[Minutes]_[Timestamp]"
              const parts = (item.lessonId || "").split('_');
              if (parts[0] === 'manual' && parts[1] && parts[2]) {
                const day = parts[1];
                const mins = parseInt(parts[2], 10);
                if (!isNaN(mins) && tempManualLogs[day] !== undefined) {
                  tempManualLogs[day] += mins / 60; // Store as hours
                  totalMinutes += mins;
                }
              }
            } else {
              const rawLessonId = (item.lessonId || "").split('_date_')[0];
              const courseIdStr = String(item.courseId);

              if (!completed[courseIdStr]) {
                completed[courseIdStr] = [];
              }
              if (!completed[courseIdStr].includes(rawLessonId)) {
                completed[courseIdStr].push(rawLessonId);
              }
              totalLessonsCount++;

              if (!activeCourses.includes(item.courseId)) {
                activeCourses.push(item.courseId);
              }

              const course = courses.find(c => String(c.id) === courseIdStr);
              if (course) {
                course.modules.forEach(mod => {
                  const lesson = mod.lessons.find(l => String(l.id) === rawLessonId);
                  if (lesson) {
                    totalMinutes += parseDurationToMinutes(lesson.duration);
                  }
                });
              }
            }
          }
        });

        setCompletedLessons(completed);
        setEnrolledCourses(activeCourses);
        setTimeSpent(totalMinutes);
        setStreak(totalLessonsCount > 0 ? Math.min(7, totalLessonsCount) : 0);
        setManualLogs(tempManualLogs);
      } catch (err) {
        console.error("Error loading progress:", err);
      }
    };

    loadProgress();
  }, [user, courses]);

  // Sync accent settings with document.style variables
  useEffect(() => {
    localStorage.setItem('strange_accent_color', accentColor);
    localStorage.setItem('strange_custom_color', customColor);

    const root = document.documentElement;
    if (accentColor !== 'custom') {
      const preset = ACCENT_PRESETS[accentColor]?.[theme] || ACCENT_PRESETS.orange[theme];
      root.style.setProperty('--primary', preset.primary);
      root.style.setProperty('--primary-glow', preset.primaryGlow);
      root.style.setProperty('--primary-hover', preset.primaryHover);
      root.style.setProperty('--accent', preset.accent);
      root.style.setProperty('--grad-primary', preset.gradPrimary);
      root.style.setProperty('--grad-primary-hover', preset.gradPrimaryHover);
      root.style.setProperty('--border-glow', preset.borderGlow);
      root.style.setProperty('--shadow-glow', preset.shadowGlow);
      root.style.setProperty('--sphere-color', preset.sphereColor);
    } else {
      const rgb = hexToRgb(customColor);
      const customPrimaryGlow = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
      const customBorderGlow = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
      const customShadowGlow = `0 0 25px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;

      root.style.setProperty('--primary', customColor);
      root.style.setProperty('--primary-glow', customPrimaryGlow);
      root.style.setProperty('--primary-hover', customColor);
      root.style.setProperty('--accent', customColor);
      root.style.setProperty('--grad-primary', `linear-gradient(135deg, ${customColor} 0%, ${customColor} 100%)`);
      root.style.setProperty('--grad-primary-hover', `linear-gradient(135deg, ${customColor} 0%, ${customColor} 100%)`);
      root.style.setProperty('--border-glow', customBorderGlow);
      root.style.setProperty('--shadow-glow', customShadowGlow);
      root.style.setProperty('--sphere-color', customColor);
    }
  }, [accentColor, customColor, theme]);

  // Sync with local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('strange_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('strange_user');
    }
  }, [user]);



  // Helper: show notification
  const triggerNotification = (message) => {
    setActiveNotification(message);
  };

  const login = (userData, password) => {

    const loggedInUser = {
        id: userData.userId,
        name: userData.fullName,
        username: userData.username,
        avatar: userData.profilePicture
    };

    setUser(loggedInUser);

    localStorage.setItem(
        "strange_user",
        JSON.stringify(loggedInUser)
    );

    if (userData.username) {
      setSavedUsername(userData.username);
      localStorage.setItem('strange_username', userData.username);
    }

    if (password) {
      setSavedPassword(password);
      localStorage.setItem('strange_password', password);
    }

    triggerNotification(
      `ACCESS_GRANTED // IDENTITY_VERIFIED: ${loggedInUser.name.toUpperCase()}`
    );
  };
  const startLogoutTransition = (onComplete, isDelete = false) => {
    setIsDeleteTransition(isDelete);
    setIsLoggingOut(true);
    setLogoutProgress(0);
    setLogoutPhase('disconnecting');
    setLogoutLogs(
      isDelete
        ? [
            'SYS // INITIATING IDENTITY SHREDDING PROTOCOL...',
            'AUTH // CLIENT_REQUEST_TOTAL_PURGE [DELETING]'
          ]
        : [
            'SYS // INITIATING DE-AUTHORIZATION PROTOCOL...',
            'AUTH // CLIENT_REQUEST_SIGN_OUT [REVOKING]'
          ]
    );

    const logsToInject = isDelete
      ? [
          { percent: 8, msg: 'DE-AUTH // SECURE TOKEN REVOCATION REQUESTED' },
          { percent: 18, msg: 'NET_SEC // SHUTTING DOWN MULTI-CHANNEL SOCKETS...' },
          { percent: 25, msg: 'DATABASE // DESTROYING USER DATA MATRIX...' },
          { percent: 38, msg: 'CACHE // SHREDDING LOCAL STORAGE DICTIONARIES...' },
          { percent: 45, msg: 'MEM // SYSTEM FORCE-PURGING ALL INSTANCES...' },
          { percent: 55, msg: 'MEM // ALL DATA SHREDDED [0x00000000 -> NULL]' },
          { percent: 68, msg: 'GRID // TEARING DOWN INTERACTIVE NEURAL NODES...' },
          { percent: 78, msg: 'KEY // ERASING ALL PASSWORD HASHES...' },
          { percent: 88, msg: 'CORE // DELETING CLIENT CRYPTO_SIGNATURES...' },
          { percent: 95, msg: 'SYS // DELETION COMPLETED. CLOSING MATRIX PORTAL...' }
        ]
      : [
          { percent: 8, msg: 'DE-AUTH // SECURE TOKEN REVOCATION REQUESTED' },
          { percent: 18, msg: 'NET_SEC // SHUTTING DOWN MULTI-CHANNEL SOCKETS...' },
          { percent: 25, msg: 'NET_SEC // SECURE_PORT_5173: CLOSED' },
          { percent: 38, msg: 'CACHE // SHREDDING LOCAL STORAGE DICTIONARIES...' },
          { percent: 45, msg: 'MEM // SYSTEM ATTEMPTING FORCE-PURGE BUFFER...' },
          { percent: 46, msg: 'SYS_RET // RETRYING HANDSHAKE RESPONSE... [OK]' },
          { percent: 55, msg: 'MEM // BUFFER FLUSHED [0x00000000 -> OK]' },
          { percent: 68, msg: 'GRID // TEARING DOWN INTERACTIVE NEURAL NODES...' },
          { percent: 78, msg: 'KEY // DELETING CLIENT CRYPTO_SIGNATURES...' },
          { percent: 88, msg: 'CORE // REMOVING SESSION ACCESS AUTHORIZATION' },
          { percent: 95, msg: 'SYS // DE-AUTH COMPLETED. CLOSING MATRIX PORTAL...' }
        ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      let increment = Math.floor(Math.random() * 5) + 2;
      
      // Introduce an organic connection tear-down lag
      if (currentProgress > 42 && currentProgress < 49 && Math.random() < 0.25) {
        increment = -2;
        const msg = isDelete ? 'SYS_RET // SHRED MATRIX STABILITY CHECK... RETRYING' : 'SYS_RET // NETWORK SHAKE... RETRYING HANDSHAKE';
        setLogoutLogs(prev => {
          if (!prev.includes(msg)) {
            return [...prev, msg];
          }
          return prev;
        });
      }
      
      currentProgress = Math.max(0, Math.min(currentProgress + increment, 100));
      setLogoutProgress(currentProgress);

      logsToInject.forEach(item => {
        if (currentProgress >= item.percent) {
          setLogoutLogs(prev => {
            if (!prev.includes(item.msg)) {
              return [...prev, item.msg];
            }
            return prev;
          });
        }
      });

      if (currentProgress >= 100) {
        clearInterval(interval);
        
        setLogoutPhase('collapsing');
        setLogoutLogs(prev => [...prev, isDelete ? 'SYS // SHREDDING COMPLETE. COLLAPSING NODE...' : 'SYS // COLLAPSING DIMENSIONAL PORTALS...']);

        setTimeout(() => {
          setLogoutPhase('idle');
          setIsLoggingOut(false);
          setIsDeleteTransition(false);
          if (onComplete) onComplete();
        }, 800);
      }
    }, 55);
  };

  const logout = () => {
    startLogoutTransition(() => {
      setUser(null);
      setSavedUsername('monish');
      setSavedPassword('monish25');
      localStorage.removeItem('strange_username');
      localStorage.removeItem('strange_password');
      triggerNotification(`SECURE_PORT_CLOSED // SESSION_DE_AUTHORIZED`);
    });
  };

  const deleteAccount = () => {
    if (!user?.id) return;
    const userIdToDelete = user.id;
    startLogoutTransition(async () => {
      setSavedUsername('monish');
      setSavedPassword('monish25');
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/Auth/delete/${userIdToDelete}`, {
          method: 'DELETE',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
      } catch (err) {
        console.error("Failed to delete account on backend:", err);
      }

      // Clear all localStorage keys related to this user
      const keysToRemove = [
        'strange_user',
        'strange_completed',
        'strange_enrolled',
        'strange_time_spent',
        'strange_streak',
        'strange_weekly_activity',
        'strange_username',
        'strange_password',
        'strange_theme',
        'strange_accent_color',
        'strange_custom_color',
        'strange_manual_study_logs'
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Reset all React state to defaults
      setUser(null);
      setCompletedLessons({});
      setEnrolledCourses([]);
      setTimeSpent(0);
      setStreak(0);
      setTheme('light');
      setAccentColor('orange');
      setCustomColor('#ff6b35');
      setSavedUsername('monish');
      setSavedPassword('monish25');

      triggerNotification('SYS_SHUTDOWN // ACCOUNT_DELETED // ALL_USER_DATA_SHREDDED');
    }, true);
  };

  const updateProfile = async (newName, newAvatar, avatarFile) => {
    let finalAvatar = newAvatar;

    if (avatarFile) {
      try {
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('userId', user.id);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Auth/upload-profile-picture`, {
          method: 'POST',
          body: formData,
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        if (res.ok) {
          const data = await res.json();
          finalAvatar = data.profilePictureUrl;
        } else {
          const errMsg = await res.text();
          triggerNotification(`SYS_ERROR // UPLOAD_FAILED // "${errMsg.toUpperCase()}"`);
          return;
        }
      } catch (err) {
        console.error("Error uploading profile picture:", err);
        triggerNotification("SYS_ERROR // NETWORK_FAILURE_ON_UPLOAD");
        return;
      }
    } else if (newAvatar !== undefined) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Auth/update-profile-picture-string`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            userId: user.id,
            profilePicture: newAvatar
          })
        });
        if (!res.ok) {
          triggerNotification("SYS_ERROR // UPDATE_AVATAR_FAILED");
          return;
        }
      } catch (err) {
        console.error("Error updating avatar string:", err);
      }
    }

    setUser(prev => {
      let updated = prev ? { ...prev } : {};
      if (newName !== undefined && newName !== null) {
        updated.name = newName.trim();
      }
      if (finalAvatar !== undefined) {
        updated.avatar = finalAvatar;
      }
      localStorage.setItem('strange_user', JSON.stringify(updated));
      return updated;
    });
    
    if (newName && finalAvatar) {
      triggerNotification(`SYS_CONFIG // IDENTITY_VERIFIED // PROFILE_UPDATED`);
    } else if (newName) {
      triggerNotification(`SYS_CONFIG // PROFILE_ID_MUTATED: "${newName.trim().toUpperCase()}"`);
    } else if (finalAvatar !== undefined) {
      triggerNotification(`SYS_CONFIG // AVATAR_MUTATED // STATUS: OK`);
    }
  };

  // Enroll in a course
  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses(prev => [...prev, courseId]);
      triggerNotification(`REGISTRY // NODE_EXPANSION_LOADED: "${getCourseTitle(courseId).toUpperCase()}"`);
    }
  };

  // Get course title helper
  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'New Course';
  };

  // Get total lessons count for a course
  const getLessonCount = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    return course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  };

  // Get percentage progress
  const getCourseProgress = (courseId) => {
    const total = getLessonCount(courseId);
    if (total === 0) return 0;
    const completed = completedLessons[courseId]?.length || 0;
    return Math.round((completed / total) * 100);
  };

const toggleLessonCompleted = async (courseId, lessonId) => {

  if (!user) {
    console.log("No user logged in");
    return;
  }

  enrollInCourse(courseId);

  const courseIdStr = String(courseId);
  const lessonIdStr = String(lessonId);

  const alreadyCompleted =
    completedLessons[courseIdStr]?.includes(lessonIdStr);


 const progressData = {
    userId: user.id,
    courseId: Number(courseId),
    lessonId: lessonIdStr,
    completed: !alreadyCompleted
};


  try {

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/Progress`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(progressData)
      }
    );


    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/Progress/${user.id}`,
      { headers: { 'ngrok-skip-browser-warning': 'true' } }
    );


    const data = await response.json();
    console.log(data);


    const completed = {};
    const activeCourses = [];
    let totalMinutes = 0;
    let totalLessonsCount = 0;
    const tempManualLogs = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    data.forEach(item => {
      if (item.completed) {
        if (item.courseId === -1) {
          const parts = (item.lessonId || "").split('_');
          if (parts[0] === 'manual' && parts[1] && parts[2]) {
            const day = parts[1];
            const mins = parseInt(parts[2], 10);
            if (!isNaN(mins) && tempManualLogs[day] !== undefined) {
              tempManualLogs[day] += mins / 60;
              totalMinutes += mins;
            }
          }
        } else {
          const rawLessonId = (item.lessonId || "").split('_date_')[0];
          const courseIdStr = String(item.courseId);

          if (!completed[courseIdStr]) {
            completed[courseIdStr] = [];
          }
          if (!completed[courseIdStr].includes(rawLessonId)) {
            completed[courseIdStr].push(rawLessonId);
          }
          totalLessonsCount++;

          if (!activeCourses.includes(item.courseId)) {
            activeCourses.push(item.courseId);
          }

          const course = courses.find(c => String(c.id) === courseIdStr);
          if (course) {
            course.modules.forEach(mod => {
              const lesson = mod.lessons.find(l => String(l.id) === rawLessonId);
              if (lesson) {
                totalMinutes += parseDurationToMinutes(lesson.duration);
              }
            });
          }
        }
      }
    });

    setCompletedLessons(completed);
    setEnrolledCourses(activeCourses);
    setTimeSpent(totalMinutes);
    setStreak(totalLessonsCount > 0 ? Math.min(7, totalLessonsCount) : 0);
    setManualLogs(tempManualLogs);


  } catch(error) {

    console.error(
      "Progress save failed:",
      error
    );

  }

};

  // Explicit mark complete (used by video auto-tracker)
  const markLessonComplete = (courseId, lessonId) => {
    enrollInCourse(courseId);
    
    const courseIdStr = String(courseId);
    const lessonIdStr = String(lessonId);

    setCompletedLessons(prev => {
      const courseCompletions = prev[courseIdStr] ? [...prev[courseIdStr]] : [];
      if (courseCompletions.includes(lessonIdStr)) return prev; // Already complete
      
      const updatedCompletions = [...courseCompletions, lessonIdStr];
      const updated = {
        ...prev,
        [courseIdStr]: updatedCompletions
      };

      // Check if course is 100% completed
      const totalLessons = getLessonCount(courseId);
      if (updatedCompletions.length === totalLessons) {
        triggerNotification(`NODE_INTEGRATION_100 // CERTIFICATE_GENERATED: "${getCourseTitle(courseId).toUpperCase()}"`);
      } else {
        triggerNotification(`SYS // MEDIA_STREAM_ANALYZED // METRICS_UPDATED`);
      }

      setTimeSpent(t => t + 8); // Add 8 minutes for watching
      return updated;
    });
  };

  // Calculate certificates earned (courses that are 100% complete)
  const getCertificates = () => {
    return courses
      .filter(course => getCourseProgress(course.id) === 100)
      .map(course => ({
        courseId: course.id,
        courseTitle: course.title,
        instructor: course.instructor,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        certId: `CERT-${String(course.id).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
      }));
  };

  // Active study tracking (increases minutes)
  const addStudyTime = (minutes) => {
    setTimeSpent(t => t + minutes);
  };

  const saveManualLog = async (day, minutes) => {
    if (!user?.id) return;
    const uniqueId = `manual_${day}_${minutes}_${Date.now()}`;
    const progressData = {
      userId: user.id,
      courseId: -1,
      lessonId: uniqueId,
      completed: true
    };
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/Progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(progressData)
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Progress/${user.id}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      
      const completed = {};
      const activeCourses = [];
      let totalMinutes = 0;
      let totalLessonsCount = 0;
      const tempManualLogs = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

      data.forEach(item => {
        if (item.completed) {
          if (item.courseId === -1) {
            const parts = (item.lessonId || "").split('_');
            if (parts[0] === 'manual' && parts[1] && parts[2]) {
              const d = parts[1];
              const mins = parseInt(parts[2], 10);
              if (!isNaN(mins) && tempManualLogs[d] !== undefined) {
                tempManualLogs[d] += mins / 60;
                totalMinutes += mins;
              }
            }
          } else {
            const rawLessonId = (item.lessonId || "").split('_date_')[0];
            const courseIdStr = String(item.courseId);

            if (!completed[courseIdStr]) {
              completed[courseIdStr] = [];
            }
            if (!completed[courseIdStr].includes(rawLessonId)) {
              completed[courseIdStr].push(rawLessonId);
            }
            totalLessonsCount++;

            if (!activeCourses.includes(item.courseId)) {
              activeCourses.push(item.courseId);
            }

            const course = courses.find(c => String(c.id) === courseIdStr);
            if (course) {
              course.modules.forEach(mod => {
                const lesson = mod.lessons.find(l => String(l.id) === rawLessonId);
                if (lesson) {
                  totalMinutes += parseDurationToMinutes(lesson.duration);
                }
              });
            }
          }
        }
      });

      setCompletedLessons(completed);
      setEnrolledCourses(activeCourses);
      setTimeSpent(totalMinutes);
      setStreak(totalLessonsCount > 0 ? Math.min(7, totalLessonsCount) : 0);
      setManualLogs(tempManualLogs);
    } catch (error) {
      console.error("Save manual log failed:", error);
    }
  };

  const resetProgress = async () => {
    if (user?.id) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/Progress/reset/${user.id}`, {
          method: 'DELETE',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
      } catch (err) {
        console.error("Failed to reset progress on backend:", err);
      }
    }
    setCompletedLessons({});
    setEnrolledCourses([]);
    setTimeSpent(0);
    setStreak(0);
    localStorage.setItem('strange_completed', JSON.stringify({}));
    localStorage.setItem('strange_enrolled', JSON.stringify([]));
    localStorage.setItem('strange_time_spent', '0');
    localStorage.setItem('strange_streak', '0');
    localStorage.removeItem('strange_weekly_activity');
    localStorage.removeItem('strange_manual_study_logs');
    triggerNotification('SYS_RESET // ALL_PROGRESS_WIPED // DEFAULTS_RESTORED');
  };

  const updateCredentials = async (newUsername, newPassword) => {
    if (!newUsername.trim() || !newPassword.trim() || !user?.id) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          userId: user.id,
          newUsername: newUsername.trim(),
          newPassword: newPassword.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        triggerNotification(`SYS_ERROR // ${errorText.toUpperCase()}`);
        return;
      }

      setSavedUsername(newUsername.trim());
      setSavedPassword(newPassword.trim());
      
      setUser(prev => prev ? { ...prev, username: newUsername.trim() } : null);
      
      triggerNotification('SYS_CONFIG // KEY_RE_ENCRYPTED // NEW_HASH_STORED');
    } catch (error) {
      triggerNotification('SYS_ERROR // CONNECTION_FAILED');
    }
  };

  const startFuturisticTransition = (userData, password, onComplete) => {
    setIsGlobalTransitioning(true);
    setGlobalTransitionProgress(0);
    setGlobalTransitionPhase('booting');
    setGlobalTransitionLogs([
      'SYS // ACCESS LEVEL: GUEST_REQ',
      'SYS // BYPASSING FIREWALL DEFENSES... [OK]'
    ]);

    const logsToInject = [
      { percent: 5, msg: 'SYS // INITIALIZING AUTHENTICATION SEED...' },
      { percent: 12, msg: 'NET_SEC // CONNECTED PROTOCOL: HTTPS//PORT:5173' },
      { percent: 18, msg: 'NET_SEC // SOCKET_OPEN: STATUS_ESTABLISHED' },
      { percent: 25, msg: 'DECRYPT // CRYPTOGRAPHIC KEY DECIPHERED [SUCCESS]' },
      { percent: 32, msg: 'DECRYPT // PARSING USER IDENTIFICATION VECTOR...' },
      { percent: 40, msg: 'MEM // LOADED DESIGN MODULES AND INTERFACES' },
      { percent: 48, msg: 'MEM // ALLOCATING HIGH-SPEED FRAME BUFFER [OK]' },
      { percent: 55, msg: 'CORE // SYNCHRONIZING SECURE DATABASE NODES' },
      { percent: 62, msg: 'CORE // RETRIEVING ENROLLED SYLLABUS BLOCKS' },
      { percent: 70, msg: 'ACCENT // STYLING GRAPHICS AND NEURAL VECTORS' },
      { percent: 78, msg: 'ACCENT // DRAWING STYLIZED HUD WIREFRAME...' },
      { percent: 85, msg: 'SYS // MOUNTING STRANGEGT GRAPHIC SYSTEMS' },
      { percent: 92, msg: 'SYS // INJECTING USER PROFILE DATA...' },
      { percent: 98, msg: 'SYS // STABILIZING DIMENSIONAL NODES [COMPLETE]' }
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      let increment;
      
      if (currentProgress < 30) {
        increment = Math.floor(Math.random() * 5) + 3;
      } else if (currentProgress < 75) {
        increment = Math.random() < 0.6 ? (Math.random() < 0.4 ? 1 : 2) : 0;
      } else {
        increment = Math.floor(Math.random() * 5) + 3;
      }

      currentProgress = Math.min(currentProgress + increment, 100);
      setGlobalTransitionProgress(currentProgress);

      logsToInject.forEach(item => {
        if (currentProgress >= item.percent) {
          setGlobalTransitionLogs(prev => {
            if (!prev.includes(item.msg)) {
              return [...prev, item.msg];
            }
            return prev;
          });
        }
      });

      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Log in to swap the route in the background
        login(userData, password);
        
        setGlobalTransitionPhase('warping');
        setGlobalTransitionLogs(prev => [...prev, 'SYS // WARP TUNNEL OPENED. INITIALIZING REDIRECT...']);

        // Hold warp phase for 900ms before finishing
        setTimeout(() => {
          setGlobalTransitionPhase('idle');
          setIsGlobalTransitioning(false);
          if (onComplete) onComplete();
        }, 900);
      }
    }, 40);
  };

  const getNotificationLabel = (msg) => {
    if (!msg) return 'SYS_ALERT // NOTIFICATION';
    if (msg.includes('ACCESS_GRANTED') || msg.includes('Welcome')) return 'AUTH_VERIFIED // SECURE_SESSION';
    if (msg.includes('SECURE_PORT_CLOSED') || msg.includes('SESSION_DE_AUTHORIZED') || msg.includes('Logged out')) return 'DE-AUTH // SESSION_TERMINATED';
    if (msg.includes('CERTIFICATE_GENERATED') || msg.includes('SYLLABUS_SECTOR_COMPILED') || msg.includes('Congratulations')) return 'SYS_ACHIEVEMENT // UNLOCKED';
    if (msg.includes('NODE_EXPANSION_LOADED') || msg.includes('Enrolled')) return 'REGISTRATION // ENROLLED';
    return 'SYS_ALERT // UPDATE';
  };

  return (
    <ProgressContext.Provider value={{
      user,
      login,
      logout,
      updateProfile,
      completedLessons,
      enrolledCourses,
      timeSpent,
      streak,
      manualLogs,
      saveManualLog,
      theme,
      setTheme,
      accentColor,
      setAccentColor,
      customColor,
      setCustomColor,
      savedUsername,
      savedPassword,
      updateCredentials,
      activeNotification,
      enrollInCourse,
      toggleLessonCompleted,
      markLessonComplete,
      getCourseProgress,
      getLessonCount,
      getCertificates,
      addStudyTime,
      resetProgress,
      triggerNotification,
      isGlobalTransitioning,
      globalTransitionProgress,
      globalTransitionPhase,
      globalTransitionLogs,
      startFuturisticTransition,
      isLoggingOut,
      logoutProgress,
      logoutPhase,
      logoutLogs,
      startLogoutTransition,
      deleteAccount,
      isDeleteTransition
    }}>
      {children}
      <FuturisticNotification
        message={activeNotification}
        onClose={() => setActiveNotification(null)}
        getNotificationLabel={getNotificationLabel}
      />
    </ProgressContext.Provider>
  );
};

const FuturisticNotification = ({ message, onClose, getNotificationLabel }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (message) {
      setShouldRender(true);
      setIsExiting(false);

      const timer = setTimeout(() => {
        setIsExiting(true);
        const exitTimer = setTimeout(() => {
          setShouldRender(false);
          onClose();
        }, 450); // Match index.css anim duration (0.45s)
        return () => clearTimeout(exitTimer);
      }, 3500);

      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
    }
  }, [message, onClose]);

  if (!shouldRender) return null;

  return (
    <div className={`alert-popup futuristic-hud-popup ${isExiting ? 'hud-exit' : 'hud-enter'}`}>
      <div className="hud-popup-corner tl"></div>
      <div className="hud-popup-corner tr"></div>
      <div className="hud-popup-corner bl"></div>
      <div className="hud-popup-corner br"></div>
      <div className="hud-popup-scanline"></div>
      <div className="hud-popup-content">
        <div className="hud-popup-icon-container">
          <div className="hud-popup-pulse-ring"></div>
          <svg className="hud-popup-icon-svg" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <div className="hud-popup-text-group">
          <div className="hud-popup-sys-label">{getNotificationLabel(message)}</div>
          <div className="hud-popup-message">{message}</div>
        </div>
      </div>
    </div>
  );
};
