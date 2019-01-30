/**
 * Load Balancing Worker
 * =====================
 */

// Initial state of the worker
let state = {
  servers: [],
  loadAlgo: '',
  balancingAlgo: '',
  loadBalancingLoopID: null,
  interval: 5000,
  timeout: 2000,
  isActive: false
};

// Actions the worker is able to perform
const actions = {
  startLoadBalancingLoop(config) {
    Object.assign(state, config);
    state.loadBalancingLoopID = setInterval(
      () => {
        state.servers = loadBalancing(
          state.servers,
          state.loadAlgo,
          state.balancingAlgo,
          state.timeout
        );
      }
    , state.interval);
    state.isActive = true;
    return true;
  },
  stopLoadBalancingLoop() {
    clearInterval( state.loadBalancingLoopID );
    state.isActive = false;
    return true;
  },
  destroyWorker() {
    state.isActive && actions.stopLoadBalancingLoop();
    self.close();
    return;
  },
  getServer() {
    return state.servers[0];
  }
};

self.onmessage = (e) => {
  switch (e.data.msg) {
    case 'start':
      actions.startLoadBalancingLoop(e.data.config); break;
    case 'stop':
      actions.stopLoadBalancingLoop(); break;
    case 'destroy':
      actions.destroyWorker(); break;
    case 'get-server':
      actions.getServer(); break;
  }
};


function loadBalancing(servers, loadAlgo, balancingAlgo, timeout) {
  Promise.all(
    servers.map( server => getLoad(server, loadAlgo, timeout) )
  )
  .then(loads => {
    return balance(loads, balancingAlgo);
  })
  .catch(err => {
    return servers;
  });
}

function getLoad(server, loadAlgo, timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('timeout'), timeout);
    fetch(`${server}/load-ping?algorithm=${loadAlgo}`)
      .then(res => {
        return res.json();
      })
      .then(load => {
        resolve({
          server: server,
          load: load.value,
          error: null
        });
      });
  })
  .catch(err => {
    return {
      server: server,
      load: +Infinity,
      error: err
    };
  });
}

function balance(loads, balancingAlgo) {
  return loads
    .sort( (x, y) => x.load-y.load )
    .map( x => x.server );
}
