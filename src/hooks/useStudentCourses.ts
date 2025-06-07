
import { useState, useCallback } from 'react';
import { Course } from '@/types/student';
import { useToast } from '@/hooks/use-toast';

export const useStudentCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadCourses = useCallback(() => {
    setIsLoading(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      
      // Load all available courses from admin
      const adminCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
      console.log('Admin courses loaded:', adminCourses);
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
      
      // Convert student ID to both string and number for comparison
      const currentStudentId = currentStudent?.id;
      const studentIdAsNumber = currentStudentId ? parseInt(currentStudentId.toString()) : null;
      const studentIdAsString = currentStudentId ? currentStudentId.toString() : null;
      
      console.log('Current student email:', userEmail);
      console.log('Current student ID:', currentStudentId);
      console.log('Student ID as number:', studentIdAsNumber);
      console.log('Student ID as string:', studentIdAsString);

      // Filter assignments for this student using multiple matching strategies
      const studentAssignments = courseAssignments.filter((assignment: any) => {
        // Try multiple ID matching strategies
        const assignmentStudentId = assignment.studentId;
        const assignmentStudentIdAsNumber = parseInt(assignmentStudentId?.toString() || '0');
        const assignmentStudentIdAsString = assignmentStudentId?.toString();
        
        const idMatch = (
          (studentIdAsNumber && assignmentStudentIdAsNumber === studentIdAsNumber) ||
          (studentIdAsString && assignmentStudentIdAsString === studentIdAsString) ||
          (currentStudentId && assignmentStudentId === currentStudentId)
        );
        
        console.log(`Assignment check: courseId=${assignment.courseId}, studentId=${assignmentStudentId}, idMatch=${idMatch}`);
        return idMatch;
      });
      
      console.log('Student assignments found:', studentAssignments);

      // Convert assignments to course objects with assignment info
      const assignedCoursesData = studentAssignments.map((assignment: any) => {
        // Find the course by trying both string and number matching
        const courseId = assignment.courseId;
        const courseIdAsNumber = parseInt(courseId?.toString() || '0');
        const courseIdAsString = courseId?.toString();
        
        const adminCourse = adminCourses.find((course: any) => {
          const adminCourseId = course.id;
          const adminCourseIdAsNumber = parseInt(adminCourseId?.toString() || '0');
          const adminCourseIdAsString = adminCourseId?.toString();
          
          return (
            adminCourseId === courseId ||
            adminCourseIdAsNumber === courseIdAsNumber ||
            adminCourseIdAsString === courseIdAsString
          );
        });
        
        if (adminCourse) {
          return {
            ...adminCourse,
            id: adminCourse.id,
            assignedBy: assignment.instructorEmail || assignment.assignedBy || 'System',
            assignedAt: assignment.assignedDate || assignment.assignedAt
          };
        }
        return null;
      }).filter(Boolean);

      console.log('Assigned courses data:', assignedCoursesData);
      setAssignedCourses(assignedCoursesData);

      // Load enrolled courses (self-enrolled)
      const enrolledCoursesData = JSON.parse(localStorage.getItem(`enrolledCourses_${userEmail}`) || '[]');
      console.log('Enrolled courses data:', enrolledCoursesData);
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
  }, [toast]);

  const handleEnrollInCourse = useCallback((course: Course) => {
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
  }, [assignedCourses, toast]);

  const myCourses = [...enrolledCourses, ...assignedCourses];

  return {
    enrolledCourses,
    assignedCourses,
    allCourses,
    myCourses,
    isLoading,
    loadCourses,
    handleEnrollInCourse
  };
};
