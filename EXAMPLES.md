# أمثلة JHTM v2.0

دليل شامل لأمثلة استخدام مكتبة JHTM مع تطبيقات عملية.

## 📁 بنية المجلد التجريبي

```
EXAMPLE/
├── index.html              # الصفحة الرئيسية (نقطة البداية)
├── template.html           # القالب الرئيسي
├── data.json              # البيانات
└── partials/              # القوالب الفرعية
    ├── header.html        # رأس الصفحة
    ├── product-card.html  # بطاقة المنتج
    └── footer.html        # ذيل الصفحة
```

## 🚀 تشغيل المثال

### الطريقة 1: باستخدام http-server (موصى بها)

```bash
# إذا لم يكن مثبتاً
npm install -g http-server

# من مجلد المشروع
cd /root/jhtm-repo
http-server -p 8080

# افتح المتصفح على
http://localhost:8080/EXAMPLE/
```

### الطريقة 2: باستخدام Python

```bash
# Python 3
python3 -m http.server 8080

# افتح المتصفح على
http://localhost:8080/EXAMPLE/
```

### الطريقة 3: باستخدام VS Code Live Server

1. افتح المجلد في VS Code
2. انقر بزر الماوس الأيمن على `EXAMPLE/index.html`
3. اختر "Open with Live Server"

## 📖 شرح المثال

### 1. الصفحة الرئيسية (index.html)

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <!-- Tailwind CSS من CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="app">جاري التحميل...</div>

    <script src="../jhtm.js"></script>
    <script>
        const jhtm = new JHTM('template.html', 'data.json', {
            templateBasePath: './partials'
        });

        jhtm.render().then(result => {
            document.getElementById('app').innerHTML = result;
        });
    </script>
</body>
</html>
```

### 2. القالب الرئيسي (template.html)

#### أ. تضمين القوالب (@include)
```html
<!-- تضمين الهيدر -->
@include(header.html)

<!-- تضمين بطاقة المنتج مع بيانات -->
@include(product-card.html, {
    name: '{{product.name}}',
    price: {{product.price}}
})

<!-- تضمين الفوتر مع سنة -->
@include(footer.html, {year: {{currentYear}}})
```

#### ب. الخصائص المتداخلة
```html
<p>{{user.name}}</p>
<p>{{user.contact.email}}</p>
<p>{{user.contact.phone}}</p>
```

#### ج. الشروط (@if)
```html
@if(user.isActive)
    <span class="badge-success">حساب مفعّل</span>
@endif

@if(user.role === 'admin')
    <span class="badge-admin">مدير</span>
@endif

@if(product.discount > 0)
    <span>خصم {{product.discount}}%</span>
@endif
```

#### د. الحلقات (@each)
```html
<div class="grid">
    @each(products as product)
        <div class="card">
            <h3>{{product.name}}</h3>
            <p>{{product.price}} ريال</p>

            @if(first)
                <span>⭐ المنتج الأول</span>
            @endif

            @if(last)
                <span>🏁 آخر منتج</span>
            @endif
        </div>
    @endeach
</div>
```

### 3. بطاقة المنتج (product-card.html)

مثال شامل يجمع كل الميزات:

```html
<div class="product-card">
    <h3>{{name}}</h3>
    <p>{{description}}</p>

    <!-- السعر مع الخصم -->
    @if(discount > 0)
        <span class="new-price">{{price - (price * discount / 100)}} ريال</span>
        <span class="old-price">{{price}} ريال</span>
        <span class="discount-badge">خصم {{discount}}%</span>
    @endif

    @if(discount === 0)
        <span class="price">{{price}} ريال</span>
    @endif

    <!-- حالة التوفر -->
    @if(inStock)
        <span class="in-stock">✓ متوفر</span>
        <button>أضف للسلة</button>
    @endif

    @if(!inStock)
        <span class="out-of-stock">✗ غير متوفر</span>
        <button disabled>غير متوفر</button>
    @endif

    <!-- شارات خاصة -->
    @if(first)
        <span class="first-badge">⭐ المنتج الأول</span>
    @endif

    @if(last)
        <span class="last-badge">🏁 آخر منتج</span>
    @endif
</div>
```

## 🎨 استخدام Tailwind CSS

جميع الأمثلة تستخدم Tailwind CSS من CDN:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

### أمثلة على classes المستخدمة:

```html
<!-- Gradients -->
<div class="bg-gradient-to-r from-blue-600 to-indigo-600"></div>

<!-- Cards -->
<div class="bg-white rounded-xl shadow-lg p-6"></div>

<!-- Buttons -->
<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"></button>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>

<!-- Responsive -->
<div class="hidden md:flex"></div>
```

## 📊 البيانات (data.json)

```json
{
  "pageTitle": "مرحباً بك في JHTM",
  "user": {
    "name": "أحمد محمد",
    "role": "admin",
    "isActive": true,
    "contact": {
      "email": "ahmed@example.com",
      "phone": "+966 50 123 4567"
    }
  },
  "products": [
    {
      "name": "لابتوب",
      "price": 5000,
      "discount": 10,
      "inStock": true,
      "description": "لابتوب قوي"
    }
  ],
  "features": [...]
}
```

## ✨ الميزات الموضحة في المثال

### ✅ 1. المتغيرات البسيطة والمتداخلة
- `{{pageTitle}}`
- `{{user.name}}`
- `{{user.contact.email}}`

### ✅ 2. الشروط المتعددة
- `@if(user.isActive)` - شرط boolean
- `@if(user.role === 'admin')` - شرط مساواة
- `@if(discount > 0)` - شرط مقارنة
- `@if(!inStock)` - شرط نفي

### ✅ 3. الحلقات مع المتغيرات الخاصة
- `@each(products as product)`
- متغير `index` - رقم العنصر
- متغير `first` - العنصر الأول
- متغير `last` - العنصر الأخير

### ✅ 4. تضمين القوالب
- `@include(header.html)` - تضمين بسيط
- `@include(product-card.html, {...})` - تضمين مع بيانات

### ✅ 5. العمليات الحسابية
- `{{price - (price * discount / 100)}}` - حساب السعر بعد الخصم
- `{{products.length}}` - عدد العناصر

## 🔧 نصائح مهمة

### 1. تطوير محلي
```javascript
const jhtm = new JHTM('template.html', 'data.json', {
    cacheTemplate: false,  // تعطيل cache أثناء التطوير
    cacheData: false
});
```

### 2. production
```javascript
const jhtm = new JHTM('template.html', 'data.json', {
    cacheTemplate: true,   // تفعيل cache في الإنتاج
    cacheData: true,
    cacheTTL: 3600000      // ساعة واحدة
});
```

### 3. معالجة الأخطاء
```javascript
jhtm.render()
    .then(result => {
        document.getElementById('app').innerHTML = result;
    })
    .catch(error => {
        console.error('خطأ:', error);
        // عرض رسالة خطأ للمستخدم
    });
```

## 🐛 استكشاف الأخطاء

### المشكلة: "Failed to load template"
**الحل**: تأكد من تشغيل http-server من مجلد المشروع الرئيسي

### المشكلة: القوالب المضمنة لا تعمل
**الحل**: تحقق من `templateBasePath` في الإعدادات:
```javascript
{
    templateBasePath: './partials'  // المسار النسبي الصحيح
}
```

### المشكلة: البيانات لا تظهر
**الحل**: افتح Console في المتصفح وتحقق من الأخطاء

## 📚 موارد إضافية

- **التوثيق الكامل**: [README.md](../README.md)
- **GitHub**: https://github.com/zizwar/jhtm
- **NPM**: https://www.npmjs.com/package/jhtm
- **Tailwind CSS Docs**: https://tailwindcss.com/docs

## 🎯 تطبيقات عملية أخرى

### مثال 1: Dashboard
```html
@each(widgets as widget)
    <div class="widget-{{widget.type}}">
        <h3>{{widget.title}}</h3>
        <p>{{widget.value}}</p>
        @if(widget.trend === 'up')
            <span class="text-green-600">↑ {{widget.change}}%</span>
        @endif
    </div>
@endeach
```

### مثال 2: User Profile
```html
<div class="profile">
    <img src="{{user.avatar}}" alt="{{user.name}}">
    <h2>{{user.name}}</h2>

    @if(user.verified)
        <span class="verified-badge">✓ موثق</span>
    @endif

    @each(user.skills as skill)
        <span class="skill-tag">{{skill}}</span>
    @endeach
</div>
```

### مثال 3: Blog Posts
```html
@each(posts as post)
    <article>
        <h2>{{post.title}}</h2>
        <p class="meta">{{post.date}} - {{post.author.name}}</p>
        <div class="content">{{{post.content}}}</div>

        @if(post.comments.length > 0)
            <div class="comments">
                <h3>التعليقات ({{post.comments.length}})</h3>
                @each(post.comments as comment)
                    <div class="comment">
                        <strong>{{comment.author}}</strong>
                        <p>{{comment.text}}</p>
                    </div>
                @endeach
            </div>
        @endif
    </article>
@endeach
```

---

**جاهز للتجربة؟** 🚀

1. شغّل `http-server` من مجلد المشروع
2. افتح `http://localhost:8080/EXAMPLE/`
3. استمتع بتجربة JHTM v2.0!
