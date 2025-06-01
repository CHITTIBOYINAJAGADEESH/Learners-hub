
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Users, Plus, Eye, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [availableCourses] = useState([
    {
      id: 1,
      title: "Introduction to Programming",
      description: "Learn the fundamentals of programming",
      modules: 5,
      assignedStudents: 12,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Web Development Basics",
      description: "HTML, CSS, and JavaScript fundamentals",
      modules: 8,
      assignedStudents: 8,
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop"
    }
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in as instructor
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || userRole !== 'instructor') {
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

  const handleAssignCourse = (courseId: number) => {
    toast({
      title: "Course Assigned",
      description: "Course has been assigned to selected students.",
    });
  };

  const stats = [
    { label: 'Assigned Courses', value: availableCourses.length, color: 'lms-blue' },
    { label: 'Total Students', value: 20, color: 'lms-green' },
    { label: 'Completed Modules', value: 45, color: 'lms-purple' },
    { label: 'Average Progress', value: '78%', color: 'lms-yellow' }
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
                <BookOpen className="h-8 w-8 text-lms-green" />
                <span className="text-2xl font-poppins font-bold text-white">Instructor Panel</span>
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
              { id: 'students', label: 'Students' },
              { id: 'modules', label: 'Module Creator' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-lms-green text-white'
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
                Welcome, Instructor!
              </h1>
              <p className="text-gray-400">
                Manage your courses and track student progress
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

            {/* Recent Activity */}
            <div className="lms-card">
              <h2 className="text-xl font-poppins font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-lms-green rounded-full"></div>
                  <span>Student completed Module 3 in Web Development</span>
                  <span className="text-gray-500 text-sm">1 hour ago</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-lms-blue rounded-full"></div>
                  <span>New student enrolled in Programming course</span>
                  <span className="text-gray-500 text-sm">3 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-lms-purple rounded-full"></div>
                  <span>Quiz submission received for Module 2</span>
                  <span className="text-gray-500 text-sm">5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-poppins font-bold text-white">Available Courses</h2>
              <p className="text-gray-400">Courses created by Admin for assignment</p>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <div key={course.id} className="lms-card">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-poppins font-bold text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{course.description}</p>
                  
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>{course.modules} modules</span>
                    <span>{course.assignedStudents} students assigned</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="lms-button bg-lms-green/20 text-lms-green hover:bg-lms-green/30 flex-1 flex items-center justify-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Assign</span>
                    </button>
                    <button className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex-1 flex items-center justify-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>Manage</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-poppins font-bold text-white">Student Progress</h2>
            
            <div className="lms-card">
              <h3 className="text-lg font-poppins font-semibold text-white mb-4">Student Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-gray-400">Student</th>
                      <th className="pb-3 text-gray-400">Course</th>
                      <th className="pb-3 text-gray-400">Progress</th>
                      <th className="pb-3 text-gray-400">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-800">
                      <td className="py-3">John Doe</td>
                      <td className="py-3">Web Development</td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div className="bg-lms-green h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <span className="text-sm">75%</span>
                        </div>
                      </td>
                      <td className="py-3">2 hours ago</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3">Jane Smith</td>
                      <td className="py-3">Programming Basics</td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div className="bg-lms-blue h-2 rounded-full" style={{width: '90%'}}></div>
                          </div>
                          <span className="text-sm">90%</span>
                        </div>
                      </td>
                      <td className="py-3">1 hour ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Module Creator Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-poppins font-bold text-white">Module Creator</h2>
              <button className="lms-button-primary flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create Module</span>
              </button>
            </div>

            <div className="lms-card">
              <h3 className="text-lg font-poppins font-semibold text-white mb-4">Create New Module</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Select Course</label>
                  <select className="lms-input">
                    <option>Introduction to Programming</option>
                    <option>Web Development Basics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Module Title</label>
                  <input 
                    type="text" 
                    className="lms-input" 
                    placeholder="Enter module title"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Module Content</label>
                  <textarea 
                    className="lms-input" 
                    rows={4}
                    placeholder="Enter module content and learning objectives"
                  />
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Module Quiz (5 MCQs)</h4>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="mb-4 p-4 bg-lms-dark rounded-lg">
                      <label className="block text-gray-300 mb-2">Question {num}</label>
                      <input 
                        type="text" 
                        className="lms-input mb-2" 
                        placeholder={`Enter question ${num}`}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" className="lms-input" placeholder="Option A" />
                        <input type="text" className="lms-input" placeholder="Option B" />
                        <input type="text" className="lms-input" placeholder="Option C" />
                        <input type="text" className="lms-input" placeholder="Option D" />
                      </div>
                      <select className="lms-input mt-2">
                        <option>Select correct answer</option>
                        <option>Option A</option>
                        <option>Option B</option>
                        <option>Option C</option>
                        <option>Option D</option>
                      </select>
                    </div>
                  ))}
                </div>

                <button type="submit" className="lms-button-success">
                  Create Module with Quiz
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
