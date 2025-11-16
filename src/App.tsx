import { useState } from 'react';
import { PropertyListingPage } from './components/PropertyListingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { PropertyDetailsPage } from './components/PropertyDetailsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { Toaster } from './components/ui/sonner';
import { Footer } from './components/Footer';

export type PropertyType = 'sale' | 'rent';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  features: string[];
  createdAt: Date;
}

export type UserRole = 'admin' | 'user';
export type PageType = 'home' | 'favorites' | 'admin' | 'details';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      title: 'فيلا فاخرة بإطلالة بحرية',
      description: 'فيلا راقية بتصميم عصري مع إطلالة خلابة على البحر، تتضمن حديقة واسعة ومسبح خاص',
      price: 2500000,
      type: 'sale',
      location: 'جدة، حي الشاطئ',
      bedrooms: 5,
      bathrooms: 4,
      area: 450,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      features: ['مسبح خاص', 'حديقة', 'موقف سيارات', 'مطبخ حديث', 'نظام أمني'],
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'شقة عصرية في برج سكني',
      description: 'شقة مفروشة بالكامل في برج حديث مع جميع المرافق والخدمات',
      price: 3500,
      type: 'rent',
      location: 'الرياض، حي العليا',
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      features: ['مفروشة', 'صالة رياضية', 'أمن 24 ساعة', 'موقف مغطى'],
      createdAt: new Date('2024-02-20')
    },
    {
      id: '3',
      title: 'دوبلكس واسع للعائلات',
      description: 'دوبلكس بمساحة كبيرة مثالي للعائلات الكبيرة، مع تشطيبات فاخرة',
      price: 1800000,
      type: 'sale',
      location: 'دبي، جميرا',
      bedrooms: 4,
      bathrooms: 3,
      area: 320,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      features: ['تشطيبات فاخرة', 'غرفة خادمة', 'شرفات واسعة', 'مصعد خاص'],
      createdAt: new Date('2024-03-10')
    },
    {
      id: '4',
      title: 'شقة صغيرة مفروشة',
      description: 'شقة استوديو مفروشة بالكامل، مثالية للأفراد أو الأزواج الجدد',
      price: 2200,
      type: 'rent',
      location: 'أبو ظبي، المركزية',
      bedrooms: 1,
      bathrooms: 1,
      area: 65,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      features: ['مفروشة بالكامل', 'إنترنت مجاني', 'قريبة من المترو'],
      createdAt: new Date('2024-03-25')
    }
  ]);

  const handleAddProperty = (property: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setProperties([newProperty, ...properties]);
  };

  const handleUpdateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(properties.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setCurrentPage('details');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id)
        : [...prev, id]
    );
  };

  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50 pb-16 flex flex-col" dir="rtl">
      <div className="flex-1">
        {currentPage === 'home' && (
          <PropertyListingPage
            properties={properties}
            onViewDetails={handleViewDetails}
            onNavigate={setCurrentPage}
            userRole={userRole}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
        
        {currentPage === 'favorites' && (
          <FavoritesPage
            properties={favoriteProperties}
            onViewDetails={handleViewDetails}
            onNavigate={setCurrentPage}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            userRole={userRole}
          />
        )}
        
        {currentPage === 'admin' && (
          <AdminDashboard
            properties={properties}
            onAddProperty={handleAddProperty}
            onUpdateProperty={handleUpdateProperty}
            onDeleteProperty={handleDeleteProperty}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'details' && selectedProperty && (
          <PropertyDetailsPage
            property={selectedProperty}
            onBack={() => setCurrentPage('home')}
            isFavorite={favorites.includes(selectedProperty.id)}
            onToggleFavorite={() => toggleFavorite(selectedProperty.id)}
          />
        )}
      </div>

      {/* Footer - Only show on home, favorites, and admin pages */}
      {currentPage !== 'details' && <Footer />}
      
      <Toaster position="top-center" dir="rtl" />
    </div>
  );
}

export default App;
