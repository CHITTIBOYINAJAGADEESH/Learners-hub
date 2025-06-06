import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Plus, Upload, User, Mail, Calendar, Award, RefreshCw, Download, Edit2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface Course {
  id: number;
  title: string;
  description: string;
  modules: number;
  image: string;
  instructor?: string;
  assignedBy?: string;
  assignedAt?: string;
}

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  joinDate: string;
}

interface Certificate {
  id: string;
  courseName: string;
  completionDate: string;
  duration: string;
  studentName: string;
  grade: string;
}

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Student User',
    email: localStorage.getItem('userEmail') || 'student@example.com',
    bio: 'Passionate about learning and growing through technology.',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    joinDate: '2024-01-15'
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const loadCourses = () => {
    setIsLoading(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      
      // Load all available courses from admin
      const adminCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
      setAllCourses(adminCourses);

      // Load courses assigned by instructors
      const courseAssignments = JSON.parse(localStorage.getItem('courseAssignments') || '[]');
      console.log('All course assignments:', courseAssignments);
      
      // Get the current student's user ID from both users and registeredUsers
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const combinedUsers = [...allUsers, ...registeredUsers];
      
      const currentStudent = combinedUsers.find((user: any) => 
        user.email === userEmail && user.role === 'student'
      );
      const currentStudentId = currentStudent?.id;
      
      console.log('Current student email:', userEmail);
      console.log('Current student ID:', currentStudentId);
      console.log('Current student object:', currentStudent);

      // Filter assignments for this student using both email and ID matching
      const studentAssignments = courseAssignments.filter((assignment: any) => {
        const emailMatch = assignment.studentEmail === userEmail;
        const idMatch = currentStudentId && (
          assignment.studentId === currentStudentId ||
          assignment.studentId === parseInt(currentStudentId) ||
          assignment.studentId === currentStudentId.toString()
        );
        console.log(`Assignment check: courseId=${assignment.courseId}, studentId=${assignment.studentId}, studentEmail=${assignment.studentEmail}, emailMatch=${emailMatch}, idMatch=${idMatch}`);
        return emailMatch || idMatch;
      });
      console.log('Student assignments found:', studentAssignments);

      // Convert assignments to course objects with assignment info
      const assignedCoursesData = studentAssignments.map((assignment: any) => {
        const adminCourse = adminCourses.find((course: any) => course.id === assignment.courseId);
        if (adminCourse) {
          return {
            ...adminCourse,
            assignedBy: assignment.instructorEmail,
            assignedAt: assignment.assignedDate
          };
        }
        return null;
      }).filter(Boolean);

      console.log('Assigned courses data:', assignedCoursesData);
      setAssignedCourses(assignedCoursesData);

      // Load enrolled courses (self-enrolled)
      const enrolledCoursesData = JSON.parse(localStorage.getItem(`enrolledCourses_${userEmail}`) || '[]');
      setEnrolledCourses(enrolledCoursesData);

      toast({
        title: "Courses Refreshed",
        description: "Your course list has been updated.",
      });
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in as student
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || userRole !== 'student') {
      navigate('/login');
      return;
    }

    loadCourses();

    // Load user profile
    const userEmail = localStorage.getItem('userEmail');
    const savedProfile = localStorage.getItem(`studentProfile_${userEmail}`);
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Load certificates
    const savedCertificates = localStorage.getItem(`studentCertificates_${userEmail}`);
    if (savedCertificates) {
      setCertificates(JSON.parse(savedCertificates));
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

  const handleEnrollInCourse = (course: Course) => {
    const userEmail = localStorage.getItem('userEmail');
    const currentEnrolled = JSON.parse(localStorage.getItem(`enrolledCourses_${userEmail}`) || '[]');
    
    // Check if already enrolled or assigned
    const isAlreadyEnrolled = currentEnrolled.some((c: Course) => c.id === course.id);
    const isAlreadyAssigned = assignedCourses.some((c: Course) => c.id === course.id);
    
    if (isAlreadyEnrolled || isAlreadyAssigned) {
      toast({
        title: "Already Enrolled",
        description: "You are already enrolled in this course.",
        variant: "destructive"
      });
      return;
    }

    const updatedCourses = [...currentEnrolled, course];
    localStorage.setItem(`enrolledCourses_${userEmail}`, JSON.stringify(updatedCourses));
    setEnrolledCourses(updatedCourses);
    
    toast({
      title: "Enrolled Successfully",
      description: `You have been enrolled in ${course.title}.`,
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('userEmail');
    localStorage.setItem(`studentProfile_${userEmail}`, JSON.stringify(userProfile));
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
        setUserProfile(prev => ({
          ...prev,
          profilePicture: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Combine enrolled and assigned courses for display
  const myCourses = [...enrolledCourses, ...assignedCourses];

  const generateCertificate = (certificate: Certificate) => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Certificate background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 297, 210, 'F');

    // Border
    pdf.setDrawColor(0, 51, 102);
    pdf.setLineWidth(3);
    pdf.rect(10, 10, 277, 190);
    
    // Inner border
    pdf.setLineWidth(1);
    pdf.rect(15, 15, 267, 180);

    // Header
    pdf.setFontSize(32);
    pdf.setTextColor(0, 51, 102);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CERTIFICATE OF COMPLETION', 148.5, 40, { align: 'center' });

    // Decorative line
    pdf.setLineWidth(2);
    pdf.setDrawColor(255, 215, 0);
    pdf.line(50, 50, 247, 50);

    // Main content
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text('This is to certify that', 148.5, 70, { align: 'center' });

    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text(certificate.studentName, 148.5, 90, { align: 'center' });

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('has successfully completed the course', 148.5, 110, { align: 'center' });

    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text(certificate.courseName, 148.5, 130, { align: 'center' });

    // Course details
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Duration: ${certificate.duration}`, 148.5, 150, { align: 'center' });
    pdf.text(`Completion Date: ${certificate.completionDate}`, 148.5, 165, { align: 'center' });

    // Signature section
    pdf.setFontSize(12);
    pdf.text('Authorized Signature', 60, 185, { align: 'center' });
    pdf.text('Director', 60, 190, { align: 'center' });
    
    // Signature line
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(30, 180, 90, 180);

    // AICTE stamp area
    pdf.setFontSize(10);
    pdf.text('AICTE Approved', 230, 185, { align: 'center' });
    pdf.text('Institution', 230, 190, { align: 'center' });
    
    // Stamp outline
    pdf.setDrawColor(0, 51, 102);
    pdf.setLineWidth(1);
    pdf.circle(230, 175, 15, 'D');

    // Save the PDF
    pdf.save(`${certificate.courseName}_Certificate.pdf`);
    
    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded successfully.",
    });
  };

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
                <span className="text-2xl font-poppins font-bold text-white">Student Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={userProfile.profilePicture}
                  alt="Student"
                  className="w-10 h-10 rounded-full object-cover border-2 border-lms-blue"
                />
                <span className="text-white font-medium">{userProfile.name}</span>
              </div>
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
              { id: 'courses', label: 'My Courses' },
              { id: 'browse', label: 'Browse Courses' },
              { id: 'certificates', label: 'Certificates' },
              { id: 'profile', label: 'Profile' }
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

        {/* My Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-poppins font-bold text-white">My Courses</h2>
              <button
                onClick={loadCourses}
                disabled={isLoading}
                className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Courses</span>
              </button>
            </div>

            {myCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-24 w-24 text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-poppins font-bold text-white mb-4">
                  No Courses Yet
                </h3>
                <p className="text-gray-400 mb-6">
                  You haven't enrolled in any courses yet. Browse available courses to get started!
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="lms-button-primary"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="course-grid">
                {myCourses.map((course) => (
                  <div key={`${course.id}-${course.assignedBy || 'enrolled'}`} className="lms-card group hover:shadow-2xl transition-all duration-300">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {course.assignedBy && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-lms-green/20 text-lms-green rounded-full text-xs font-medium">
                          Assigned
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-poppins font-bold text-white line-clamp-2 hover:text-lms-blue transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                      
                      <div className="flex justify-between text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.modules} modules</span>
                        </span>
                        {course.instructor && (
                          <span className="text-xs">
                            By: {course.instructor}
                          </span>
                        )}
                      </div>
                      
                      {course.assignedBy && (
                        <p className="text-lms-green text-xs">
                          Assigned by: {course.assignedBy}
                        </p>
                      )}
                      
                      <Link
                        to={`/course/${course.id}`}
                        className="block w-full lms-button-primary text-center"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Browse Courses Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-poppins font-bold text-white">Browse All Courses</h2>
            
            <div className="course-grid">
              {allCourses.map((course) => {
                const isEnrolled = myCourses.some(c => c.id === course.id);
                
                return (
                  <div key={course.id} className="lms-card group hover:shadow-2xl transition-all duration-300">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isEnrolled && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-lms-green/20 text-lms-green rounded-full text-xs font-medium">
                          Enrolled
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-poppins font-bold text-white line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                      
                      <div className="flex justify-between text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.modules} modules</span>
                        </span>
                        {course.instructor && (
                          <span className="text-xs">
                            By: {course.instructor}
                          </span>
                        )}
                      </div>
                      
                      {isEnrolled ? (
                        <Link
                          to={`/course/${course.id}`}
                          className="block w-full lms-button bg-lms-green/20 text-lms-green hover:bg-lms-green/30 text-center"
                        >
                          Continue Learning
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleEnrollInCourse(course)}
                          className="w-full lms-button-primary flex items-center justify-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Enroll Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-poppins font-bold text-white">My Certificates</h2>
            
            {certificates.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-24 w-24 text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-poppins font-bold text-white mb-4">
                  No Certificates Yet
                </h3>
                <p className="text-gray-400">
                  Complete courses to earn certificates!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="lms-card">
                    <div className="flex items-center space-x-3 mb-4">
                      <Award className="h-8 w-8 text-lms-yellow" />
                      <div>
                        <h3 className="text-lg font-poppins font-bold text-white">
                          {certificate.courseName}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Completed on {certificate.completionDate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-300 text-sm">
                        <strong>Duration:</strong> {certificate.duration}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <strong>Grade:</strong> {certificate.grade}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => generateCertificate(certificate)}
                      className="w-full lms-button bg-lms-yellow/20 text-lms-yellow hover:bg-lms-yellow/30 flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-poppins font-bold text-white">My Profile</h2>
              <button
                onClick={() => setShowProfileEdit(true)}
                className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex items-center space-x-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="lms-card max-w-2xl">
              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={userProfile.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-lms-blue"
                />
                <div>
                  <h3 className="text-2xl font-poppins font-bold text-white mb-2">
                    {userProfile.name}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Mail className="h-4 w-4" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {userProfile.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-poppins font-semibold text-white mb-2">Bio</h4>
                <p className="text-gray-300 leading-relaxed">{userProfile.bio}</p>
              </div>
            </div>
          </div>
        )}

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
                  ×
                </button>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={userProfile.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-lms-blue"
                    />
                    <label className="absolute bottom-0 right-0 bg-lms-blue rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                      <Upload className="h-4 w-4 text-white" />
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
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="lms-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={userProfile.bio}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="lms-input min-h-[100px]"
                    rows={4}
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
      </div>
    </div>
  );
};

export default StudentDashboard;
