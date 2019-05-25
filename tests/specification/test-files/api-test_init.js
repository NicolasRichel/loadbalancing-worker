import {
  assert,
  assertConfigEqual,
  assertStateEqual,
  assertActionCalls,
  prepareAssertion,
  executeAssertionBlock
} from '../test-utils.js';


export const tests = [
  {
    description: 'should initialize worker configuration',
    testFunction: shouldInitializeConfig
  },
  {
    description: 'should update worker configuration',
    testFunction: shouldUpdateConfig
  },
  {
    description: 'should stop load balancing loop (if running)',
    testFunction: shouldStopLoadBalancingLoop
  }
];


function shouldInitializeConfig( worker ) {
  // --{ ACT }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['A', 'B', 'C'],
      loadBalancingScript: 'script.js',
      interval: 2000
    },
    assert: true
  });

  return prepareAssertion( worker ).then(
    ({ response, data }) => executeAssertionBlock(() => {
      // --{ ASSERT }--
      let result = assert(
        response, 'expect "response" to be true'
      );
      result = result && assertConfigEqual(
        data.wConfig,
        {
          endpoints: ['A', 'B', 'C'],
          loadBalancingScript: 'script.js',
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
        ['initializeWorker']
      );
      return result;
    })
  );
}


function shouldUpdateConfig( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['A', 'B', 'C'],
      loadBalancingScript: 'hello-world.js'
    }
  });

  // --{ ACT }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['X', 'Y', 'Z'],
      interval: 1500
    },
    assert: true
  });

  return prepareAssertion( worker ).then(
    ({ response, data }) => executeAssertionBlock(() => {
      // --{ ASSERT }--
      let result = assert(
        response, 'expect "response" to be true'
      );
      result = result && assertConfigEqual(
        data.wConfig,
        {
          endpoints: ['X', 'Y', 'Z'],
          loadBalancingScript: 'hello-world.js',
          interval: 1500
        }
      );
      return result;
    })
  );
}


function shouldStopLoadBalancingLoop( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['A', 'B', 'C'],
      loadBalancingScript: 'toto.js'
    }
  });
  worker.postMessage({
    action: 'start'
  });

  // --{ ACT }--
  worker.postMessage({
    action: 'init',
    config: {},
    assert: true
  });

  return prepareAssertion( worker ).then(
      ({ response, data }) => executeAssertionBlock(() => {
        // --{ ASSERT }--
        let result = assert(
          response, 'expect "response" to be true'
        );
        result = result && assert(
          !data.wState.isActive, 'expect "state.isActive" to be false'
        );
        result = result && assertActionCalls(
          data.actionCalls,
          ['stopLoadBalancingLoop']
        );
        return result;
      })
    );
}
