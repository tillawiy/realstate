import { Property } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Bed, Bath, Maximize, MapPin, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import React from 'react';

interface PropertyCardProps {
  property: Property;
  onViewDetails: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function PropertyCard({ property, onViewDetails, isFavorite, onToggleFavorite }: PropertyCardProps) {
  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') {
      return `${price.toLocaleString('ar-SA')} ريال/شهر`;
    }
    return `${price.toLocaleString('ar-SA')} ريال`;
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  return (
    <Card 
      className="overflow-hidden active:scale-[0.98] transition-transform md:hover:shadow-lg md:hover:-translate-y-1 cursor-pointer" 
      onClick={onViewDetails}
    >
      <div className="flex gap-3 p-3 md:gap-4 md:p-4 lg:gap-5 lg:p-5">
        {/* Image */}
        <div className="relative flex-shrink-0 w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <Badge 
            className="absolute top-2 right-2 text-xs px-2 py-0.5 md:top-3 md:right-3 md:text-sm md:px-3 md:py-1"
            variant={property.type === 'sale' ? 'default' : 'secondary'}
          >
            {property.type === 'sale' ? 'بيع' : 'إيجار'}
          </Badge>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1 md:mb-2">
              <h3 className="text-sm md:text-base lg:text-lg line-clamp-1 hover:text-blue-600 transition-colors">
                {property.title}
              </h3>
              {onToggleFavorite && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 md:h-10 md:w-10 p-0 flex-shrink-0"
                  onClick={handleFavoriteClick}
                >
                  <Heart 
                    className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-gray-500 mb-2 md:mb-3">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="text-xs md:text-sm line-clamp-1">{property.location}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600 text-xs md:text-sm mb-2 md:mb-3">
              <div className="flex items-center gap-1">
                <Bed className="w-3 h-3 md:w-4 md:h-4" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-3 h-3 md:w-4 md:h-4" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize className="w-3 h-3 md:w-4 md:h-4" />
                <span>{property.area} م²</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <p className="text-blue-600 text-sm md:text-base lg:text-lg font-semibold">
              {formatPrice(property.price, property.type)}
            </p>
            <Button 
              size="sm" 
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onViewDetails(); }} 
              className="h-7 text-xs px-3 md:h-9 md:text-sm md:px-4"
            >
              التفاصيل
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
