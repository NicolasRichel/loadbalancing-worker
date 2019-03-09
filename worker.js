/**
 * Load Balancing Worker
 * =====================
 */

// Initial state of the worker (Default values)
let state = {
  servers: [],
  targetServer: '',
  loadBalancingFunction: '',
  loadBalancingLoopID: null,
  interval: 5000,
  isActive: false
};

// Worker Actions
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
        () => loadBalancing( state.servers ).then(server => state.targetServer = server),
        state.interval
      );
      state.isActive = true;
      return true;
    }
    return false;
  },
  getServer() {
    if (state.isActive) return state.targetServer;
    return null;
  },
  isActive() {
    return state.isActive;
  },
  stopLoadBalancingLoop() {
    clearInterval( state.loadBalancingLoopID );
    state.isActive = false;
    return true;
  },
  destroyWorker() {
    actions.stopLoadBalancingLoop();
    self.close();
  }
};


self.onmessage = (e) => {
  let response = null;
  switch (e.data.msg) {
    case 'init':
      response = actions.initializeWorker(e.data.config); break;
    case 'start':
      response = actions.startLoadBalancingLoop(); break;
    case 'get-server':
      response = actions.getServer(); break;
    case 'is-active?':
      response = actions.isActive(); break;
    case 'stop':
      response = actions.stopLoadBalancingLoop(); break;
    case 'destroy':
      actions.destroyWorker();
  }
  self.postMessage( response );
};
