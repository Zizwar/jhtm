# JHTM (JavaScript HTML Template Manager)

JHTM is a lightweight yet powerful library for managing HTML templates using JavaScript. It can be used in both browser and Node.js environments.

## Features

- Support for browser and Node.js usage
- Load templates from URL or local file
- Support for multiple data sources (JSON URL, JavaScript object)
- Template caching for improved performance
- Support for dynamic code execution within templates
- Proper handling of script tags, CSS files, and other external resources

## Installation

```bash
npm install jhtm
```

## Usage

### In Browser

```html
<script src="path/to/jhtm.js"></script>
<script>
  const jhtm = new JHTM('/template.html', '/data.json'/*or "https://exemple.com/feed.json"*/, { cacheTemplate: true });
  jhtm.render().then(result => {
    document.body.innerHTML = result;
  });
</script>
```

### In Node.js

```javascript
const JHTM = require('jhtm');

const jhtm = new JHTM('/template.html', { name: 'John', age: 30 });
jhtm.render().then(result => {
  console.log(result);
});
```

## Options

You can pass a configuration object as the third argument to the constructor:

```javascript
const config = {
  cacheTemplate: true, // Enable template caching
  cacheTTL: 3600000, // Cache time-to-live in milliseconds (default 1 hour)
  executeScripts: true, // Execute inline scripts and load external scripts
  loadCSS: true // Load external CSS files
};

const jhtm = new JHTM('/template.html', '/data.json', config);
```

## Template Example

```html
<h1>{{name}}</h1>
<p>Age: {{age}}</p>
<div>
  ${data.hobbies.map(hobby => `<span>${hobby}</span>`).join(', ')}
</div>
<script>console.log('Hello from template!');</script>
<link rel="stylesheet" href="styles.css">
```

## License

MIT
