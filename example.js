// مثال تجريبي لـ JHTM في Node.js

const JHTM = require('./jhtm.js');

// ============================================
// مثال 1: قالب بسيط مع متغيرات
// ============================================
async function example1() {
  console.log('\n📝 مثال 1: قالب بسيط مع متغيرات');
  console.log('=====================================');

  const template = `
    <div>
      <h1>مرحبا {{name}}!</h1>
      <p>عمرك {{age}} سنة</p>
      <p>البريد الإلكتروني: {{email}}</p>
    </div>
  `;

  const data = {
    name: 'أحمد',
    age: 25,
    email: 'ahmed@example.com'
  };

  const jhtm = new JHTM(() => template, data);
  const html = await jhtm.render();
  console.log(html);
}

// ============================================
// مثال 2: استخدام الشروط @if
// ============================================
async function example2() {
  console.log('\n🔀 مثال 2: استخدام الشروط');
  console.log('=====================================');

  const template = `
    <div>
      <h2>{{username}}</h2>

      @if(isActive)
        <span>✅ الحساب مفعّل</span>
      @endif

      @if(age >= 18)
        <p>🎉 بالغ</p>
      @else
        <p>👶 قاصر</p>
      @endif

      @if(role === 'admin')
        <button>لوحة التحكم</button>
      @endif
    </div>
  `;

  const data = {
    username: 'محمد',
    isActive: true,
    age: 20,
    role: 'admin'
  };

  const jhtm = new JHTM(() => template, data);
  const html = await jhtm.render();
  console.log(html);
}

// ============================================
// مثال 3: استخدام الحلقات @each
// ============================================
async function example3() {
  console.log('\n🔁 مثال 3: استخدام الحلقات');
  console.log('=====================================');

  const template = `
    <div>
      <h2>قائمة المستخدمين</h2>
      <ul>
        @each(users as user)
          <li>
            <strong>{{user.name}}</strong> -
            {{user.role}} -
            {{user.age}} سنة
          </li>
        @endeach
      </ul>

      <h3>المنتجات</h3>
      @each(products as product)
        <div class="product">
          <h4>{{product.name}}</h4>
          <p>السعر: {{product.price}} دولار</p>
          @if(product.inStock)
            <span>✅ متوفر</span>
          @else
            <span>❌ غير متوفر</span>
          @endif
        </div>
      @endeach
    </div>
  `;

  const data = {
    users: [
      { name: 'أحمد', role: 'مطور', age: 25 },
      { name: 'فاطمة', role: 'مصممة', age: 28 },
      { name: 'محمد', role: 'مدير', age: 35 }
    ],
    products: [
      { name: 'لابتوب', price: 1200, inStock: true },
      { name: 'هاتف', price: 800, inStock: false },
      { name: 'تابلت', price: 500, inStock: true }
    ]
  };

  const jhtm = new JHTM(() => template, data);
  const html = await jhtm.render();
  console.log(html);
}

// ============================================
// مثال 4: بيانات متداخلة
// ============================================
async function example4() {
  console.log('\n🏗️ مثال 4: بيانات متداخلة');
  console.log('=====================================');

  const template = `
    <div>
      <h1>{{company.name}}</h1>
      <p>الموقع: {{company.location.city}}, {{company.location.country}}</p>

      <h2>الموظفون</h2>
      @each(company.employees as employee)
        <div>
          <h3>{{employee.name}}</h3>
          <p>القسم: {{employee.department}}</p>
          <p>الراتب: {{employee.salary}} دولار</p>

          <h4>المهارات:</h4>
          <ul>
            @each(employee.skills as skill)
              <li>{{skill}}</li>
            @endeach
          </ul>
        </div>
      @endeach
    </div>
  `;

  const data = {
    company: {
      name: 'شركة التقنية',
      location: {
        city: 'دبي',
        country: 'الإمارات'
      },
      employees: [
        {
          name: 'أحمد',
          department: 'البرمجة',
          salary: 5000,
          skills: ['JavaScript', 'Node.js', 'React']
        },
        {
          name: 'سارة',
          department: 'التصميم',
          salary: 4500,
          skills: ['Photoshop', 'Figma', 'UI/UX']
        }
      ]
    }
  };

  const jhtm = new JHTM(() => template, data);
  const html = await jhtm.render();
  console.log(html);
}

// ============================================
// مثال 5: محاكاة جلب بيانات من API
// ============================================
async function example5() {
  console.log('\n🌐 مثال 5: جلب بيانات ديناميكية');
  console.log('=====================================');

  // محاكاة دالة لجلب بيانات من API
  const fetchUserData = async () => {
    // في الواقع، هذه ستكون استدعاء fetch حقيقي
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            name: 'عبدالله',
            email: 'abdullah@example.com',
            posts: [
              { title: 'مقالتي الأولى', views: 120 },
              { title: 'تعلم JavaScript', views: 350 },
              { title: 'دليل Node.js', views: 480 }
            ]
          }
        });
      }, 100);
    });
  };

  const template = `
    <div>
      <h1>مدونة {{user.name}}</h1>
      <p>البريد: {{user.email}}</p>

      <h2>المقالات</h2>
      @each(user.posts as post)
        <article>
          <h3>{{post.title}}</h3>
          <span>👁️ {{post.views}} مشاهدة</span>

          @if(post.views > 300)
            <span>🔥 شائع!</span>
          @endif
        </article>
      @endeach
    </div>
  `;

  // جلب البيانات
  const data = await fetchUserData();

  const jhtm = new JHTM(() => template, data);
  const html = await jhtm.render();
  console.log(html);
}

// ============================================
// تشغيل جميع الأمثلة
// ============================================
async function runAllExamples() {
  console.log('🚀 بدء تشغيل أمثلة JHTM');
  console.log('='.repeat(50));

  try {
    await example1();
    await example2();
    await example3();
    await example4();
    await example5();

    console.log('\n✅ تم تشغيل جميع الأمثلة بنجاح!');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    console.error(error.stack);
  }
}

// تشغيل
runAllExamples();
