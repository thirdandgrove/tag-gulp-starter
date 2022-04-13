# TAG SCSS Starter w/ Gulp

## To Get Started:

1. If they aren't already, make sure that node and npm (Node Package Manager) are [installed](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm). If you are using a Mac, Homebrew is recommended for this.
2. If this is your first time ever using gulp, you will need to install it globally by running `npm install -g gulp` so that the terminal recognizes gulp commands.
3. The first time running this particular project, `cd` into this directory and type `npm install`.
4. Copy `.env.example.js` to `.env.js` and configure to suit your local and production environment needs.
5. To continually watch .scss and .js files for changes, type `gulp` and use `ctrl + C` to stop.
6. To run a one-time compilation of .scss files, use `gulp scss`.

## Guidelines:
- Do not nest your CSS selectors, except for states `(:hover, etc.)`, pseudoelements `(::before, ::after)`, or pseudo-selectors `(:nth-child)`, etc. While SCSS provides this functionality, it can easily get out of control creating hard-to-read code and unwieldy selectors.
- All styling should be done mobile-first. This repo contains a mixin for the `min-width` media query only, which in the vast majority of cases should be all you need.
- When in doubt, break your code out into its own partial in appropriately named folders.
- [View the full TAG Front-End Best Practices](https://thirdandgrove.atlassian.net/wiki/display/TAGCo/Front+End+Best+Practices)

### SVG

- SVGs should be inlined in templates when possible. If using Twig you can use source like `{{ source('/themes/custom/[theme name]/dist/images/svg/'my-svg.svg', ignore_missing = true) }}`. Make sure you include `ignore_missing` so that the site doesn't bomb out.

### Stylelint

This project uses Stylelint to make CSS consistent. If you are using VSCode you'll want to add this block to your settings.json:

```
  "css.validate": false,
  "scss.validate": false,
  "stylelint.snippet": [
    "css",
    "less",
    "postcss",
    "scss"
  ],
  "stylelint.validate": [
    "css",
    "less",
    "postcss",
    "scss"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  }
```
This disables the built-in CSS/SCSS validation and sets up validation via Stylelint. It also fixes all of your SCSS formatting on save.

*Enabling format on save is strongly recommended.* CI integrations will run Stylelint checks, so your builds may fail if you are not meeting the Stylelint requirements.

### Critical CSS

Great for site speed. When modifying global style rebuild the critical css styles. Run `gulp critical-css` will get you there. The penthouse docs are a little light. You can output to .css, .php, .what-have-you.

### PostCSS Combine Media Queries

This plugin moves all media queries to end of the file, so it may introduce bugs if your CSS is not well structured. Please keep this in mind!

### Build

If you need run a quick build or would like one last sweep of tasks prior to a commit use `gulp build`. This will compile css, js, critical css and build a fresh set of styleguides.

## Helpful References:

- [SCSS basics](http://sass-lang.com/guide) and [full SCSS documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)
