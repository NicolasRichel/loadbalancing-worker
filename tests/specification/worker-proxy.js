// Worker Proxy

self.onmessage = (e) => {
  if (e.data.action === 'proxy-init') {
    let workerName = e.data.workerName;
    workerName = workerName.endsWith('.js') ? workerName : workerName+'.js';
    self.importScripts(`/workers/${workerName}`);

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
  }
};
