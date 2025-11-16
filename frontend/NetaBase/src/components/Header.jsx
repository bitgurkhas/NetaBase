import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, MessageCircle } from 'lucide-react';
import icon from "../assets/NetaBase.png";

const Header = ({ isDark, setIsDark }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load OmniWidget script
  useEffect(() => {
    // Prevent duplicate load
    if (document.getElementById("omnidimension-web-widget")) return;
    
    const script = document.createElement("script");
    script.id = "omnidimension-web-widget";
    script.async = true;
    script.src =
      "https://backend.omnidim.io/web_widget.js?secret_key=473444d319254e96656cfe4207b5f65d";
    
    document.body.appendChild(script);
    
    return () => {
      const existing = document.getElementById("omnidimension-web-widget");
      if (existing) existing.remove();
    };
  }, []);

  // check login state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh_token');
    const userId = localStorage.getItem('user_id');

    if (token && refresh && userId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    setIsLoggedIn(false);
    navigate('/auth');
  };

  const handleChatClick = () => {
    //  OmniWidget chat
    const chatButton = document.getElementById('omni-open-widget-btn');
    if (chatButton) {
      chatButton.click();
    }
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50 border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/home')}>
            <img src={icon} className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-lg" alt="NetaBase" />
            <span className="text-lg sm:text-xl font-bold hidden sm:inline cursor-pointer">NetaBase</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 ml-12">
            <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white transition text-sm bg-none border-none cursor-pointer">Home</button>
            <button onClick={() => navigate('/election')} className="text-gray-300 hover:text-white transition text-sm bg-none border-none cursor-pointer">Events</button>
            <button onClick={() => navigate('/party')} className="text-gray-300 hover:text-white transition text-sm bg-none border-none cursor-pointer">Party</button>
            <button onClick={() => navigate('/news')} className="text-gray-300 hover:text-white transition text-sm bg-none border-none cursor-pointer">News</button>
            <button onClick={() => navigate('/about')} className="text-gray-300 hover:text-white transition text-sm bg-none border-none cursor-pointer">About</button>
            <button onClick={handleChatClick} className="text-gray-300 hover:text-white transition text-sm bg-none border-none cursor-pointer flex items-center gap-2">
              <MessageCircle size={16} />
              <span>Chat</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 cursor-pointer">
            {/* Login / Logout button */}
            {!isLoggedIn ? (
              <button
                onClick={() => navigate('/auth')}
                className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-gray-900 rounded-lg transition text-sm"
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-gray-900 rounded-lg transition text-sm text-red-400 hover:text-red-300"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-900 rounded-lg"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className="h-0.5 bg-white rounded"></span>
                <span className="h-0.5 bg-white rounded"></span>
                <span className="h-0.5 bg-white rounded"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-900">
            <nav className="flex flex-col gap-3 pt-4">
              <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white transition px-2 py-2 text-left bg-none border-none cursor-pointer">Home</button>
              <button onClick={() => navigate('/election')} className="text-gray-300 hover:text-white transition px-2 py-2 text-left bg-none border-none cursor-pointer">Events</button>
              <button onClick={() => navigate('/party')} className="text-gray-300 hover:text-white transition px-2 py-2 text-left bg-none border-none cursor-pointer">Party</button>
              <button onClick={() => navigate('/news')} className="text-gray-300 hover:text-white transition px-2 py-2 text-left bg-none border-none cursor-pointer">News</button>
              <button onClick={() => navigate('/about')} className="text-gray-300 hover:text-white transition px-2 py-2 text-left bg-none border-none cursor-pointer">About</button>
              <button onClick={handleChatClick} className="text-gray-300 hover:text-white transition px-2 py-2 text-left bg-none border-none cursor-pointer flex items-center gap-2">
                <MessageCircle size={16} />
                <span>Chat</span>
              </button>

              {/* Mobile Logout/Login */}
              {!isLoggedIn ? (
                <button
                  onClick={() => navigate('/auth')}
                  className="text-left text-gray-300 hover:text-white transition px-2 py-2 flex items-center gap-2 bg-none border-none cursor-pointer"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-left text-red-400 hover:text-red-300 transition px-2 py-2 flex items-center gap-2 bg-none border-none cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* OmniWidget Button  */}
      <button
        id="omni-open-widget-btn"
        style={{ display: 'none' }}
      ></button>
    </header>
  );
};

export default Header;