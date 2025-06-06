import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Play, CheckCircle, Award, User, BarChart3, Settings, X, Camera, Download, Edit, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  currentModule: number;
  image: string;
  instructor: string;
  lastAccessed: string;
  assignedBy?: string;
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
  studentName?: string;
  customMessage?: string;
}

interface CertificateForm {
  studentName: string;
  customMessage: string;
}

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [selectedCertificateCourse, setSelectedCertificateCourse] = useState<Course | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [certificateForm, setCertificateForm] = useState<CertificateForm>({
    studentName: '',
    customMessage: ''
  });
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: 'Student User',
    email: localStorage.getItem('userEmail') || 'student@learnershub.com',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b692?w=150&h=150&fit=crop&crop=face'
  });
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadCoursesAndProgress = () => {
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) return;

    console.log('Loading courses for student:', userEmail);

    // Load assigned courses for this student
    const courseAssignments = JSON.parse(localStorage.getItem('courseAssignments') || '[]');
    console.log('All course assignments:', courseAssignments);
    
    const studentAssignments = courseAssignments.filter((assignment: any) => 
      assignment.studentEmail === userEmail
    );
    console.log('Student assignments:', studentAssignments);

    // Load all courses and filter for assigned ones
    const allCourses = [
      {
        id: 1,
        title: "Introduction to Programming",
        description: "Learn the fundamentals of programming with hands-on exercises",
        progress: 0,
        totalModules: 5,
        completedModules: 0,
        currentModule: 1,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
        instructor: "Dr. Smith",
        lastAccessed: "Never"
      },
      {
        id: 2,
        title: "Web Development Basics",
        description: "HTML, CSS, and JavaScript fundamentals for beginners",
        progress: 0,
        totalModules: 8,
        completedModules: 0,
        currentModule: 1,
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
        instructor: "Prof. Johnson",
        lastAccessed: "Never"
      },
      {
        id: 3,
        title: "Data Structures and Algorithms",
        description: "Essential computer science concepts and problem-solving techniques",
        progress: 0,
        totalModules: 10,
        completedModules: 0,
        currentModule: 1,
        image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=300&fit=crop",
        instructor: "Dr. Williams",
        lastAccessed: "Never"
      },
      {
        id: 4,
        title: "Database Management",
        description: "Learn SQL and database design principles",
        progress: 0,
        totalModules: 6,
        completedModules: 0,
        currentModule: 1,
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop",
        instructor: "Prof. Davis",
        lastAccessed: "Never"
      },
      {
        id: 5,
        title: "Machine Learning Fundamentals",
        description: "Introduction to AI and machine learning concepts",
        progress: 0,
        totalModules: 12,
        completedModules: 0,
        currentModule: 1,
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
        instructor: "Dr. Chen",
        lastAccessed: "Never"
      }
    ];

    // Filter courses based on assignments and add assignment info
    const assignedCourses = allCourses.filter(course => 
      studentAssignments.some((assignment: any) => assignment.courseId === course.id)
    ).map(course => {
      const assignment = studentAssignments.find((a: any) => a.courseId === course.id);
      return {
        ...course,
        assignedBy: assignment?.instructorEmail,
        assignedDate: assignment?.assignedDate
      };
    });

    console.log('Assigned courses:', assignedCourses);

    // Load student progress
    const studentProgress = JSON.parse(localStorage.getItem(`studentProgress_${userEmail}`) || '{}');
    console.log('Student progress:', studentProgress);
    
    const coursesWithProgress = assignedCourses.map(course => {
      const progress = studentProgress[course.id] || { 
        completedModules: 0, 
        progress: 0, 
        currentModule: 1,
        lastAccessed: "Never" 
      };
      
      return {
        ...course,
        completedModules: progress.completedModules || 0,
        progress: progress.progress || 0,
        currentModule: progress.currentModule || 1,
        lastAccessed: progress.lastAccessed || "Never"
      };
    });

    console.log('Final courses with progress:', coursesWithProgress);
    setEnrolledCourses(coursesWithProgress);
  };

  const handleRefreshCourses = async () => {
    setIsRefreshing(true);
    console.log('Refreshing courses...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    loadCoursesAndProgress();
    
    setIsRefreshing(false);
    toast({
      title: "Courses Refreshed",
      description: "Your course list has been updated.",
    });
  };

  useEffect(() => {
    // Check if user is logged in as student
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!isLoggedIn || userRole !== 'student') {
      navigate('/login');
      return;
    }

    // Load student profile from userProfiles
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    if (userEmail && userProfiles[userEmail]) {
      setStudentProfile(userProfiles[userEmail]);
      setCertificateForm(prev => ({
        ...prev,
        studentName: userProfiles[userEmail].name
      }));
    }

    loadCoursesAndProgress();

    // Load certificates
    const savedCertificates = JSON.parse(localStorage.getItem(`studentCertificates_${userEmail}`) || '[]');
    setCertificates(savedCertificates);
  }, [navigate]);

  // Save student data to localStorage whenever it changes
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      localStorage.setItem(`studentCertificates_${userEmail}`, JSON.stringify(certificates));
    }
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
    const userEmail = localStorage.getItem('userEmail');
    
    // Update in userProfiles
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    if (userEmail) {
      userProfiles[userEmail] = studentProfile;
      localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
    }
    
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
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    // Update last accessed time
    const studentProgress = JSON.parse(localStorage.getItem(`studentProgress_${userEmail}`) || '{}');
    if (!studentProgress[courseId]) {
      studentProgress[courseId] = { 
        completedModules: 0, 
        progress: 0, 
        currentModule: 1 
      };
    }
    studentProgress[courseId].lastAccessed = new Date().toLocaleDateString();
    localStorage.setItem(`studentProgress_${userEmail}`, JSON.stringify(studentProgress));

    // Navigate to course
    navigate(`/course/${courseId}`);
  };

  const handleCompleteModule = (courseId: number) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    const course = enrolledCourses.find(c => c.id === courseId);
    if (!course) return;

    const studentProgress = JSON.parse(localStorage.getItem(`studentProgress_${userEmail}`) || '{}');
    if (!studentProgress[courseId]) {
      studentProgress[courseId] = { 
        completedModules: 0, 
        progress: 0, 
        currentModule: 1 
      };
    }

    const currentProgress = studentProgress[courseId];
    
    // Complete current module and unlock next one
    if (currentProgress.completedModules < course.totalModules) {
      currentProgress.completedModules += 1;
      currentProgress.currentModule = Math.min(currentProgress.completedModules + 1, course.totalModules);
      currentProgress.progress = Math.round((currentProgress.completedModules / course.totalModules) * 100);
      currentProgress.lastAccessed = new Date().toLocaleDateString();
      
      localStorage.setItem(`studentProgress_${userEmail}`, JSON.stringify(studentProgress));
      
      // Reload courses to reflect changes
      loadCoursesAndProgress();
      
      if (currentProgress.progress === 100) {
        toast({
          title: "🎉 Course Completed!",
          description: `Congratulations! You've completed ${course.title}. Certificate now available!`,
        });
      } else {
        toast({
          title: "✅ Module Completed!",
          description: `Module ${currentProgress.completedModules} completed. Next module unlocked!`,
        });
      }
    }
  };

  const handleClaimCertificate = (course: Course) => {
    if (course.progress === 100) {
      setSelectedCertificateCourse(course);
      setCertificateForm(prev => ({
        ...prev,
        studentName: studentProfile.name,
        customMessage: `Congratulations on successfully completing ${course.title}! This achievement demonstrates your dedication to learning and your commitment to excellence.`
      }));
      setShowCertificateForm(true);
    }
  };

  const handleCertificateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCertificateCourse) return;

    const newCertificate: Certificate = {
      id: Date.now(),
      courseName: selectedCertificateCourse.title,
      completionDate: new Date().toISOString().split('T')[0],
      grade: "A (95%)",
      studentName: certificateForm.studentName,
      customMessage: certificateForm.customMessage
    };

    setCertificates(prev => [...prev, newCertificate]);
    setShowCertificateForm(false);
    setSelectedCertificateCourse(null);
    
    toast({
      title: "Certificate Generated",
      description: "Your certificate is ready for download!",
    });
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Background gradient effect
    pdf.setFillColor(240, 248, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Decorative border
    pdf.setLineWidth(3);
    pdf.setDrawColor(212, 175, 55);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Inner decorative border
    pdf.setLineWidth(1);
    pdf.setDrawColor(184, 134, 11);
    pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);
    
    // Header with institution name
    pdf.setFontSize(20);
    pdf.setTextColor(59, 130, 246);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🎓 LEARNERS HUB INSTITUTE', pageWidth / 2, 30, { align: 'center' });
    
    // Certificate title
    pdf.setFontSize(42);
    pdf.setTextColor(147, 51, 234);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 55, { align: 'center' });
    
    // Decorative line
    pdf.setLineWidth(2);
    pdf.setDrawColor(212, 175, 55);
    pdf.line(pageWidth / 2 - 60, 62, pageWidth / 2 + 60, 62);
    
    // Presentation text
    pdf.setFontSize(16);
    pdf.setTextColor(75, 85, 99);
    pdf.setFont('helvetica', 'normal');
    pdf.text('This is to certify that', pageWidth / 2, 80, { align: 'center' });
    
    // Student name with decorative styling
    pdf.setFontSize(32);
    pdf.setTextColor(220, 38, 38);
    pdf.setFont('helvetica', 'bold');
    pdf.text(certificate.studentName || studentProfile.name, pageWidth / 2, 100, { align: 'center' });
    
    // Course completion text
    pdf.setFontSize(16);
    pdf.setTextColor(75, 85, 99);
    pdf.setFont('helvetica', 'normal');
    pdf.text('has successfully completed the comprehensive course', pageWidth / 2, 120, { align: 'center' });
    
    // Course name
    pdf.setFontSize(26);
    pdf.setTextColor(59, 130, 246);
    pdf.setFont('helvetica', 'bold');
    pdf.text(certificate.courseName, pageWidth / 2, 140, { align: 'center' });
    
    // Course duration and completion details
    const randomDuration = Math.floor(Math.random() * 6) + 2; // 2-8 months
    pdf.setFontSize(14);
    pdf.setTextColor(107, 114, 128);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Course Duration: ${randomDuration} months | Grade: ${certificate.grade}`, pageWidth / 2, 155, { align: 'center' });
    
    // Custom message
    if (certificate.customMessage) {
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.setFont('helvetica', 'italic');
      const lines = pdf.splitTextToSize(certificate.customMessage, pageWidth - 60);
      pdf.text(lines, pageWidth / 2, 170, { align: 'center' });
    }
    
    // Date and verification
    const completionDate = new Date(certificate.completionDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date of Completion: ${completionDate}`, pageWidth / 2, 190, { align: 'center' });
    
    // Certificate ID
    const certId = `LH-${Date.now().toString().slice(-6)}`;
    pdf.text(`Certificate ID: ${certId}`, pageWidth / 2, 200, { align: 'center' });
    
    // Signature section
    const signatureY = pageHeight - 45;
    
    // Signature lines and labels
    const signatures = [
      { label: 'Course Instructor', x: pageWidth / 4 },
      { label: 'Academic Director', x: pageWidth / 2 },
      { label: 'Principal', x: (pageWidth / 4) * 3 }
    ];
    
    signatures.forEach(sig => {
      // Signature line
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(107, 114, 128);
      pdf.line(sig.x - 25, signatureY, sig.x + 25, signatureY);
      
      // Label
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);
      pdf.setFont('helvetica', 'bold');
      pdf.text(sig.label, sig.x, signatureY + 8, { align: 'center' });
    });
    
    // AICTE-like accreditation stamps
    const stamps = [
      { text: 'AICTE\nAPPROVED', x: 40, y: 60, color: [34, 197, 94] },
      { text: 'UGC\nRECOGNIZED', x: pageWidth - 40, y: 60, color: [168, 85, 247] },
      { text: 'ISO 9001:2015\nCERTIFIED', x: 40, y: pageHeight - 60, color: [239, 68, 68] },
      { text: 'NAAC\nACCREDITED', x: pageWidth - 40, y: pageHeight - 60, color: [59, 130, 246] }
    ];
    
    stamps.forEach(stamp => {
      // Stamp circle
      pdf.setDrawColor(stamp.color[0], stamp.color[1], stamp.color[2]);
      pdf.setLineWidth(2);
      pdf.circle(stamp.x, stamp.y, 18, 'S');
      
      // Stamp text
      pdf.setFontSize(8);
      pdf.setTextColor(stamp.color[0], stamp.color[1], stamp.color[2]);
      pdf.setFont('helvetica', 'bold');
      const stampLines = stamp.text.split('\n');
      stampLines.forEach((line, index) => {
        pdf.text(line, stamp.x, stamp.y - 3 + (index * 6), { align: 'center' });
      });
    });
    
    // Verification QR code placeholder
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Verify at: www.learnershub.com/verify', pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Download the PDF
    const fileName = `Certificate-${certificate.courseName.replace(/\s+/g, '-')}-${certificate.studentName?.replace(/\s+/g, '-') || 'Student'}.pdf`;
    pdf.save(fileName);

    toast({
      title: "📄 Certificate Downloaded",
      description: "Your professional certificate has been downloaded successfully.",
    });
  };

  const stats = [
    { label: 'Assigned Courses', value: enrolledCourses.length, color: 'lms-blue' },
    { label: 'Completed Modules', value: enrolledCourses.reduce((sum, course) => sum + course.completedModules, 0), color: 'lms-green' },
    { label: 'Certificates Earned', value: certificates.length, color: 'lms-purple' },
    { label: 'Average Progress', value: `${Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length) || 0}%`, color: 'lms-yellow' }
  ];

  const achievements = [
    { title: "First Course Assigned", date: "Nov 2024", icon: BookOpen },
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
              <button
                onClick={handleRefreshCourses}
                disabled={isRefreshing}
                className={`text-gray-400 hover:text-white transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                title="Refresh Courses"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
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

        {/* Certificate Form Modal */}
        {showCertificateForm && selectedCertificateCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-lms-gray rounded-xl p-6 w-full max-w-lg modal-content">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-poppins font-bold text-white">Customize Certificate</h3>
                <button 
                  onClick={() => setShowCertificateForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCertificateFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Student Name</label>
                  <input
                    type="text"
                    value={certificateForm.studentName}
                    onChange={(e) => setCertificateForm(prev => ({ ...prev, studentName: e.target.value }))}
                    className="lms-input"
                    placeholder="Enter your name as it should appear on the certificate"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Congratulatory Message</label>
                  <textarea
                    value={certificateForm.customMessage}
                    onChange={(e) => setCertificateForm(prev => ({ ...prev, customMessage: e.target.value }))}
                    className="lms-input min-h-[100px] resize-none"
                    placeholder="Enter a personalized message for your certificate"
                    rows={4}
                  />
                </div>
                <div className="bg-lms-dark p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Certificate Preview</h4>
                  <p className="text-gray-400 text-sm">
                    Course: <span className="text-white">{selectedCertificateCourse.title}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Recipient: <span className="text-white">{certificateForm.studentName || 'Your Name'}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Date: <span className="text-white">{new Date().toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="lms-button-primary flex-1">
                    Generate Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCertificateForm(false)}
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">
                  Welcome back, {studentProfile.name}!
                </h1>
                <p className="text-gray-400">
                  Continue your learning journey
                </p>
              </div>
              <button
                onClick={handleRefreshCourses}
                disabled={isRefreshing}
                className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Courses'}</span>
              </button>
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

            {/* No Courses Message */}
            {enrolledCourses.length === 0 && (
              <div className="lms-card text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-poppins font-bold text-white mb-2">No Courses Assigned</h3>
                <p className="text-gray-400 mb-4">
                  You don't have any courses assigned yet. Please contact your instructor to get started.
                </p>
                <button
                  onClick={handleRefreshCourses}
                  disabled={isRefreshing}
                  className="lms-button-primary flex items-center space-x-2 mx-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Check for New Courses</span>
                </button>
              </div>
            )}

            {/* Continue Learning */}
            {enrolledCourses.length > 0 && (
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
            )}

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
              <h2 className="text-2xl font-poppins font-bold text-white">My Assigned Courses</h2>
              <button
                onClick={handleRefreshCourses}
                disabled={isRefreshing}
                className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="lms-card text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-poppins font-bold text-white mb-2">No Courses Assigned</h3>
                <p className="text-gray-400 mb-4">
                  You don't have any courses assigned yet. Contact your instructor or refresh to check for new assignments.
                </p>
                <button
                  onClick={handleRefreshCourses}
                  disabled={isRefreshing}
                  className="lms-button-primary flex items-center space-x-2 mx-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Check for New Courses</span>
                </button>
              </div>
            ) : (
              /* Courses Grid */
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
                    <p className="text-gray-500 text-sm mb-2 text-wrap-break">Instructor: {course.instructor}</p>
                    {course.assignedBy && (
                      <p className="text-gray-500 text-sm mb-4 text-wrap-break">Assigned by: {course.assignedBy}</p>
                    )}
                    
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
                      <p className="text-gray-500 text-xs mt-2">
                        Current Module: {course.currentModule}/{course.totalModules}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <button 
                        onClick={() => handleContinueCourse(course.id)}
                        className="lms-button-primary flex-1 flex items-center justify-center space-x-1"
                      >
                        <Play className="h-4 w-4" />
                        <span>Continue</span>
                      </button>
                      {course.currentModule <= course.totalModules && course.progress < 100 && (
                        <button 
                          onClick={() => handleCompleteModule(course.id)}
                          className="lms-button bg-lms-green/20 text-lms-green hover:bg-lms-green/30 flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Complete Module</span>
                        </button>
                      )}
                      {course.progress === 100 && (
                        <button 
                          onClick={() => handleClaimCertificate(course)}
                          className="lms-button bg-lms-purple/20 text-lms-purple hover:bg-lms-purple/30 flex items-center space-x-1"
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
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-poppins font-bold text-white">Learning Progress</h2>
            
            {enrolledCourses.length === 0 ? (
              <div className="lms-card text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-poppins font-bold text-white mb-2">No Progress to Show</h3>
                <p className="text-gray-400">
                  Progress will appear here once you have assigned courses.
                </p>
              </div>
            ) : (
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
                  <h3 className="text-lg font-poppins font-semibold text-white mb-4">Module Completion</h3>
                  <div className="space-y-3">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="flex justify-between items-center">
                        <span className="text-gray-300 text-wrap-break">{course.title}</span>
                        <span className="text-lms-blue">{course.completedModules}/{course.totalModules}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
                    <p className="text-gray-400 mb-2">Recipient: {certificate.studentName}</p>
                    <p className="text-gray-400 mb-4">Completed: {certificate.completionDate}</p>
                    <p className="text-sm text-gray-500 mb-4">Grade: {certificate.grade}</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDownloadCertificate(certificate)}
                        className="lms-button-success flex-1 flex items-center justify-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Completed Courses Available for Certificate */}
              {enrolledCourses
                .filter(course => course.progress === 100 && !certificates.some(cert => cert.courseName === course.title))
                .map((course) => (
                  <div key={`available-${course.id}`} className="lms-card border-2 border-lms-blue/30">
                    <div className="text-center">
                      <Award className="h-16 w-16 text-lms-blue mx-auto mb-4" />
                      <h3 className="text-xl font-poppins font-bold text-white mb-2 text-wrap-break">
                        {course.title}
                      </h3>
                      <p className="text-gray-400 mb-4">Certificate Available</p>
                      <button 
                        onClick={() => handleClaimCertificate(course)}
                        className="lms-button-primary w-full flex items-center justify-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Customize & Generate</span>
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

              {/* No Certificates Message */}
              {certificates.length === 0 && enrolledCourses.filter(c => c.progress === 100).length === 0 && (
                <div className="lms-card text-center py-12 col-span-full">
                  <Award className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-poppins font-bold text-white mb-2">No Certificates Yet</h3>
                  <p className="text-gray-400">
                    Complete your courses to earn certificates.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
