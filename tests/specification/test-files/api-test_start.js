import {
  prepareAssertion, executeAssertionBlock, assert
} from '../test-utils.js';


export const tests = [
  {
    description: 'should activate if idle is idle',
    testFunction: shouldActivateWhenIdle
  },
  {
    description: 'should do nothing if worker is already active',
    testFunction: shouldDoNothingWhenActive
  }
];


function shouldActivateWhenIdle( worker ) {
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
    action: 'start',
    assert: true
  });

  return prepareAssertion( worker ).then(
    ({response, data}) => executeAssertionBlock(() => {
      // --{ ASSERT }--
      let result = assert(
        response, 'expect "response" to be true'
      );
      result = result &&  assert(
        data.wState.isActive, 'expect "state.isActive" to be true'
      );
      result = result && assert(
        data.wState.loadBalancingLoopID > 0, 'expect "state.loadBalancingLoopID" to be greater than 0'
      );
      return result;
    })
  );
};

function shouldDoNothingWhenActive( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['A', 'B', 'C'],
      loadBalancingScript: 'hello-world.js'
    }
  });
  worker.postMessage({
    action: 'start'
  });

  // --{ ACT }--
  worker.postMessage({
    action: 'start',
    assert: true
  });

  return prepareAssertion( worker ).then(
    ({response, data}) => executeAssertionBlock(() => {
      // --{ ASSERT }--
      let result = assert(
        !response, 'expect "response" to be false'
      );
      result = result &&  assert(
        data.wState.isActive, 'expect "state.isActive" to be true'
      );
      result = result && assert(
        data.wState.loadBalancingLoopID > 0, 'expect "state.loadBalancingLoopID" to be greater than 0'
      );
      return result;
    })
  );
}
