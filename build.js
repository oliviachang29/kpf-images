const fs = require('fs-extra')

const path = require('path');
const fg = require("fast-glob");
const images_array = fg.sync(["images/*.{jpg,jpeg,png}", "!**/_site"]);
let images_string = ''

const SITE_URL = "https://kpf.netlify.app"

images_array.forEach((url) => {
    url = `${SITE_URL}/${url}`;
    images_string += url + ', '
});

fs.mkdir('_dist', { recursive: true }, (err) => {
  if (err) throw err;
});

fs.copy('images', '_dist/images')

fs.writeFile('_dist/index.html', images_string, 'utf8', (err) => {
  console.log('wrote dist')
})

