import { useState } from 'react';
import { Property, PropertyType, UserRole, PageType } from '../App';
import { PropertyCard } from './PropertyCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Search, SlidersHorizontal, Home, Heart, Settings } from 'lucide-react';
import { BottomNav } from './BottomNav';

interface PropertyListingPageProps {
  properties: Property[];
  onViewDetails: (property: Property) => void;
  onNavigate: (page: PageType) => void;
  userRole: UserRole;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function PropertyListingPage({ 
  properties, 
  onViewDetails, 
  onNavigate,
  userRole,
  favorites,
  onToggleFavorite
}: PropertyListingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<PropertyType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAndSortedProperties = properties
    .filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || property.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-3 md:static md:shadow-none md:border-b md:px-8 md:py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600" />
            <h2 className="text-blue-600">العقارات</h2>
          </div>
          {userRole === 'admin' && (
            <Button size="sm" variant="ghost" onClick={() => onNavigate('admin')}>
              <Settings className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="ابحث عن عقار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 pl-12"
          />
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute left-1 top-1"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[400px]">
              <SheetHeader>
                <SheetTitle>الفلاتر والترتيب</SheetTitle>
                <SheetDescription className="sr-only">
                  اختر نوع العقار والترتيب المطلوب
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="mb-3">نوع العقار</h3>
                  <Tabs value={filterType} onValueChange={(v) => setFilterType(v as PropertyType | 'all')} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="all">الكل</TabsTrigger>
                      <TabsTrigger value="sale">للبيع</TabsTrigger>
                      <TabsTrigger value="rent">للإيجار</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div>
                  <h3 className="mb-3">الترتيب</h3>
                  <div className="space-y-2">
                    <Button 
                      variant={sortBy === 'newest' ? 'default' : 'outline'} 
                      className="w-full justify-start"
                      onClick={() => setSortBy('newest')}
                    >
                      الأحدث
                    </Button>
                    <Button 
                      variant={sortBy === 'price-low' ? 'default' : 'outline'} 
                      className="w-full justify-start"
                      onClick={() => setSortBy('price-low')}
                    >
                      السعر: من الأقل للأعلى
                    </Button>
                    <Button 
                      variant={sortBy === 'price-high' ? 'default' : 'outline'} 
                      className="w-full justify-start"
                      onClick={() => setSortBy('price-high')}
                    >
                      السعر: من الأعلى للأقل
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Type Filter Tabs */}
      <div className="bg-white px-4 py-3 border-b md:px-8">
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as PropertyType | 'all')} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="sale">للبيع</TabsTrigger>
            <TabsTrigger value="rent">للإيجار</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 md:px-8">
        <p className="text-gray-600 text-sm">
          {filteredAndSortedProperties.length} عقار متاح
        </p>
      </div>

      {/* Properties List */}
      {filteredAndSortedProperties.length === 0 ? (
        <div className="text-center py-16 px-4 md:px-8">
          <p className="text-gray-500">لا توجد عقارات مطابقة للبحث</p>
        </div>
      ) : (
        <div className="px-4 pb-4 space-y-4 md:max-w-6xl md:mx-auto md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {filteredAndSortedProperties.map(property => (
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

      {/* Bottom Navigation */}
      <BottomNav currentPage="home" onNavigate={onNavigate} userRole={userRole} />
    </div>
  );
}
