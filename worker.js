/**
 * Load Balancing Worker
 * =====================
 */

// Initial state of the worker
// (Default values)
let state = {
  servers: [],
  mostAvailableServer: '',
  loadBalancingFunction: '',
  loadBalancingLoopID: null,
  interval: 5000,
  isActive: false
};

// Actions the worker is able to perform
const actions = {
  initializeWorker(config) {
    try {
      actions.stopLoadBalancingLoop();
      Object.assign(state, config);
      self.importScript( state.loadBalancingFunction );
      return true;
    } catch (err) {
      return false;
    }
  },
  startLoadBalancingLoop() {
    if (!state.isActive) {
      state.loadBalancingLoopID = setInterval(
        () => loadBalancing( state.servers ).then(server => state.mostAvailableServer = server),
        state.interval
      );
      state.isActive = true;
      return true;
    }
    return false;
  },
  stopLoadBalancingLoop() {
    clearInterval( state.loadBalancingLoopID );
    state.isActive = false;
    return true;
  },
  destroyWorker() {
    actions.stopLoadBalancingLoop();
    self.close();
  },
  getServer() {
    if (state.isActive) return state.mostAvailableServer;
    return null;
  },
  isActive() {
    return state.isActive;
  }
};

self.onmessage = (e) => {
  let response = null;
  switch (e.data.msg) {
    case 'init':
      response = actions.initializeWorker(e.data.config); break;
    case 'start':
      response = actions.startLoadBalancingLoop(); break;
    case 'stop':
      response = actions.stopLoadBalancingLoop(); break;
    case 'destroy':
      actions.destroyWorker(); break;
    case 'get-server':
      response = actions.getServer(); break;
    case 'is-active?':
      response = actions.isActive(); break;
  }
  self.postMessage( response );
};
