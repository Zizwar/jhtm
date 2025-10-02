# 📦 دليل التضمين الشامل - JHTM v2.0

دليل كامل لاستخدام ميزة تضمين القوالب في JHTM

---

## 🎯 ما هو التضمين؟

التضمين يسمح لك بتقسيم قوالب HTML الكبيرة إلى أجزاء صغيرة قابلة لإعادة الاستخدام، مثل:
- Header و Footer
- Navigation menu
- مكونات UI قابلة لإعادة الاستخدام (Buttons, Cards, Forms)
- Widgets و Components

---

## 📖 الصيغة الأساسية

### 1. التضمين البسيط

```html
@include(header.html)
@import(footer.html)
```

**ملاحظة:** `@include` و `@import` يعملان بنفس الطريقة تماماً - استخدم أيهما تفضل!

### 2. التضمين مع بيانات مخصصة

```html
@include(card.html, {title: 'عنوان', price: 100})
```

---

## 🚀 البداية السريعة

### الخطوة 1: أنشئ هيكل المشروع

```
project/
├── templates/
│   ├── main.html
│   ├── header.html
│   └── footer.html
└── app.js
```

### الخطوة 2: أنشئ القوالب

**templates/header.html**
```html
<header style="background: #007bff; color: white; padding: 20px;">
  <h1>{{siteName}}</h1>
</header>
```

**templates/footer.html**
```html
<footer style="background: #333; color: white; padding: 20px; text-align: center;">
  <p>© {{year}} - {{siteName}}</p>
</footer>
```

**templates/main.html**
```html
<!DOCTYPE html>
<html>
<head>
  <title>{{pageTitle}}</title>
</head>
<body>
  @include(header.html)
  
  <main style="padding: 40px;">
    <h1>{{pageTitle}}</h1>
    <p>{{content}}</p>
  </main>
  
  @include(footer.html, {year: 2025})
</body>
</html>
```

### الخطوة 3: استخدم في الكود

```javascript
const JHTM = require('jhtm');

const jhtm = new JHTM('templates/main.html', {
  siteName: 'موقعي',
  pageTitle: 'الرئيسية',
  content: 'مرحباً بكم!'
}, {
  templateBasePath: './templates'  // مهم جداً!
});

jhtm.render().then(html => {
  console.log(html);
});
```

---

## ⚙️ الإعدادات

### templateBasePath

يحدد المسار الأساسي للقوالب المضمّنة:

```javascript
const config = {
  templateBasePath: './templates'
};

// الآن @include(header.html) سيبحث في:
// ./templates/header.html
```

**بدون templateBasePath:**
```javascript
// سيبحث في المسار النسبي من ملف main.html
@include(./templates/header.html)
```

**مع templateBasePath:**
```javascript
// أبسط وأنظف!
@include(header.html)
```

### maxIncludeDepth

الحد الأقصى لعمق التضمين (منع الحلقات اللانهائية):

```javascript
const config = {
  maxIncludeDepth: 10  // الافتراضي
};
```

إذا تجاوز التضمين هذا العمق، سيظهر خطأ:
```
Error: Maximum include depth (10) exceeded
```

---

## 🎨 أمثلة متقدمة

### مثال 1: مكونات UI قابلة لإعادة الاستخدام

#### button.html
```html
<button 
  style="
    background: {{color || '#007bff'}}; 
    color: white;
    padding: {{padding || '10px 20px'}};
    border: none;
    border-radius: 5px;
    font-size: {{size || '16px'}};
    cursor: pointer;
  "
  type="{{type || 'button'}}"
>
  {{text || 'زر'}}
</button>
```

#### الاستخدام:
```html
<!-- زر أزرق عادي -->
@include(button.html, {text: 'حفظ'})

<!-- زر أخضر كبير -->
@include(button.html, {
  text: 'إرسال',
  color: '#28a745',
  size: '18px',
  padding: '12px 24px',
  type: 'submit'
})

<!-- زر أحمر -->
@include(button.html, {text: 'حذف', color: '#dc3545'})
```

---

### مثال 2: بطاقة منتج Product Card

#### product-card.html
```html
<div class="product-card" style="
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
">
  @if(image)
    <img src="{{image}}" alt="{{name}}" style="width: 100%; border-radius: 4px;">
  @endif
  
  <h3 style="margin: 15px 0 10px;">{{name}}</h3>
  <p style="color: #666; font-size: 14px;">{{description}}</p>
  
  <div style="margin: 15px 0;">
    @if(discount > 0)
      <span style="text-decoration: line-through; color: #999;">
        {{price}} درهم
      </span>
      <span style="color: #d9534f; font-weight: bold; font-size: 20px;">
        {{price - discount}} درهم
      </span>
    @endif
    
    @if(discount === 0)
      <span style="font-weight: bold; font-size: 20px;">
        {{price}} درهم
      </span>
    @endif
  </div>
  
  @if(inStock)
    @include(button.html, {text: 'اشتري الآن', color: '#28a745'})
  @endif
  
  @if(!inStock)
    @include(button.html, {text: 'غير متوفر', color: '#6c757d'})
  @endif
</div>
```

#### الاستخدام:
```html
<div class="products" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
  @each(products as product)
    @include(product-card.html, {
      name: '{{product.name}}',
      description: '{{product.description}}',
      price: {{product.price}},
      discount: {{product.discount}},
      image: '{{product.image}}',
      inStock: {{product.inStock}}
    })
  @endeach
</div>
```

---

### مثال 3: نظام Layout كامل

#### layout.html (القالب الأساسي)
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{pageTitle}} - {{siteName}}</title>
  @include(head.html)
</head>
<body>
  @include(header.html)
  
  <main class="container" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
    {{content}}
  </main>
  
  @include(footer.html)
</body>
</html>
```

#### head.html
```html
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
  .container { max-width: 1200px; margin: 0 auto; }
</style>
```

#### header.html
```html
<header style="background: #2c3e50; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
  <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding: 20px;">
    <h1 style="font-size: 24px;">{{siteName}}</h1>
    @include(navigation.html)
  </div>
</header>
```

#### navigation.html
```html
<nav>
  <ul style="display: flex; list-style: none; gap: 25px;">
    @each(menu as item)
      <li>
        <a href="{{item.url}}" style="
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        ">
          {{item.label}}
        </a>
      </li>
    @endeach
  </ul>
</nav>
```

#### استخدام Layout:
```javascript
const jhtm = new JHTM('layout.html', {
  siteName: 'موقع الشركة',
  pageTitle: 'الرئيسية',
  content: '<h1>مرحباً بكم</h1><p>هذا المحتوى الرئيسي</p>',
  menu: [
    { label: 'الرئيسية', url: '/' },
    { label: 'من نحن', url: '/about' },
    { label: 'الخدمات', url: '/services' },
    { label: 'اتصل بنا', url: '/contact' }
  ]
}, {
  templateBasePath: './templates/layout'
});
```

---

## 🔄 التضمين المتداخل

يمكنك تضمين قوالب داخل قوالب أخرى بأي عمق تريد!

```
page.html
  └── @include(layout.html)
        ├── @include(header.html)
        │     └── @include(navigation.html)
        │           └── @include(menu-item.html)
        ├── @include(sidebar.html)
        │     ├── @include(widget-search.html)
        │     └── @include(widget-categories.html)
        └── @include(footer.html)
              └── @include(social-links.html)
```

**مثال عملي:**

**page.html**
```html
@include(layout.html)
```

**layout.html**
```html
<div class="page">
  @include(header.html)
  <div class="content">{{content}}</div>
  @include(footer.html)
</div>
```

**header.html**
```html
<header>
  @include(logo.html)
  @include(nav.html)
</header>
```

**nav.html**
```html
<nav>
  @each(menu as item)
    @include(menu-item.html, {label: '{{item.label}}', url: '{{item.url}}'})
  @endeach
</nav>
```

---

## 🛡️ الأمان والحماية

### 1. حماية من التضمين الدائري (Circular Include)

JHTM يمنع الحلقات اللانهائية تلقائياً:

```html
<!-- a.html -->
@include(b.html)

<!-- b.html -->
@include(a.html)  ❌ خطأ!
```

سيظهر خطأ:
```
Error: Circular include detected: a.html
```

### 2. حد أقصى للعمق

```javascript
const config = {
  maxIncludeDepth: 5  // لن يسمح بأكثر من 5 مستويات
};
```

### 3. معالجة الأخطاء

```javascript
try {
  const html = await jhtm.render();
} catch (error) {
  if (error.message.includes('Failed to include')) {
    console.error('القالب غير موجود:', error);
  } else if (error.message.includes('Circular include')) {
    console.error('حلقة دائرية في التضمين:', error);
  }
}
```

---

## 💡 نصائح وأفضل الممارسات

### ✅ استخدم هيكل منظم

```
templates/
├── layouts/
│   ├── main.html
│   └── admin.html
├── components/
│   ├── header.html
│   ├── footer.html
│   └── sidebar.html
├── ui/
│   ├── button.html
│   ├── input.html
│   └── card.html
└── widgets/
    ├── stats.html
    └── chart.html
```

### ✅ استخدم أسماء واضحة

```html
<!-- ❌ سيء -->
@include(c.html)
@include(part1.html)

<!-- ✅ جيد -->
@include(product-card.html)
@include(user-profile-header.html)
```

### ✅ وثّق البيانات المطلوبة

```html
<!-- 
  product-card.html
  
  البيانات المطلوبة:
  - name: string (اسم المنتج)
  - price: number (السعر)
  - image: string (مسار الصورة) - اختياري
  - inStock: boolean (متوفر أم لا)
-->
<div class="product-card">
  ...
</div>
```

### ✅ استخدم القيم الافتراضية

```html
<button style="background: {{color || '#007bff'}};">
  {{text || 'زر'}}
</button>
```

### ✅ اجعل المكونات صغيرة ومحددة

```html
<!-- ❌ مكون كبير جداً -->
page-with-everything.html (500 سطر)

<!-- ✅ مكونات صغيرة -->
header.html (50 سطر)
navigation.html (30 سطر)
footer.html (40 سطر)
```

---

## 📊 مقارنة مع الطرق التقليدية

### بدون التضمين (طريقة تقليدية)

**مشكلة:** تكرار الكود في كل صفحة

```html
<!-- page1.html -->
<header>...</header>  <!-- 100 سطر -->
<main>محتوى الصفحة 1</main>
<footer>...</footer>  <!-- 50 سطر -->

<!-- page2.html -->
<header>...</header>  <!-- نفس الـ 100 سطر! -->
<main>محتوى الصفحة 2</main>
<footer>...</footer>  <!-- نفس الـ 50 سطر! -->
```

❌ **المشاكل:**
- تكرار الكود
- صعوبة التحديث (تحديث في 10 ملفات!)
- ملفات كبيرة
- أخطاء محتملة

### مع التضمين (JHTM v2.0)

```html
<!-- page1.html -->
@include(header.html)
<main>محتوى الصفحة 1</main>
@include(footer.html)

<!-- page2.html -->
@include(header.html)
<main>محتوى الصفحة 2</main>
@include(footer.html)
```

✅ **المميزات:**
- لا تكرار
- تحديث واحد في مكان واحد
- ملفات صغيرة
- سهل الصيانة

---

## 🎓 تمارين عملية

### تمرين 1: أنشئ نظام Cards

أنشئ:
1. `card.html` - بطاقة عامة
2. `card-header.html` - رأس البطاقة
3. `card-body.html` - محتوى البطاقة
4. `card-footer.html` - تذييل البطاقة

### تمرين 2: أنشئ نظام Forms

أنشئ:
1. `form-group.html` - مجموعة حقل (label + input)
2. `form-buttons.html` - أزرار النموذج
3. `contact-form.html` - يستخدم المكونات السابقة

### تمرين 3: أنشئ Dashboard

أنشئ:
1. `dashboard-layout.html` - الهيكل الأساسي
2. `sidebar.html` - القائمة الجانبية
3. `stat-widget.html` - ويدجت إحصائيات
4. `chart-widget.html` - ويدجت رسم بياني

---

## 🆘 استكشاف الأخطاء

### خطأ: Template not found

```
Error: Failed to include template 'header.html': Failed to load: 404
```

**الحل:**
1. تأكد من وجود الملف
2. تحقق من `templateBasePath`
3. تحقق من المسار النسبي

### خطأ: Circular include

```
Error: Circular include detected: a.html
```

**الحل:**
- تحقق من التضمينات المتداخلة
- تجنب التضمين الدائري

### خطأ: Maximum depth exceeded

```
Error: Maximum include depth (10) exceeded
```

**الحل:**
- قلل عمق التضمين
- أو زد `maxIncludeDepth` في الإعدادات

---

## 🎉 الخلاصة

التضمين في JHTM v2.0 يجعل:
- ✅ الكود أنظف وأسهل للقراءة
- ✅ الصيانة أبسط
- ✅ إعادة استخدام المكونات سهلة
- ✅ تنظيم المشروع أفضل
- ✅ التطوير أسرع

**ابدأ الآن واستمتع بقوة التضمين! 🚀**