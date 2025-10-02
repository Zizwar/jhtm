# 📁 هيكل مشروع JHTM v2.0

```
jhtm/
│
├── 📄 jhtm.js                    # الكود الرئيسي
├── 📄 jhtm.d.ts                  # TypeScript definitions
├── 📄 package.json               # معلومات المكتبة
│
├── 📁 test/
│   └── test.js                   # الاختبارات (25 اختبار)
│
├── 📁 docs/
│   ├── README.md                 # الوثائق الرئيسية
│   ├── QUICKSTART.md             # البداية السريعة
│   ├── CHEATSHEET.md             # ورقة الغش
│   ├── EXAMPLES.md               # الأمثلة العملية
│   ├── INCLUDE_GUIDE.md          # دليل التضمين
│   ├── COMPARISON.md             # مقارنة v1 vs v2
│   ├── SUMMARY.md                # الملخص الشامل
│   └── INDEX.md                  # دليل الوثائق
│
├── 📄 CHANGELOG.md               # سجل التغييرات
├── 📄 LICENSE                    # الترخيص MIT
└── 📄 STRUCTURE.md               # هذا الملف
```

## 🎯 كيفية التنظيم:

### الخطوة 1: أنشئ المجلدات
```bash
mkdir test docs
```

### الخطوة 2: انقل الملفات

**الملفات الرئيسية (في الجذر):**
- `jhtm.js`
- `jhtm.d.ts`
- `package.json`
- `CHANGELOG.md`
- `LICENSE`
- `STRUCTURE.md`

**مجلد test/:**
- `test.js`

**مجلد docs/:**
- `README.md`
- `QUICKSTART.md`
- `CHEATSHEET.md`
- `EXAMPLES.md`
- `INCLUDE_GUIDE.md`
- `COMPARISON.md`
- `SUMMARY.md`
- `INDEX.md`

### الخطوة 3 (اختياري): روابط سريعة في الجذر

يمكنك إنشاء نسخة من README في الجذر للسهولة:
```bash
cp docs/README.md ./README.md
```

---

## 📦 للنشر على npm:

**الملفات المطلوبة في الجذر:**
- ✅ `jhtm.js`
- ✅ `jhtm.d.ts`
- ✅ `package.json`
- ✅ `README.md` (انسخه من docs/)
- ✅ `LICENSE`

**package.json يشمل:**
```json
"files": [
  "jhtm.js",
  "jhtm.d.ts",
  "README.md",
  "LICENSE"
]
```

---

## ✅ جاهز للنشر!