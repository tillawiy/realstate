import { Property } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ArrowRight, MapPin, Bed, Bath, Maximize, Check, Phone, Mail, Heart, Share2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface PropertyDetailsPageProps {
  property: Property;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function PropertyDetailsPage({ property, onBack, isFavorite, onToggleFavorite }: PropertyDetailsPageProps) {
  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') {
      return `${price.toLocaleString('ar-SA')} ريال / شهرياً`;
    }
    return `${price.toLocaleString('ar-SA')} ريال`;
  };

  const handleContact = () => {
    toast.success('تم إرسال طلب التواصل بنجاح!');
  };

  const handlePurchase = () => {
    if (property.type === 'sale') {
      toast.success('تم إرسال طلب الشراء بنجاح!');
    } else {
      toast.success('تم إرسال طلب الإيجار بنجاح!');
    }
  };

  const handleShare = () => {
    toast.success('تم نسخ الرابط!');
  };

  const handleFavoriteToggle = () => {
    onToggleFavorite();
    if (!isFavorite) {
      toast.success('تمت الإضافة للمفضلة');
    } else {
      toast.success('تمت الإزالة من المفضلة');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleFavoriteToggle}>
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </header>

      <div className="pb-24">
        {/* Image */}
        <div className="relative h-64 bg-gray-200">
          <ImageWithFallback
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <Badge 
            className="absolute top-4 right-4"
            variant={property.type === 'sale' ? 'default' : 'secondary'}
          >
            {property.type === 'sale' ? 'للبيع' : 'للإيجار'}
          </Badge>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Title & Location */}
          <div>
            <h1 className="mb-2">{property.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>

          {/* Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Bed className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-gray-600 text-xs mb-1">غرف النوم</p>
                  <p className="text-sm">{property.bedrooms}</p>
                </div>
                <div className="text-center">
                  <Bath className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-gray-600 text-xs mb-1">دورات المياه</p>
                  <p className="text-sm">{property.bathrooms}</p>
                </div>
                <div className="text-center">
                  <Maximize className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-gray-600 text-xs mb-1">المساحة</p>
                  <p className="text-sm">{property.area} م²</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-2">الوصف</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3">المميزات</h3>
              <div className="space-y-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3">معلومات التواصل</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>+966 50 123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>info@realestate.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-10">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-gray-600 text-xs mb-1">السعر</p>
            <p className="text-blue-600">
              {formatPrice(property.price, property.type)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={handleContact}
            variant="outline"
          >
            <Phone className="w-4 h-4 ml-2" />
            اتصل الآن
          </Button>
          <Button onClick={handlePurchase}>
            {property.type === 'sale' ? 'طلب شراء' : 'طلب إيجار'}
          </Button>
        </div>
      </div>
    </div>
  );
}
