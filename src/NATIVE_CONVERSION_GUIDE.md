# دليل تحويل التطبيق إلى Native 📱

هذا الدليل يشرح بالتفصيل كيفية تحويل تطبيق العقارات إلى تطبيق Android/iOS native.

---

## الخيار الموصى به: Capacitor ⚡

**Capacitor** يتيح لك استخدام الكود الحالي مباشرة وتحويله إلى تطبيق native.

### الخطوات التفصيلية:

#### 1️⃣ التحضير

\`\`\`bash
# تأكد من تثبيت Node.js
node --version  # يجب أن يكون 16 أو أحدث

# انسخ كود التطبيق إلى مجلد جديد
mkdir real-estate-native
cd real-estate-native

# انسخ جميع الملفات من Figma Make
# (App.tsx, components/, styles/, package.json)
\`\`\`

#### 2️⃣ تثبيت Capacitor

\`\`\`bash
# تثبيت Capacitor
npm install @capacitor/core @capacitor/cli

# تهيئة Capacitor
npx cap init
# الاسم: منصة العقارات
# Package ID: com.realestate.app
# Web Dir: dist (أو build حسب إعدادات React)
\`\`\`

#### 3️⃣ إعداد ملف vite.config.ts أو next.config.js

إذا كنت تستخدم Vite:

\`\`\`typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
})
\`\`\`

#### 4️⃣ بناء التطبيق

\`\`\`bash
# بناء نسخة production
npm run build

# التأكد من وجود مجلد dist
ls dist/
\`\`\`

#### 5️⃣ إضافة منصة Android

\`\`\`bash
# تثبيت plugin Android
npm install @capacitor/android

# إضافة Android
npx cap add android

# سينشئ مجلد android/
\`\`\`

#### 6️⃣ إضافة منصة iOS (يحتاج Mac)

\`\`\`bash
# تثبيت plugin iOS
npm install @capacitor/ios

# إضافة iOS
npx cap add ios

# سينشئ مجلد ios/
\`\`\`

#### 7️⃣ مزامنة الكود

\`\`\`bash
# مزامنة كل التغييرات
npx cap sync

# أو مزامنة منصة محددة
npx cap sync android
npx cap sync ios
\`\`\`

#### 8️⃣ فتح في IDE

\`\`\`bash
# فتح Android Studio
npx cap open android

# فتح Xcode (Mac فقط)
npx cap open ios
\`\`\`

---

## إعدادات Android Studio 🤖

### 1. تثبيت Android Studio
- حمّل من: https://developer.android.com/studio
- ثبّت Android SDK
- ثبّت Android Emulator

### 2. فتح المشروع
\`\`\`bash
npx cap open android
\`\`\`

### 3. تشغيل التطبيق
- انقر على ▶️ Run
- اختر جهاز (Emulator أو هاتفك)
- انتظر البناء

### 4. بناء APK للنشر
\`\`\`
Build > Build Bundle(s) / APK(s) > Build APK(s)
\`\`\`

الملف سيكون في:
\`\`\`
android/app/build/outputs/apk/release/app-release.apk
\`\`\`

---

## إعدادات Xcode (iOS) 🍎

### 1. متطلبات
- Mac مع macOS 12 أو أحدث
- Xcode 14 أو أحدث
- حساب Apple Developer ($99/سنة)

### 2. فتح المشروع
\`\`\`bash
npx cap open ios
\`\`\`

### 3. إعداد Signing
- اختر الـ Team في Xcode
- اختر Signing Certificate
- غيّر Bundle Identifier إذا لزم الأمر

### 4. تشغيل على Simulator
- اختر iPhone Simulator
- انقر ▶️ Run

### 5. تشغيل على جهاز حقيقي
- وصل iPhone بالكمبيوتر
- اختر جهازك من القائمة
- قد تحتاج الموافقة على Developer في Settings > General > VPN & Device Management

---

## إضافة Plugins محلية 🔌

### الكاميرا:
\`\`\`bash
npm install @capacitor/camera
npx cap sync
\`\`\`

\`\`\`typescript
import { Camera } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });
  // استخدم image.webPath
};
\`\`\`

### الموقع (GPS):
\`\`\`bash
npm install @capacitor/geolocation
npx cap sync
\`\`\`

\`\`\`typescript
import { Geolocation } from '@capacitor/geolocation';

const getLocation = async () => {
  const position = await Geolocation.getCurrentPosition();
  console.log(position.coords.latitude, position.coords.longitude);
};
\`\`\`

### المشاركة:
\`\`\`bash
npm install @capacitor/share
npx cap sync
\`\`\`

\`\`\`typescript
import { Share } from '@capacitor/share';

const shareProperty = async () => {
  await Share.share({
    title: 'عقار رائع!',
    text: 'شاهد هذا العقار',
    url: 'https://example.com/property/123',
  });
};
\`\`\`

### التخزين المحلي:
\`\`\`bash
npm install @capacitor/preferences
npx cap sync
\`\`\`

\`\`\`typescript
import { Preferences } from '@capacitor/preferences';

// حفظ
await Preferences.set({ key: 'favorites', value: JSON.stringify(favoriteIds) });

// قراءة
const { value } = await Preferences.get({ key: 'favorites' });
const favoriteIds = JSON.parse(value || '[]');
\`\`\`

---

## تحديث التطبيق 🔄

بعد كل تعديل على الكود:

\`\`\`bash
# 1. بناء التطبيق
npm run build

# 2. مزامنة مع Native
npx cap sync

# 3. (اختياري) فتح IDE
npx cap open android
npx cap open ios
\`\`\`

---

## حل المشاكل الشائعة 🔧

### المشكلة: "Unable to load native module"
**الحل:**
\`\`\`bash
npx cap sync
\`\`\`

### المشكلة: التطبيق يظهر صفحة بيضاء
**الحل:**
تحقق من capacitor.config.ts:
\`\`\`typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.realestate.app',
  appName: 'منصة العقارات',
  webDir: 'dist', // تأكد أن هذا صحيح
  server: {
    androidScheme: 'https'
  }
};

export default config;
\`\`\`

### المشكلة: الخطوط العربية لا تظهر بشكل صحيح
**الحل:**
أضف الخطوط في android/app/src/main/assets/fonts/

### المشكلة: Keyboard يغطي الـ Input
**الحل:**
\`\`\`bash
npm install @capacitor/keyboard
npx cap sync
\`\`\`

---

## نشر في Google Play Store 📲

### 1. إنشاء حساب مطور
- https://play.google.com/console
- دفع $25 (مرة واحدة)

### 2. بناء Signed APK/AAB

في Android Studio:
\`\`\`
Build > Generate Signed Bundle / APK
\`\`\`

### 3. إنشاء Keystore
\`\`\`bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
\`\`\`

### 4. إعدادات Gradle

في android/app/build.gradle:
\`\`\`gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("my-release-key.keystore")
            storePassword "password"
            keyAlias "my-key-alias"
            keyPassword "password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
\`\`\`

### 5. رفع على Play Console
- اختر "Create app"
- املأ التفاصيل
- ارفع AAB file
- املأ Store Listing
- انشر!

---

## نشر في App Store 🍎

### 1. حساب Apple Developer
- https://developer.apple.com
- $99/سنة

### 2. إنشاء App ID
- App Store Connect
- My Apps > + > New App

### 3. إعداد في Xcode
- اختر Product > Archive
- انتظر البناء
- Upload to App Store

### 4. املأ البيانات
- App Store Connect
- Screenshots
- Description
- Privacy Policy
- Submit for Review

### 5. انتظر المراجعة
- عادةً 24-48 ساعة
- قد يطلبون تعديلات

---

## نصائح مهمة 💡

1. **اختبر على أجهزة حقيقية** - Emulators لا تكفي
2. **استخدم Environment Variables** - لا تكتب API keys في الكود
3. **فعّل ProGuard/R8** - لتصغير حجم التطبيق (Android)
4. **اختبر الـ RTL** - تأكد أن العربي يظهر بشكل صحيح
5. **راجع سياسات المتاجر** - قبل النشر

---

## موارد مفيدة 📚

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Developers](https://developer.android.com)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [React Native (بديل)](https://reactnative.dev)

---

**بالتوفيق في تطبيقك! 🚀**
