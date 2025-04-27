import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Users, Activity, UserPlus, LogOut, Menu, X, User, Settings } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { Button } from '../ui/Button';

export const AppLayout: React.FC = () => {
  const { user, signOut, isLoading, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Activity },
    { name: 'Programs', href: '/programs', icon: Activity },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Register Client', href: '/clients/new', icon: UserPlus },
  ];

  if (isAdmin) {
    navigation.push({ name: 'User Management', href: '/users', icon: Settings });
  }

  const isActiveLink = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white shadow-lg">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-cyan-600">
              <h1 className="text-xl font-bold text-white">Health Info System</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const active = isActiveLink(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        active
                          ? 'bg-cyan-50 text-cyan-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-6 w-6 ${
                          active ? 'text-cyan-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div className="bg-cyan-600 rounded-full p-1">
                    <User className="inline-block h-8 w-8 rounded-full text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user.email}
                    </p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Button
                variant="outline"
                onClick={signOut}
                leftIcon={<LogOut className="h-4 w-4" />}
                className="w-full justify-center"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center shadow-sm h-16 bg-white">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-2 text-xl font-semibold text-gray-800">Health Info System</h1>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 flex z-40 md:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold text-cyan-600">Health Info System</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => {
                    const active = isActiveLink(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          active
                            ? 'bg-cyan-50 text-cyan-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon
                          className={`mr-4 flex-shrink-0 h-6 w-6 ${
                            active ? 'text-cyan-600' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div className="bg-cyan-600 rounded-full p-1">
                      <User className="inline-block h-8 w-8 rounded-full text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user.email}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <Button
                  variant="outline"
                  onClick={signOut}
                  leftIcon={<LogOut className="h-4 w-4" />}
                  className="w-full justify-center"
                >
                  Logout
                </Button>
              </div>
            </div>
            
            <div className="flex-shrink-0 w-14"></div>
          </div>
        )}
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};