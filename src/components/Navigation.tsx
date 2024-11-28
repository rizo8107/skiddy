import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, pb } from '../lib/pocketbase';
import { Logo } from './Logo';
import { User, LogOut } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Navigation() {
  const navigate = useNavigate();
  const user = pb.authStore.model;

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-white/10 bg-black/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
            </Link>

            <div className="hidden md:flex md:items-center md:gap-6">
              <Link
                to="/courses"
                className="text-base text-white/70 hover:text-white/90 transition-colors duration-200"
              >
                Courses
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="relative h-10 w-10 rounded-full bg-black/20 border border-white/10 hover:border-indigo-500/50 
                           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <span className="flex h-full w-full items-center justify-center">
                    <span className="text-lg font-medium text-white/90">
                      {user?.name?.[0]?.toUpperCase() || 'N'}
                    </span>
                  </span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  className="w-56 bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl p-1 animate-in fade-in-0 zoom-in-95"
                >
                  <DropdownMenu.Item 
                    onSelect={() => navigate('/profile')}
                    className="flex items-center gap-3 px-3 py-2.5 text-base text-white/90 focus:text-white 
                             hover:bg-white/5 focus:bg-white/5 rounded-lg cursor-pointer outline-none"
                  >
                    <User className="w-5 h-5 text-indigo-400/80" />
                    <span>Profile</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="my-1 border-t border-white/10" />

                  <DropdownMenu.Item 
                    onSelect={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 text-base text-white/90 focus:text-white 
                             hover:bg-white/5 focus:bg-white/5 rounded-lg cursor-pointer outline-none"
                  >
                    <LogOut className="w-5 h-5 text-indigo-400/80" />
                    <span>Sign out</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </nav>
  );
}
