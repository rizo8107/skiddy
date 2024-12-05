import React from 'react';
import { Lesson } from '../lib/pocketbase';

interface LessonListProps {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  onSelectLesson: (lesson: Lesson) => void;
}

export function LessonList({ lessons = [], currentLesson, onSelectLesson }: LessonListProps) {
  if (!Array.isArray(lessons) || lessons.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white/95 mb-4">Lessons List</h2>
        <p className="text-white/60">No lessons available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white/95 mb-4">Lessons List</h2>
      <div className="space-y-2">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson(lesson)}
            className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
              currentLesson?.id === lesson.id
                ? 'bg-indigo-500/20 border border-indigo-500/30 text-white/95'
                : 'hover:bg-white/5 text-white/70 border border-transparent hover:border-white/10'
            }`}
          >
            <div>
              <h3 className="font-medium">{lesson.lessons_title}</h3>
              {lesson.duration && (
                <p className="text-sm text-white/50 mt-0.5">{lesson.duration}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}