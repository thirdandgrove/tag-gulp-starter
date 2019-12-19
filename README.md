# TAG SCSS Starter w/ Gulp

## To Get Started:

1. If they aren't already, make sure that node and npm (Node Package Manager) are [installed](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm). If you are using a Mac, Homebrew is recommended for this.
2. If this is your first time ever using gulp, you will need to install it globally by running `npm install -g gulp` so that the terminal recognizes gulp commands.
3. The first time running this particular project, `cd` into this directory and type `npm install`.
4. You'll also need to change the `localDev` variable in gulpfile.js to point to your local site URL.
5. To continually watch .scss and .js files for changes, type `gulp` and use `ctrl + C` to stop.
6. To run a one-time compilation of .scss files, use `gulp scss`. To generate KSS styleguides use `gulp kss`.

## Guidelines:

- In general, all units should use the `px-to-rem()` described in `/functions/_px-to-rem.scss`
- With rare case-by-case exceptions, bitmap sprites should never be used.
- For multi-color illustrations for which a bitmap sprite might often be used, use an SVG sprite instead if at all possible.
- Do not nest your CSS selectors, except for states `(:hover, etc.)`, pseudoelements `(:before, :after)`, or pseudo-selectors `(:nth-child, etc.)`. While SCSS provides this functionality, it can easily get out of control creating hard-to-read code and unwieldy selectors.
- All styling should be done mobile-first. This repo contains a mixin for the `min-width` media query only, which in the vast majority of cases should be all you need.
- When in doubt, break your code out into its own partial in appropriately named folders.
- [View the full TAG Front-End Best Practices](https://thirdandgrove.atlassian.net/wiki/display/TAGCo/Front+End+Best+Practices)

### Generating Icons

- Add your icons to `src/images/icons/` and run the `gulp icons` task.
  This will optimize your SVGs and create an icon font with scss partial.
- Tip: If your icons seem tiny or invisible despite normal font sizes, make sure that none of the svg files have `width="100%"` and/or `height="100%"` on the `<svg>` tag.
- Tip: You should optimize your SVG files using a tool like [ImageOptim](https://imageoptim.com/mac)

### Sass-lint

Sass-lint accepts `YML` or `JSON` files. Config needs to be in project root unless you specify in `package.json`.

If you need to ignore a rule use: `// sass-lint:disable <rule>, <rule>` and include a reason.

[Docs here](https://github.com/sasstools/sass-lint/tree/develop/docs)

### KSS Styleguides

There is an option to build visual stylguides with KSS. If unfamiliar with the syntax see the docs.
[Docs here](https://github.com/kss-node/kss-node)

## Helpful References:

- [SCSS basics](http://sass-lang.com/guide) and [full SCSS documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)
