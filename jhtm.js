// jhtm.js

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define([], factory);
  } else if (typeof module === 'object' && module.exports) {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.
      module.exports = factory();
  } else {
      // Browser globals (root is window)
      root.JHTM = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  class JHTM {
      constructor(templateUrl, dataSource, config = {}) {
          this.templateUrl = templateUrl;
          this.dataSource = dataSource;
          this.config = {
              cacheTemplate: true,
              cacheTTL: 3600000, // 1 hour in milliseconds
              executeScripts: true,
              loadCSS: true,
              ...config
          };
          this.templateCache = null;
          this.dataCache = null;
      }

      async loadTemplate() {
          if (this.templateCache && this.config.cacheTemplate) {
              return this.templateCache;
          }
          let template;
          if (typeof this.templateUrl === 'string') {
              const response = await fetch(this.templateUrl);
              template = await response.text();
          } else if (typeof this.templateUrl === 'function') {
              template = await this.templateUrl();
          } else {
              throw new Error('Invalid template source');
          }
          if (this.config.cacheTemplate) {
              this.templateCache = template;
              setTimeout(() => this.templateCache = null, this.config.cacheTTL);
          }
          return template;
      }

      async loadData() {
          if (this.dataCache) {
              return this.dataCache;
          }
          let data;
          if (typeof this.dataSource === 'string') {
              const response = await fetch(this.dataSource);
              data = await response.json();
          } else if (typeof this.dataSource === 'object') {
              data = this.dataSource;
          } else if (typeof this.dataSource === 'function') {
              data = await this.dataSource();
          } else {
              throw new Error('Invalid data source');
          }
          this.dataCache = data;
          return data;
      }

      renderTemplate(template, data) {
          // Replace simple variables
          template = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
              return data[key] !== undefined ? data[key] : '';
          });
          
          // Execute dynamic code
          template = template.replace(/\$\{(.+?)\}/g, (match, code) => {
              try {
                  return new Function('data', `return (${code})`)(data);
              } catch (error) {
                  console.error('Error executing code:', error);
                  return match;
              }
          });
          
          return template;
      }

      async handleExternalResources(renderedTemplate) {
          // Check if we're in a browser environment
          if (typeof window === 'undefined') {
              return renderedTemplate;
          }

          const parser = new DOMParser();
          const doc = parser.parseFromString(renderedTemplate, 'text/html');

          if (this.config.executeScripts) {
              // Handle inline scripts
              doc.querySelectorAll('script:not([src])').forEach(script => {
                  const newScript = document.createElement('script');
                  newScript.textContent = script.textContent;
                  script.parentNode.replaceChild(newScript, script);
              });

              // Handle external scripts
              const scriptPromises = Array.from(doc.querySelectorAll('script[src]')).map(script => {
                  return new Promise((resolve, reject) => {
                      const newScript = document.createElement('script');
                      newScript.src = script.src;
                      newScript.onload = resolve;
                      newScript.onerror = reject;
                      script.parentNode.replaceChild(newScript, script);
                  });
              });

              await Promise.all(scriptPromises);
          }

          if (this.config.loadCSS) {
              // Handle external CSS
              doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                  const newLink = document.createElement('link');
                  newLink.rel = 'stylesheet';
                  newLink.href = link.href;
                  document.head.appendChild(newLink);
              });
          }

          return doc.body.innerHTML;
      }

      async render() {
          const [template, data] = await Promise.all([this.loadTemplate(), this.loadData()]);
          const renderedTemplate = this.renderTemplate(template, data);
          return this.handleExternalResources(renderedTemplate);
      }
  }

  return JHTM;
}));

// For ES Module support
if (typeof exports === 'object' && typeof module !== 'undefined') {
  module.exports.default = module.exports; // Enable `import JHTM from 'jhtm'`
}