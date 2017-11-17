TAG SCSS Starter w/ Gulp
========================

## To Get Started:

1. If they aren't already, make sure that node and npm (Node Package Manager) are [installed](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm). If you are using a Mac, Homebrew is recommended for this.
2. If this is your first time ever using gulp, you will need to install it globally by running `npm install -g gulp` so that the terminal recognizes gulp commands.
3. The first time running this particular project, `cd` into this directory and type `npm install`
4. To continually watch .scss and .js files for changes, type `gulp` and use `ctrl + C` to stop.
5. To run a one-time compilation of .scss files, type `gulp scss`

*Note:* You'll need the [livereload browser extension](http://livereload.com/extensions/) to automatically refresh on changes.

## Guidelines:

* In general, all units should use the `px-to-rem()` described in scss/base/_functions.scss
* With rare case-by-case exceptions, bitmap sprites should never be used.
* For multi-color illustrations for which a bitmap sprite might often be used, use an SVG sprite instead if at all possible.
* Do not nest your CSS selectors, except for states (:hover, etc.), pseudoelements(:before, :after), or pseudo-selectors (:nth-child, etc.). While SCSS provides this functionality, it can easily get out of control creating hard-to-read code and unwieldy selectors.
* All styling should be done mobile-first. This repo contains a mixin for the `min-width` media query only, which in the vast majority of cases should be all you need.
* When in doubt, break your code out into its own partial. You can add partials by first creating the partial and then importing it from _components.scss, _base.scss, _layout.scss, or _global.scss. In the majority of cases, it will belong in components. Do not put partials outside of these folders.
* [View the full TAG Front-End Best Practices](https://thirdandgrove.atlassian.net/wiki/display/TAGCo/Front+End+Best+Practices)

## Grid:

* We have Susy 3 included in this repo. You can customize it as needed. See the documentation at [http://oddbird.net/susy/docs](http://oddbird.net/susy/docs)
* Unfortunately, Susy doesn't seem to want to play nicely with the sourcemaps, so we've commented them out of the gulpfile for the time being. If you're not using Susy, feel free to uncomment them.

### Generating Icons
* Add your icons to `images/svg/` and run the `gulp icons` task.
  This will optimize your SVGs and create an icon font with scss partial.
* Tip: If your icons seem tiny or invisible despite normal font sizes, make sure that none of the svg files have `width="100%"` and/or `height="100%"` on the `<svg>` tag.

## Helpful References:
* [SCSS basics](http://sass-lang.com/guide) and [full SCSS documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)

## Frequently Used JS Libraries:
* [Owl carousel](http://www.owlcarousel.owlgraphic.com/) and its [documentation](http://www.owlcarousel.owlgraphic.com/docs/api-options.html)
