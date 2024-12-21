import React from 'react';
import { MeditationSession } from '../../types';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  sessions: MeditationSession[];
};

const NOTES_PER_PAGE = 5;

export default function SessionReport({ sessions }: Props) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((acc, session) => acc + session.duration / 60, 0);
  const averageRating = sessions.reduce((acc, session) => acc + session.rating, 0) / totalSessions || 0;
  
  const sessionsWithNotes = sessions
    .filter(session => session.notes)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const totalPages = Math.ceil(sessionsWithNotes.length / NOTES_PER_PAGE);
  const startIndex = (currentPage - 1) * NOTES_PER_PAGE;
  const currentNotes = sessionsWithNotes.slice(startIndex, startIndex + NOTES_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{totalSessions}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{Math.round(totalMinutes)}</div>
          <div className="text-sm text-gray-600">Minutes Meditated</div>
        </div>
        <div className="text-center">
          <div className="flex justify-center items-center">
            <span className="text-2xl font-bold text-gray-800 mr-1">
              {averageRating.toFixed(1)}
            </span>
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
      </div>

      {sessionsWithNotes.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Session Notes</h3>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          <div className="space-y-4">
            {currentNotes.map((session) => (
              <div key={session.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-600">
                    {new Date(session.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex">
                    {Array.from({ length: session.rating }).map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 text-yellow-400 fill-current" 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{session.notes}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {(session.duration / 60).toFixed(2)} minutes • {session.pre_mood} → {session.post_mood}
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + NOTES_PER_PAGE, sessionsWithNotes.length)} of {sessionsWithNotes.length}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}