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
          // إذا لم يكن URL، اعتبره محتوى القالب مباشرة
          if (!(/^https?:\/\/|^\/|^\.\//.test(this.templateUrl))) {
            template = this.templateUrl;
          } else if (typeof fetch === 'function') {
            const response = await fetch(this.templateUrl);
            if (!response.ok) throw new Error(`Failed to load template: ${response.status}`);
            template = await response.text();
          } else {
            // Fallback for Node.js environment if fetch is not available
            const fs = require('fs').promises;
            template = await fs.readFile(this.templateUrl, 'utf8');
          }
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

    // إيجاد حلقة @each مطابقة (مع دعم التداخل)
    findMatchingLoop(template, startPos) {
      const eachStart = /@each\(/g;
      const eachEnd = /@endeach/g;

      eachStart.lastIndex = startPos;
      const match = eachStart.exec(template);
      if (!match) return null;

      let depth = 1;
      let pos = eachStart.lastIndex;

      while (depth > 0 && pos < template.length) {
        const nextEach = template.indexOf('@each(', pos);
        const nextEnd = template.indexOf('@endeach', pos);

        if (nextEnd === -1) return null; // لا يوجد @endeach مطابق

        if (nextEach !== -1 && nextEach < nextEnd) {
          depth++;
          pos = nextEach + 6; // طول '@each('
        } else {
          depth--;
          if (depth === 0) {
            return {
              start: match.index,
              end: nextEnd + 8, // طول '@endeach'
              fullMatch: template.substring(match.index, nextEnd + 8)
            };
          }
          pos = nextEnd + 8;
        }
      }

      return null;
    }

    // معالجة الحلقات: @each(items as item)...@endeach
    processLoops(template, data) {
      let result = template;

      while (true) {
        const loopInfo = this.findMatchingLoop(result, 0);
        if (!loopInfo) break;

        const fullMatch = loopInfo.fullMatch;
        const headerMatch = fullMatch.match(/@each\((\w+(?:\.\w+)*)\s+as\s+(\w+)\)/);
        if (!headerMatch) {
          result = result.replace(fullMatch, '');
          continue;
        }

        const [, arrayPath, itemName] = headerMatch;
        const content = fullMatch.substring(
          headerMatch[0].length,
          fullMatch.length - 8 // -'@endeach'.length
        );

        try {
          const array = this.getNestedValue(data, arrayPath);
          if (!Array.isArray(array)) {
            result = result.replace(fullMatch, '');
            continue;
          }

          const rendered = array.map((item, index) => {
            const itemData = {
              ...data,
              [itemName]: item,
              index,
              first: index === 0,
              last: index === array.length - 1
            };

            let itemContent = content;

            // معالجة الحلقات المتداخلة
            if (/@each\(/.test(itemContent)) {
              itemContent = this.processLoops(itemContent, itemData);
            }

            // معالجة الشروط
            itemContent = this.processConditionals(itemContent, itemData);

            // معالجة المتغيرات
            itemContent = this.renderSimpleVariables(itemContent, itemData);

            return itemContent;
          }).join('');

          result = result.replace(fullMatch, rendered);
        } catch (error) {
          console.warn('Loop error:', error);
          result = result.replace(fullMatch, '');
        }
      }

      return result;
    }

    // تقييم تعبير بسيط بشكل آمن
    evaluateExpression(expr, data) {
      expr = expr.trim();

      // الحالة 1: مقارنة كاملة (e.g., "age >= 18")
      const comparisonRegex = /^(!?)(\w+(?:\.\w+)*)\s*(===|!==|>=|<=|>|<)\s*(.+)$/;
      const comparisonMatch = expr.match(comparisonRegex);

      if (comparisonMatch) {
        const [, not, path, operator, rawValue] = comparisonMatch;
        let value = this.getNestedValue(data, path);
        
        let compareValue = rawValue?.trim();
        if (compareValue === 'true') compareValue = true;
        else if (compareValue === 'false') compareValue = false;
        else if (compareValue === 'null') compareValue = null;
        else if (!isNaN(Number(compareValue)) && compareValue !== '' && !compareValue.includes(' ')) {
          compareValue = Number(compareValue);
        } else {
          compareValue = compareValue.replace(/^['\"]|['\"]$/g, '');
        }

        let result;
        switch (operator) {
          case '===': result = value === compareValue; break;
          case '!==': result = value !== compareValue; break;
          case '>': result = value > compareValue; break;
          case '<': result = value < compareValue; break;
          case '>=': result = value >= compareValue; break;
          case '<=': result = value <= compareValue; break;
          default: result = false;
        }
        return not ? !result : result;
      }

      // الحالة 2: متغير بولياني بسيط (e.g., "isActive", "!user.active")
      const booleanRegex = /^(!?)(\w+(?:\.\w+)*)$/;
      const booleanMatch = expr.match(booleanRegex);

      if (booleanMatch) {
        const [, not, path] = booleanMatch;
        const value = this.getNestedValue(data, path);
        return not ? !value : !!value;
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

        // معالجة التضمينات والحلقات بشكل متكرر
        let processed = template;
        let maxIterations = 5; // الحد الأقصى لتجنب الحلقات اللانهائية

        for (let i = 0; i < maxIterations; i++) {
          // معالجة التضمينات أولاً
          const withIncludes = await this.processIncludes(processed, data);

          // معالجة الحلقات ثم الشروط (الترتيب مهم!)
          const withLoops = this.processLoops(withIncludes, data);
          const withConditions = this.processConditionals(withLoops, data);

          // إذا لم تتغير النتيجة، نكون انتهينا
          if (withConditions === processed) {
            processed = withConditions;
            break;
          }

          processed = withConditions;
        }

        // معالجة التضمينات المتبقية بعد توسيع الحلقات
        processed = await this.processIncludes(processed, data);

        // معالجة المتغيرات النهائية
        processed = this.renderRawVariables(processed, data);
        processed = this.renderSimpleVariables(processed, data);

        return await this.handleExternalResources(processed);
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