import React, { useState, useEffect } from 'react'; 
import { Gamepad2, User, LogOut } from 'lucide-react'; 

const Navbar = ({ onLogoClick, onSignInClick, onLibraryClick }) => {
  const [user, setUser] = useState(null);

  // Check for user on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="border-b border-white/5 bg-black/95 backdrop-blur-md sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <div 
          onClick={onLogoClick} 
          className="flex items-center gap-2 font-black uppercase tracking-tighter text-2xl cursor-pointer hover:text-red-500 transition-colors group"
        >
          <Gamepad2 className="h-8 w-8 text-red-600 group-hover:rotate-12 transition-transform" /> 
          <span>Game<span className="text-red-600">Trackr</span></span>
        </div>
        
        {user ? (
          <div className="flex items-center gap-6"> 
             <button 
               onClick={onLibraryClick}
               className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
              >
               My Library
             </button>
             <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
                <User size={16} />
                <span>{user.username}</span>
             </div>
             <button 
                onClick={handleLogout}
                className="text-xs font-black text-red-600 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
             >
                <LogOut size={14} /> Logout
             </button>
          </div>
        ) : (
          <button 
            onClick={onSignInClick}
            className="px-6 py-2 text-xs font-black text-white bg-red-600 uppercase tracking-widest hover:bg-red-700 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
