import {
  prepareAssertion,
  assertConfigEqual,
  assertStateEqual,
  assertActionCalls
} from '../test-utils.js';


export const run = {
  shouldInitializeConfig: shouldInitializeConfig,
  shouldUpdateConfig: shouldUpdateConfig,
  shouldStopLoadBalancingLoop: shouldStopLoadBalancingLoop
};


function shouldInitializeConfig( worker ) {
  // --{ ARRANGE }--
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
      return {
        message: '',
        success: value
      };
    }
  );
}


function shouldUpdateConfig( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['A', 'B', 'C'],
      loadBalancingScript: '/specification/loadbalancing-test.js'
    }
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
          interval: 1500
        }
      );
      return result;
    }
  );

  // --{ ACT }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['X', 'Y', 'Z'],
      loadBalancingScript: '/specification/loadbalancing-test.js',
      interval: 1500
    }
  });

  return resultPromise.then(
    value => {
      return {
        message: '',
        success: value
      };
    }
  );
}


function shouldStopLoadBalancingLoop( worker ) {
  // --{ ARRANGE }--
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
      result = result && !data.wState.isActive
      return result;
    }
  );

  // --{ ACT }--
  worker.postMessage({
    action: 'init',
    config: {}
  });

  return resultPromise.then(
    value => {
      return {
        message: '',
        success: value
      };
    }
  );
}
