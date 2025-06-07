
import { Course } from '@/types/student';
import { CourseCard } from './CourseCard';

interface BrowseCoursesProps {
  allCourses: Course[];
  myCourses: Course[];
  onCourseClick: (courseId: number) => void;
  onEnrollInCourse: (course: Course) => void;
}

export const BrowseCourses = ({ 
  allCourses, 
  myCourses, 
  onCourseClick, 
  onEnrollInCourse 
}: BrowseCoursesProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-poppins font-bold text-white">Browse All Courses</h2>
      
      <div className="course-grid">
        {allCourses.map((course) => {
          const isEnrolled = myCourses.some(c => c.id === course.id);
          
          return (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={isEnrolled}
              onCourseClick={onCourseClick}
              onEnroll={!isEnrolled ? onEnrollInCourse : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};
