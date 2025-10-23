module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addCollection("docsByCategory", function (collectionApi) {
    const docs = collectionApi.getFilteredByGlob("src/docs/**/*.md");
    const categories = {};

    docs.forEach(doc => {
      // Get the category from the path
      const parts = doc.inputPath.split('/');
      const docsIndex = parts.indexOf('docs');
      const category = parts[docsIndex + 1]; // Folder name after 'docs'

      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(doc);
    });

    // Sort docs within each category
    Object.keys(categories).forEach(cat => {
      categories[cat].sort((b, a) => a.fileSlug.localeCompare(b.fileSlug));
    });

    return categories;
  });

  eleventyConfig.addPairedShortcode("infoCard", function (content, type, title) {
    return `<div class="info-card info-card--${type}">
    <strong class="info-card__title">${title}</strong>
    <p class="info-card__content">${content}</p>
  </div>`;
  })

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
