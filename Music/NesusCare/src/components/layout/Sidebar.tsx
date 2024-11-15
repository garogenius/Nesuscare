import { Link, useLocation } from 'react-router-dom';
import { FaHospital } from 'react-icons/fa';
import {
  Heart,
  Phone,
  UserRoundPlus,
  PlusSquare,
  Calendar,
  Video,
  MessageSquare,
  User,
  Settings,
  X,
  Home,
} from 'lucide-react';
import { cn } from '../../lib/utils';  // Ensure cn is correctly imported or implemented

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Emergency Contacts', href: '/emergency-contacts', icon: Phone },
  { name: 'Doctors', href: '/doctors', icon: UserRoundPlus },
  { name: 'Hospitals', href: '/hospitals', icon: FaHospital },
  { name: 'Pharmacy', href: '/pharmacy', icon: PlusSquare },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'DPP Room', href: '/dpp-room', icon: Video },
  { name: 'Chat AI', href: '/chat-ai', icon: MessageSquare },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Sidebar background overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-gray-900/80 lg:hidden',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={() => setIsOpen(false)} // Close sidebar on click outside
      />

      {/* Sidebar content */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-rose-600" />
            <span className="text-xl font-bold text-gray-900">NesusCare</span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setIsOpen(false)} // Close sidebar when clicking the close button
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center rounded-lg px-3 py-2 text-sm font-medium',
                    location.pathname === item.href
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link
              to="/profile"
              className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </Link>
            <Link
              to="/settings"
              className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
