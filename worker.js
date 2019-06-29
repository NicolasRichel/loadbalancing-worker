// =====================
// Load Balancing Worker
// =====================


// Initial configuration of the worker
let wConfig = {
  endpoints: [],
  loadBalancingScript: '',
  interval: 5000
};

// Initial state of the worker
let wState = {
  isActive: false,
  targetEndpoint: '',
  loadBalancingLoopID: -1,
};

// Worker Actions
const actions = {
  initializeWorker(config) {
    try {
      actions.stopLoadBalancingLoop();
      Object.assign(wConfig, config);
      self.importScripts( wConfig.loadBalancingScript );
      return true;
    } catch (err) {
      return false;
    }
  },
  startLoadBalancingLoop() {
    if (!wState.isActive) {
      wState.loadBalancingLoopID = setInterval(
        () => loadBalancing( wConfig.endpoints ).then(endpoint => wState.targetEndpoint = endpoint),
        wConfig.interval
      );
      wState.isActive = true;
      return true;
    }
    return false;
  },
  getEndpoint() {
    return wState.isActive ? wState.targetEndpoint : null;
  },
  isActive() {
    return wState.isActive;
  },
  stopLoadBalancingLoop() {
    if (wState.isActive) {
      clearInterval( wState.loadBalancingLoopID );
      wState.loadBalancingLoopID = -1;
      wState.isActive = false;
      return true;
    }
    return false;
  },
  destroyWorker() {
    actions.stopLoadBalancingLoop();
    self.close();
  }
};


self.onmessage = (e) => {
  let response = null;
  switch (e.data.action) {
    case 'init':
      response = actions.initializeWorker(e.data.config); break;
    case 'start':
      response = actions.startLoadBalancingLoop(); break;
    case 'get-endpoint':
      response = actions.getEndpoint(); break;
    case 'is-active?':
      response = actions.isActive(); break;
    case 'stop':
      response = actions.stopLoadBalancingLoop(); break;
    case 'destroy':
      actions.destroyWorker(); break;
  }
  self.postMessage( response );
};
