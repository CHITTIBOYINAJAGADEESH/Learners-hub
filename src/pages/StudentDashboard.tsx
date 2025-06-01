
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Play, CheckCircle, Award, User, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolledCourses] = useState([
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
      progress: 40,
      totalModules: 8,
      completedModules: 3,
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
      instructor: "Prof. Johnson",
      lastAccessed: "1 day ago"
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
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const handleContinueCourse = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  const stats = [
    { label: 'Enrolled Courses', value: enrolledCourses.length, color: 'lms-blue' },
    { label: 'Completed Modules', value: 6, color: 'lms-green' },
    { label: 'Certificates Earned', value: 1, color: 'lms-purple' },
    { label: 'Average Progress', value: '58%', color: 'lms-yellow' }
  ];

  const achievements = [
    { title: "First Course Enrolled", date: "Nov 2024", icon: BookOpen },
    { title: "First Module Completed", date: "Nov 2024", icon: CheckCircle },
    { title: "Quiz Master", date: "Nov 2024", icon: Award }
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
              <Link to="/profile" className="text-gray-400 hover:text-white">
                Profile
              </Link>
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-poppins font-bold text-white mb-2">
                Welcome back, Student!
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
                      <h3 className="text-white font-medium">{course.title}</h3>
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
                        <h4 className="text-white font-medium text-sm">{achievement.title}</h4>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="lms-card">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-poppins font-bold text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 mb-2">{course.description}</p>
                  <p className="text-gray-500 text-sm mb-4">Instructor: {course.instructor}</p>
                  
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
                      <button className="lms-button bg-lms-green/20 text-lms-green hover:bg-lms-green/30 flex items-center space-x-1">
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
                        <span className="text-gray-300">{course.title}</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Certificate */}
              <div className="lms-card border-2 border-lms-green/30">
                <div className="text-center">
                  <Award className="h-16 w-16 text-lms-green mx-auto mb-4" />
                  <h3 className="text-xl font-poppins font-bold text-white mb-2">
                    Programming Fundamentals
                  </h3>
                  <p className="text-gray-400 mb-4">Completed: Nov 15, 2024</p>
                  <p className="text-sm text-gray-500 mb-4">Grade: A (95%)</p>
                  <button className="lms-button-success w-full">
                    Download Certificate
                  </button>
                </div>
              </div>

              {/* Upcoming Certificates */}
              <div className="lms-card border-2 border-gray-600 opacity-75">
                <div className="text-center">
                  <Award className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-poppins font-bold text-gray-400 mb-2">
                    Web Development
                  </h3>
                  <p className="text-gray-500 mb-4">40% Complete</p>
                  <button disabled className="lms-button bg-gray-600 text-gray-400 w-full cursor-not-allowed">
                    In Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
