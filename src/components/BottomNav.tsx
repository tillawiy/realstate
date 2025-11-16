import { Home, Heart, Settings } from 'lucide-react';
import { PageType, UserRole } from '../App';
import { Button } from './ui/button';

interface BottomNavProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  userRole: UserRole;
}

export function BottomNav({ currentPage, onNavigate, userRole }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20 md:hidden">
      <div className="grid grid-cols-3 gap-1 p-2">
        <Button
          variant={currentPage === 'home' ? 'default' : 'ghost'}
          className="flex flex-col items-center justify-center h-14 gap-1"
          onClick={() => onNavigate('home')}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">الرئيسية</span>
        </Button>
        
        <Button
          variant={currentPage === 'favorites' ? 'default' : 'ghost'}
          className="flex flex-col items-center justify-center h-14 gap-1"
          onClick={() => onNavigate('favorites')}
        >
          <Heart className="w-5 h-5" />
          <span className="text-xs">المفضلة</span>
        </Button>
        
        {userRole === 'admin' && (
          <Button
            variant={currentPage === 'admin' ? 'default' : 'ghost'}
            className="flex flex-col items-center justify-center h-14 gap-1"
            onClick={() => onNavigate('admin')}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">الإدارة</span>
          </Button>
        )}
      </div>
    </nav>
  );
}
