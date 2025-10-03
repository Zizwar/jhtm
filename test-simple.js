const JHTM = require('./jhtm.js');
const fs = require('fs');
const path = require('path');

console.log('🧪 اختبار JHTM البسيط\n');

// قراءة الملفات
const template = fs.readFileSync('./EXAMPLE/template.html', 'utf-8');
const data = JSON.parse(fs.readFileSync('./EXAMPLE/data.json', 'utf-8'));

// محاكاة fetch
global.fetch = async (url) => {
    console.log('📥 fetch:', url);

    const filePath = path.join('./EXAMPLE/partials', path.basename(url));
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        console.log('✅ تم تحميل:', filePath);
        return {
            ok: true,
            text: async () => content
        };
    }

    console.log('❌ لم يتم العثور على:', filePath);
    return { ok: false, status: 404 };
};

const jhtm = new JHTM(
    () => template,
    data,
    {
        templateBasePath: './EXAMPLE/partials',
        cacheTemplate: false
    }
);

console.log('⚙️ الإعدادات:', jhtm.config);
console.log('');

jhtm.render()
    .then(result => {
        console.log('\n✅ نجح render()');
        console.log('📊 طول النتيجة:', result.length);

        // فحص @include
        const hasInclude = result.includes('@include');
        console.log('');
        console.log('🔍 فحص @include:', hasInclude ? '❌ موجود' : '✅ تمت معالجته');

        // فحص النص من header.html
        const hasHeader = result.includes('هذا الهيدر من ملف خارجي');
        console.log('🔍 فحص header.html:', hasHeader ? '✅ تم جلبه' : '❌ لم يُجلب');

        // عرض جزء من النتيجة
        console.log('\n📄 أول 500 حرف من النتيجة:');
        console.log('━'.repeat(50));
        console.log(result.substring(0, 500));
        console.log('━'.repeat(50));

        // حفظ النتيجة
        fs.writeFileSync('./EXAMPLE/output.html', result);
        console.log('\n💾 تم حفظ النتيجة في: EXAMPLE/output.html');
    })
    .catch(error => {
        console.error('\n❌ خطأ:', error.message);
        console.error('📍 Stack:', error.stack);
    });
