import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseService, isAuthenticated, pb, isAdmin } from '../lib/pocketbase';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '../components/Navigation';
import { Loader2, Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function CoursePage() {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch courses
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e]">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
            <p className="mt-2 text-white/70">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e]">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">Error loading courses</h2>
            <p className="mt-2 text-white/70">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Marketing Banner */}
        <div className="mb-16 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl overflow-hidden">
          <div className="relative px-6 py-12 sm:px-12 sm:py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-bold text-white">
                  Master Cybersecurity Skills
                </h2>
                <p className="text-lg text-white/70">
                  Join our comprehensive courses and learn from industry experts. Start your journey to becoming a cybersecurity professional today.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      const coursesSection = document.getElementById('courses');
                      if (coursesSection) {
                        coursesSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white 
                             bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-all duration-200"
                  >
                    Explore Courses
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate('/about')}
                    className="px-6 py-3 text-base font-semibold text-white/90 hover:text-white 
                             bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                  >
                    Learn More
                  </button>
                </div>
              </div>
              <div className="relative w-48 h-48 flex-shrink-0 hidden md:block">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-indigo-500/40 rounded-2xl -rotate-6 flex items-center justify-center">
                  <span className="text-6xl">🔒</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course List Section */}
        <div id="courses">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              {isAdmin() ? 'All Courses' : 'My Courses'}
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-white/70 sm:mt-4">
              {isAdmin() 
                ? 'Manage and view all available courses'
                : 'Access your enrolled courses and continue learning'}
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => (
              <div
                key={course.id}
                className="relative flex flex-col rounded-lg shadow-lg overflow-hidden 
                         bg-white dark:bg-gray-800 transition-all duration-200
                         hover:shadow-xl"
              >
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-6 space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium text-white/95">
                      {course.course_title}
                    </h1>
                    <p className="text-base text-white/70">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap gap-6 text-sm text-white/60 pt-2">
                      {course.expand?.instructor && (
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-indigo-400/80" />
                          <span>{course.expand.instructor.name}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-indigo-400/80" />
                        <span>{course.duration} hours</span>
                      </div>
                      <div className="flex items-center">
                        <Signal className="w-4 h-4 mr-2 text-indigo-400/80" />
                        <span className="capitalize">{course.level}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {course.level}
                      </p>
                      {!course.enabled && isAdmin() && (
                        <span className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-full">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">
                        {course.title}
                      </p>
                      <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                        {course.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Duration: {course.duration}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Instructor: {course.expand?.instructor?.username || 'Unknown'}
                      </span>
                    </div>
                    <Link
                      to={`/course/${course.id}`}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                               transition-colors duration-200 text-sm font-medium"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {(!courses || courses.length === 0) && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {isAdmin() 
                    ? 'No courses have been created yet.'
                    : 'You don\'t have access to any courses yet. Please contact an administrator for access.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
