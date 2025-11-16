# دليل بناء ملف APK خطوة بخطوة 📱

هذا الدليل يشرح كيفية تحويل التطبيق إلى ملف APK جاهز للتثبيت على أندرويد.

---

## المتطلبات 📋

قبل البدء، تأكد من تثبيت:

1. **Node.js** (الإصدار 18 أو أحدث)
   - حمّل من: https://nodejs.org
   - تحقق: `node --version`

2. **Java Development Kit (JDK)**
   - حمّل JDK 17: https://adoptium.net
   - تحقق: `java --version`

3. **Android Studio**
   - حمّل من: https://developer.android.com/studio
   - ثبّت Android SDK

---

## الخطوات 🚀

### 1️⃣ تحميل الملفات

قم بتحميل كل الملفات من Figma Make إلى مجلد على جهازك:

\`\`\`bash
mkdir real-estate-app
cd real-estate-app

# انسخ جميع الملفات هنا
\`\`\`

الملفات المطلوبة:
- ✅ `App.tsx`
- ✅ مجلد `components/`
- ✅ مجلد `styles/`
- ✅ `package.json`
- ✅ `capacitor.config.ts`
- ✅ `vite.config.ts`
- ✅ `tsconfig.json`
- ✅ `index.html`
- ✅ مجلد `src/`

---

### 2️⃣ تثبيت Dependencies

\`\`\`bash
# تثبيت جميع المكتبات
npm install

# تثبيت Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# إنشاء مجلد Android
npx cap add android
\`\`\`

---

### 3️⃣ بناء التطبيق

\`\`\`bash
# بناء نسخة production
npm run build

# التحقق من المجلد dist
ls dist/
# يجب أن ترى: index.html, assets/, ...
\`\`\`

---

### 4️⃣ مزامنة مع Android

\`\`\`bash
# نسخ ملفات الويب إلى مشروع Android
npx cap sync android
\`\`\`

---

### 5️⃣ فتح في Android Studio

\`\`\`bash
npx cap open android
\`\`\`

سيفتح Android Studio تلقائياً.

---

### 6️⃣ بناء APK من Android Studio

#### أ) APK للتجربة (Debug):

1. في Android Studio، اضغط: `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
2. انتظر حتى ينتهي البناء (شريط في الأسفل)
3. اضغط على "locate" عند ظهور الإشعار
4. الملف في: `android/app/build/outputs/apk/debug/app-debug.apk`

**✅ جاهز! يمكنك نقله للهاتف وتثبيته**

---

#### ب) APK للنشر (Release - Signed):

##### الخطوة 1: إنشاء Keystore

\`\`\`bash
cd android/app

keytool -genkey -v -keystore real-estate-key.keystore \\
  -alias real-estate \\
  -keyalg RSA \\
  -keysize 2048 \\
  -validity 10000

# سيطلب منك:
# - Enter keystore password: (اختر كلمة سر قوية)
# - Re-enter password: (كررها)
# - What is your first and last name?: (اسمك)
# - What is the name of your organization?: (اسم الشركة)
# - ... (املأ الباقي)
\`\`\`

**⚠️ مهم جداً:** احفظ:
- الملف `real-estate-key.keystore`
- كلمة السر
- لن تستطيع تحديث التطبيق بدونهم!

---

##### الخطوة 2: إعداد Gradle

أنشئ ملف `android/key.properties`:

\`\`\`properties
storePassword=كلمة_سر_الـkeystore
keyPassword=كلمة_سر_الـkey
keyAlias=real-estate
storeFile=real-estate-key.keystore
\`\`\`

---

##### الخطوة 3: تعديل build.gradle

افتح `android/app/build.gradle` وأضف قبل `android {`:

\`\`\`gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
\`\`\`

---

##### الخطوة 4: بناء APK موقّع

في Android Studio:

1. `Build` > `Generate Signed Bundle / APK`
2. اختر `APK`
3. `Next`
4. اختر Keystore file (`real-estate-key.keystore`)
5. أدخل الباسوردات
6. `Next`
7. اختر `release`
8. `Finish`

أو من Terminal:

\`\`\`bash
cd android
./gradlew assembleRelease

# الملف سيكون في:
# android/app/build/outputs/apk/release/app-release.apk
\`\`\`

---

### 7️⃣ تثبيت APK على الهاتف

#### الطريقة 1: USB

\`\`\`bash
# تفعيل USB Debugging على الهاتف
# Settings > Developer Options > USB Debugging

# توصيل الهاتف بالكمبيوتر
adb install app-release.apk
\`\`\`

#### الطريقة 2: نقل الملف

1. انقل `app-release.apk` للهاتف (عبر USB/Email/Drive)
2. افتح الملف على الهاتف
3. السماح بـ "Install from Unknown Sources" إذا طُلب منك
4. اضغط "Install"

---

## استكشاف الأخطاء 🔧

### الخطأ: "SDK location not found"

**الحل:**

أنشئ ملف `android/local.properties`:

\`\`\`properties
# Windows
sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\sdk

# Mac
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk

# Linux
sdk.dir=/home/YOUR_USERNAME/Android/Sdk
\`\`\`

---

### الخطأ: "Build failed" - Gradle

**الحل:**

\`\`\`bash
cd android
./gradlew clean
./gradlew assembleDebug
\`\`\`

---

### الخطأ: التطبيق يظهر شاشة بيضاء

**الحل:**

تأكد من:
1. ملف `capacitor.config.ts` يشير لـ `webDir: 'dist'`
2. قمت بتشغيل `npm run build` قبل `npx cap sync`

---

### الخطأ: الخطوط العربية لا تظهر

**الحل:**

أضف الخطوط في `android/app/src/main/assets/fonts/`

---

## تحسين حجم APK 📦

### 1. تفعيل ProGuard

في `android/app/build.gradle`:

\`\`\`gradle
buildTypes {
    release {
        minifyEnabled true  // غيّر من false
        shrinkResources true  // أضف هذا
        ...
    }
}
\`\`\`

### 2. تقسيم حسب Architecture

\`\`\`gradle
android {
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
            universalApk false
        }
    }
}
\`\`\`

سينتج 4 ملفات APK أصغر حجماً.

---

## نشر في Google Play Store 🚀

### 1. إنشاء حساب مطور

- https://play.google.com/console
- دفع $25 (مرة واحدة)

### 2. تحضير المتطلبات

- ✅ APK موقّع (أو AAB)
- ✅ أيقونة التطبيق (512x512)
- ✅ صور شاشة (Screenshots)
- ✅ وصف التطبيق بالعربي والإنجليزي
- ✅ Privacy Policy URL

### 3. إنشاء تطبيق جديد

في Play Console:
1. "Create app"
2. املأ التفاصيل الأساسية
3. App access: ما إذا كان يحتاج تسجيل دخول
4. Content rating
5. Target audience

### 4. رفع APK

1. Production > Create new release
2. رفع APK/AAB
3. Release notes بالعربي
4. Review > Roll out to production

### 5. انتظر المراجعة

- عادةً تستغرق من ساعات إلى أيام
- راجع emails من Google

---

## بدائل سريعة ⚡

### الخيار 1: استخدام موقع عبر الإنترنت

**AppsGeyser** (مجاني):
1. https://appsgeyser.com
2. اختر "Website/Blog"
3. أدخل رابط التطبيق المباشر
4. سيولد لك APK

**عيوبه:**
- جودة أقل
- قد يضيف إعلانات
- ليس native حقيقي

---

### الخيار 2: Expo (إذا أردت إعادة كتابة بسيطة)

\`\`\`bash
npx create-expo-app@latest RealEstateApp
# ثم انسخ المنطق والمكونات

# بناء APK
eas build --platform android
\`\`\`

**ميزاته:**
- أسهل من Capacitor
- بناء سحابي (لا يحتاج Android Studio)
- APK جاهز بدون تعقيدات

---

## النتيجة النهائية 🎉

بعد اتباع هذه الخطوات، سيكون لديك:

✅ ملف `app-release.apk` جاهز
✅ يمكن تثبيته على أي هاتف Android
✅ جاهز للنشر في Google Play Store

**الحجم المتوقع:** 5-15 MB

---

## أسئلة شائعة ❓

**س: هل يمكن تحديث التطبيق بعد النشر؟**
ج: نعم، استخدم نفس الـ keystore وزد رقم الإصدار.

**س: هل التطبيق يعمل بدون إنترنت؟**
ج: حالياً لا، لكن يمكن إضافة Service Worker.

**س: كم سيكلف النشر؟**
ج: Google Play: $25 مرة واحدة. مجاني بعد ذلك.

**س: كم يستغرق البناء؟**
ج: أول مرة: 10-30 دقيقة. بعد ذلك: 2-5 دقائق.

---

**بالتوفيق! 🚀**

أي سؤال؟ راجع:
- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android Studio Guide](https://developer.android.com/studio/build)
