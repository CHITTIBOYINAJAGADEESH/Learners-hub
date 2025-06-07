
import { BookOpen, RefreshCw } from 'lucide-react';
import { Course } from '@/types/student';
import { CourseCard } from './CourseCard';

interface MyCoursesProps {
  myCourses: Course[];
  isLoading: boolean;
  onRefresh: () => void;
  onCourseClick: (courseId: number) => void;
  onBrowseClick: () => void;
}

export const MyCourses = ({ 
  myCourses, 
  isLoading, 
  onRefresh, 
  onCourseClick, 
  onBrowseClick 
}: MyCoursesProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-poppins font-bold text-white">My Courses</h2>
        <button
          onClick={onRefresh}
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
            onClick={onBrowseClick}
            className="lms-button-primary"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="course-grid">
          {myCourses.map((course) => (
            <CourseCard
              key={`${course.id}-${course.assignedBy || 'enrolled'}`}
              course={course}
              showAssignedBadge={true}
              onCourseClick={onCourseClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
