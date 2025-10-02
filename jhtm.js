// jhtm.js v2.0 - محسّن ومطوّر

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JHTM = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  class JHTM {
    constructor(templateUrl, dataSource, config = {}) {
      this.templateUrl = templateUrl;
      this.dataSource = dataSource;
      this.config = {
        cacheTemplate: true,
        cacheData: false,
        cacheTTL: 3600000, // 1 ساعة
        executeScripts: false, // أمان: معطل افتراضياً
        loadCSS: true,
        sanitize: true, // تنظيف HTML
        templateBasePath: '', // المسار الأساسي للقوالب
        maxIncludeDepth: 10, // الحد الأقصى لعمق التضمين
        ...config
      };
      this.cache = new Map();
      this.includeDepth = 0; // تتبع عمق التضمين
      this.includedTemplates = new Set(); // منع الحلقات
    }

    // تحميل القالب
    async loadTemplate() {
      const cacheKey = 'template';
      
      if (this.config.cacheTemplate && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.config.cacheTTL) {
          return cached.data;
        }
        this.cache.delete(cacheKey);
      }

      let template;
      try {
        if (typeof this.templateUrl === 'string') {
          const response = await fetch(this.templateUrl);
          if (!response.ok) throw new Error(`Failed to load template: ${response.status}`);
          template = await response.text();
        } else if (typeof this.templateUrl === 'function') {
          template = await this.templateUrl();
        } else {
          template = String(this.templateUrl);
        }
      } catch (error) {
        throw new Error(`Template loading error: ${error.message}`);
      }

      if (this.config.cacheTemplate) {
        this.cache.set(cacheKey, { data: template, timestamp: Date.now() });
      }

      return template;
    }

    // تحميل البيانات
    async loadData() {
      const cacheKey = 'data';
      
      if (this.config.cacheData && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.config.cacheTTL) {
          return cached.data;
        }
        this.cache.delete(cacheKey);
      }

      let data;
      try {
        if (typeof this.dataSource === 'string') {
          const response = await fetch(this.dataSource);
          if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
          data = await response.json();
        } else if (typeof this.dataSource === 'function') {
          data = await this.dataSource();
        } else {
          data = this.dataSource || {};
        }
      } catch (error) {
        throw new Error(`Data loading error: ${error.message}`);
      }

      if (this.config.cacheData) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return data;
    }

    // تحميل قالب خارجي (للتضمين)
    async loadExternalTemplate(path) {
      const fullPath = this.config.templateBasePath 
        ? `${this.config.templateBasePath}/${path}`.replace(/\/+/g, '/')
        : path;

      const cacheKey = `external:${fullPath}`;
      
      if (this.config.cacheTemplate && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.config.cacheTTL) {
          return cached.data;
        }
        this.cache.delete(cacheKey);
      }

      let template;
      try {
        if (typeof window !== 'undefined' || typeof fetch !== 'undefined') {
          const response = await fetch(fullPath);
          if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
          template = await response.text();
        } else {
          // Node.js
          const fs = require('fs').promises;
          template = await fs.readFile(fullPath, 'utf8');
        }
      } catch (error) {
        throw new Error(`Failed to include template '${path}': ${error.message}`);
      }

      if (this.config.cacheTemplate) {
        this.cache.set(cacheKey, { data: template, timestamp: Date.now() });
      }

      return template;
    }

    // معالجة التضمينات @include و @import
    async processIncludes(template, data) {
      // حماية من العمق الزائد
      if (this.includeDepth >= this.config.maxIncludeDepth) {
        throw new Error(`Maximum include depth (${this.config.maxIncludeDepth}) exceeded`);
      }

      this.includeDepth++;

      try {
        // البحث عن @include(path) أو @include(path, {data})
        const includeRegex = /@(?:include|import)\(([^,)]+)(?:,\s*(\{[^}]+\}))?\)/g;
        let match;
        let result = template;

        while ((match = includeRegex.exec(template)) !== null) {
          const [fullMatch, pathExpr, dataExpr] = match;
          
          // استخراج المسار
          const path = pathExpr.trim().replace(/['"]/g, '');
          
          // حماية من الحلقات اللانهائية
          if (this.includedTemplates.has(path)) {
            throw new Error(`Circular include detected: ${path}`);
          }

          this.includedTemplates.add(path);

          try {
            // تحميل القالب الخارجي
            let includedTemplate = await this.loadExternalTemplate(path);

            // معالجة البيانات المخصصة للقالب المضمّن
            let includeData = data;
            if (dataExpr) {
              try {
                includeData = { ...data, ...JSON.parse(dataExpr) };
              } catch (e) {
                console.warn(`Failed to parse include data for ${path}:`, e);
              }
            }

            // معالجة التضمينات المتداخلة بشكل متكرر
            includedTemplate = await this.processIncludes(includedTemplate, includeData);

            // معالجة القالب المضمّن
            includedTemplate = this.renderTemplate(includedTemplate, includeData);

            // استبدال @include بالقالب المعالج
            result = result.replace(fullMatch, includedTemplate);
          } finally {
            this.includedTemplates.delete(path);
          }
        }

        return result;
      } finally {
        this.includeDepth--;
      }
    }

    // الوصول إلى خاصية متداخلة (user.name.first)
    getNestedValue(obj, path) {
      return path.split('.').reduce((current, prop) => 
        current?.[prop], obj);
    }

    // معالجة الشروط: @if(condition)...@endif
    processConditionals(template, data) {
      return template.replace(/@if\((.*?)\)([\s\S]*?)@endif/g, (match, condition, content) => {
        try {
          const result = this.evaluateExpression(condition, data);
          return result ? content : '';
        } catch (error) {
          console.warn('Conditional error:', error);
          return '';
        }
      });
    }

    // معالجة الحلقات: @each(items as item)...@endeach
    processLoops(template, data) {
      return template.replace(/@each\((\w+(?:\.\w+)*)\s+as\s+(\w+)\)([\s\S]*?)@endeach/g, 
        (match, arrayPath, itemName, content) => {
          try {
            const array = this.getNestedValue(data, arrayPath);
            if (!Array.isArray(array)) return '';
            
            return array.map((item, index) => {
              const itemData = { ...data, [itemName]: item, index, first: index === 0, last: index === array.length - 1 };
              return this.renderSimpleVariables(content, itemData);
            }).join('');
          } catch (error) {
            console.warn('Loop error:', error);
            return '';
          }
        });
    }

    // تقييم تعبير بسيط بشكل آمن
    evaluateExpression(expr, data) {
      // دعم العمليات البسيطة فقط لتجنب eval
      expr = expr.trim();
      
      // مقارنات بسيطة: value === 'string', value > 5, !value
      const comparison = /^(!?)(\w+(?:\.\w+)*)\s*(===|!==|>|<|>=|<=)?\s*(.+)?$/;
      const match = expr.match(comparison);
      
      if (match) {
        const [, not, path, operator, rawValue] = match;
        let value = this.getNestedValue(data, path);
        
        if (not) value = !value;
        if (!operator) return !!value;
        
        // تحويل القيمة المقارنة
        let compareValue = rawValue?.trim();
        if (compareValue === 'true') compareValue = true;
        else if (compareValue === 'false') compareValue = false;
        else if (compareValue === 'null') compareValue = null;
        else if (!isNaN(compareValue)) compareValue = Number(compareValue);
        else compareValue = compareValue.replace(/^['"]|['"]$/g, ''); // إزالة علامات التنصيص
        
        switch (operator) {
          case '===': return value === compareValue;
          case '!==': return value !== compareValue;
          case '>': return value > compareValue;
          case '<': return value < compareValue;
          case '>=': return value >= compareValue;
          case '<=': return value <= compareValue;
          default: return false;
        }
      }
      
      return false;
    }

    // معالجة المتغيرات البسيطة {{name}} أو {{user.name}}
    renderSimpleVariables(template, data) {
      return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
        const value = this.getNestedValue(data, path);
        return value !== undefined && value !== null ? this.escapeHtml(String(value)) : '';
      });
    }

    // معالجة المتغيرات الخام {{{html}}} - بدون escape
    renderRawVariables(template, data) {
      return template.replace(/\{\{\{(\w+(?:\.\w+)*)\}\}\}/g, (match, path) => {
        const value = this.getNestedValue(data, path);
        return value !== undefined && value !== null ? String(value) : '';
      });
    }

    // تنظيف HTML من XSS
    escapeHtml(text) {
      if (!this.config.sanitize) return text;
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    // معالجة القالب
    renderTemplate(template, data) {
      // 1. معالجة المتغيرات الخام أولاً {{{html}}}
      template = this.renderRawVariables(template, data);
      
      // 2. معالجة الشروط @if
      template = this.processConditionals(template, data);
      
      // 3. معالجة الحلقات @each
      template = this.processLoops(template, data);
      
      // 4. معالجة المتغيرات العادية {{name}}
      template = this.renderSimpleVariables(template, data);
      
      return template;
    }

    // معالجة الموارد الخارجية (scripts, CSS)
    async handleExternalResources(renderedTemplate) {
      if (typeof window === 'undefined') {
        return renderedTemplate;
      }

      const div = document.createElement('div');
      div.innerHTML = renderedTemplate;

      // معالجة CSS
      if (this.config.loadCSS) {
        const links = div.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
          if (!document.querySelector(`link[href="${link.href}"]`)) {
            document.head.appendChild(link.cloneNode(true));
          }
        });
      }

      // معالجة Scripts (إذا كانت مفعّلة - غير آمن!)
      if (this.config.executeScripts) {
        const scripts = div.querySelectorAll('script');
        for (const script of scripts) {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
            await new Promise((resolve, reject) => {
              newScript.onload = resolve;
              newScript.onerror = reject;
              document.body.appendChild(newScript);
            });
          } else {
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
          }
        }
      }

      return div.innerHTML;
    }

    // الدالة الرئيسية للعرض
    async render() {
      try {
        const [template, data] = await Promise.all([
          this.loadTemplate(),
          this.loadData()
        ]);
        
        // معالجة التضمينات أولاً
        const templateWithIncludes = await this.processIncludes(template, data);
        
        const rendered = this.renderTemplate(templateWithIncludes, data);
        return await this.handleExternalResources(rendered);
      } catch (error) {
        console.error('JHTM Render Error:', error);
        throw error;
      }
    }

    // مسح الكاش
    clearCache() {
      this.cache.clear();
    }

    // تحديث البيانات وإعادة العرض
    async update(newData) {
      this.dataSource = newData;
      this.cache.delete('data');
      return this.render();
    }
  }

  // دوال مساعدة ثابتة
  JHTM.create = (template, data, config) => new JHTM(template, data, config);
  
  JHTM.renderString = async (template, data) => {
    const jhtm = new JHTM(template, data, { cacheTemplate: false });
    return jhtm.render();
  };

  return JHTM;
}));

if (typeof exports === 'object' && typeof module !== 'undefined') {
  module.exports.default = module.exports;
}