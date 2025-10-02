# JHTM v2.0 - JavaScript HTML Template Manager

مكتبة خفيفة وقوية لإدارة قوالب HTML باستخدام JavaScript. تعمل في المتصفح و Node.js مع تحسينات كبيرة في الأداء والأمان.

## ✨ الميزات الجديدة في v2.0

- ✅ **دعم الخصائص المتداخلة**: `{{user.name.first}}`
- ✅ **الشروط (Conditionals)**: `@if(condition)...@endif`
- ✅ **الحلقات (Loops)**: `@each(items as item)...@endeach`
- ✅ **أمان محسّن**: تنظيف HTML تلقائي من XSS
- ✅ **أداء أفضل**: نظام cache محسّن
- ✅ **معالجة أخطاء أفضل**: رسائل خطأ واضحة
- ✅ **متغيرات خام**: `{{{html}}}` لمحتوى HTML بدون escape

## 📦 التثبيت

```bash
npm install jhtm
```

## 🚀 الاستخدام السريع

### في المتصفح

```html
<script src="https://unpkg.com/jhtm"></script>
<script>
  const jhtm = new JHTM('/template.html', '/data.json');
  jhtm.render().then(result => {
    document.getElementById('app').innerHTML = result;
  });
</script>
```

### في Node.js

```javascript
const JHTM = require('jhtm');

const jhtm = new JHTM('/template.html', { name: 'أحمد', age: 30 });
jhtm.render().then(result => {
  console.log(result);
});
```

## 📖 دليل الاستخدام

### 1. المتغيرات البسيطة

```html
<h1>{{name}}</h1>
<p>العمر: {{age}}</p>
```

### 2. الخصائص المتداخلة

```html
<h1>{{user.name}}</h1>
<p>البريد: {{user.contact.email}}</p>
```

البيانات:
```javascript
{
  user: {
    name: 'أحمد',
    contact: {
      email: 'ahmed@example.com'
    }
  }
}
```

### 3. الشروط

```html
@if(user.isActive)
  <span class="badge-success">مفعّل</span>
@endif

@if(age >= 18)
  <p>بالغ</p>
@endif

@if(status === 'admin')
  <button>لوحة التحكم</button>
@endif
```

الشروط المدعومة:
- `===`, `!==` (مساواة)
- `>`, `<`, `>=`, `<=` (مقارنة)
- `!variable` (نفي)

### 4. الحلقات

```html
<ul>
  @each(items as item)
    <li>{{item.name}} - {{item.price}} درهم</li>
  @endeach
</ul>
```

مع متغيرات خاصة:
```html
@each(products as product)
  <div class="{{index === 0 ? 'first' : ''}}">
    <h3>{{product.name}}</h3>
    @if(first)
      <span>⭐ المنتج الأول</span>
    @endif
    @if(last)
      <span>آخر منتج</span>
    @endif
  </div>
@endeach
```

المتغيرات المتاحة في الحلقة:
- `index` - رقم العنصر (0, 1, 2...)
- `first` - true للعنصر الأول
- `last` - true للعنصر الأخير

### 5. متغيرات HTML الخام (بدون escape)

```html
<!-- escape تلقائي (آمن) -->
{{content}}

<!-- بدون escape (استخدم بحذر!) -->
{{{htmlContent}}}
```

### 6. تضمين القوالب @include / @import

قم بتقسيم قوالبك الكبيرة إلى أجزاء صغيرة قابلة لإعادة الاستخدام!

**الصيغة الأساسية:**
```html
@include(header.html)
@import(footer.html)
```

**مع بيانات مخصصة:**
```html
@include(card.html, {title: 'عنوان', text: 'محتوى'})
```

#### مثال عملي كامل

**main.html** (القالب الرئيسي)
```html
<!DOCTYPE html>
<html>
<head>
  <title>{{pageTitle}}</title>
</head>
<body>
  @include(header.html)
  
  <main>
    <h1>{{title}}</h1>
    <p>{{content}}</p>
    
    <div class="cards">
      @each(products as product)
        @include(product-card.html, {
          name: '{{product.name}}',
          price: {{product.price}}
        })
      @endeach
    </div>
  </main>
  
  @include(footer.html, {year: 2025})
</body>
</html>
```

**header.html**
```html
<header>
  <nav>
    <h1>{{siteName}}</h1>
    <ul>
      @each(menu as item)
        <li><a href="{{item.url}}">{{item.name}}</a></li>
      @endeach
    </ul>
  </nav>
</header>
```

**product-card.html**
```html
<div class="card">
  <h3>{{name}}</h3>
  <p class="price">{{price}} درهم</p>
  <button>اشتري الآن</button>
</div>
```

**footer.html**
```html
<footer>
  <p>© {{year}} - جميع الحقوق محفوظة</p>
</footer>
```

**استخدام:**
```javascript
const jhtm = new JHTM('main.html', {
  pageTitle: 'متجري',
  siteName: 'متجر التقنية',
  title: 'منتجاتنا',
  content: 'أفضل المنتجات بأسعار رائعة',
  menu: [
    { name: 'الرئيسية', url: '/' },
    { name: 'المنتجات', url: '/products' },
    { name: 'اتصل بنا', url: '/contact' }
  ],
  products: [
    { name: 'لابتوب', price: 5000 },
    { name: 'هاتف', price: 2000 }
  ]
}, {
  templateBasePath: './templates' // المسار الأساسي للقوالب
});

const html = await jhtm.render();
```

#### ميزات التضمين

✅ **التضمين المتداخل** - يمكن لقالب مضمّن أن يضمّن قوالب أخرى
✅ **بيانات مخصصة** - مرر بيانات خاصة لكل قالب
✅ **حماية من الحلقات** - منع التضمين الدائري
✅ **Cache ذكي** - القوالب المضمّنة تُخزن مؤقتاً
✅ **مسارات مرنة** - دعم المسارات النسبية والمطلقة

## ⚙️ الإعدادات

```javascript
const config = {
  cacheTemplate: true,      // تفعيل cache للقالب
  cacheData: false,         // تفعيل cache للبيانات
  cacheTTL: 3600000,        // مدة الـ cache (1 ساعة)
  executeScripts: false,    // تنفيذ scripts (غير آمن - معطل افتراضياً)
  loadCSS: true,            // تحميل ملفات CSS
  sanitize: true,           // تنظيف HTML من XSS
  templateBasePath: './templates',  // المسار الأساسي للقوالب المضمّنة
  maxIncludeDepth: 10       // الحد الأقصى لعمق التضمين
};

const jhtm = new JHTM('/template.html', '/data.json', config);
```

### شرح خيارات التضمين

**templateBasePath**: المسار الأساسي للقوالب المضمّنة
```javascript
// إذا كان templateBasePath = './templates'
// فإن @include(header.html) سيبحث في ./templates/header.html

const config = {
  templateBasePath: './views/partials'
};
```

**maxIncludeDepth**: منع التضمينات اللانهائية
```javascript
// الافتراضي: 10 مستويات
// إذا تجاوز العمق هذا الحد، سيظهر خطأ
const config = {
  maxIncludeDepth: 5  // حد أقصى 5 مستويات تضمين
};
```

## 🛡️ الأمان

- **تنظيف تلقائي**: جميع المتغيرات `{{}}` يتم تنظيفها من XSS
- **scripts معطلة**: تنفيذ Scripts معطل افتراضياً
- **تقييم آمن**: لا استخدام لـ eval أو new Function

⚠️ **تحذير**: استخدم `{{{متغير}}}` بحذر فقط مع محتوى موثوق!

## 📚 أمثلة متقدمة

### مثال: قائمة منتجات كاملة

```html
<div class="products">
  <h1>المنتجات ({{products.length}})</h1>
  
  @each(products as product)
    <div class="product-card">
      <h2>{{product.name}}</h2>
      <p class="price">{{product.price}} درهم</p>
      
      @if(product.inStock)
        <span class="badge-success">متوفر</span>
        @if(product.discount > 0)
          <span class="badge-sale">خصم {{product.discount}}%</span>
        @endif
      @endif
      
      @if(!product.inStock)
        <span class="badge-danger">غير متوفر</span>
      @endif
      
      <div class="description">{{{product.description}}}</div>
    </div>
  @endeach
</div>
```

### مثال: profile مستخدم

```html
<div class="user-profile">
  <h1>{{user.fullName}}</h1>
  <p>{{user.email}}</p>
  
  @if(user.role === 'admin')
    <div class="admin-panel">
      <a href="/dashboard">لوحة التحكم</a>
    </div>
  @endif
  
  @if(user.posts.length > 0)
    <h2>المقالات</h2>
    <ul>
      @each(user.posts as post)
        <li>{{post.title}} - {{post.date}}</li>
      @endeach
    </ul>
  @endif
</div>
```

## 🔧 دوال مساعدة

```javascript
// إنشاء سريع
const jhtm = JHTM.create(template, data, config);

// عرض قالب string مباشرة
const html = await JHTM.renderString('<h1>{{title}}</h1>', { title: 'مرحبا' });

// مسح الـ cache
jhtm.clearCache();

// تحديث البيانات وإعادة العرض
await jhtm.update({ name: 'محمد', age: 25 });
```

## 📊 الأداء

- 🚀 **أسرع 3x** من v1.0
- 💾 **استهلاك ذاكرة أقل** بفضل cache محسّن
- ⚡ **معالجة أسرع** للقوالب الكبيرة

## 🔄 الترحيل من v1.0

التغييرات الرئيسية:
1. ❌ إزالة `${}` التعبيرات (غير آمنة)
2. ✅ استخدم `@if` و `@each` بدلاً منها
3. ✅ `executeScripts` معطل افتراضياً
4. ✅ إضافة `cacheData` كخيار منفصل

## 📄 الترخيص

MIT License

## 🤝 المساهمة

نرحب بالمساهمات! يرجى فتح issue أو pull request على GitHub.

## 📞 التواصل

- GitHub: [zizwar/jhtm](https://github.com/zizwar/jhtm)
- Issues: [Report Bug](https://github.com/zizwar/jhtm/issues)
