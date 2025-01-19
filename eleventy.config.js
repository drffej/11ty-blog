const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img")
const path = require('path')
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { format } = require('date-fns'); 
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {

// add navigation plug in
eleventyConfig.addPlugin(eleventyNavigationPlugin);

// date filter
eleventyConfig.addFilter("postDate", (dateObj) => {
    const result = format(dateObj, 'MMMM dd, yyyy')
    return result;
});

// Return all the tags used in a collection
eleventyConfig.addFilter("getAllTags", collection => {
    let tagSet = new Set();
    for(let item of collection) {
        (item.data.tags || []).forEach(tag => tagSet.add(tag));
    }
    return Array.from(tagSet);
});

eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
});

// add the markdown library
// Initialize the markdown-it library
const markdownLib = markdownIt({
    html: true
});

// Add a Nunjucks filter for rendering Markdown
eleventyConfig.addNunjucksFilter("markdown", function(content) {
return markdownLib.render(content);
});

 // Optional: You can set the markdown library for Eleventy's Markdown parsing
 eleventyConfig.setLibrary("md", markdownLib);


// add syntax highlighter
eleventyConfig.addPlugin(syntaxHighlight);

return {

    passthroughFileCopy: true,
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
        "md",
        "njk",
        "html",
        "liquid",
        "js",
        "png",
        "jpg",
        "ico",
        "svg",
        "webp",
        "xml",
        "webmanifest",
        "txt",
        "json",
        "css"
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // These are all optional:
    dir: {
        input: "content",          // default: "."
        includes: "../_includes",  // default: "_includes"
        data: "../_data",          // default: "_data"
        output: "_site"
    },

    // -----------------------------------------------------------------
    // Optional items:
    // -----------------------------------------------------------------

    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

    // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
    // it will transform any absolute URLs in your HTML to include this
    // folder name and does **not** affect where things go in the output folder.
    pathPrefix: "/",
};
}