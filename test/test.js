// test.js - اختبارات بسيطة لـ JHTM v2.0

const JHTM = require('../jhtm.js');

// ألوان للطباعة
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

// عداد النتائج
let passed = 0;
let failed = 0;

// دالة مساعدة للاختبار
async function test(name, fn) {
  try {
    await fn();
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    passed++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    console.log(`  ${colors.red}${error.message}${colors.reset}`);
    failed++;
  }
}

// دالة للتحقق
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// بداية الاختبارات
console.log('\n🧪 اختبارات JHTM v2.0\n');

(async () => {
  // اختبار 1: متغيرات بسيطة
  await test('متغيرات بسيطة', async () => {
    const jhtm = new JHTM(
      () => '<h1>{{name}}</h1><p>{{age}}</p>',
      { name: 'أحمد', age: 25 }
    );
    const result = await jhtm.render();
    assert(result.includes('أحمد'), 'يجب أن يحتوي على الاسم');
    assert(result.includes('25'), 'يجب أن يحتوي على العمر');
  });

  // اختبار 2: خصائص متداخلة
  await test('خصائص متداخلة', async () => {
    const jhtm = new JHTM(
      () => '<p>{{user.name}}</p><p>{{user.email}}</p>',
      { user: { name: 'محمد', email: 'mohamed@test.com' } }
    );
    const result = await jhtm.render();
    assert(result.includes('محمد'), 'يجب أن يحتوي على الاسم');
    assert(result.includes('mohamed@test.com'), 'يجب أن يحتوي على البريد');
  });

  // اختبار 3: الشروط - true
  await test('شرط true', async () => {
    const jhtm = new JHTM(
      () => '@if(isActive)<span>مفعّل</span>@endif',
      { isActive: true }
    );
    const result = await jhtm.render();
    assert(result.includes('مفعّل'), 'يجب أن يظهر النص');
  });

  // اختبار 4: الشروط - false
  await test('شرط false', async () => {
    const jhtm = new JHTM(
      () => '@if(isActive)<span>مفعّل</span>@endif',
      { isActive: false }
    );
    const result = await jhtm.render();
    assert(!result.includes('مفعّل'), 'يجب ألا يظهر النص');
  });

  // اختبار 5: شرط المقارنة
  await test('شرط المقارنة (===)', async () => {
    const jhtm = new JHTM(
      () => '@if(age >= 18)<span>بالغ</span>@endif',
      { age: 25 }
    );
    const result = await jhtm.render();
    assert(result.includes('بالغ'), 'يجب أن يظهر "بالغ"');
  });

  // اختبار 6: الحلقات
  await test('حلقة بسيطة', async () => {
    const jhtm = new JHTM(
      () => '<ul>@each(items as item)<li>{{item}}</li>@endeach</ul>',
      { items: ['أحمد', 'محمد', 'فاطمة'] }
    );
    const result = await jhtm.render();
    assert(result.includes('أحمد'), 'يجب أن يحتوي على أحمد');
    assert(result.includes('محمد'), 'يجب أن يحتوي على محمد');
    assert(result.includes('فاطمة'), 'يجب أن يحتوي على فاطمة');
  });

  // اختبار 7: حلقة مع كائنات
  await test('حلقة مع كائنات', async () => {
    const jhtm = new JHTM(
      () => '@each(users as user)<p>{{user.name}}</p>@endeach',
      { users: [{ name: 'أحمد' }, { name: 'محمد' }] }
    );
    const result = await jhtm.render();
    assert(result.includes('أحمد'), 'يجب أن يحتوي على أحمد');
    assert(result.includes('محمد'), 'يجب أن يحتوي على محمد');
  });

  // اختبار 8: متغيرات خام
  await test('متغيرات HTML خام', async () => {
    const jhtm = new JHTM(
      () => '{{{html}}}',
      { html: '<strong>نص عريض</strong>' },
      { sanitize: false }
    );
    const result = await jhtm.render();
    assert(result.includes('<strong>'), 'يجب أن يحتوي على HTML خام');
  });

  // اختبار 9: تنظيف XSS
  await test('تنظيف XSS', async () => {
    const jhtm = new JHTM(
      () => '<div>{{content}}</div>',
      { content: '<script>alert("xss")</script>' }
    );
    const result = await jhtm.render();
    assert(!result.includes('<script>'), 'يجب ألا يحتوي على script');
    assert(result.includes('&lt;script&gt;'), 'يجب أن يكون منظّف');
  });

  // اختبار 10: Cache
  await test('نظام Cache', async () => {
    let callCount = 0;
    const jhtm = new JHTM(
      () => {
        callCount++;
        return '<h1>{{name}}</h1>';
      },
      { name: 'أحمد' },
      { cacheTemplate: true }
    );
    
    await jhtm.render();
    await jhtm.render();
    
    assert(callCount === 1, 'يجب استدعاء القالب مرة واحدة فقط');
  });

  // اختبار 11: clearCache
  await test('مسح Cache', async () => {
    let callCount = 0;
    const jhtm = new JHTM(
      () => {
        callCount++;
        return '<h1>{{name}}</h1>';
      },
      { name: 'أحمد' },
      { cacheTemplate: true }
    );
    
    await jhtm.render();
    jhtm.clearCache();
    await jhtm.render();
    
    assert(callCount === 2, 'يجب استدعاء القالب مرتين بعد مسح الـ cache');
  });

  // اختبار 12: update()
  await test('تحديث البيانات', async () => {
    const jhtm = new JHTM(
      () => '<h1>{{name}}</h1>',
      { name: 'أحمد' }
    );
    
    const result1 = await jhtm.render();
    assert(result1.includes('أحمد'), 'يجب أن يحتوي على أحمد');
    
    const result2 = await jhtm.update({ name: 'محمد' });
    assert(result2.includes('محمد'), 'يجب أن يحتوي على محمد');
    assert(!result2.includes('أحمد'), 'يجب ألا يحتوي على أحمد');
  });

  // اختبار 13: دوال مساعدة - renderString
  await test('JHTM.renderString()', async () => {
    const result = await JHTM.renderString(
      '<h1>{{title}}</h1>',
      { title: 'مرحبا' }
    );
    assert(result.includes('مرحبا'), 'يجب أن يحتوي على النص');
  });

  // اختبار 14: دوال مساعدة - create
  await test('JHTM.create()', async () => {
    const jhtm = JHTM.create(
      () => '<p>{{text}}</p>',
      { text: 'نص تجريبي' }
    );
    const result = await jhtm.render();
    assert(result.includes('نص تجريبي'), 'يجب أن يحتوي على النص');
  });

  // اختبار 15: معالجة الأخطاء
  await test('معالجة خطأ في القالب', async () => {
    const jhtm = new JHTM(
      () => { throw new Error('خطأ في القالب'); },
      {}
    );
    
    try {
      await jhtm.render();
      throw new Error('يجب أن يفشل');
    } catch (error) {
      assert(
        error.message.includes('Template loading error'),
        'يجب أن يحتوي على رسالة خطأ واضحة'
      );
    }
  });

  // اختبار 16: حلقة فارغة
  await test('حلقة مع array فارغ', async () => {
    const jhtm = new JHTM(
      () => '<div>@each(items as item)<p>{{item}}</p>@endeach</div>',
      { items: [] }
    );
    const result = await jhtm.render();
    assert(!result.includes('<p>'), 'يجب ألا يحتوي على عناصر');
  });

  // اختبار 17: متغيرات الحلقة الخاصة
  await test('متغيرات الحلقة (index, first, last)', async () => {
    const jhtm = new JHTM(
      () => '@each(items as item){{index}}@if(first)F@endif@if(last)L@endif@endeach',
      { items: ['a', 'b', 'c'] }
    );
    const result = await jhtm.render();
    assert(result.includes('0F'), 'يجب أن يحتوي على first');
    assert(result.includes('2L'), 'يجب أن يحتوي على last');
  });

  // اختبار 18: شروط متداخلة
  await test('شروط متداخلة', async () => {
    const template = `
      @if(user.active)
        @if(user.role === 'admin')
          <span>مدير مفعّل</span>
        @endif
      @endif
    `;
    const jhtm = new JHTM(
      () => template,
      { user: { active: true, role: 'admin' } }
    );
    const result = await jhtm.render();
    assert(result.includes('مدير مفعّل'), 'يجب أن يظهر النص');
  });

  // اختبار 19: خصائص متداخلة عميقة
  await test('خصائص متداخلة عميقة', async () => {
    const jhtm = new JHTM(
      () => '<p>{{a.b.c.d}}</p>',
      { a: { b: { c: { d: 'عميق' } } } }
    );
    const result = await jhtm.render();
    assert(result.includes('عميق'), 'يجب أن يصل للخاصية العميقة');
  });

  // اختبار 20: قيم undefined و null
  await test('قيم undefined و null', async () => {
    const jhtm = new JHTM(
      () => '<p>{{missing}}</p><p>{{nothing}}</p>',
      { missing: undefined, nothing: null }
    );
    const result = await jhtm.render();
    assert(!result.includes('undefined'), 'يجب ألا يظهر undefined');
    assert(!result.includes('null'), 'يجب ألا يظهر null');
  });

  // اختبار 21: تضمين قالب بسيط (mock)
  await test('تضمين قالب بسيط @include', async () => {
    // نحتاج لـ mock loadExternalTemplate
    const jhtm = new JHTM(
      () => '<div>@include(header.html)</div>',
      { title: 'اختبار' }
    );
    
    // نعيد تعريف loadExternalTemplate للاختبار
    jhtm.loadExternalTemplate = async (path) => {
      if (path === 'header.html') {
        return '<h1>{{title}}</h1>';
      }
      throw new Error('Template not found');
    };
    
    const result = await jhtm.render();
    assert(result.includes('<h1>اختبار</h1>'), 'يجب أن يحتوي على القالب المضمّن');
  });

  // اختبار 22: تضمين مع بيانات مخصصة
  await test('تضمين مع بيانات مخصصة', async () => {
    const jhtm = new JHTM(
      () => '@include(card.html, {"title": "عنوان مخصص"})',
      {}
    );
    
    jhtm.loadExternalTemplate = async (path) => {
      if (path === 'card.html') {
        return '<div>{{title}}</div>';
      }
      throw new Error('Template not found');
    };
    
    const result = await jhtm.render();
    assert(result.includes('عنوان مخصص'), 'يجب أن يستخدم البيانات المخصصة');
  });

  // اختبار 23: تضمين متداخل
  await test('تضمين متداخل', async () => {
    const jhtm = new JHTM(
      () => '@include(layout.html)',
      { name: 'أحمد' }
    );
    
    jhtm.loadExternalTemplate = async (path) => {
      if (path === 'layout.html') {
        return '<div>@include(inner.html)</div>';
      }
      if (path === 'inner.html') {
        return '<p>{{name}}</p>';
      }
      throw new Error('Template not found');
    };
    
    const result = await jhtm.render();
    assert(result.includes('<p>أحمد</p>'), 'يجب أن يعالج التضمين المتداخل');
  });

  // اختبار 24: @import (اسم بديل لـ @include)
  await test('استخدام @import بدلاً من @include', async () => {
    const jhtm = new JHTM(
      () => '@import(header.html)',
      { text: 'محتوى' }
    );
    
    jhtm.loadExternalTemplate = async (path) => {
      if (path === 'header.html') {
        return '<h1>{{text}}</h1>';
      }
      throw new Error('Template not found');
    };
    
    const result = await jhtm.render();
    assert(result.includes('<h1>محتوى</h1>'), '@import يجب أن يعمل مثل @include');
  });

  // اختبار 25: حماية من التضمين الدائري
  await test('حماية من التضمين الدائري', async () => {
    const jhtm = new JHTM(
      () => '@include(a.html)',
      {}
    );
    
    jhtm.loadExternalTemplate = async (path) => {
      if (path === 'a.html') {
        return '@include(b.html)';
      }
      if (path === 'b.html') {
        return '@include(a.html)'; // حلقة دائرية!
      }
      throw new Error('Template not found');
    };
    
    try {
      await jhtm.render();
      throw new Error('يجب أن يفشل بسبب التضمين الدائري');
    } catch (error) {
      assert(
        error.message.includes('Circular include'),
        'يجب أن يكتشف التضمين الدائري'
      );
    }
  });

  // طباعة النتائج
  console.log('\n' + '='.repeat(50));
  console.log(
    `${colors.green}✓ نجح: ${passed}${colors.reset} | ` +
    `${colors.red}✗ فشل: ${failed}${colors.reset} | ` +
    `المجموع: ${passed + failed}`
  );
  
  if (failed === 0) {
    console.log(`\n${colors.green}🎉 جميع الاختبارات نجحت!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}❌ بعض الاختبارات فشلت${colors.reset}\n`);
    process.exit(1);
  }
})();