// jhtm.d.ts - TypeScript Type Definitions for JHTM v2.0

declare module 'jhtm' {
  /**
   * إعدادات JHTM
   */
  export interface JHTMConfig {
    /**
     * تفعيل cache للقالب
     * @default true
     */
    cacheTemplate?: boolean;

    /**
     * تفعيل cache للبيانات
     * @default false
     */
    cacheData?: boolean;

    /**
     * مدة صلاحية الـ cache بالميلي ثانية
     * @default 3600000 (ساعة واحدة)
     */
    cacheTTL?: number;

    /**
     * تنفيذ scripts في القالب (غير آمن!)
     * @default false
     */
    executeScripts?: boolean;

    /**
     * تحميل ملفات CSS الخارجية
     * @default true
     */
    loadCSS?: boolean;

    /**
     * تنظيف HTML من XSS تلقائياً
     * @default true
     */
    sanitize?: boolean;

    /**
     * المسار الأساسي للقوالب المضمّنة
     * @default ''
     */
    templateBasePath?: string;

    /**
     * الحد الأقصى لعمق التضمين (منع الحلقات اللانهائية)
     * @default 10
     */
    maxIncludeDepth?: number;
  }

  /**
   * مصدر القالب - يمكن أن يكون:
   * - string: URL أو مسار الملف
   * - Function: دالة ترجع القالب
   */
  export type TemplateSource = string | (() => string | Promise<string>);

  /**
   * مصدر البيانات - يمكن أن يكون:
   * - string: URL لملف JSON
   * - object: كائن البيانات مباشرة
   * - Function: دالة ترجع البيانات
   */
  export type DataSource<T = any> = 
    | string 
    | T 
    | (() => T | Promise<T>);

  /**
   * JHTM - JavaScript HTML Template Manager
   * 
   * @example
   * ```typescript
   * const jhtm = new JHTM('/template.html', { name: 'أحمد' });
   * const html = await jhtm.render();
   * ```
   */
  export class JHTM<T = any> {
    /**
     * إنشاء instance جديد من JHTM
     * 
     * @param templateUrl - مصدر القالب (URL، مسار، أو دالة)
     * @param dataSource - مصدر البيانات (URL، كائن، أو دالة)
     * @param config - إعدادات اختيارية
     */
    constructor(
      templateUrl: TemplateSource,
      dataSource: DataSource<T>,
      config?: JHTMConfig
    );

    /**
     * مصدر القالب
     */
    readonly templateUrl: TemplateSource;

    /**
     * مصدر البيانات
     */
    dataSource: DataSource<T>;

    /**
     * الإعدادات المستخدمة
     */
    readonly config: Required<JHTMConfig>;

    /**
     * تحميل القالب من المصدر
     * @returns القالب كـ string
     */
    loadTemplate(): Promise<string>;

    /**
     * تحميل البيانات من المصدر
     * @returns البيانات كـ object
     */
    loadData(): Promise<T>;

    /**
     * عرض القالب مع البيانات
     * @returns HTML المعالج
     */
    render(): Promise<string>;

    /**
     * تحديث البيانات وإعادة العرض
     * @param newData - البيانات الجديدة
     * @returns HTML المعالج
     */
    update(newData: DataSource<T>): Promise<string>;

    /**
     * مسح جميع الـ cache
     */
    clearCache(): void;

    /**
     * الوصول إلى قيمة متداخلة في كائن
     * @param obj - الكائن
     * @param path - المسار (مثل: 'user.name.first')
     */
    getNestedValue(obj: any, path: string): any;

    /**
     * معالجة الشروط في القالب
     */
    processConditionals(template: string, data: T): string;

    /**
     * معالجة الحلقات في القالب
     */
    processLoops(template: string, data: T): string;

    /**
     * تقييم تعبير شرطي
     */
    evaluateExpression(expr: string, data: T): boolean;

    /**
     * معالجة المتغيرات البسيطة
     */
    renderSimpleVariables(template: string, data: T): string;

    /**
     * معالجة المتغيرات الخام (HTML)
     */
    renderRawVariables(template: string, data: T): string;

    /**
     * تنظيف HTML من XSS
     */
    escapeHtml(text: string): string;

    /**
     * معالجة القالب بالكامل
     */
    renderTemplate(template: string, data: T): string;

    /**
     * معالجة الموارد الخارجية (scripts, CSS)
     */
    handleExternalResources(renderedTemplate: string): Promise<string>;
  }

  /**
   * إنشاء instance جديد من JHTM
   * 
   * @example
   * ```typescript
   * const jhtm = JHTM.create('/template.html', { name: 'محمد' });
   * ```
   */
  export function create<T = any>(
    template: TemplateSource,
    data: DataSource<T>,
    config?: JHTMConfig
  ): JHTM<T>;

  /**
   * عرض string قالب مباشرة
   * 
   * @example
   * ```typescript
   * const html = await JHTM.renderString(
   *   '<h1>{{title}}</h1>',
   *   { title: 'مرحبا' }
   * );
   * ```
   */
  export function renderString<T = any>(
    template: string,
    data: T
  ): Promise<string>;

  export default JHTM;
}

declare global {
  interface Window {
    JHTM: typeof import('jhtm').JHTM;
  }
}