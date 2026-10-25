const path = require("path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addCollection("docsByCategory", function (collectionApi) {
    const docs = collectionApi.getFilteredByGlob("src/docs/**/*.md");
    const categories = {};

    docs.forEach(doc => {
      // Normalize path across all operating systems
      const segments = path.normalize(doc.inputPath).split(path.sep);
      const docsIndex = segments.indexOf("docs");
      const category = docsIndex !== -1 ? segments[docsIndex + 1] : "general";

      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(doc);
    });

    // Sort documents alphabetically by title/slug within each category
    Object.keys(categories).forEach(cat => {
      categories[cat].sort((a, b) => {
        const titleA = a.data.title || a.fileSlug;
        const titleB = b.data.title || b.fileSlug;
        return titleA.localeCompare(titleB);
      });
    });

    return categories;
  });

  eleventyConfig.addPairedShortcode("infoCard", function (content, type = "info", title = "Information") {
    return `<div class="info-card info-card--${type}">
    <strong class="info-card__title">${title}</strong>
    <div class="info-card__content">${content}</div>
  </div>`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
