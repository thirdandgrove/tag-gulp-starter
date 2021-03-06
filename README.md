# TAG SCSS Starter w/ Gulp

## To Get Started:

1. If they aren't already, make sure that node and npm (Node Package Manager) are [installed](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm). If you are using a Mac, Homebrew is recommended for this.
2. If this is your first time ever using gulp, you will need to install it globally by running `npm install -g gulp` so that the terminal recognizes gulp commands.
3. The first time running this particular project, `cd` into this directory and type `npm install`.
4. Copy `.env.example.js` to `.env.js` and configure to suit your local and production environment needs.
5. To continually watch .scss and .js files for changes, type `gulp` and use `ctrl + C` to stop.
6. To run a one-time compilation of .scss files, use `gulp scss`. To generate KSS styleguides use `gulp kss`.

## Guidelines:
- Do not nest your CSS selectors, except for states `(:hover, etc.)`, pseudoelements `(::before, ::after)`, or pseudo-selectors `(:nth-child)`, etc. While SCSS provides this functionality, it can easily get out of control creating hard-to-read code and unwieldy selectors.
- All styling should be done mobile-first. This repo contains a mixin for the `min-width` media query only, which in the vast majority of cases should be all you need.
- When in doubt, break your code out into its own partial in appropriately named folders.
- Note that previous implementations of the `px-to-rem()` function have been replaced by a PostCSS plugin that automatically converts px to rem. Saves us all keystrokes!
- [View the full TAG Front-End Best Practices](https://thirdandgrove.atlassian.net/wiki/display/TAGCo/Front+End+Best+Practices)

### Generating Icons

- Add your icons to `src/images/font-icons/` and run the `gulp icons` task.
  This will optimize your SVGs and create an icon font with scss partial.
- Tip: If your icons seem tiny or invisible despite normal font sizes, make sure that none of the svg files have `width="100%"` and/or `height="100%"` on the `<svg>` tag.
- Tip: Often icons can seems too thin or too thick. Make sure to expand and combine paths in a vector editing software.

* Tip: If running `gulp icons` returns an error, sometimes this can be caused by a malformed svg. Try converting the shape to outlines, expand to bounds, then clip to artboard.

### Generating SVG Sprites

- Add svg images to the `src/images` folder. During `gulp watch` these images will be optimized and then sprited. The results will include a unified svg with an unified svg file with appropriate `symbol` for `use` with inline svg. A handy reference HTML sticker sheet is also created in the `dist` directory.

### Using SVG Sprites

- A nice tutorial to use the spite can be found here [SVG symbol a Good Choice for Icons](https://css-tricks.com/svg-symbol-good-choice-icons/)

### Sass-lint

Sass-lint rules are found in `sass-lint.yml` in the theme root.

If you need to ignore a rule use: `// sass-lint:disable <rule>, <rule>` and include a reason. Make sure once you are done using the disabled rules you reenable for the rest of the file. `// sass-lint:enable <rule>, <rule>`.

[Docs here](https://github.com/sasstools/sass-lint/tree/develop/docs)

### KSS Styleguides

There is an option to build visual stylguides with KSS. If unfamiliar with the syntax see the docs. It is best practice instead of adding the KSS block to the top of the file, create a separate file prefixed with `kss`. Example: `_buttons.scss` & `kss-buttons.scss`.

[Docs here](https://github.com/kss-node/kss-node)

### Critical CSS

Great for site speed. When modifying global style rebuild the critical css styles. Run `gulp critical-css` will get you there. The penthouse docs are a little light. You can output to .css, .php, .what-have-you.

### PostCSS Combine Media Queries

This plugin moves all media queries to end of the file, so it may introduce bugs if your CSS is not well structured. Please keep this in mind!

### Build

If you need run a quick build or would like one last sweep of tasks prior to a commit use `gulp build`. This will compile css, js, critical css and build a fresh set of styleguides.

## Helpful References:

- [SCSS basics](http://sass-lang.com/guide) and [full SCSS documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)
