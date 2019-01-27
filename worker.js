/**
 * Load Balancing Worker
 */

state = {};

actions = {
  startLoadCheckingLoop(config) {
    return true;
  },
  stopLoadCheckingLoop() {
    return true;
  },
  destroyWorker() {
    return;
  },
  getServer() {
    return '';
  }
};

self.onmessage = (e) => {
  switch (e.data.msg) {
    case 'start':
      actions.startLoadCheckingLoop(e.data.config); break;
    case 'stop':
      actions.stopLoadCheckingLoop(); break;
    case 'destroy':
      actions.destroyWorker(); break;
    case 'get-server':
      actions.getServer(); break;
  }
};

self.onerror = (error) => {};
