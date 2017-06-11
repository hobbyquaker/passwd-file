# passwd-file

[![npm version](https://badge.fury.io/js/passwd-file.svg)](https://badge.fury.io/js/passwd-file) 
[![Dependency Status](https://img.shields.io/gemnasium/hobbyquaker/passwd-file.svg?maxAge=2592000)](https://gemnasium.com/github.com/hobbyquaker/passwd-file)
[![Coverage Status](https://coveralls.io/repos/github/hobbyquaker/passwd-file/badge.svg?branch=master)](https://coveralls.io/github/hobbyquaker/passwd-file?branch=master)
[![Build Status](https://travis-ci.org/hobbyquaker/passwd-file.svg?branch=master)](https://travis-ci.org/hobbyquaker/passwd-file)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat
[mit-url]: LICENSE

> Password File CLI Tool and Lib :closed_lock_with_key:


# CLI Tool

`npm install -g passwd-file`


## Usage

```
usage passwd-file [-c | -t | -D] passwordfile username
      passwd-file -b [-c | -t] passwordfile username password

Options:
  -c, --create  create a new password file. This will overwrite existing files.
                                                                       [boolean]
  -b, --batch   run in batch mode to allow passing passwords on the command
                line.                                                  [boolean]
  -D, --delete  delete the username rather than adding/updating its password.
                                                                       [boolean]
  -t, --test    test mode. verify a users password.                    [boolean]
  --version     Show version number                                    [boolean]
  --help        Show help                                              [boolean]

```


# Lib

`npm install passwd-file`


## Usage

```javascript
const passwd = require('passwd-file')('/path/to/passwordfile')

passwd.verify('user', 'password', (err, res) => {
    if (!err && res) {
        console.log('Password is correct!');
    } 
});

```


## License

The MIT License (MIT)

Copyright (c) 2017 Sebastian Raff <hq@ccu.io> https://github.com/hobbyquaker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
