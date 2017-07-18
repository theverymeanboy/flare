# flare
CLI utility for dynamically updating Amazon Route 53 DNS with a computer's public IP.

Getting Started
------------

Download the latest build for your platform below:
 * [macos](href="https://github.com/theverymeanboy/flare/raw/master/bin/flare-macos")
 * [linux](href="https://github.com/theverymeanboy/flare/raw/master/bin/flare-linux")
 * [windows](href="https://github.com/theverymeanboy/flare/raw/master/bin/flare-win.exe")

Usage
-----

From the command line, run:

```bash
$ ./flare --accessKeyId=#### --secretAccessKey=#### --list=#### --interval=####
```

#### Parameters

| Parameter         | Description                               | Example                                  | Notes                                                          |
|-------------------|-------------------------------------------|------------------------------------------|----------------------------------------------------------------|
| accessKeyId     | 20-digit Amazon AWS IAM user access id    | ####                                     | *User must have access to read and update zones and records*   |
| secretAccessKey | 20-digit Amazon AWS IAM user secret key   | ####                                     | *See above*                                                    |
| list            | Comma-delimited list of domains to update | .tvmb.io,blog.joemakesstuff.com          | *For root A records, include a single dot at the start*        |
| interval        | Interval between syncs in minutes         | 60 *(Runs once an hour)*                 | *Must be a number*                                             |


License
-------

(The MIT License)

Copyright (c) 2017 Joe Cruz &lt;joecruz.tvmb@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.