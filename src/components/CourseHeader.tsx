import React from 'react';
import { Course } from '../lib/pocketbase';
import { BookOpen, Clock, Signal } from 'lucide-react';

interface CourseHeaderProps {
  course: Course;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex flex-col md:flex-row gap-8">
      
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-semibold text-white/95">
            {course.course_title}
          </h1>
          <p className="text-base text-white/70 leading-relaxed">
            {course.description}
          </p>
          <div className="flex flex-wrap gap-6 pt-2">
            {course.duration && (
              <div className="flex items-center text-white/60">
                <Clock className="w-4 h-4 mr-2 text-indigo-400/80" />
                <span>{course.duration}</span>
              </div>
            )}
            {course.level && (
              <div className="flex items-center text-white/60">
                <Signal className="w-4 h-4 mr-2 text-indigo-400/80" />
                <span className="capitalize">{course.level}</span>
              </div>
            )}
            {course.expand?.instructor && (
              <div className="flex items-center text-white/60">
                <BookOpen className="w-4 h-4 mr-2 text-indigo-400/80" />
                <span>By {course.expand.instructor.name || 'Unknown'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}