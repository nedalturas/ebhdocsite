# Building a Documentation Site with 11ty

Complete guide to building a documentation site with a landing page and categorized docs with collapsible sidebar.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Folder Structure](#folder-structure)
3. [Configuration](#configuration)
4. [Layouts](#layouts)
5. [Styling](#styling)
6. [JavaScript](#javascript)
7. [Creating Content](#creating-content)
8. [Running the Site](#running-the-site)

## Project Setup

### Initialize Project

```bash
mkdir my-docs-site
cd my-docs-site
npm init -y
npm install --save-dev @11ty/eleventy
```

### Create Folder Structure

```bash
mkdir -p src/docs
mkdir -p src/_includes
mkdir -p src/css
mkdir -p src/js
```

Your project structure:

```
my-docs-site/
├── src/
│   ├── docs/           # Documentation markdown files
│   ├── _includes/      # Layout templates
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   ├── index.njk      # Landing page
│   └── docs.njk       # Docs index page
├── .eleventy.js       # 11ty configuration
└── package.json
```

## Configuration

### .eleventy.js

Create `.eleventy.js` in the root folder:

```javascript
module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  
  // Create collection organized by category folders
  eleventyConfig.addCollection("docsByCategory", function(collectionApi) {
    const docs = collectionApi.getFilteredByGlob("src/docs/**/*.md");
    const categories = {};
    
    docs.forEach(doc => {
      // Extract category from folder path
      const parts = doc.inputPath.split('/');
      const docsIndex = parts.indexOf('docs');
      const category = parts[docsIndex + 1];
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(doc);
    });
    
    // Sort docs within each category
    Object.keys(categories).forEach(cat => {
      categories[cat].sort((a, b) => a.fileSlug.localeCompare(b.fileSlug));
    });
    
    return categories;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
```

### package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "start": "eleventy --serve",
    "build": "eleventy"
  }
}
```

## Layouts

### Base Layout

File: `src/_includes/base.njk`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  
  <!-- Shared CSS libraries go here -->
  <link rel="stylesheet" href="/css/global.css">
  
  <!-- Page-specific CSS -->
  {% block styles %}{% endblock %}
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>
```

### Home Layout

File: `src/_includes/home-layout.njk`

```html
{% extends "base.njk" %}

{% block styles %}
<link rel="stylesheet" href="/css/home.css">
{% endblock %}

{% block content %}
{{ content | safe }}
{% endblock %}
```

### Docs Layout

File: `src/_includes/docs-layout.njk`

```html
{% extends "base.njk" %}

{% block styles %}
<link rel="stylesheet" href="/css/docs.css">
{% endblock %}

{% block content %}
<div class="container">
  <aside class="sidebar">
    <h2>Documentation</h2>
    <nav>
      {% for category, docs in collections.docsByCategory %}
      <div class="category">
        <button class="category-toggle">
          {{ category | replace("-", " ") | title }}
          <span class="arrow">▼</span>
        </button>
        <ul class="category-links">
          {% for doc in docs %}
          <li>
            <a href="{{ doc.url }}">{{ doc.data.title or doc.fileSlug }}</a>
          </li>
          {% endfor %}
        </ul>
      </div>
      {% endfor %}
    </nav>
  </aside>
  <main class="content">
    {{ content | safe }}
  </main>
</div>

<script src="/js/sidebar.js"></script>
{% endblock %}
```

## Styling

### Global CSS

File: `src/css/global.css`

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}
```

### Home Page CSS

File: `src/css/home.css`

```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: scale(1.05);
}
```

### Documentation CSS

File: `src/css/docs.css`

```css
body {
  line-height: 1.6;
}

.container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #f5f5f5;
  padding: 2rem 1rem;
  border-right: 1px solid #ddd;
}

.sidebar h2 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.sidebar nav {
  list-style: none;
}

.category {
  margin-bottom: 1rem;
}

.category-toggle {
  width: 100%;
  padding: 0.75rem;
  background: #e0e0e0;
  border: none;
  border-radius: 4px;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.category-toggle:hover {
  background: #d0d0d0;
}

.category-toggle .arrow {
  transition: transform 0.2s;
}

.category.open .arrow {
  transform: rotate(-180deg);
}

.category-links {
  list-style: none;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.category.open .category-links {
  max-height: 500px;
  margin-top: 0.5rem;
}

.category-links li {
  margin-bottom: 0.25rem;
}

.category-links a {
  text-decoration: none;
  color: #333;
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.category-links a:hover {
  background: #e0e0e0;
}

.category-links a.active {
  background: #d0d0d0;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 800px;
}

.content h1 {
  margin-bottom: 1rem;
}
```

## JavaScript

### Sidebar Toggle Script

File: `src/js/sidebar.js`

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  
  // Toggle categories on click
  document.querySelectorAll('.category-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.parentElement;
      category.classList.toggle('open');
    });
  });
  
  // Auto-open category if current page is inside it
  document.querySelectorAll('.category-links a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      // Found active link, open its category
      const category = link.closest('.category');
      category.classList.add('open');
      link.classList.add('active');
    }
  });
});
```

## Creating Content

### Landing Page

File: `src/index.njk`

```html
---
layout: home-layout.njk
title: Home
---

<div class="hero">
  <h1>Welcome to My Project</h1>
  <p>Your project description here</p>
  <a href="/docs/" class="cta-button">View Documentation</a>
</div>
```

### Docs Index Page

File: `src/docs.njk`

```html
---
layout: docs-layout.njk
title: Documentation
permalink: /docs/
---

# Documentation

Welcome to the documentation. Select a category from the sidebar to get started.
```

### Documentation Files

Create category folders and markdown files:

```
src/docs/
├── getting-started/
│   ├── installation.md
│   └── quick-start.md
├── guides/
│   ├── configuration.md
│   └── deployment.md
└── api/
    ├── authentication.md
    └── endpoints.md
```

Example markdown file - `src/docs/getting-started/installation.md`:

```markdown
---
layout: docs-layout.njk
title: Installation
---

# Installation

## Prerequisites

- Node.js 14+
- npm or yarn

## Install

\`\`\`bash
npm install
\`\`\`

## Verify Installation

\`\`\`bash
npm --version
\`\`\`
```

## Running the Site

### Development

```bash
npm start
```

Visit:
- `http://localhost:8080/` - Landing page
- `http://localhost:8080/docs/` - Documentation index

### Production Build

```bash
npm run build
```

Output will be in `_site/` folder.

## How It Works

### Collections

The `.eleventy.js` file creates a `docsByCategory` collection that:
1. Finds all `.md` files in `src/docs/**/*.md`
2. Groups them by their parent folder (category)
3. Sorts docs alphabetically within each category

### Layouts

Three layouts work together:
- **base.njk** - Shared HTML structure and global CSS
- **home-layout.njk** - Extends base, adds home-specific styling
- **docs-layout.njk** - Extends base, adds sidebar and docs styling

### Sidebar Navigation

The sidebar is generated from the `docsByCategory` collection:
- Category folders become collapsible sections
- Markdown files become navigation links
- JavaScript handles toggle functionality and active states

### Adding New Documentation

To add new docs:

1. **New category**: Create a folder in `src/docs/`
2. **New doc**: Create a `.md` file with frontmatter:

```markdown
---
layout: docs-layout.njk
title: Your Page Title
---

# Your Content Here
```

The sidebar will automatically update on next build.

## Tips

### Ordering Categories

Categories are displayed in alphabetical order. To control order, prefix folder names:

```
src/docs/
├── 01-getting-started/
├── 02-guides/
└── 03-api/
```

Update the docs layout to strip numbers:

```javascript
{{ category | replace("-", " ") | replace(/^\d+-/, "") | title }}
```

### Adding Images

1. Create `src/images/` folder
2. Add passthrough in `.eleventy.js`:

```javascript
eleventyConfig.addPassthroughCopy("src/images");
```

3. Use in markdown:

```markdown
![Alt text](/images/screenshot.png)
```

### Code Syntax Highlighting

Install a plugin:

```bash
npm install --save-dev @11ty/eleventy-plugin-syntaxhighlight
```

Add to `.eleventy.js`:

```javascript
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  // ... rest of config
};
```

## Troubleshooting

### CSS Not Loading

- Check `.eleventy.js` has `addPassthroughCopy("src/css")`
- Delete `_site` folder and rebuild
- Verify CSS files are in `src/css/`

### Sidebar Not Showing Docs

- Check markdown files are in `src/docs/CATEGORY/file.md`
- Verify frontmatter includes `layout: docs-layout.njk`
- Check browser console for JavaScript errors

### Categories Not Collapsing

- Verify `src/js/sidebar.js` exists
- Check `.eleventy.js` has `addPassthroughCopy("src/js")`
- Open browser console for JavaScript errors

## Next Steps

- Add search functionality
- Implement dark mode
- Add breadcrumb navigation
- Create a table of contents for long pages
- Add prev/next navigation between docs