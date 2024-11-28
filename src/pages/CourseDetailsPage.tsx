import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { VideoPlayer } from '../components/VideoPlayer';
import { LessonList } from '../components/LessonList';
import { CourseHeader } from '../components/CourseHeader';
import { LessonDetails } from '../components/LessonDetails';
import { ReviewList } from '../components/ReviewList';
import { courseService, lessonService, Course, Lesson } from '../lib/pocketbase';
import { Loader2 } from 'lucide-react';

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseId ? courseService.getOne(courseId) : null,
    enabled: !!courseId,
  });

  const { data: lessons = [], isLoading: isLessonsLoading } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => courseId ? lessonService.getAll(courseId) : [],
    enabled: !!courseId,
  });

  useEffect(() => {
    if (lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessons, currentLesson]);

  if (!courseId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-white/90">Course ID Required</h2>
          <p className="text-base text-white/70">Please provide a valid course ID to view the content.</p>
          <button
            onClick={() => navigate('/courses')}
            className="text-indigo-400/90 hover:text-indigo-400 transition-colors"
          >
            Return to courses
          </button>
        </div>
      </div>
    );
  }

  if (isCourseLoading || isLessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-indigo-500/90 animate-spin mx-auto" />
          <p className="text-sm text-white/50">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-white/90">Course Not Found</h2>
          <p className="text-base text-white/70">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="text-indigo-400/90 hover:text-indigo-400 transition-colors"
          >
            Return to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e]">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <CourseHeader course={course} />
        
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {currentLesson ? (
              <>
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                  <VideoPlayer
                    lessons_title={currentLesson.lessons_title}
                    videoUrl={currentLesson.videoUrl}
                  />
                </div>
              </>
            ) : (
              <div className="aspect-video bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl 
                           flex items-center justify-center">
                <p className="text-sm sm:text-base text-white/50">Select a lesson to start learning</p>
              </div>
            )}
            
            {/* Lesson List for Mobile */}
            <div className="lg:hidden bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl">
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
              <div className="hidden lg:block bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl">
                <LessonList
                  lessons={lessons}
                  currentLesson={currentLesson}
                  onSelectLesson={setCurrentLesson}
                />
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl">
                <ReviewList courseId={course.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
