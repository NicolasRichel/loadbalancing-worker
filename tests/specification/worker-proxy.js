// Worker Proxy

let actionCalls;

self.onmessage = (e) => {
  if (e.data.action === 'proxy-init') {
    self.importScripts(`/workers/${e.data.workerFile}`);
    setupActionWrapper();
    setupMessageHandler();
  }
};


function setupActionWrapper() {
  actionCalls = [];
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
}

function setupMessageHandler() {
  const handleMessage = self.onmessage;
  self.onmessage = (e) => {
    actionCalls = [];
    switch (e.data.action) {
      case 'set-config':
        Object.assign(wConfig, e.data.config); break;
      case 'set-state':
        Object.assign(wState, e.data.state); break;
      default:
        handleMessage(e);
    }
    if (e.data.assert) {
      self.postMessage({
        type: 'proxy-data',
        wConfig: wConfig,
        wState: wState,
        actionCalls: actionCalls
      });
    }
  }
}
