
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Users, Plus, Eye, BarChart3, Settings, X, Camera, Save, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: number;
  title: string;
  description: string;
  modules: number;
  assignedStudents: number;
  image: string;
  instructor?: string;
  createdDate?: string;
  status?: 'active' | 'draft';
}

interface InstructorProfile {
  name: string;
  email: string;
  profilePicture: string;
}

interface Module {
  id: number;
  title: string;
  content: string;
  courseId: number;
  mcqs: MCQ[];
}

interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile>({
    name: 'Instructor User',
    email: localStorage.getItem('userEmail') || 'instructor@learnershub.com',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  });
  const [newModule, setNewModule] = useState({
    title: '',
    content: '',
    mcqs: Array(5).fill(null).map((_, index) => ({
      id: index + 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }))
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in as instructor
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || userRole !== 'instructor') {
      navigate('/login');
      return;
    }

    // Load courses created by admin
    const adminCourses = localStorage.getItem('adminCourses');
    if (adminCourses) {
      setAvailableCourses(JSON.parse(adminCourses));
    }

    // Load instructor profile
    const savedProfile = localStorage.getItem('instructorProfile');
    if (savedProfile) {
      setInstructorProfile(JSON.parse(savedProfile));
    }

    // Load modules created by instructor
    const savedModules = localStorage.getItem('instructorModules');
    if (savedModules) {
      setModules(JSON.parse(savedModules));
    }
  }, [navigate]);

  // Save modules to localStorage whenever modules change
  useEffect(() => {
    if (modules.length > 0) {
      localStorage.setItem('instructorModules', JSON.stringify(modules));
    }
  }, [modules]);

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
    localStorage.setItem('instructorProfile', JSON.stringify(instructorProfile));
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
        setInstructorProfile(prev => ({
          ...prev,
          profilePicture: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    const module: Module = {
      id: Date.now(),
      title: newModule.title,
      content: newModule.content,
      courseId: selectedCourseId,
      mcqs: newModule.mcqs
    };

    const updatedModules = [...modules, module];
    setModules(updatedModules);
    setNewModule({
      title: '',
      content: '',
      mcqs: Array(5).fill(null).map((_, index) => ({
        id: index + 1,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }))
    });
    setShowModuleForm(false);
    setSelectedCourseId(null);

    toast({
      title: "Module Added",
      description: "New module has been created successfully.",
    });
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setNewModule({
      title: module.title,
      content: module.content,
      mcqs: module.mcqs
    });
    setSelectedCourseId(module.courseId);
  };

  const handleSaveModuleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    const updatedModules = modules.map(module =>
      module.id === editingModule.id
        ? { ...module, title: newModule.title, content: newModule.content, mcqs: newModule.mcqs }
        : module
    );

    setModules(updatedModules);
    setEditingModule(null);
    setNewModule({
      title: '',
      content: '',
      mcqs: Array(5).fill(null).map((_, index) => ({
        id: index + 1,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }))
    });

    toast({
      title: "Module Updated",
      description: "Module has been updated successfully.",
    });
  };

  const handleDeleteModule = (moduleId: number) => {
    const updatedModules = modules.filter(module => module.id !== moduleId);
    setModules(updatedModules);
    localStorage.setItem('instructorModules', JSON.stringify(updatedModules));
    toast({
      title: "Module Deleted",
      description: "Module has been removed successfully.",
    });
  };

  const updateMCQ = (mcqIndex: number, field: string, value: any) => {
    setNewModule(prev => ({
      ...prev,
      mcqs: prev.mcqs.map((mcq, index) =>
        index === mcqIndex ? { ...mcq, [field]: value } : mcq
      )
    }));
  };

  const updateMCQOption = (mcqIndex: number, optionIndex: number, value: string) => {
    setNewModule(prev => ({
      ...prev,
      mcqs: prev.mcqs.map((mcq, index) =>
        index === mcqIndex
          ? {
              ...mcq,
              options: mcq.options.map((option, oIndex) =>
                oIndex === optionIndex ? value : option
              )
            }
          : mcq
      )
    }));
  };

  const stats = [
    { label: 'Available Courses', value: availableCourses.length, color: 'lms-blue' },
    { label: 'Created Modules', value: modules.length, color: 'lms-green' },
    { label: 'Total Students', value: 20, color: 'lms-purple' },
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
              <div className="flex items-center space-x-3">
                <img
                  src={instructorProfile.profilePicture}
                  alt="Instructor"
                  className="w-10 h-10 rounded-full object-cover border-2 border-lms-green"
                />
                <span className="text-white font-medium">{instructorProfile.name}</span>
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
              { id: 'modules', label: 'Modules' },
              { id: 'students', label: 'Students' }
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
                      src={instructorProfile.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-lms-green"
                    />
                    <label className="absolute bottom-0 right-0 bg-lms-green rounded-full p-2 cursor-pointer hover:bg-green-600 transition-colors">
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
                    value={instructorProfile.name}
                    onChange={(e) => setInstructorProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="lms-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={instructorProfile.email}
                    onChange={(e) => setInstructorProfile(prev => ({ ...prev, email: e.target.value }))}
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

        {/* Module Form Modal */}
        {(showModuleForm || editingModule) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-lms-gray rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto modal-content">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-poppins font-bold text-white">
                  {editingModule ? 'Edit Module' : 'Create New Module'}
                </h3>
                <button 
                  onClick={() => {
                    setShowModuleForm(false);
                    setEditingModule(null);
                    setSelectedCourseId(null);
                    setNewModule({
                      title: '',
                      content: '',
                      mcqs: Array(5).fill(null).map((_, index) => ({
                        id: index + 1,
                        question: '',
                        options: ['', '', '', ''],
                        correctAnswer: 0
                      }))
                    });
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={editingModule ? handleSaveModuleEdit : handleAddModule} className="space-y-4">
                {!editingModule && (
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Select Course</label>
                    <select
                      value={selectedCourseId || ''}
                      onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                      className="lms-input"
                      required
                    >
                      <option value="">Choose a course</option>
                      {availableCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Module Title</label>
                  <input
                    type="text"
                    value={newModule.title}
                    onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                    className="lms-input"
                    placeholder="Enter module title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Module Content</label>
                  <textarea
                    value={newModule.content}
                    onChange={(e) => setNewModule(prev => ({ ...prev, content: e.target.value }))}
                    className="lms-input min-h-[100px] resize-none"
                    rows={4}
                    placeholder="Enter module content and learning objectives"
                    required
                  />
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Module Quiz (5 MCQs)</h4>
                  {newModule.mcqs.map((mcq, mcqIndex) => (
                    <div key={mcqIndex} className="mb-4 p-4 bg-lms-dark rounded-lg">
                      <label className="block text-gray-300 mb-2">Question {mcqIndex + 1}</label>
                      <input
                        type="text"
                        value={mcq.question}
                        onChange={(e) => updateMCQ(mcqIndex, 'question', e.target.value)}
                        className="lms-input mb-2"
                        placeholder={`Enter question ${mcqIndex + 1}`}
                        required
                      />
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {mcq.options.map((option, optionIndex) => (
                          <input
                            key={optionIndex}
                            type="text"
                            value={option}
                            onChange={(e) => updateMCQOption(mcqIndex, optionIndex, e.target.value)}
                            className="lms-input"
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            required
                          />
                        ))}
                      </div>
                      <select
                        value={mcq.correctAnswer}
                        onChange={(e) => updateMCQ(mcqIndex, 'correctAnswer', Number(e.target.value))}
                        className="lms-input"
                        required
                      >
                        <option value="">Select correct answer</option>
                        {mcq.options.map((_, optionIndex) => (
                          <option key={optionIndex} value={optionIndex}>
                            Option {String.fromCharCode(65 + optionIndex)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="lms-button-success flex-1 flex items-center justify-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{editingModule ? 'Update Module' : 'Create Module'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModuleForm(false);
                      setEditingModule(null);
                      setSelectedCourseId(null);
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-poppins font-bold text-white mb-2">
                Welcome, {instructorProfile.name}!
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
              <p className="text-gray-400">Courses created by Admin</p>
            </div>

            {/* Courses Grid */}
            <div className="course-grid">
              {availableCourses.map((course) => (
                <div key={course.id} className="lms-card">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-poppins font-bold text-white mb-2 line-clamp-2 text-wrap-break">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3 text-wrap-break">{course.description}</p>
                  
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

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-poppins font-bold text-white">Module Management</h2>
              <button
                onClick={() => setShowModuleForm(true)}
                className="lms-button-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Module</span>
              </button>
            </div>

            {/* Modules Grid */}
            <div className="course-grid">
              {modules.map((module) => {
                const course = availableCourses.find(c => c.id === module.courseId);
                return (
                  <div key={module.id} className="lms-card">
                    <div className="space-y-3">
                      <h3 className="text-lg font-poppins font-bold text-white line-clamp-2 text-wrap-break">
                        {module.title}
                      </h3>
                      <p className="text-gray-400 text-sm text-wrap-break">
                        Course: {course?.title || 'Unknown Course'}
                      </p>
                      <p className="text-gray-400 text-sm line-clamp-3 text-wrap-break">
                        {module.content}
                      </p>
                      <div className="text-gray-500 text-xs">
                        {module.mcqs.length} MCQs included
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <button 
                          onClick={() => handleEditModule(module)}
                          className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex-1 flex items-center justify-center space-x-1 text-sm"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteModule(module.id)}
                          className="lms-button bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center px-3 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                      <td className="py-3 text-wrap-break">Web Development</td>
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
                      <td className="py-3 text-wrap-break">Programming Basics</td>
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
      </div>
    </div>
  );
};

export default InstructorDashboard;
