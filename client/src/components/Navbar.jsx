import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          Exam Portal
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm bg-indigo-700 px-3 py-1 rounded-full uppercase text-xs font-semibold">
                {user.role}
              </span>
              <span className="text-sm font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md text-sm transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-200 text-sm font-medium">Login</Link>
              <Link to="/register" className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;