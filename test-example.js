// اختبار JHTM مع المثال
const JHTM = require('./jhtm.js');
const fs = require('fs');
const path = require('path');

// قراءة الملفات محلياً
const template = fs.readFileSync('./EXAMPLE/template.html', 'utf-8');
const data = JSON.parse(fs.readFileSync('./EXAMPLE/data.json', 'utf-8'));

// دالة لقراءة القوالب المضمنة
const loadPartial = (fileName) => {
    const filePath = path.join('./EXAMPLE/partials', fileName);
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    throw new Error(`Template not found: ${fileName}`);
};

// محاكاة fetch للقوالب المضمنة
global.fetch = async (url) => {
    console.log('📥 Loading:', url);

    if (url.includes('partials/')) {
        const fileName = path.basename(url);
        const content = loadPartial(fileName);
        return {
            ok: true,
            text: async () => content
        };
    }

    return {
        ok: false,
        status: 404
    };
};

// إنشاء instance من JHTM
const jhtm = new JHTM(
    () => template,
    data,
    {
        cacheTemplate: false,
        cacheData: false,
        templateBasePath: './EXAMPLE/partials',
        sanitize: true
    }
);

console.log('🚀 بدء اختبار JHTM...\n');

// عرض القالب
jhtm.render()
    .then(result => {
        console.log('✅ تم عرض القالب بنجاح!\n');
        console.log('📊 طول المحتوى:', result.length, 'حرف');
        console.log('📄 أول 500 حرف من النتيجة:\n');
        console.log(result.substring(0, 500));
        console.log('\n...\n');

        // حفظ النتيجة
        fs.writeFileSync('./EXAMPLE/output-test.html', result);
        console.log('💾 تم حفظ النتيجة في: EXAMPLE/output-test.html');
    })
    .catch(error => {
        console.error('❌ خطأ:', error.message);
        console.error('📍 Stack:', error.stack);
    });
