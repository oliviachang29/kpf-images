const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");

const fg = require("fast-glob");
const images = fg.sync(["src/assets/images/*.{jpg,jpeg,png}", "!**/_site"]);
const sharp = require("sharp");

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
        urlWithoutSrc = url.slice(url.indexOf("/"), url.length);
        sharp(url)
            .resize(600, 800)
            .toFile(__dirname + `/dist${urlWithoutSrc}`, (err, info) => { console.log(info);console.error(err) });

        url = urlWithoutSrc;
        return url;
    });
  });

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

  // Layouts
  config.addLayoutAlias("base", "base.njk");
  config.addLayoutAlias("post", "post.njk");

  // Pass-through files
  config.addPassthroughCopy("src/robots.txt");
  config.addPassthroughCopy("src/site.webmanifest");
  config.addPassthroughCopy("src/assets/fonts");

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
