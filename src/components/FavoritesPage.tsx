import { Property, PageType, UserRole } from '../App';
import { PropertyCard } from './PropertyCard';
import { Heart } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

interface FavoritesPageProps {
  properties: Property[];
  onViewDetails: (property: Property) => void;
  onNavigate: (page: PageType) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  userRole: UserRole;
}

export function FavoritesPage({ 
  properties, 
  onViewDetails, 
  onNavigate,
  favorites,
  onToggleFavorite,
  userRole
}: FavoritesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          <h2 className="text-red-500">المفضلة</h2>
        </div>
      </header>

      {/* Count */}
      <div className="px-4 py-3">
        <p className="text-gray-600 text-sm">
          {properties.length} عقار في المفضلة
        </p>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="text-center py-16 px-4">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-2">لا توجد عقارات في المفضلة</p>
          <p className="text-gray-400 text-sm">اضغط على القلب لإضافة عقارات للمفضلة</p>
        </div>
      ) : (
        <div className="px-4 pb-4 space-y-4 md:max-w-6xl md:mx-auto md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onViewDetails={() => onViewDetails(property)}
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={() => onToggleFavorite(property.id)}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Bottom Navigation */}
      <BottomNav currentPage="favorites" onNavigate={onNavigate} userRole={userRole} />
    </div>
  );
}
