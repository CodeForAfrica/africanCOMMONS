AfricanCOMMONS
--------------

_A platform to showcase re-useable tools built across Africa and the people & organizations building them. Accessible at https://africancommons.net/_

Why is everyone reinventing the wheel? Massive amounts of money and time are being wasted on rebuilding solutions for digital democracies and open data. africanCOMMONS showcases carefully selected best-of-breed open source civic technologies that have already been ‘battle tested’ elsewhere, for possible re-use in countries across the continent.

africanCOMMONS is a carefully curated collection of the world’s best open source software for civic technologies, compatible with our environment, along with a tactical CivicPatterns ‘playbook’ to help digital activists save time, money, and effort. The collection is designed to help citizens, organizations, and governments re-use both code and data for their own projects, free-of-charge, in the most cost-effective way possible to ensure that the bulk of their project budgets are reserved for actual civic engagement rather than technology.


## Installation

### Requirements

To run this site you need:

- Jekyll https://jekyllrb.com/
- Yarn

To install the yarn requirements;

```sh
yarn install
```

### Development

From inside the root directory;

1. Serve using Jekyll;
```sh
$ jekyll s
```

2. On a separate terminal window, watch for JS/CSS changes using Webpack;
```sh
$ yarn run watch
```

<!-- TODO: Figure out live-reloading -->


### Data Update/Import

To update the projects:

```sh
$ curl -L "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4gM-ByCoxuTAlX4qtRHn05IfPgjBB_pPk6aGfjkRFhYl_IFx9__s9NUfxJKnj3HvtkIWhBvoMLLei/pub?gid=0&single=true&output=csv" > src/_data/projects.csv
```

## Contributing

TODO

---

### License

The MIT License (MIT)

Copyright (c) 2017 Code for Africa.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
