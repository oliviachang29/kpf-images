const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const fs = require('fs');

const fg = require("fast-glob");
const images = fg.sync(["src/assets/images/*.{jpg,jpeg,png}", "!**/_site"]);

const filters = require("./utils/filters.js");
const transforms = require("./utils/transforms.js");
const shortcodes = require("./utils/shortcodes.js");
const iconsprite = require("./utils/iconsprite.js");

module.exports = function (config) {
  // Plugins
  config.addPlugin(pluginRss);
  config.addPlugin(pluginNavigation);

  config.addCollection("images", function (collection) {
    return images.map((url) => {
        url = url.slice(url.indexOf("/") + 1, url.length);

        return url;
    });
  });

  config.addWatchTarget("./src/assets");

  // Filters
  Object.keys(filters).forEach((filterName) => {
    config.addFilter(filterName, filters[filterName]);
  });

  // Transforms
  Object.keys(transforms).forEach((transformName) => {
    config.addTransform(transformName, transforms[transformName]);
  });

  // Shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    config.addShortcode(shortcodeName, shortcodes[shortcodeName]);
  });

  // Icon Sprite
  config.addNunjucksAsyncShortcode("iconsprite", iconsprite);

  // Asset Watch Targets
  config.addWatchTarget("./src/assets");

  // Markdown
  config.setLibrary(
    "md",
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true,
    })
  );

  // Pass-through files
  config.addPassthroughCopy("src/robots.txt");
  config.addPassthroughCopy("src/site.webmanifest");
  config.addPassthroughCopy("src/assets/images");

  // Deep-Merge
  config.setDataDeepMerge(true);

  // Base Config
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "includes",
      layouts: "layouts",
      data: "data",
    },
    templateFormats: ["njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
