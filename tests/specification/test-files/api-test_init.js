import {
  assert,
  assertConfigEqual,
  assertStateEqual,
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
    description: 'should deactivate',
    testFunction: shouldDeactivate
  },
  {
    description: 'should return false if no endpoints are provided',
    testFunction: shouldBeFalseIfNoEndpoints
  },
  {
    description: 'should return false if load balancing script does not exist',
    testFunction: shouldBeFalseWhenScriptNotExist
  },
  {
    description: 'should return false if load balancing function does not exist',
    testFunction: shouldBeFalseWhenFunctionNotExist
  }
];


function shouldInitializeConfig( worker ) {
  // --{ ACT }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['A', 'B', 'C'],
      loadBalancingScript: '/specification/loadbalancing-test.js',
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
      return result;
    })
  );
}


function shouldUpdateConfig( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'set-config',
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
      loadBalancingScript: '/specification/loadbalancing-test.js',
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
          loadBalancingScript: '/specification/loadbalancing-test.js',
          interval: 1500
        }
      );
      return result;
    })
  );
}


function shouldDeactivate( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'set-config',
    config: {
      endpoints: ['A', 'B', 'C'],
      loadBalancingScript: '/specification/loadbalancing-test.js'
    }
  });
  worker.postMessage({
    action: 'set-state',
    state: {
      isActive: true
    }
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
      return result;
    })
  );
}


function shouldBeFalseIfNoEndpoints() {
  return Promise.resolve({
    success: false,
    message: 'test not implemented'
  });
}


function shouldBeFalseWhenScriptNotExist( worker ) {
  // --{ ACT }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: [],
      loadBalancingScript: 'unknown-script.js',
    },
    assert: true
  });

  return prepareAssertion( worker ).then(
    ({ response, data }) => executeAssertionBlock(() => {
      // --{ ASSERT }--
      return assert( !response, 'expect "response" to be false' );
    })
  );
}


function shouldBeFalseWhenFunctionNotExist() {
  return Promise.resolve({
    success: false,
    message: 'test not implemented'
  });
}
