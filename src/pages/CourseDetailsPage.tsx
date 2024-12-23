import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { VideoPlayer } from '../components/VideoPlayer';
import { LessonList } from '../components/LessonList';
import { CourseHeader } from '../components/CourseHeader';
import { LessonDetails } from '../components/LessonDetails';
import { ReviewList } from '../components/ReviewList';
import { pb } from '../lib/pocketbase';
import { Loader2 } from 'lucide-react';
import type { Course, Lesson } from '../types';

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  // First check if user has access to this course
  const { data: hasAccess, isLoading: isAccessLoading } = useQuery({
    queryKey: ['courseAccess', id],
    queryFn: async () => {
      if (!id) return false;
      const userId = pb.authStore.model?.id;
      if (!userId) return false;

      console.log('Checking course access for user:', userId, 'course:', id);

      try {
        // Get the user record with expanded course access
        const user = await pb.collection('users').getOne(userId, {
          expand: 'course_access'
        });

        console.log('User data:', user);

        if (!user.course_access) {
          console.log('No course access found for user');
          return false;
        }

        // Check if the course ID is in the user's course_access
        const accessibleCourseIds = Array.isArray(user.course_access) 
          ? user.course_access 
          : [user.course_access];

        const hasAccess = accessibleCourseIds.includes(id);
        console.log('Has access:', hasAccess, 'Course IDs:', accessibleCourseIds);
        return hasAccess;
      } catch (error) {
        console.error('Error checking course access:', error);
        return false;
      }
    },
    enabled: !!id,
  });

  // Redirect if no access
  useEffect(() => {
    if (!isAccessLoading && hasAccess === false) {
      console.log('No access to course, redirecting to courses page');
      navigate('/courses');
    }
  }, [hasAccess, isAccessLoading, navigate]);

  const { data: course, isLoading: isCourseLoading, error: courseError } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      if (!id) throw new Error('Course ID is required');
      try {
        const record = await pb.collection('courses').getOne(id, {
          expand: 'instructor',
        });
        if (!record) throw new Error('Course not found');
        return record;
      } catch (error) {
        console.error('Error loading course:', error);
        throw error;
      }
    },
    enabled: !!id && hasAccess === true,
    retry: 1,
  });

  const { data: lessons = [], isLoading: isLessonsLoading, error: lessonsError } = useQuery({
    queryKey: ['lessons', id],
    queryFn: async () => {
      if (!id) throw new Error('Course ID is required');
      try {
        const records = await pb.collection('lessons').getFullList({
          filter: `course="${id}"`,
          sort: 'order',
        });
        return records;
      } catch (error) {
        console.error('Error loading lessons:', error);
        throw error;
      }
    },
    enabled: !!id && !!course && hasAccess === true,
    retry: 1,
  });

  useEffect(() => {
    if (lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessons, currentLesson]);

  if (!id) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto bg-[#1a1f2e] rounded-lg p-8 border border-white/10">
          <h2 className="text-2xl font-semibold text-white">Course ID Required</h2>
          <p className="text-base text-white/70">Please provide a valid course ID to view the content.</p>
          <button
            onClick={() => navigate('/courses')}
            className="w-full px-4 py-3 text-base font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-lg transition-colors duration-200 shadow-lg shadow-indigo-500/20"
          >
            Return to courses
          </button>
        </div>
      </div>
    );
  }

  if (isAccessLoading || isCourseLoading || isLessonsLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#4f46e5] animate-spin mx-auto" />
          <p className="text-sm text-white/50">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto bg-[#1a1f2e] rounded-lg p-8 border border-white/10">
          <h2 className="text-2xl font-semibold text-white">Course Not Found</h2>
          <p className="text-base text-white/70">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="w-full px-4 py-3 text-base font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-lg transition-colors duration-200 shadow-lg shadow-indigo-500/20"
          >
            Return to courses
          </button>
        </div>
      </div>
    );
  }

  if (lessonsError) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto bg-[#1a1f2e] rounded-lg p-8 border border-white/10">
          <h2 className="text-2xl font-semibold text-white">Error Loading Lessons</h2>
          <p className="text-base text-white/70">
            An error occurred while loading lessons for this course.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="w-full px-4 py-3 text-base font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-lg transition-colors duration-200 shadow-lg shadow-indigo-500/20"
          >
            Return to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <CourseHeader course={course} />
        
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {currentLesson ? (
              <div className="bg-[#1a1f2e] rounded-xl overflow-hidden">
                <VideoPlayer
                  lessons_title={currentLesson.lessons_title}
                  videoUrl={currentLesson.videoUrl}
                />
              </div>
            ) : (
              <div className="aspect-video bg-[#1a1f2e] rounded-xl 
                           flex items-center justify-center">
                <p className="text-sm sm:text-base text-white/50">Select a lesson to start learning</p>
              </div>
            )}
            
            {/* Lesson List for Mobile */}
            <div className="lg:hidden bg-[#1a1f2e] rounded-xl">
              <LessonList
                lessons={lessons}
                currentLesson={currentLesson}
                onSelectLesson={setCurrentLesson}
              />
            </div>
            
            <LessonDetails lesson={currentLesson} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-8">
              {/* Lesson List for Desktop */}
              <div className="hidden lg:block bg-[#1a1f2e] rounded-xl">
                <LessonList
                  lessons={lessons}
                  currentLesson={currentLesson}
                  onSelectLesson={setCurrentLesson}
                />
              </div>
              <div className="bg-[#1a1f2e] rounded-xl">
                <ReviewList courseId={course.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
