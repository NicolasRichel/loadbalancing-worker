import {
  prepareAssertion,
  assertConfigEqual,
  assertStateEqual,
  assertActionCalls
} from '../test-utils.js';


export const run = {
  shouldInitializeConfig: shouldInitializeConfig,
  shouldStopLoadBalancingLoop: shouldStopLoadBalancingLoop
};


function shouldInitializeConfig() {

  // --{ ARRANGE }--
  const worker = new Worker('/specification/worker-proxy.js');

  const resultPromise = prepareAssertion(
    worker,
    (response, data) => {

      // --{ ASSERT }--
      let result = true;
      result = result && response;
      result = result && assertConfigEqual(
        data.wConfig,
        {
          endpoints: ['A', 'B', 'C'],
          loadBalancingScript: '/specification/loadbalancing-test.js',
          interval: 2000
        }
      );
      result = result && assertStateEqual(
        data.wState,
        {
          isActive: false,
          targetEndpoint: '',
          loadBalancingLoopID: -1
        }
      );
      result = result && assertActionCalls(
        data.actionCalls,
        ['initializeWorker', 'stopLoadBalancingLoop']
      );
      return result;

    }
  );

  // --{ ACT }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['A', 'B', 'C'],
      loadBalancingScript: '/specification/loadbalancing-test.js',
      interval: 2000
    }
  });

  return resultPromise.then(
    value => {
      worker.terminate();
      return {
        message: '',
        success: value
      };
    }
  );
}


function shouldStopLoadBalancingLoop() {
  
  // --{ ARRANGE }--
  const worker = new Worker('/specification/worker-proxy.js');

  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['A', 'B', 'C'],
      loadBalancingScript: '/specification/loadbalancing-test.js'
    }
  });

  worker.postMessage({
    action: 'start'
  });

  const resultPromise = prepareAssertion(
    worker,
    (response, data) => {

      // --{ ASSERT }--
      let result = true;
      result = result && response;
      result = result && assertConfigEqual(
        data.wConfig,
        {
          endpoints: ['X', 'Y', 'Z'],
          loadBalancingScript: '/specification/loadbalancing-test.js',
          interval: 5000
        }
      );
      result = result && !data.wState.isActive
      return result;

    }
  );

  // --{ ACT }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['X', 'Y', 'Z']
    }
  });

  return resultPromise.then(
    value => {
      worker.terminate();
      return {
        message: '',
        success: value
      };
    }
  );
}
