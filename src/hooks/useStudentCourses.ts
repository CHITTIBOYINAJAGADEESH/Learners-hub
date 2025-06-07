
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
        const adminCourse = adminCourses.find((course: any) => 
          course.id === assignment.courseId || 
          course.id === parseInt(assignment.courseId) ||
          course.id === assignment.courseId.toString()
        );
        if (adminCourse) {
          return {
            ...adminCourse,
            id: typeof adminCourse.id === 'string' ? parseInt(adminCourse.id) : adminCourse.id,
            assignedBy: assignment.instructorEmail || 'System',
            assignedAt: assignment.assignedDate
          };
        }
        return null;
      }).filter(Boolean);

      console.log('Assigned courses data:', assignedCoursesData);
      setAssignedCourses(assignedCoursesData);

      // Load enrolled courses (self-enrolled)
      const enrolledCoursesData = JSON.parse(localStorage.getItem(`enrolledCourses_${userEmail}`) || '[]')
        .map((course: any) => ({
          ...course,
          id: typeof course.id === 'string' ? parseInt(course.id) : course.id
        }));
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

    const courseToSave = {
      ...course,
      id: typeof course.id === 'string' ? parseInt(course.id) : course.id
    };
    const updatedCourses = [...currentEnrolled, courseToSave];
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
