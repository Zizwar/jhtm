# أمثلة عملية - JHTM v2.0

## مثال 1: قالب بسيط

### template.html
```html
<div class="welcome">
  <h1>مرحبا {{name}}!</h1>
  <p>عمرك {{age}} سنة</p>
</div>
```

### script.js
```javascript
const jhtm = new JHTM('template.html', {
  name: 'أحمد',
  age: 25
});

jhtm.render().then(html => {
  document.body.innerHTML = html;
});
```

---

## مثال 8: تضمين القوالب - مدونة كاملة

### هيكل الملفات
```
project/
├── templates/
│   ├── layout.html
│   ├── header.html
│   ├── footer.html
│   ├── post-card.html
│   └── sidebar.html
└── app.js
```

### layout.html (القالب الرئيسي)
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>{{pageTitle}} - {{siteName}}</title>
  <style>
    body { font-family: Arial; margin: 0; padding: 0; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .main { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
  </style>
</head>
<body>
  @include(header.html)
  
  <div class="container">
    <div class="main">
      <main>
        <h1>{{pageTitle}}</h1>
        
        <div class="posts">
          @each(posts as post)
            @include(post-card.html, {
              title: '{{post.title}}',
              excerpt: '{{post.excerpt}}',
              author: '{{post.author}}',
              date: '{{post.date}}'
            })
          @endeach
        </div>
      </main>
      
      @include(sidebar.html)
    </div>
  </div>
  
  @include(footer.html, {year: 2025})
</body>
</html>
```

### header.html
```html
<header style="background: #333; color: white; padding: 20px 0;">
  <div class="container">
    <nav style="display: flex; justify-content: space-between; align-items: center;">
      <h1 style="margin: 0;">{{siteName}}</h1>
      <ul style="display: flex; list-style: none; gap: 20px; margin: 0; padding: 0;">
        @each(navigation as item)
          <li>
            <a href="{{item.url}}" style="color: white; text-decoration: none;">
              {{item.label}}
            </a>
          </li>
        @endeach
      </ul>
    </nav>
  </div>
</header>
```

### post-card.html
```html
<article style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
  <h2 style="margin-top: 0;">{{title}}</h2>
  <p style="color: #666;">{{excerpt}}</p>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
    <span style="color: #999;">بواسطة {{author}}</span>
    <span style="color: #999;">{{date}}</span>
  </div>
  <a href="#" style="display: inline-block; margin-top: 10px; color: #007bff;">
    اقرأ المزيد ←
  </a>
</article>
```

### sidebar.html
```html
<aside>
  <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="margin-top: 0;">عن المدونة</h3>
    <p>{{siteDescription}}</p>
  </div>
  
  <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
    <h3 style="margin-top: 0;">التصنيفات</h3>
    <ul style="list-style: none; padding: 0;">
      @each(categories as category)
        <li style="margin-bottom: 8px;">
          <a href="#" style="color: #007bff; text-decoration: none;">
            {{category.name}} ({{category.count}})
          </a>
        </li>
      @endeach
    </ul>
  </div>
</aside>
```

### footer.html
```html
<footer style="background: #f5f5f5; padding: 30px 0; margin-top: 40px; text-align: center;">
  <div class="container">
    <p style="margin: 0; color: #666;">© {{year}} - {{siteName}} - جميع الحقوق محفوظة</p>
  </div>
</footer>
```

### app.js
```javascript
const JHTM = require('jhtm');

const data = {
  siteName: 'مدونة التقنية',
  siteDescription: 'مدونة متخصصة في التقنية والبرمجة',
  pageTitle: 'الرئيسية',
  navigation: [
    { label: 'الرئيسية', url: '/' },
    { label: 'المقالات', url: '/posts' },
    { label: 'من نحن', url: '/about' },
    { label: 'اتصل بنا', url: '/contact' }
  ],
  posts: [
    {
      title: 'مقدمة في JavaScript',
      excerpt: 'تعلم أساسيات لغة JavaScript من الصفر...',
      author: 'أحمد محمد',
      date: '2025-01-15'
    },
    {
      title: 'React vs Vue: أيهما أفضل؟',
      excerpt: 'مقارنة شاملة بين أشهر مكتبات الواجهات...',
      author: 'فاطمة علي',
      date: '2025-01-10'
    },
    {
      title: 'دليل Node.js للمبتدئين',
      excerpt: 'كل ما تحتاج معرفته للبدء مع Node.js...',
      author: 'محمد حسن',
      date: '2025-01-05'
    }
  ],
  categories: [
    { name: 'JavaScript', count: 12 },
    { name: 'React', count: 8 },
    { name: 'Node.js', count: 6 },
    { name: 'CSS', count: 10 }
  ]
};

const jhtm = new JHTM('templates/layout.html', data, {
  templateBasePath: './templates',
  cacheTemplate: true
});

jhtm.render().then(html => {
  console.log(html);
  // أو احفظه في ملف
  // require('fs').promises.writeFile('output.html', html);
});
```

---

## مثال 9: تضمين متداخل - نظام Components

### هيكل متقدم
```
components/
├── ui/
│   ├── button.html
│   ├── input.html
│   └── card.html
├── layout/
│   ├── header.html
│   └── footer.html
└── forms/
    └── contact-form.html
```

### button.html (مكوّن UI)
```html
<button 
  style="
    background: {{color || '#007bff'}}; 
    color: white; 
    padding: 10px 20px; 
    border: none; 
    border-radius: 5px;
    cursor: pointer;
  "
  type="{{type || 'button'}}"
>
  {{text}}
</button>
```

### contact-form.html (يستخدم button.html)
```html
<form style="max-width: 500px; margin: 0 auto;">
  <h2>{{formTitle}}</h2>
  
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px;">الاسم</label>
    <input type="text" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px;">البريد الإلكتروني</label>
    <input type="email" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px;">الرسالة</label>
    <textarea style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px;"></textarea>
  </div>
  
  <div style="display: flex; gap: 10px;">
    @include(../ui/button.html, {text: 'إرسال', color: '#28a745', type: 'submit'})
    @include(../ui/button.html, {text: 'إلغاء', color: '#dc3545', type: 'button'})
  </div>
</form>
```

### استخدام:
```javascript
const jhtm = new JHTM('components/forms/contact-form.html', {
  formTitle: 'اتصل بنا'
}, {
  templateBasePath: './components/forms'
});
```

---

## مثال 10: Dashboard مع تضمين ديناميكي

### dashboard.html
```html
<div class="dashboard">
  <h1>{{dashboardTitle}}</h1>
  
  <div class="widgets" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    @each(widgets as widget)
      @if(widget.type === 'stats')
        @include(widgets/stats-card.html, {
          title: '{{widget.title}}',
          value: '{{widget.value}}',
          icon: '{{widget.icon}}'
        })
      @endif
      
      @if(widget.type === 'chart')
        @include(widgets/chart-card.html, {
          title: '{{widget.title}}',
          data: '{{widget.data}}'
        })
      @endif
      
      @if(widget.type === 'list')
        @include(widgets/list-card.html, {
          title: '{{widget.title}}',
          items: '{{widget.items}}'
        })
      @endif
    @endeach
  </div>
</div>
```

### widgets/stats-card.html
```html
<div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; text-align: center;">
  <div style="font-size: 48px; margin-bottom: 10px;">{{icon}}</div>
  <h3 style="margin: 10px 0; color: #666;">{{title}}</h3>
  <p style="font-size: 32px; font-weight: bold; margin: 0;">{{value}}</p>
</div>
```

---

## مثال 2: قائمة مهام To-Do

### template.html
```html
<div class="todo-app">
  <h1>قائمة المهام ({{tasks.length}})</h1>
  
  @if(tasks.length === 0)
    <p class="empty">لا توجد مهام! 🎉</p>
  @endif
  
  @if(tasks.length > 0)
    <ul class="task-list">
      @each(tasks as task)
        <li class="{{task.completed ? 'completed' : ''}}">
          <span class="task-title">{{task.title}}</span>
          @if(task.completed)
            <span class="check">✓</span>
          @endif
          @if(task.priority === 'high')
            <span class="badge-danger">عاجل</span>
          @endif
        </li>
      @endeach
    </ul>
  @endif
</div>

<style>
  .completed { text-decoration: line-through; opacity: 0.6; }
  .badge-danger { background: red; color: white; padding: 2px 8px; }
</style>
```

### data.json
```json
{
  "tasks": [
    { "title": "شراء الخضروات", "completed": false, "priority": "high" },
    { "title": "قراءة كتاب", "completed": true, "priority": "low" },
    { "title": "الرد على الإيميلات", "completed": false, "priority": "medium" }
  ]
}
```

---

## مثال 3: بطاقات المنتجات

### template.html
```html
<div class="shop">
  <header>
    <h1>{{shop.name}}</h1>
    <p>{{shop.description}}</p>
  </header>
  
  <div class="products-grid">
    @each(shop.products as product)
      <div class="product-card">
        <img src="{{product.image}}" alt="{{product.name}}">
        <h3>{{product.name}}</h3>
        <p class="description">{{product.description}}</p>
        
        <div class="price-section">
          @if(product.discount > 0)
            <span class="old-price">{{product.price}} درهم</span>
            <span class="new-price">{{product.price - product.discount}} درهم</span>
            <span class="discount-badge">-{{product.discount}} درهم</span>
          @endif
          
          @if(product.discount === 0)
            <span class="price">{{product.price}} درهم</span>
          @endif
        </div>
        
        @if(product.inStock)
          <button class="btn-buy">اشتري الآن</button>
        @endif
        
        @if(!product.inStock)
          <button class="btn-disabled" disabled>غير متوفر</button>
        @endif
        
        @if(product.rating >= 4)
          <div class="rating">⭐ {{product.rating}}/5</div>
        @endif
      </div>
    @endeach
  </div>
</div>
```

### data.js
```javascript
const data = {
  shop: {
    name: 'متجر التقنية',
    description: 'أفضل المنتجات التقنية',
    products: [
      {
        name: 'لابتوب احترافي',
        description: 'مثالي للعمل والدراسة',
        price: 5000,
        discount: 500,
        inStock: true,
        rating: 4.5,
        image: '/images/laptop.jpg'
      },
      {
        name: 'سماعات لاسلكية',
        description: 'صوت نقي وجودة عالية',
        price: 300,
        discount: 0,
        inStock: false,
        rating: 4.2,
        image: '/images/headphones.jpg'
      }
    ]
  }
};

const jhtm = new JHTM('template.html', data);
```

---

## مثال 4: ملف تعريف المستخدم

### template.html
```html
<div class="profile">
  <div class="header">
    <img src="{{user.avatar}}" alt="{{user.name}}" class="avatar">
    <div class="info">
      <h1>{{user.name}}</h1>
      <p>{{user.bio}}</p>
      
      @if(user.verified)
        <span class="verified">✓ موثّق</span>
      @endif
      
      @if(user.role === 'admin')
        <span class="badge-admin">مدير</span>
      @endif
      
      @if(user.role === 'moderator')
        <span class="badge-mod">مشرف</span>
      @endif
    </div>
  </div>
  
  <div class="stats">
    <div class="stat">
      <strong>{{user.stats.posts}}</strong>
      <span>منشور</span>
    </div>
    <div class="stat">
      <strong>{{user.stats.followers}}</strong>
      <span>متابع</span>
    </div>
    <div class="stat">
      <strong>{{user.stats.following}}</strong>
      <span>يتابع</span>
    </div>
  </div>
  
  @if(user.posts.length > 0)
    <div class="posts">
      <h2>آخر المنشورات</h2>
      @each(user.posts as post)
        <article class="post">
          <h3>{{post.title}}</h3>
          <p class="date">{{post.date}}</p>
          <div class="content">{{{post.content}}}</div>
          <div class="meta">
            ❤️ {{post.likes}} | 💬 {{post.comments}}
          </div>
        </article>
      @endeach
    </div>
  @endif
  
  @if(user.posts.length === 0)
    <p class="no-posts">لم ينشر شيئاً بعد</p>
  @endif
</div>
```

---

## مثال 5: لوحة تحكم Dashboard

### template.html
```html
<div class="dashboard">
  <h1>لوحة التحكم - {{dashboard.title}}</h1>
  
  <!-- إحصائيات -->
  <div class="stats-grid">
    @each(dashboard.stats as stat)
      <div class="stat-card {{stat.trend}}">
        <h3>{{stat.label}}</h3>
        <p class="value">{{stat.value}}</p>
        @if(stat.change > 0)
          <span class="trend-up">↑ {{stat.change}}%</span>
        @endif
        @if(stat.change < 0)
          <span class="trend-down">↓ {{stat.change}}%</span>
        @endif
      </div>
    @endeach
  </div>
  
  <!-- التنبيهات -->
  @if(dashboard.alerts.length > 0)
    <div class="alerts">
      <h2>التنبيهات</h2>
      @each(dashboard.alerts as alert)
        <div class="alert alert-{{alert.type}}">
          @if(alert.type === 'error')
            ⚠️ <strong>خطأ:</strong>
          @endif
          @if(alert.type === 'warning')
            ⚡ <strong>تحذير:</strong>
          @endif
          @if(alert.type === 'info')
            ℹ️ <strong>معلومة:</strong>
          @endif
          {{alert.message}}
        </div>
      @endeach
    </div>
  @endif
  
  <!-- المستخدمون -->
  <div class="users-section">
    <h2>المستخدمون النشطون ({{dashboard.users.length}})</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>الاسم</th>
          <th>البريد</th>
          <th>الحالة</th>
        </tr>
      </thead>
      <tbody>
        @each(dashboard.users as user)
          <tr>
            <td>{{index + 1}}</td>
            <td>{{user.name}}</td>
            <td>{{user.email}}</td>
            <td>
              @if(user.online)
                <span class="status-online">متصل</span>
              @endif
              @if(!user.online)
                <span class="status-offline">غير متصل</span>
              @endif
            </td>
          </tr>
        @endeach
      </tbody>
    </table>
  </div>
</div>
```

---

## مثال 6: استخدام مع API خارجي

```javascript
// جلب البيانات من API
const jhtm = new JHTM(
  'template.html',
  'https://api.example.com/data.json',
  {
    cacheTemplate: true,
    cacheData: true,  // تخزين البيانات مؤقتاً
    cacheTTL: 300000  // 5 دقائق
  }
);

// عرض القالب
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const html = await jhtm.render();
    document.getElementById('app').innerHTML = html;
  } catch (error) {
    console.error('خطأ في التحميل:', error);
    document.getElementById('app').innerHTML = '<p>فشل تحميل البيانات</p>';
  }
});

// تحديث البيانات كل 30 ثانية
setInterval(async () => {
  jhtm.clearCache(); // مسح الـ cache القديم
  const html = await jhtm.render();
  document.getElementById('app').innerHTML = html;
}, 30000);
```

---

## مثال 7: قالب ديناميكي بالكامل

```javascript
// دالة لتوليد القالب ديناميكياً
const generateTemplate = () => {
  return `
    <div class="dynamic-content">
      <h1>{{title}}</h1>
      @each(items as item)
        <div class="item-{{item.type}}">
          <h3>{{item.name}}</h3>
          @if(item.type === 'video')
            <video src="{{item.url}}" controls></video>
          @endif
          @if(item.type === 'image')
            <img src="{{item.url}}" alt="{{item.name}}">
          @endif
          @if(item.type === 'text')
            <p>{{{item.content}}}</p>
          @endif
        </div>
      @endeach
    </div>
  `;
};

// دالة لجلب البيانات
const fetchData = async () => {
  const response = await fetch('/api/content');
  return response.json();
};

// إنشاء ورسم القالب
const jhtm = new JHTM(generateTemplate, fetchData);
const html = await jhtm.render();
```

---

## نصائح للأداء الأفضل

1. **استخدم الـ cache للقوالب الثابتة**
   ```javascript
   const config = { cacheTemplate: true, cacheTTL: 3600000 };
   ```

2. **قسّم القوالب الكبيرة**
   ```javascript
   // بدلاً من قالب واحد كبير، استخدم عدة قوالب صغيرة
   const header = new JHTM('header.html', data);
   const content = new JHTM('content.html', data);
   const footer = new JHTM('footer.html', data);
   ```

3. **تجنب الحلقات المتداخلة العميقة**
   ```html
   <!-- ❌ تجنب هذا -->
   @each(level1 as item1)
     @each(item1.level2 as item2)
       @each(item2.level3 as item3)
         ...
       @endeach
     @endeach
   @endeach
   
   <!-- ✅ افعل هذا -->
   @each(flattenedItems as item)
     ...
   @endeach
   ```

4. **استخدم `{{{html}}}` فقط عند الضرورة**
   - `{{safe}}` أفضل في معظم الحالات
   - `{{{html}}}` فقط للمحتوى الموثوق

---

## خلاصة

JHTM v2.0 أصبح أكثر قوة ومرونة! هذه الأمثلة توضح:
- ✅ سهولة الاستخدام
- ✅ قوة الميزات
- ✅ الأداء العالي
- ✅ الأمان المحسّن

جرّبها الآن! 🚀