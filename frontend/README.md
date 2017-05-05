# Installing

Install dependencies

```
npm i
```

Install gulp globally.

```
npm install -g gulp
```

# Running

Watch files in src/ to rebuild build/axon.js and build/axon.min.js.

```
gulp
```

Simultaneously run the server:

```
npm start
```

Now go to [http://localhost:3001/](http://localhost:3001/).

# Notes

We use HTML5 mode URL's, mainly so that links to things like profiles look normal.

We're attempting to match John Papa's [styleguide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md), it's one of the most widely used standards for Angular 1.*. This also means we're using ES5 (no ES6 features like classes, let/const etc.).

Before you write something, look at the styleguide and make sure what you do matches with it.
