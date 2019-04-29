// Worker Proxy

self.importScripts('/workers/worker.js');

let actionCalls = [];
Object.keys(actions).forEach(
  action => {
    const workerAction = actions[action];
    const proxyAction = (...args) => {
      actionCalls.push({
        action: action,
        args: args
      });
      return workerAction(...args);
    };
    actions[action] = proxyAction;
  }
);

const handleMessage = self.onmessage;
self.onmessage = (e) => {
  actionCalls = [];
  handleMessage(e);
  self.postMessage({
    type: 'proxy-data',
    wConfig: wConfig,
    wState: wState,
    actionCalls: actionCalls
  });
}
