import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pb } from '../lib/pocketbase';
import { Loader2, BookOpen, Clock, Signal, User } from 'lucide-react';
import type { Course } from '../types';

export default function CoursesPage() {
  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        console.log('No user ID found');
        return { items: [] };
      }

      console.log('Fetching courses for user:', userId);

      try {
        // Get the user record with expanded course access
        const user = await pb.collection('users').getOne(userId, {
          expand: 'course_access'
        });

        console.log('User data:', user);

        if (!user.course_access) {
          console.log('No course access found for user');
          return { items: [] };
        }

        // Get the course IDs from the user's course_access field
        const accessibleCourseIds = Array.isArray(user.course_access) 
          ? user.course_access 
          : [user.course_access];

        console.log('Accessible course IDs:', accessibleCourseIds);

        if (accessibleCourseIds.length === 0) {
          console.log('No accessible courses found');
          return { items: [] };
        }

        // Build the filter for multiple course IDs
        const filter = accessibleCourseIds.map(id => `id = "${id}"`).join(' || ');
        console.log('Course filter:', filter);

        // Fetch only the courses that the user has access to
        const records = await pb.collection('courses').getList(1, 50, {
          filter: filter,
          expand: 'instructor',
          sort: '-created',
        });

        console.log('Found courses:', records.items);
        return records;
      } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
    },
  });

  if (error) {
    console.error('Query error:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white/90">All Courses</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesData?.items.map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="group bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden 
                         hover:border-indigo-500/50 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30
                         transition-all duration-300 outline-none transform hover:-translate-y-1"
              >
                {course.thumbnail ? (
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <img
                      src={`${pb.files.getUrl(course, course.thumbnail)}?thumb=1920x1080`}
                      alt={course.course_title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-black/50 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/20" />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-medium text-white/95 group-hover:text-white transition-colors">
                    {course.course_title}
                  </h2>
                  <p className="text-base text-white/70 group-hover:text-white/80 transition-colors line-clamp-2">
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
