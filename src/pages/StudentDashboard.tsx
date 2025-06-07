
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import { UserProfile, Certificate } from '@/types/student';
import { useStudentCourses } from '@/hooks/useStudentCourses';
import { StudentDashboardHeader } from '@/components/student/StudentDashboardHeader';
import { StudentDashboardTabs } from '@/components/student/StudentDashboardTabs';
import { MyCourses } from '@/components/student/MyCourses';
import { BrowseCourses } from '@/components/student/BrowseCourses';
import { Certificates } from '@/components/student/Certificates';
import { ProfileTab } from '@/components/student/ProfileTab';
import { ProfileEditModal } from '@/components/student/ProfileEditModal';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Student User',
    email: localStorage.getItem('userEmail') || 'student@example.com',
    bio: 'Passionate about learning and growing through technology.',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    joinDate: '2024-01-15'
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    myCourses,
    allCourses,
    isLoading,
    loadCourses,
    handleEnrollInCourse
  } = useStudentCourses();

  const handleCourseNavigation = (courseId: number) => {
    console.log('Navigating to course with ID:', courseId);
    // Convert courseId to string for navigation
    const courseIdString = courseId.toString();
    
    // Ensure the course exists before navigating
    const course = myCourses.find(c => c.id === courseId) || allCourses.find(c => c.id === courseId);
    if (course) {
      console.log('Course found, navigating to:', `/course/${courseIdString}`);
      navigate(`/course/${courseIdString}`);
    } else {
      console.error('Course not found:', courseId);
      toast({
        title: "Error",
        description: "Course not found. Please try refreshing your courses.",
        variant: "destructive"
      });
    }
  };

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
  }, [navigate, loadCourses]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <MyCourses
            myCourses={myCourses}
            isLoading={isLoading}
            onRefresh={loadCourses}
            onCourseClick={handleCourseNavigation}
            onBrowseClick={() => setActiveTab('browse')}
          />
        );
      case 'browse':
        return (
          <BrowseCourses
            allCourses={allCourses}
            myCourses={myCourses}
            onCourseClick={handleCourseNavigation}
            onEnrollInCourse={handleEnrollInCourse}
          />
        );
      case 'certificates':
        return (
          <Certificates
            certificates={certificates}
            onGenerateCertificate={generateCertificate}
          />
        );
      case 'profile':
        return (
          <ProfileTab
            userProfile={userProfile}
            onEditProfile={() => setShowProfileEdit(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-lms-dark">
      <StudentDashboardHeader
        userProfile={userProfile}
        onBackClick={() => navigate('/')}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-6 py-8">
        <StudentDashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {renderActiveTab()}

        <ProfileEditModal
          isOpen={showProfileEdit}
          userProfile={userProfile}
          onClose={() => setShowProfileEdit(false)}
          onSave={handleProfileUpdate}
          onProfileChange={setUserProfile}
          onProfilePictureChange={handleProfilePictureChange}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
