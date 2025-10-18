module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  
  eleventyConfig.addCollection("docsByCategory", function(collectionApi) {
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