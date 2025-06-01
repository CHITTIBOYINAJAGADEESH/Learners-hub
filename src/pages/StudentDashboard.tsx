
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Play, CheckCircle, Award, User, BarChart3, Settings, X, Camera, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  image: string;
  instructor: string;
  lastAccessed: string;
}

interface StudentProfile {
  name: string;
  email: string;
  profilePicture: string;
}

interface Certificate {
  id: number;
  courseName: string;
  completionDate: string;
  grade: string;
}

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Introduction to Programming",
      description: "Learn the fundamentals of programming",
      progress: 75,
      totalModules: 5,
      completedModules: 3,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      instructor: "Dr. Smith",
      lastAccessed: "2 hours ago"
    },
    {
      id: 2,
      title: "Web Development Basics",
      description: "HTML, CSS, and JavaScript fundamentals",
      progress: 100,
      totalModules: 8,
      completedModules: 8,
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
      instructor: "Prof. Johnson",
      lastAccessed: "1 day ago"
    }
  ]);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: 'Student User',
    email: localStorage.getItem('userEmail') || 'student@learnershub.com',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b692?w=150&h=150&fit=crop&crop=face'
  });
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 1,
      courseName: "Web Development Basics",
      completionDate: "2024-11-15",
      grade: "A (95%)"
    }
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in as student
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || userRole !== 'student') {
      navigate('/login');
      return;
    }

    // Load student profile
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
      setStudentProfile(JSON.parse(savedProfile));
    }

    // Load enrolled courses
    const savedCourses = localStorage.getItem('studentCourses');
    if (savedCourses) {
      setEnrolledCourses(JSON.parse(savedCourses));
    }

    // Load certificates
    const savedCertificates = localStorage.getItem('studentCertificates');
    if (savedCertificates) {
      setCertificates(JSON.parse(savedCertificates));
    }
  }, [navigate]);

  // Save student data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studentCourses', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  useEffect(() => {
    localStorage.setItem('studentCertificates', JSON.stringify(certificates));
  }, [certificates]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('studentProfile', JSON.stringify(studentProfile));
    setShowProfileEdit(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setStudentProfile(prev => ({
          ...prev,
          profilePicture: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinueCourse = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    // Create a simple certificate HTML content
    const certificateContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certificate.courseName}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            text-align: center;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .certificate {
            background: white;
            padding: 60px;
            border: 10px solid #667eea;
            border-radius: 20px;
            box-shadow: 0 0 30px rgba(0,0,0,0.2);
            max-width: 800px;
            width: 100%;
          }
          .title {
            font-size: 48px;
            color: #667eea;
            margin-bottom: 30px;
            font-weight: bold;
          }
          .subtitle {
            font-size: 24px;
            color: #333;
            margin-bottom: 40px;
          }
          .student-name {
            font-size: 36px;
            color: #764ba2;
            font-weight: bold;
            margin: 30px 0;
            text-decoration: underline;
          }
          .course-name {
            font-size: 28px;
            color: #333;
            margin: 30px 0;
            font-style: italic;
          }
          .details {
            font-size: 18px;
            color: #666;
            margin: 20px 0;
          }
          .signature {
            margin-top: 60px;
            border-top: 2px solid #333;
            padding-top: 20px;
            display: inline-block;
            min-width: 200px;
          }
          .logo {
            font-size: 24px;
            color: #667eea;
            font-weight: bold;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="logo">🎓 Learners Hub</div>
          <div class="title">Certificate of Completion</div>
          <div class="subtitle">This is to certify that</div>
          <div class="student-name">${studentProfile.name}</div>
          <div class="subtitle">has successfully completed the course</div>
          <div class="course-name">${certificate.courseName}</div>
          <div class="details">Completion Date: ${certificate.completionDate}</div>
          <div class="details">Grade: ${certificate.grade}</div>
          <div class="signature">
            <div>Authorized Signature</div>
            <div style="margin-top: 10px;">Learners Hub Administration</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download the certificate
    const blob = new Blob([certificateContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificate-${certificate.courseName.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded successfully.",
    });
  };

  const handleClaimCertificate = (courseId: number) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    if (course && course.progress === 100) {
      const newCertificate: Certificate = {
        id: Date.now(),
        courseName: course.title,
        completionDate: new Date().toISOString().split('T')[0],
        grade: "A (95%)"
      };

      setCertificates(prev => [...prev, newCertificate]);
      toast({
        title: "Certificate Generated",
        description: "Congratulations! Your certificate is now available.",
      });
    }
  };

  const stats = [
    { label: 'Enrolled Courses', value: enrolledCourses.length, color: 'lms-blue' },
    { label: 'Completed Modules', value: enrolledCourses.reduce((sum, course) => sum + course.completedModules, 0), color: 'lms-green' },
    { label: 'Certificates Earned', value: certificates.length, color: 'lms-purple' },
    { label: 'Average Progress', value: `${Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length) || 0}%`, color: 'lms-yellow' }
  ];

  const achievements = [
    { title: "First Course Enrolled", date: "Nov 2024", icon: BookOpen },
    { title: "First Module Completed", date: "Nov 2024", icon: CheckCircle },
    { title: "Certificate Earned", date: "Nov 2024", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-lms-dark">
      {/* Header */}
      <header className="bg-lms-gray border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-lms-purple" />
                <span className="text-2xl font-poppins font-bold text-white">Student Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={studentProfile.profilePicture}
                  alt="Student"
                  className="w-10 h-10 rounded-full object-cover border-2 border-lms-purple"
                />
                <span className="text-white font-medium">{studentProfile.name}</span>
              </div>
              <button
                onClick={() => setShowProfileEdit(true)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button onClick={handleLogout} className="lms-button-primary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'courses', label: 'My Courses' },
              { id: 'progress', label: 'Progress' },
              { id: 'certificates', label: 'Certificates' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-lms-purple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Edit Modal */}
        {showProfileEdit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-lms-gray rounded-xl p-6 w-full max-w-md modal-content">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-poppins font-bold text-white">Edit Profile</h3>
                <button 
                  onClick={() => setShowProfileEdit(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={studentProfile.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-lms-purple"
                    />
                    <label className="absolute bottom-0 right-0 bg-lms-purple rounded-full p-2 cursor-pointer hover:bg-purple-600 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={studentProfile.name}
                    onChange={(e) => setStudentProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="lms-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={studentProfile.email}
                    onChange={(e) => setStudentProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="lms-input"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="lms-button-primary flex-1">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProfileEdit(false)}
                    className="lms-button bg-gray-600 hover:bg-gray-700 flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-poppins font-bold text-white mb-2">
                Welcome back, {studentProfile.name}!
              </h1>
              <p className="text-gray-400">
                Continue your learning journey
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="lms-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}/20 rounded-full flex items-center justify-center`}>
                      <BarChart3 className={`h-6 w-6 text-${stat.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Learning */}
            <div className="lms-card">
              <h2 className="text-xl font-poppins font-bold text-white mb-4">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrolledCourses.slice(0, 2).map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 bg-lms-dark rounded-lg">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-wrap-break">{course.title}</h3>
                      <p className="text-gray-400 text-sm">Progress: {course.progress}%</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-lms-green h-2 rounded-full" 
                          style={{width: `${course.progress}%`}}
                        ></div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleContinueCourse(course.id)}
                      className="lms-button bg-lms-purple/20 text-lms-purple hover:bg-lms-purple/30"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="lms-card">
              <h2 className="text-xl font-poppins font-bold text-white mb-4">Recent Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-lms-dark rounded-lg">
                      <div className="w-10 h-10 bg-lms-green/20 rounded-full flex items-center justify-center">
                        <Icon className="h-5 w-5 text-lms-green" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm text-wrap-break">{achievement.title}</h4>
                        <p className="text-gray-400 text-xs">{achievement.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-poppins font-bold text-white">My Courses</h2>
              <p className="text-gray-400">Your enrolled courses</p>
            </div>

            {/* Courses Grid */}
            <div className="course-grid">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="lms-card">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-poppins font-bold text-white mb-2 line-clamp-2 text-wrap-break">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 mb-2 line-clamp-2 text-wrap-break">{course.description}</p>
                  <p className="text-gray-500 text-sm mb-4 text-wrap-break">Instructor: {course.instructor}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress: {course.progress}%</span>
                      <span>{course.completedModules}/{course.totalModules} modules</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-lms-green h-2 rounded-full transition-all duration-300" 
                        style={{width: `${course.progress}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleContinueCourse(course.id)}
                      className="lms-button-primary flex-1 flex items-center justify-center space-x-1"
                    >
                      <Play className="h-4 w-4" />
                      <span>Continue</span>
                    </button>
                    {course.progress === 100 && (
                      <button 
                        onClick={() => handleClaimCertificate(course.id)}
                        className="lms-button bg-lms-green/20 text-lms-green hover:bg-lms-green/30 flex items-center space-x-1"
                      >
                        <Award className="h-4 w-4" />
                        <span>Certificate</span>
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-500 text-xs mt-3">Last accessed: {course.lastAccessed}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-poppins font-bold text-white">Learning Progress</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lms-card">
                <h3 className="text-lg font-poppins font-semibold text-white mb-4">Course Progress</h3>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div key={course.id}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-wrap-break">{course.title}</span>
                        <span className="text-lms-green">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-lms-green h-3 rounded-full transition-all duration-500" 
                          style={{width: `${course.progress}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lms-card">
                <h3 className="text-lg font-poppins font-semibold text-white mb-4">Quiz Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Module 1 Quiz</span>
                    <span className="text-lms-green">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Module 2 Quiz</span>
                    <span className="text-lms-green">88%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Module 3 Quiz</span>
                    <span className="text-lms-yellow">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-poppins font-bold text-white">My Certificates</h2>
              <p className="text-gray-400">Earned certificates and achievements</p>
            </div>

            <div className="course-grid">
              {/* Earned Certificates */}
              {certificates.map((certificate) => (
                <div key={certificate.id} className="lms-card border-2 border-lms-green/30">
                  <div className="text-center">
                    <Award className="h-16 w-16 text-lms-green mx-auto mb-4" />
                    <h3 className="text-xl font-poppins font-bold text-white mb-2 text-wrap-break">
                      {certificate.courseName}
                    </h3>
                    <p className="text-gray-400 mb-4">Completed: {certificate.completionDate}</p>
                    <p className="text-sm text-gray-500 mb-4">Grade: {certificate.grade}</p>
                    <button 
                      onClick={() => handleDownloadCertificate(certificate)}
                      className="lms-button-success w-full flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Certificate</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* In Progress Courses */}
              {enrolledCourses
                .filter(course => course.progress < 100)
                .map((course) => (
                  <div key={`progress-${course.id}`} className="lms-card border-2 border-gray-600 opacity-75">
                    <div className="text-center">
                      <Award className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-poppins font-bold text-gray-400 mb-2 text-wrap-break">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 mb-4">{course.progress}% Complete</p>
                      <button disabled className="lms-button bg-gray-600 text-gray-400 w-full cursor-not-allowed">
                        In Progress
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
