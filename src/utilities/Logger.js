/*
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
*/
const moment = require('moment');
const fs = require('fs');
const mkdirp = require('mkdirp');

const initTime = moment();
const prettyInitTime = moment().format('MMM-Do-YYYY HH:mm:ss');
const newline = `\n`;
const markup = '```';

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

const timeFromStart = (time) => {
  return moment.duration(time.diff(initTime)).asSeconds();
}

class Logger {
  constructor () {
    this.state = {
      name: 'Test',
      copywrite: copywrite,
      logs: []
    }
  }

  init (copywrite, name) {
    if (!name) {
      name = 'Proxy Logger'
    }
    if (!copywrite) {
      copywrite = copywrite;
    }
    this.state = {
      name: name,
      copywrite: copywrite,
      logs: []
    }
  }

  addLog (log) {
    log.time = timeFromStart(moment());
    this.state.logs.push(log);
  }

  end (location) {
    return new Promise((resolve, reject) => {
      var file = ``;
      file += this.state.copywrite;
      file += newline;
      file += `## Begin logs at time ${prettyInitTime}`;
      this.state.logs.forEach(log => {
        file += newline;
        file += `##### ${log.class} - ${log.time}s runtime`;
        file += newline;
        file += markup;
        file += newline;
        file += log.message;
        file += newline;
        if (log.data && log.data.length !== 0) {
          file += `Data:`
          file += newline;
          log.data.forEach(object => {
            file += JSON.stringify(object, null, 4);
          })
          file += newline;
        }
        file += markup;
        file += newline;
      })
      file += newline;
      file += `## Total Runtime ${timeFromStart(moment())} seconds`;
      file += newline;
      mkdirp.sync(location);
      fs.writeFileSync(location + `/log_${prettyInitTime}.md`, file);
      resolve();
    });
  }
}

module.exports = new Logger();
