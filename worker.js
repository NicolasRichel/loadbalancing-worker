/**
 * Load Balancing Worker
 * =====================
 */

// Initial configuration of the worker
let wConfig = {
  endpoints: [],
  loadBalaningScript: '',
  interval: 5000
};

// Initial state of the worker
let wState = {
  isActive: false,
  targetEndpoint: '',
  loadBalancingLoopID: null,
};

// Worker Actions
const actions = {
  initializeWorker(config) {
    try {
      actions.stopLoadBalancingLoop();
      Object.assign(wConfig, config);
      self.importScripts( state.loadBalancingScript );
      return true;
    } catch (err) {
      return false;
    }
  },
  startLoadBalancingLoop() {
    if (!state.isActive) {
      state.loadBalancingLoopID = setInterval(
        () => loadBalancing( wConfig.endpoints ).then(server => state.targetEndpoint = server),
        wConfig.interval
      );
      state.isActive = true;
      return true;
    }
    return false;
  },
  getEndpoint() {
    if (state.isActive) return state.targetEndpoint;
    return null;
  },
  isActive() {
    return state.isActive;
  },
  stopLoadBalancingLoop() {
    if (wState.isActive) {
      clearInterval( wState.loadBalancingLoopID );
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
