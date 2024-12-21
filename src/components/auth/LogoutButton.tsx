import React from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>Sign Out</span>
    </button>
  );
}