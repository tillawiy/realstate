import { useState } from 'react';
import { Property, PropertyType, PageType } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet';
import { Badge } from './ui/badge';
import { Plus, Pencil, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { BottomNav } from './BottomNav';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Footer } from './Footer';

interface AdminDashboardProps {
  properties: Property[];
  onAddProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  onUpdateProperty: (id: string, updates: Partial<Property>) => void;
  onDeleteProperty: (id: string) => void;
  onNavigate: (page: PageType) => void;
}

export function AdminDashboard({
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  onNavigate
}: AdminDashboardProps) {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'sale' as PropertyType,
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    image: '',
    features: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      type: 'sale',
      location: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      image: '',
      features: ''
    });
  };

  const handleAddSubmit = () => {
    if (!formData.title || !formData.price || !formData.location) {
      toast.error('الرجاء ملء الحقول المطلوبة');
      return;
    }

    onAddProperty({
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      type: formData.type,
      location: formData.location,
      bedrooms: parseInt(formData.bedrooms) || 1,
      bathrooms: parseInt(formData.bathrooms) || 1,
      area: parseFloat(formData.area) || 100,
      image: formData.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    });

    toast.success('تم إضافة العقار بنجاح');
    setIsAddSheetOpen(false);
    resetForm();
  };

  const handleEditClick = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      type: property.type,
      location: property.location,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      image: property.image,
      features: property.features.join(', ')
    });
    setIsEditSheetOpen(true);
  };

  const handleEditSubmit = () => {
    if (!editingProperty) return;

    onUpdateProperty(editingProperty.id, {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      type: formData.type,
      location: formData.location,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseFloat(formData.area),
      image: formData.image,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    });

    toast.success('تم تحديث العقار بنجاح');
    setIsEditSheetOpen(false);
    setEditingProperty(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العقار؟')) {
      onDeleteProperty(id);
      toast.success('تم حذف العقار بنجاح');
    }
  };

  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') {
      return `${price.toLocaleString('ar-SA')} ريال/شهر`;
    }
    return `${price.toLocaleString('ar-SA')} ريال`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-blue-600">لوحة التحكم</h2>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-blue-600 text-xl mb-1">{properties.length}</p>
              <p className="text-gray-600 text-xs">إجمالي</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-blue-600 text-xl mb-1">
                {properties.filter(p => p.type === 'sale').length}
              </p>
              <p className="text-gray-600 text-xs">للبيع</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-blue-600 text-xl mb-1">
                {properties.filter(p => p.type === 'rent').length}
              </p>
              <p className="text-gray-600 text-xs">للإيجار</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Button */}
        <Button onClick={() => setIsAddSheetOpen(true)} className="w-full">
          <Plus className="w-4 h-4 ml-2" />
          إضافة عقار جديد
        </Button>

        {/* Properties List */}
        <div className="space-y-3">
          {properties.map(property => (
            <Card key={property.id}>
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <ImageWithFallback
                    src={property.image}
                    alt={property.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm mb-1 line-clamp-1">{property.title}</h3>
                    <p className="text-gray-600 text-xs mb-1 line-clamp-1">{property.location}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={property.type === 'sale' ? 'default' : 'secondary'} className="text-xs">
                        {property.type === 'sale' ? 'بيع' : 'إيجار'}
                      </Badge>
                      <p className="text-blue-600 text-xs">
                        {formatPrice(property.price, property.type)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleEditClick(property)}
                      >
                        <Pencil className="w-3 h-3 ml-1" />
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="w-3 h-3 ml-1" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>إضافة عقار جديد</SheetTitle>
            <SheetDescription className="sr-only">
              أدخل بيانات العقار الجديد
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">عنوان العقار *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="فيلا فاخرة..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف تفصيلي..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="price">السعر *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="250000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">النوع *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as PropertyType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">للبيع</SelectItem>
                    <SelectItem value="rent">للإيجار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">الموقع *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="الرياض، حي العليا"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="bedrooms">غرف</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  placeholder="3"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bathrooms">حمامات</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  placeholder="2"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="area">م²</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="200"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">رابط الصورة</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="features">المميزات (بفاصلة)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="مسبح, حديقة, موقف"
                rows={2}
              />
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="flex-1">
              إلغاء
            </Button>
            <Button onClick={handleAddSubmit} className="flex-1">
              إضافة
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>تعديل العقار</SheetTitle>
            <SheetDescription className="sr-only">
              قم بتعديل بيانات العقار
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">عنوان العقار *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">الوصف</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">السعر *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-type">النوع *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as PropertyType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">للبيع</SelectItem>
                    <SelectItem value="rent">للإيجار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-location">الموقع *</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-bedrooms">غرف</Label>
                <Input
                  id="edit-bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-bathrooms">حمامات</Label>
                <Input
                  id="edit-bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-area">م²</Label>
                <Input
                  id="edit-area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-image">رابط الصورة</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-features">المميزات (بفاصلة)</Label>
              <Textarea
                id="edit-features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditSheetOpen(false)} className="flex-1">
              إلغاء
            </Button>
            <Button onClick={handleEditSubmit} className="flex-1">
              حفظ
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Footer */}
      <Footer />

      {/* Bottom Navigation */}
      <BottomNav currentPage="admin" onNavigate={onNavigate} userRole="admin" />
    </div>
  );
}
