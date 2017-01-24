# ember-emojione

## Installation

With npm:

    ember install ember-emojione
    
With Yarn:

    yarn add -D ember-emojione

As of #24, the default blueprint (`ember g ember-emojione`) won't install the Bower dependency for some reason. You have to install it manually:

    bower install -S emojione-js=https://raw.githubusercontent.com/Ranks/emojione/v2.2.7/lib/js/emojione.js



## Configuration

`ember-emojione` relies on [emojione.js defaults](https://github.com/Ranks/emojione/blob/v2.2.7/lib/js/emojione.js#L150-L157).

To configure `ember-emojione` and override `emojione` options, add these options to your app's `config/environment.js`. Default values are shown:

```js
"ember-emojione": {

  // Used to skip certain portions of the input string.
  // Useful for Markdown code blocks. Apply after Markdown transformation.
  // Set to `false` to disable.
  regexToSkip: /<code[\s\S]*?>[\s\S]*?<\/code>/gm
  
  // EmojiOne library options
  emojione: {
    imagePathPNG:        'https://cdn.jsdelivr.net/emojione/assets/png/',
    imagePathSVG:        'https://cdn.jsdelivr.net/emojione/assets/svg/',
    imagePathSVGSprites: './../assets/sprites/emojione.sprites.svg',
    imageType:           'png', // or svg
    imageTitleTag:       true,  //set to false to remove title attribute from img tag
    sprites:             false, // if this is true then sprite markup will be used (if SVG image type is set then you must include the SVG sprite file locally)
    unicodeAlt:          true,  // use the unicode char as the alt attribute (makes copy and pasting the resulting text better)
    ascii:               false, // change to true to convert ascii smileys
  }
}
```

Configuration is optional.



## Usage

### `inject-emoji` helper

This helper is used to convert a string with emoji codes into a string of HTML with emoji images.

You must manually mark the input string as HTML-safe:

```js
{
  inputStr: Ember.String.htmlSafe("Hi! :sunglasses:")
}
```

By doing so you acknowledge responsibility that the input string will never contain malicious code. Neglecting this responsibility will make your app/website prone to XSS attacks.

Use triple curlies to inject HTML into your template:

```handlebars
<div>
  {{{inject-emoji inputStr}}}
</div>
```

Result:

```handlebars
<div>
  Hi! <img class="emojione" alt="😎" title=":sunglasses:" src="https://cdn.jsdelivr.net/emojione/assets/png/1f60e.png?v=2.2.7"/>
</div>
```



### Overriding options

You can override `ember-emojione` and `emojione.js` options for a single invocation of `inject-emoji`:

```hbs
<div>
  {{{inject-emoji inputStr (hash
    regexToSkip = false
    emojione = (hash
      imageType = 'svg'
      sprites   = true
    )
  )}}}
</div>
```



### Use from JS

You can use the `inject-emoji` helper in JS via the `injectEmoji` convenience function:

```js
import {htmlSafe} from 'ember-string';
import {injectEmoji} from 'ember-emojione/helpers/inject-emoji';

const inputSafeString  = htmlSafe(':D');
const options          = {regexToSkip: false, emojiOne: {ascii: true}};
const resultSafeString = injectEmoji(inputSafeString, options);
```


### Skipping code blocks

`inject-emoji` will ignore emoji located within portions of the input string that match given regular expression.

The regex can be configured via the `regexToSkip` option.

By default, the regex matches `<code>...</code>` elements.

To disable skipping, set `regexToSkip` to `false`.



## Development

### Installation

* `npm i -g yarn`
* `git clone <repository-url>` this repository
* `cd ember-emojione`
* `yarn install` :warning:
* `bower install`



### Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).



### Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`



### Do not use `npm` or `ember install`, use `yarn`

This project uses [Yarn](https://yarnpkg.com/) to lock dependencies. Install yarn with `npm i -g yarn`.

To install this addon's npm dependencies locally, do:

    yarn install

To install an Ember addon into this addon, do:

    yarn add -D <package-name>
    ember g <package-name>

An error message "no such blueprint" is expected in case the addon does not want to do boilerplate customizations.

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).