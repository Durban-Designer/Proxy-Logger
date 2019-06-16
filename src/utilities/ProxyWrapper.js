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
const Logger = require('./Logger');
class ProxyWrapper {
  constructor () {
    this.state = {
      object: null,
      targetName: null,
      methodName: null,
      receiver: null
    }
  }

  setState (newState) {
    this.state = {
      object: newState.object || this.state.object,
      targetName: newState.targetName || this.state.targetName,
      methodName: newState.methodName || this.state.methodName,
      receiver: newState.receiver || this.state.receiver
    }
  }

  init (copywrite, name, location) {
    process.stdin.resume();
    const exitHandler = (options, exitCode) => {
      if (!location) {
        location = `./logs`;
      }
      Logger.end(location)
        .then(() => {
          process.exit();
        })
        .catch(err => {
          reject(err);
        })
    }
    process.on('exit', exitHandler.bind(null,{cleanup:true}));
    process.on('SIGINT', exitHandler.bind(null, {exit:true}));
    process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
    process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
    process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
    Logger.init(copywrite, name);
  }

  addLog (log) {
    Logger.addLog(log);
  }

  wrap (object) {
    const node = this;
    return new Proxy(object, {
      get: (target, name, receiver) => {
        let keys = Object.keys(target);
        let obj = {};
        keys.forEach(key => {
          obj[key] = target[key];
        })
        node.setState({
          object: obj,
          targetName: target.constructor.name,
          methodName: name,
          receiver: receiver
        })
        if (!target.hasOwnProperty(name)) {
          if (typeof target[name] === "function") {
            Logger.addLog({ message: `Calling Method: ${name},\nTarget class: ${node.state.targetName}`, class: node.state.targetName });
            Logger.addLog({ message: `Pre Condition`, data: [obj], class: node.state.targetName });
          }
          return new Proxy(target[name], this);
        }
        return Reflect.get(target, name, receiver);
      },
      set: (target, prop, val) => {
        target[prop] = val;
        let keys = Object.keys(target);
        let obj = {};
        keys.forEach(key => {
          obj[key] = target[key];
        })
        Logger.addLog({ message: `Begin set state operation`, class: node.state.targetName })
        Logger.addLog({ message: `Key to update: ${prop},\nOld Value: ${node.state.object[prop]},\nNew Value: ${val}`, class: node.state.targetName });
        Logger.addLog({ message: `Post Condition`, data: [obj], class: node.state.targetName });
        return true;
      }
    });
  };
}

module.exports = new ProxyWrapper();
