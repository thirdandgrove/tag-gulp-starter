TAG SCSS Starter w/ Gulp
========================

## To Get Started:

1. If they aren't already, make sure that node and npm (Node Package Manager) are [installed](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm). If you are using a Mac, Homebrew is recommended for this.
2. If this is your first time ever using gulp, you will need to install it globally by running `npm install -g gulp` so that the terminal recognizes gulp commands.
3. The first time running this particular project, `cd` into this directory and type `npm install`
4. To continually watch .scss and .js files for changes, type `gulp` and use `ctrl + C` to stop.
5. To run a one-time compilation of .scss files, type `gulp scss`

## Guidelines:

* In general, all units should use the `px-to-rem()` described in scss/base/_functions.scss
* With rare case-by-case exceptions, bitmap sprites should never be used.
* For multi-color illustrations for which a bitmap sprite might often be used, use an SVG sprite instead if at all possible.
* Do not nest your CSS selectors. While SCSS provides this functionality, it can easily get out of control creating hard-to-read code and unwieldy selectors.
* All styling should be done mobile-first. This repo contains a mixin for the `min-width` media query only, which in the vast majority of cases should be all you need.
* When in doubt, break your code out into its own partial. You can add partials by first creating the partial and then importing it from _components.scss, _base.scss, _layout.scss, or _global.scss. In the majority of cases, it will belong in components. Do not put partials outside of these folders.

### Generating Icons
* Add your icons to `images/svg/` and run the `gulp icons` task.
  This will optimize your SVGs and create an icon font with scss partial. 

## Helpful References:
* [SCSS basics](http://sass-lang.com/guide) and [full SCSS documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)
* [Icomoon documentation](https://icomoon.io/#docs)

## Frequently Used JS Libraries:
* [Owl carousel](http://www.owlcarousel.owlgraphic.com/) and its [documentation](http://www.owlcarousel.owlgraphic.com/docs/api-options.html)
* [MatchHeight](https://github.com/liabru/jquery-match-height)
