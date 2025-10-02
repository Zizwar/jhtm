# 🚀 البداية السريعة - JHTM v2.0

دليل سريع لبدء استخدام JHTM في دقائق!

---

## 📦 التثبيت (30 ثانية)

### في المتصفح (CDN)
```html
<script src="https://unpkg.com/jhtm@latest"></script>
```

### Node.js (npm)
```bash
npm install jhtm
```

---

## 🎯 مثالك الأول (دقيقة واحدة)

### 1. أنشئ ملف HTML:

**index.html**
```html
<!DOCTYPE html>
<html>
<head>
  <title>تجربة JHTM</title>
</head>
<body>
  <div id="app">جاري التحميل...</div>

  <script src="https://unpkg.com/jhtm@latest"></script>
  <script>
    // القالب
    const template = `
      <h1>مرحبا {{name}}!</h1>
      <p>عمرك {{age}} سنة</p>
    `;

    // البيانات
    const data = {
      name: 'أحمد',
      age: 25
    };

    // العرض
    const jhtm = new JHTM(() => template, data);
    jhtm.render().then(html => {
      document.getElementById('app').innerHTML = html;
    });
  </script>
</body>
</html>
```

**افتح الملف في المتصفح - انتهيت! 🎉**

---

## 📚 الأساسيات (5 دقائق)

### 1️⃣ المتغيرات

```html
<!-- بسيط -->
<h1>{{title}}</h1>

<!-- متداخل -->
<p>{{user.name}}</p>
<p>{{user.profile.bio}}</p>
```

```javascript
const data = {
  title: 'موقعي',
  user: {
    name: 'أحمد',
    profile: { bio: 'مطور' }
  }
};
```

---

### 2️⃣ الشروط

```html
<!-- شرط بسيط -->
@if(isActive)
  <span>✅ مفعّل</span>
@endif

<!-- مقارنة -->
@if(age >= 18)
  <p>بالغ</p>
@endif

<!-- مساواة -->
@if(role === 'admin')
  <button>لوحة التحكم</button>
@endif

<!-- نفي -->
@if(!isPremium)
  <button>ترقية الحساب</button>
@endif
```

```javascript
const data = {
  isActive: true,
  age: 25,
  role: 'admin',
  isPremium: false
};
```

---

### 3️⃣ الحلقات

```html
<!-- حلقة بسيطة -->
<ul>
  @each(items as item)
    <li>{{item}}</li>
  @endeach
</ul>

<!-- مع كائنات -->
<div class="products">
  @each(products as product)
    <div class="card">
      <h3>{{product.name}}</h3>
      <p>{{product.price}} درهم</p>
    </div>
  @endeach
</div>
```

```javascript
const data = {
  items: ['تفاح', 'برتقال', 'موز'],
  products: [
    { name: 'لابتوب', price: 5000 },
    { name: 'هاتف', price: 2000 }
  ]
};
```

---

### 4️⃣ تضمين القوالب

قسّم قوالبك الكبيرة إلى أجزاء صغيرة قابلة لإعادة الاستخدام!

#### الصيغة الأساسية

```html
<!-- تضمين قالب بسيط -->
@include(header.html)

<!-- تضمين مع بيانات مخصصة -->
@include(card.html, {title: 'عنوان', price: 100})
```

#### مثال عملي سريع

**هيكل الملفات:**
```
project/
├── templates/
│   ├── main.html
│   ├── header.html
│   └── footer.html
└── app.js
```

**main.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>{{pageTitle}}</title>
</head>
<body>
  @include(header.html)
  
  <main>
    <h1>{{content}}</h1>
  </main>
  
  @include(footer.html, {year: 2025})
</body>
</html>
```

**header.html:**
```html
<header style="background: #333; color: white; padding: 20px;">
  <h1>{{siteName}}</h1>
  <nav>
    @each(menu as item)
      <a href="{{item.url}}" style="color: white; margin: 0 10px;">
        {{item.name}}
      </a>
    @endeach
  </nav>
</header>
```

**footer.html:**
```html
<footer style="background: #f5f5f5; padding: 20px; text-align: center;">
  <p>© {{year}} - جميع الحقوق محفوظة</p>
</footer>
```

**app.js:**
```javascript
const jhtm = new JHTM('templates/main.html', {
  pageTitle: 'موقعي',
  siteName: 'شركة التقنية',
  content: 'مرحباً بكم في موقعنا!',
  menu: [
    { name: 'الرئيسية', url: '/' },
    { name: 'من نحن', url: '/about' },
    { name: 'اتصل بنا', url: '/contact' }
  ]
}, {
  templateBasePath: './templates'  // مهم!
});

jhtm.render().then(html => {
  document.body.innerHTML = html;
});
```

#### ميزات التضمين

✅ **تضمين متداخل** - قالب داخل قالب داخل قالب
✅ **بيانات مخصصة** - مرر بيانات مختلفة لكل قالب
✅ **حماية من الحلقات** - لن يسمح بتضمين دائري
✅ **Cache ذكي** - سرعة فائقة
✅ **مسارات نسبية** - سهل التنظيم

#### نصائح التضمين

```javascript
// ✅ استخدم templateBasePath لتنظيم أفضل
const config = {
  templateBasePath: './views/components'
};

// الآن @include(button.html) سيبحث في:
// ./views/components/button.html
```

```html
<!-- ✅ استخدم مسارات نسبية للمجلدات المتداخلة -->
@include(ui/button.html)
@include(../layout/header.html)
```

```html
<!-- ✅ مرر بيانات JSON مخصصة -->
@include(card.html, {
  title: 'عنوان',
  text: 'محتوى',
  color: 'blue'
})
```

---

## 💡 نصائح سريعة

### ✅ استخدم الـ Cache للأداء
```javascript
const jhtm = new JHTM(template, data, {
  cacheTemplate: true,
  cacheTTL: 3600000 // ساعة واحدة
});
```

### ✅ تحديث البيانات
```javascript
// عرض أولي
await jhtm.render();

// تحديث البيانات
await jhtm.update({ name: 'محمد', age: 30 });
```

### ✅ مسح الـ Cache
```javascript
jhtm.clearCache(); // عند التحديث
```

---

## 🎨 أمثلة عملية (10 دقائق)

### مثال 1: قائمة مهام To-Do

```html
<div id="app"></div>

<script src="https://unpkg.com/jhtm@latest"></script>
<script>
  const template = `
    <div class="todo-app">
      <h1>قائمة المهام ({{tasks.length}})</h1>
      
      <ul>
        @each(tasks as task)
          <li style="{{task.done ? 'text-decoration: line-through' : ''}}">
            {{task.title}}
            @if(task.done)
              <span style="color: green">✓</span>
            @endif
          </li>
        @endeach
      </ul>
    </div>
  `;

  const data = {
    tasks: [
      { title: 'شراء الخضروات', done: false },
      { title: 'قراءة كتاب', done: true },
      { title: 'الرد على الإيميلات', done: false }
    ]
  };

  const jhtm = new JHTM(() => template, data);
  jhtm.render().then(html => {
    document.getElementById('app').innerHTML = html;
  });
</script>
```

---

### مثال 2: بطاقة ملف تعريف

```html
<div id="app"></div>

<script src="https://unpkg.com/jhtm@latest"></script>
<script>
  const template = `
    <div class="profile-card" style="border: 1px solid #ddd; padding: 20px; max-width: 400px;">
      <img src="{{user.avatar}}" style="width: 100px; border-radius: 50%;">
      <h2>{{user.name}}</h2>
      <p>{{user.bio}}</p>
      
      @if(user.verified)
        <span style="color: blue">✓ موثّق</span>
      @endif
      
      <div style="display: flex; gap: 20px; margin-top: 10px;">
        <div>
          <strong>{{user.followers}}</strong>
          <div>متابع</div>
        </div>
        <div>
          <strong>{{user.posts}}</strong>
          <div>منشور</div>
        </div>
      </div>
    </div>
  `;

  const data = {
    user: {
      name: 'أحمد محمد',
      bio: 'مطور ويب ومصمم',
      avatar: 'https://i.pravatar.cc/100',
      verified: true,
      followers: 1250,
      posts: 89
    }
  };

  const jhtm = new JHTM(() => template, data);
  jhtm.render().then(html => {
    document.getElementById('app').innerHTML = html;
  });
</script>
```

---

### مثال 3: متجر منتجات

```html
<div id="app"></div>

<script src="https://unpkg.com/jhtm@latest"></script>
<script>
  const template = `
    <div style="padding: 20px;">
      <h1>{{shop.name}}</h1>
      <p>{{shop.description}}</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
        @each(shop.products as product)
          <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
            <h3>{{product.name}}</h3>
            <p>{{product.description}}</p>
            
            @if(product.discount > 0)
              <div>
                <span style="text-decoration: line-through; color: #999;">
                  {{product.price}} درهم
                </span>
                <span style="color: red; font-weight: bold;">
                  {{product.price - product.discount}} درهم
                </span>
              </div>
            @endif
            
            @if(product.discount === 0)
              <div style="font-weight: bold;">
                {{product.price}} درهم
              </div>
            @endif
            
            @if(product.inStock)
              <button style="background: green; color: white; padding: 8px 16px; border: none; cursor: pointer;">
                اشتري الآن
              </button>
            @endif
            
            @if(!product.inStock)
              <button style="background: #ccc; padding: 8px 16px; border: none;" disabled>
                غير متوفر
              </button>
            @endif
          </div>
        @endeach
      </div>
    </div>
  `;

  const data = {
    shop: {
      name: 'متجر التقنية',
      description: 'أفضل المنتجات التقنية بأسعار مناسبة',
      products: [
        {
          name: 'لابتوب احترافي',
          description: 'مثالي للعمل والدراسة',
          price: 5000,
          discount: 500,
          inStock: true
        },
        {
          name: 'سماعات لاسلكية',
          description: 'صوت نقي وجودة عالية',
          price: 300,
          discount: 0,
          inStock: false
        },
        {
          name: 'ماوس احترافي',
          description: 'للألعاب والتصميم',
          price: 150,
          discount: 30,
          inStock: true
        }
      ]
    }
  };

  const jhtm = new JHTM(() => template, data);
  jhtm.render().then(html => {
    document.getElementById('app').innerHTML = html;
  });
</script>
```

---

## 🌐 استخدام مع API

```javascript
// جلب البيانات من API
const jhtm = new JHTM(
  () => `
    <div>
      <h1>{{title}}</h1>
      @each(items as item)
        <p>{{item.name}}</p>
      @endeach
    </div>
  `,
  'https://api.example.com/data.json'
);

// العرض
jhtm.render()
  .then(html => document.getElementById('app').innerHTML = html)
  .catch(error => console.error('خطأ:', error));
```

---

## 🛡️ نصائح الأمان

### ✅ آمن (استخدمه دائماً)
```html
{{name}}  <!-- تنظيف تلقائي -->
{{user.bio}}  <!-- آمن من XSS -->
```

### ⚠️ احذر (استخدم فقط مع محتوى موثوق)
```html
{{{htmlContent}}}  <!-- بدون تنظيف! -->
```

---

## 📱 في Node.js

```javascript
const JHTM = require('jhtm');
const fs = require('fs').promises;

async function renderPage() {
  // قراءة القالب من ملف
  const template = await fs.readFile('./template.html', 'utf8');
  
  // البيانات
  const data = {
    title: 'صفحتي',
    content: 'محتوى الصفحة'
  };
  
  // العرض
  const jhtm = new JHTM(() => template, data);
  const html = await jhtm.render();
  
  // حفظ النتيجة
  await fs.writeFile('./output.html', html);
  console.log('✅ تم!');
}

renderPage();
```

---

## 🎓 الخطوات التالية

1. **اقرأ الوثائق الكاملة** - README.md
2. **جرّب الأمثلة** - EXAMPLES.md
3. **شاهد المقارنة** - COMPARISON.md
4. **ابدأ مشروعك!** 🚀

---

## 🆘 مساعدة سريعة

### مشكلة: لا يظهر شيء
```javascript
// تأكد من:
1. تحميل المكتبة: <script src="...jhtm"></script>
2. استدعاء render(): await jhtm.render()
3. وضع النتيجة في DOM: element.innerHTML = html
```

### مشكلة: البيانات لا تظهر
```javascript
// تأكد من:
1. اسم المتغير صحيح: {{name}} مع data.name
2. الخصائص المتداخلة: {{user.name}} مع data.user.name
```

### مشكلة: الحلقة لا تعمل
```javascript
// تأكد من:
1. الصيغة صحيحة: @each(items as item)...@endeach
2. items هو array: data.items = [...]
```

---

## 🎉 تهانينا!

أنت الآن جاهز لاستخدام JHTM في مشاريعك! 

**موارد إضافية:**
- 📖 [الوثائق الكاملة](README.md)
- 💡 [أمثلة متقدمة](EXAMPLES.md)
- 🔄 [دليل الترحيل](COMPARISON.md)
- 🐛 [الإبلاغ عن مشكلة](https://github.com/zizwar/jhtm/issues)

**استمتع بالبرمجة! 🚀**