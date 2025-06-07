
import { BookOpen, Plus } from 'lucide-react';
import { Course } from '@/types/student';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  showAssignedBadge?: boolean;
  onCourseClick: (courseId: number) => void;
  onEnroll?: (course: Course) => void;
}

export const CourseCard = ({ 
  course, 
  isEnrolled = false, 
  showAssignedBadge = false,
  onCourseClick,
  onEnroll 
}: CourseCardProps) => {
  return (
    <div className="lms-card group hover:shadow-2xl transition-all duration-300">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {showAssignedBadge && course.assignedBy && course.assignedBy !== 'System' && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-lms-green/20 text-lms-green rounded-full text-xs font-medium">
            Assigned
          </div>
        )}
        {isEnrolled && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-lms-green/20 text-lms-green rounded-full text-xs font-medium">
            Enrolled
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
        
        {showAssignedBadge && course.assignedBy && course.assignedBy !== 'System' && (
          <p className="text-lms-green text-xs">
            Assigned by: {course.assignedBy}
          </p>
        )}
        
        {isEnrolled ? (
          <button
            onClick={() => onCourseClick(course.id)}
            className="block w-full lms-button bg-lms-green/20 text-lms-green hover:bg-lms-green/30 text-center"
          >
            Continue Learning
          </button>
        ) : onEnroll ? (
          <button
            onClick={() => onEnroll(course)}
            className="w-full lms-button-primary flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Enroll Now</span>
          </button>
        ) : (
          <button
            onClick={() => onCourseClick(course.id)}
            className="block w-full lms-button-primary text-center"
          >
            Continue Learning
          </button>
        )}
      </div>
    </div>
  );
};
