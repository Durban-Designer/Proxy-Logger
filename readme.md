# Proxy-Logger

A proxy based logger for utility classes in node.js!

## Features

- Automatically log all preconditions, postconditions, and changes to class state by wrapping the class in a Proxy Logger.
- All logs are written to markdown so they are clean to review, just right click and Markdown Preview in Atom.
- No more filling functions with more logs than functional code, classes are automatically logged!

## Installing

Using npm:

```bash
$ npm install proxy-logger
```

Using yarn:

```bash
$ yarn add proxy-logger
```

## Example

### Instantiating the Proxy Logger

##### App.js

```

const ProxyLogger = require('proxy-logger');

const copywrite = `Copyright 2019 Durban-Designer : Royce Birnbaum

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in the
Software without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.`;

const name = `Proxy Logger`;

const location = './logs';

const testLog = {
  class: 'test',
  message: 'testLog is added manually by the addLog test',
  data: [
    {
      object: 'test',
      test: []
    }
  ]
};

const test = require('./TestClass.js');

ProxyLogger.init(copywrite, name, location);

test.testA();
test.testB();

ProxyLogger.addLog(testLog);

process.exit();

```

  - note if you don't specify copywrite it will be as above

  - note if you don't specify name it will be as above

  - note if you don't specify location it will default to ./logs

  - WARNING if you don't call ProxyLogger.init() the exit listener wont trigger and logs wont write!

### Wrapping a utility class

##### TestClass.js

```
const ProxyLogger = require('proxy-logger');

class TestClass {
  constructor () {
    this.a = null;
    this.b = null;
  }

  testA () {
    this.a = 1;
  }

  testB () {
    this.b = 2;
  }
}

module.exports = ProxyLogger.wrap(new TestClass());
```

### Writing the log

  - logs are automatically written when the application closes.

### Manually adding a log

```
const ProxyLogger = require('proxy-logger');

ProxyLogger.addLog({
  class: 'class name',
  message: 'a string with a message to log',
  data: {
    key1: value1,
    key2: value2,
    keyn: valuen
  }
})
```

  - Class can be any string
  - Message can be any string
  - data can be any JSON object or Array

### Testing

```
$ npm install --dev

$ npm install -g mocha

$ npm test
```

## Resources

* [Discord](https://discord.gg/fwYDu5J)

## Credits

* [Soorena](https://stackoverflow.com/users/5284370/soorena)
  - inspired by your stack overflow post on proxying class methods
* [Grapetoast](https://github.com/Grapetoast)
  - Thanks for pushing me to improve logging beyond a manual implimentation.

## License

MIT

## Example Log

Copyright 2019 Durban-Designer : Royce Birnbaum

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in the
Software without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
## Begin logs at time Jun-16th-2019 09:59:25
##### TestClass - 0.018s runtime
```
Calling Method: testA,
Target class: TestClass
```

##### TestClass - 0.02s runtime
```
Pre Condition
Data:
{
    "a": null,
    "b": null
}
```

##### TestClass - 0.02s runtime
```
Begin set state operation
```

##### TestClass - 0.02s runtime
```
Key to update: a,
Old Value: null,
New Value: 1
```

##### TestClass - 0.02s runtime
```
Post Condition
Data:
{
    "a": 1,
    "b": null
}
```

##### TestClass - 0.02s runtime
```
Calling Method: testB,
Target class: TestClass
```

##### TestClass - 0.02s runtime
```
Pre Condition
Data:
{
    "a": 1,
    "b": null
}
```

##### TestClass - 0.02s runtime
```
Begin set state operation
```

##### TestClass - 0.02s runtime
```
Key to update: b,
Old Value: null,
New Value: 2
```

##### TestClass - 0.02s runtime
```
Post Condition
Data:
{
    "a": 1,
    "b": 2
}
```

##### test - 0.026s runtime
```
testLog is added manually by the addLog test
Data:
{
    "object": "test",
    "test": []
}
```

## Total Runtime 0.028 seconds
