import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { useSessions } from './hooks/useSessions';
import AuthForm from './components/auth/AuthForm';
import LogoutButton from './components/auth/LogoutButton';
import Timer from './components/Timer';
import MoodTracker from './components/MoodTracker';
import SessionRating from './components/SessionRating';
import Dashboard from './components/dashboard/Dashboard';
import { Sparkles } from 'lucide-react';
import MoodPatternAnalysis from './components/insights/MoodPatternAnalysis';
import { createSession } from './lib/api/sessions';

function AppContent() {
  const { user, loading } = useAuth();
  const { sessions } = useSessions();
  const [duration, setDuration] = React.useState(0);
  const [preMood, setPreMood] = React.useState<string>();
  const [postMood, setPostMood] = React.useState<string>();
  const [preMoodScore, setPreMoodScore] = React.useState(3);
  const [postMoodScore, setPostMoodScore] = React.useState(3);
  const [rating, setRating] = React.useState(0);
  const [notes, setNotes] = React.useState('');
  const [sessionCompleted, setSessionCompleted] = React.useState(false);

  const handleSessionComplete = (completedDuration: number) => {
    setSessionCompleted(true);
    setDuration(completedDuration);
  };

  const handleDiscardSession = () => {
    setSessionCompleted(false);
    setPreMood(undefined);
    setPostMood(undefined);
    setPreMoodScore(3);
    setPostMoodScore(3);
    setRating(0);
    setNotes('');
  };

  const handleSaveSession = async () => {
    if (!user || !preMood || !postMood || !rating || rating < 1) {
      console.error('Missing required fields');
      return;
    }
    
    try {
      await createSession({
        userId: user.id,
        duration,
        preMood,
        preMoodScore,
        postMood,
        postMoodScore,
        rating,
        notes: notes || undefined
      });
      
      // Reset form
      setPreMood(undefined);
      setPostMood(undefined);
      setPreMoodScore(3);
      setPostMoodScore(3);
      setRating(0);
      setNotes('');
      setSessionCompleted(false);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-2">Reflection</h1>
          <p className="text-gray-600">Your daily meditation companion</p>
        </div>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-safe">
      <div className="container mx-auto px-4 py-4 sm:py-8 relative">
        <div className="flex justify-end mb-4 sm:absolute sm:top-4 sm:right-4">
          <div className="sm:relative sm:top-auto sm:right-auto">
            <LogoutButton />
          </div>
        </div>
        <header className="text-center mb-8 sm:mb-12 mt-4 sm:mt-0">
          <h1 className="text-4xl font-light text-gray-800 mb-2">Reflection</h1>
          <p className="text-gray-600">Your daily meditation companion</p>
        </header>

        <main className="max-w-4xl mx-auto space-y-6 sm:space-y-12">
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Track Your Mood</h2>
            <MoodTracker
              preMood={preMood}
              postMood={postMood}
              preMoodScore={preMoodScore}
              postMoodScore={postMoodScore}
              onPreMoodSelect={setPreMood}
              onPostMoodSelect={setPostMood}
              onPreMoodScoreSelect={setPreMoodScore}
              onPostMoodScoreSelect={setPostMoodScore}
              showPostMood={sessionCompleted}
            />
          </section>
          
          {sessionCompleted && (
            <section className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Rate your session</h2>
              <SessionRating value={rating} onChange={setRating} />
              
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-gray-700">Session notes</label>
                <textarea
                  aria-label="Session notes"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                  placeholder="How was your meditation session?"
                  rows={4}
                />
              </div>
              
              {preMood && postMood && rating > 0 && (
                <button
                  onClick={handleSaveSession}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Save Session
                </button>
              )}
              {(!preMood || !postMood || rating === 0) && (
                <p className="text-sm text-gray-600 text-center mt-4">
                  Please complete all fields to save your session
                </p>
              )}
            </section>
          )}

          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm">
            <Timer 
              onComplete={handleSessionComplete}
              disabled={!preMood}
              onDiscard={handleDiscardSession}
              disabledMessage={!preMood ? "Please select your current mood above to begin" : undefined}
            />
          </section>
          
          <Dashboard />

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center space-x-3 text-blue-600">
              <Sparkles size={20} />
              <h2 className="text-xl font-medium">AI Insights</h2>
            </div>
            {sessions && sessions.length > 0 ? (
              <div className="mt-6">
                <MoodPatternAnalysis sessions={sessions} />
              </div>
            ) : (
              <p className="mt-4 text-gray-600">
                Complete your first meditation session to receive personalized insights.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;