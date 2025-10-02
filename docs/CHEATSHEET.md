# JHTM v2.0 - ورقة غش سريعة 📝

## التثبيت
```bash
npm install jhtm
```

## الاستخدام الأساسي
```javascript
const JHTM = require('jhtm');
const jhtm = new JHTM('template.html', data);
const html = await jhtm.render();
```

## المتغيرات
```html
{{name}}                    <!-- بسيط -->
{{user.email}}              <!-- متداخل -->
{{{rawHTML}}}               <!-- خام (بدون escape) -->
```

## الشروط
```html
@if(isActive)
  <span>مفعّل</span>
@endif

@if(age >= 18)
  <p>بالغ</p>
@endif

@if(role === 'admin')
  <button>Admin</button>
@endif
```

## الحلقات
```html
@each(items as item)
  <li>{{item}}</li>
@endeach

@each(users as user)
  <p>{{user.name}} - {{index}}</p>
@endeach
```

## التضمين
```html
@include(header.html)
@import(footer.html)
@include(card.html, {title: 'عنوان', price: 100})
```

## الإعدادات
```javascript
{
  cacheTemplate: true,
  cacheData: false,
  templateBasePath: './templates',
  sanitize: true,
  executeScripts: false
}
```

## دوال مساعدة
```javascript
// إنشاء سريع
JHTM.create(template, data, config);

// عرض string
await JHTM.renderString('<h1>{{title}}</h1>', {title: 'Hi'});

// تحديث
await jhtm.update({name: 'New'});

// مسح cache
jhtm.clearCache();
```

## متغيرات الحلقة
- `index` - رقم العنصر (0, 1, 2...)
- `first` - true للعنصر الأول
- `last` - true للعنصر الأخير

---

**النسخة الكاملة:** [README.md](README.md)