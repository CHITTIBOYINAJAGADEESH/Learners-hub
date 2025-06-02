import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Plus, Users, BarChart3, Settings, Trash2, Edit, Eye, Save, X, Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: number;
  title: string;
  description: string;
  modules: number;
  students: number;
  image: string;
  instructor?: string;
  createdDate?: string;
  status?: 'active' | 'draft';
}

interface AdminProfile {
  name: string;
  email: string;
  profilePicture: string;
}

interface UserActivity {
  id: string;
  email: string;
  name?: string;
  role: string;
  loginTime?: string;
  registrationTime?: string;
  type: 'login' | 'registration';
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'Admin User',
    email: localStorage.getItem('userEmail') || 'admin@learnershub.com',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  });
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    image: '',
    modules: 0,
    instructor: '',
    status: 'draft' as 'active' | 'draft'
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user activities from localStorage
  const loadUserActivities = () => {
    const adminUserData = JSON.parse(localStorage.getItem('adminUserData') || '[]');
    setUserActivities(adminUserData);
  };

  useEffect(() => {
    // Check if user is logged in as admin
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    // Load user activities
    loadUserActivities();

    // Load persistent courses from localStorage
    const savedCourses = localStorage.getItem('adminCourses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      // Initialize with default courses if none exist
      const defaultCourses = [
        {
          id: 1,
          title: "Introduction to Programming",
          description: "Learn the fundamentals of programming with hands-on exercises and real-world examples.",
          modules: 5,
          students: 12,
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
          instructor: "Dr. Smith",
          createdDate: "2024-01-15",
          status: 'active' as const
        },
        {
          id: 2,
          title: "Web Development Basics",
          description: "HTML, CSS, and JavaScript fundamentals for building modern web applications.",
          modules: 8,
          students: 8,
          image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
          instructor: "Prof. Johnson",
          createdDate: "2024-02-01",
          status: 'active' as const
        }
      ];
      setCourses(defaultCourses);
      localStorage.setItem('adminCourses', JSON.stringify(defaultCourses));
    }

    // Load admin profile from localStorage
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
      setAdminProfile(JSON.parse(savedProfile));
    }

    // Set up interval to refresh user activities every 5 seconds
    const interval = setInterval(loadUserActivities, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  // Save courses to localStorage whenever courses change
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('adminCourses', JSON.stringify(courses));
    }
  }, [courses]);

  const handleLogout = () => {
    // Don't clear course data, just clear session
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const course: Course = {
      id: Date.now(),
      ...newCourse,
      students: 0,
      image: newCourse.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    setNewCourse({ title: '', description: '', image: '', modules: 0, instructor: '', status: 'draft' });
    setShowCourseForm(false);
    
    toast({
      title: "Course Added",
      description: "New course has been created successfully.",
    });
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setNewCourse({
      title: course.title,
      description: course.description,
      image: course.image,
      modules: course.modules,
      instructor: course.instructor || '',
      status: course.status || 'active'
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    const updatedCourses = courses.map(course => 
      course.id === editingCourse.id 
        ? { ...course, ...newCourse }
        : course
    );
    
    setCourses(updatedCourses);
    setEditingCourse(null);
    setNewCourse({ title: '', description: '', image: '', modules: 0, instructor: '', status: 'draft' });
    
    toast({
      title: "Course Updated",
      description: "Course has been updated successfully.",
    });
  };

  const handleDeleteCourse = (courseId: number) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    setCourses(updatedCourses);
    localStorage.setItem('adminCourses', JSON.stringify(updatedCourses));
    toast({
      title: "Course Deleted",
      description: "Course has been removed successfully.",
    });
  };

  const handleViewCourse = (course: Course) => {
    setViewingCourse(course);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('adminProfile', JSON.stringify(adminProfile));
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
        setAdminProfile(prev => ({
          ...prev,
          profilePicture: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const stats = [
    { label: 'Total Courses', value: courses.length, color: 'lms-blue' },
    { label: 'Total Students', value: userActivities.filter(u => u.role === 'student').length, color: 'lms-green' },
    { label: 'Total Instructors', value: userActivities.filter(u => u.role === 'instructor').length, color: 'lms-purple' },
    { label: 'Total Users', value: userActivities.length, color: 'lms-yellow' }
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
                <BookOpen className="h-8 w-8 text-lms-blue" />
                <span className="text-2xl font-poppins font-bold text-white">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={adminProfile.profilePicture}
                  alt="Admin"
                  className="w-10 h-10 rounded-full object-cover border-2 border-lms-blue"
                />
                <span className="text-white font-medium">{adminProfile.name}</span>
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
              { id: 'courses', label: 'Courses' },
              { id: 'users', label: 'Users' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-lms-blue text-white'
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
                      src={adminProfile.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-lms-blue"
                    />
                    <label className="absolute bottom-0 right-0 bg-lms-blue rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
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
                    value={adminProfile.name}
                    onChange={(e) => setAdminProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="lms-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={adminProfile.email}
                    onChange={(e) => setAdminProfile(prev => ({ ...prev, email: e.target.value }))}
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
                Welcome, {adminProfile.name}!
              </h1>
              <p className="text-gray-400">
                Manage your learning platform from this dashboard
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
                {userActivities.slice(-5).reverse().map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 text-gray-300">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'registration' ? 'bg-lms-green' : 'bg-lms-blue'
                    }`}></div>
                    <span>
                      {activity.type === 'registration' ? 'New' : 'User'} {activity.role} {activity.type === 'registration' ? 'registered' : 'logged in'}: {activity.email}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {formatDateTime(activity.loginTime || activity.registrationTime || '')}
                    </span>
                  </div>
                ))}
                {userActivities.length === 0 && (
                  <p className="text-gray-500">No user activity yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-poppins font-bold text-white">Course Management</h2>
              <button
                onClick={() => setShowCourseForm(true)}
                className="lms-button-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Course</span>
              </button>
            </div>

            {/* Course Form Modal */}
            {(showCourseForm || editingCourse) && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-lms-gray rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-content">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-poppins font-bold text-white">
                      {editingCourse ? 'Edit Course' : 'Add New Course'}
                    </h3>
                    <button 
                      onClick={() => {
                        setShowCourseForm(false);
                        setEditingCourse(null);
                        setNewCourse({ title: '', description: '', image: '', modules: 0, instructor: '', status: 'draft' });
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <form onSubmit={editingCourse ? handleSaveEdit : handleAddCourse} className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Course Title</label>
                      <input
                        type="text"
                        placeholder="Enter course title"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        className="lms-input text-wrap-break"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Course Description</label>
                      <textarea
                        placeholder="Enter detailed course description"
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                        className="lms-input min-h-[100px] resize-none text-wrap-break"
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Course Image URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={newCourse.image}
                        onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                        className="lms-input text-wrap-break"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Number of Modules</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          placeholder="5"
                          value={newCourse.modules || ''}
                          onChange={(e) => setNewCourse({...newCourse, modules: parseInt(e.target.value) || 0})}
                          className="lms-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Assigned Instructor</label>
                        <input
                          type="text"
                          placeholder="Instructor name"
                          value={newCourse.instructor}
                          onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                          className="lms-input text-wrap-break"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Course Status</label>
                      <select
                        value={newCourse.status}
                        onChange={(e) => setNewCourse({...newCourse, status: e.target.value as 'active' | 'draft'})}
                        className="lms-input"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                      </select>
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button type="submit" className="lms-button-primary flex-1 flex items-center justify-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>{editingCourse ? 'Update Course' : 'Create Course'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCourseForm(false);
                          setEditingCourse(null);
                          setNewCourse({ title: '', description: '', image: '', modules: 0, instructor: '', status: 'draft' });
                        }}
                        className="lms-button bg-gray-600 hover:bg-gray-700 flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Course View Modal */}
            {viewingCourse && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-lms-gray rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto modal-content">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-poppins font-bold text-white text-wrap-break">Course Details</h3>
                    <button 
                      onClick={() => setViewingCourse(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <img
                      src={viewingCourse.image}
                      alt={viewingCourse.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    
                    <div>
                      <h4 className="text-xl font-poppins font-bold text-white mb-2 text-wrap-break">{viewingCourse.title}</h4>
                      <p className="text-gray-300 leading-relaxed text-wrap-break">{viewingCourse.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-lms-dark rounded-lg">
                        <p className="text-gray-400 text-sm">Modules</p>
                        <p className="text-lms-blue text-xl font-bold">{viewingCourse.modules}</p>
                      </div>
                      <div className="text-center p-3 bg-lms-dark rounded-lg">
                        <p className="text-gray-400 text-sm">Students</p>
                        <p className="text-lms-green text-xl font-bold">{viewingCourse.students}</p>
                      </div>
                      <div className="text-center p-3 bg-lms-dark rounded-lg">
                        <p className="text-gray-400 text-sm">Status</p>
                        <p className={`text-xl font-bold ${viewingCourse.status === 'active' ? 'text-lms-green' : 'text-lms-yellow'}`}>
                          {viewingCourse.status}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-lms-dark rounded-lg">
                        <p className="text-gray-400 text-sm">Created</p>
                        <p className="text-gray-300 text-sm font-medium">{viewingCourse.createdDate}</p>
                      </div>
                    </div>
                    
                    {viewingCourse.instructor && (
                      <div className="p-4 bg-lms-dark rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Assigned Instructor</p>
                        <p className="text-white font-medium text-wrap-break">{viewingCourse.instructor}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          setViewingCourse(null);
                          handleEditCourse(viewingCourse);
                        }}
                        className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex-1 flex items-center justify-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Course</span>
                      </button>
                      <button 
                        onClick={() => {
                          setViewingCourse(null);
                          handleDeleteCourse(viewingCourse.id);
                        }}
                        className="lms-button bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center space-x-2 px-6"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Grid */}
            <div className="course-grid">
              {courses.map((course) => (
                <div key={course.id} className="lms-card group hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === 'active' 
                        ? 'bg-lms-green/20 text-lms-green' 
                        : 'bg-lms-yellow/20 text-lms-yellow'
                    }`}>
                      {course.status}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-poppins font-bold text-white line-clamp-2 hover:text-lms-blue transition-colors text-wrap-break">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed text-wrap-break">
                      {course.description}
                    </p>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.modules} modules</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students} students</span>
                      </span>
                    </div>
                    
                    {course.instructor && (
                      <p className="text-gray-500 text-xs text-wrap-break">Instructor: {course.instructor}</p>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <button 
                        onClick={() => handleViewCourse(course)}
                        className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex-1 flex items-center justify-center space-x-1 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button 
                        onClick={() => handleEditCourse(course)}
                        className="lms-button bg-lms-green/20 text-lms-green hover:bg-lms-green/30 flex-1 flex items-center justify-center space-x-1 text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course.id)}
                        className="lms-button bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center px-3 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-poppins font-bold text-white">User Management</h2>
              <button 
                onClick={loadUserActivities}
                className="lms-button-primary flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Refresh</span>
              </button>
            </div>
            
            <div className="lms-card">
              <h3 className="text-lg font-poppins font-semibold text-white mb-4">
                User Activity ({userActivities.length} total records)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-gray-400">Email</th>
                      <th className="pb-3 text-gray-400">Name</th>
                      <th className="pb-3 text-gray-400">Role</th>
                      <th className="pb-3 text-gray-400">Activity</th>
                      <th className="pb-3 text-gray-400">Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {userActivities.length > 0 ? (
                      userActivities.slice().reverse().map((activity) => (
                        <tr key={activity.id} className="border-b border-gray-800">
                          <td className="py-3 text-wrap-break">{activity.email}</td>
                          <td className="py-3 text-wrap-break">{activity.name || '-'}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.role === 'admin' ? 'bg-lms-blue/20 text-lms-blue' :
                              activity.role === 'instructor' ? 'bg-lms-green/20 text-lms-green' :
                              'bg-lms-purple/20 text-lms-purple'
                            }`}>
                              {activity.role}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.type === 'registration' ? 'bg-lms-green/20 text-lms-green' : 'bg-lms-blue/20 text-lms-blue'
                            }`}>
                              {activity.type}
                            </span>
                          </td>
                          <td className="py-3">
                            {formatDateTime(activity.loginTime || activity.registrationTime || '')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No user activity recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-poppins font-bold text-white">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lms-card">
                <h3 className="text-lg font-poppins font-semibold text-white mb-4">Course Enrollment</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-wrap-break">Introduction to Programming</span>
                    <span className="text-lms-blue">12 students</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-lms-blue h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-wrap-break">Web Development Basics</span>
                    <span className="text-lms-green">8 students</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-lms-green h-2 rounded-full" style={{width: '40%'}}></div>
                  </div>
                </div>
              </div>

              <div className="lms-card">
                <h3 className="text-lg font-poppins font-semibold text-white mb-4">User Registration Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Registrations</span>
                    <span className="text-lms-green">{userActivities.filter(u => u.type === 'registration').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Logins</span>
                    <span className="text-lms-blue">{userActivities.filter(u => u.type === 'login').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Students</span>
                    <span className="text-lms-purple">{userActivities.filter(u => u.role === 'student').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Instructors</span>
                    <span className="text-lms-yellow">{userActivities.filter(u => u.role === 'instructor').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
