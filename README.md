# uidRanger

A library for parsing IMAP UID ranges.

## Usage

```js
var uidRanger = require('uid-ranger');
var range = uidRanger.parse('5694:5696,5712,5715:5717');

expect(range.toString(), 'to equal', '5694:5696,5712,5715:5717');
expect(range.toArray(), 'to equal', [5694, 5695, 5696, 5712, 5715, 5716, 5717]);
expect(range.length(), 'to equal', 7);
expect(range.get(1), 'to equal', 5694);
expect(range.get(3), 'to equal', 5712);
```

### Node

Install it with NPM or add it to your `package.json`:

```
$ npm install uidRanger
```

Then:

```js
var uidRanger = require('uid-ranger');
```

### Browser

Include `uidRanger.js`.

```html
<script src="uidRanger.js"></script>
```

this will expose the expect function under the following namespace:

```js
var uidRanger = one.uidRanger;
```

### RequireJS

Include the library with RequireJS the following way:

```js
require.config({
    paths: {
        uidRanger: 'path/to/uidRanger'
    }
});

define(['uidRanger'], function (uidRanger) {
   // Your code
});
```
