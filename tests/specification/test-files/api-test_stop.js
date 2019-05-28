import {
  assert,
  prepareAssertion,
  executeAssertionBlock
} from "../test-utils.js";


export const tests = [
  {
    description: 'should deactivate if worker is active',
    testFunction: shouldDeactivateWhenActive
  },
  {
    description: 'should do nothing if worker is idle',
    testFunction: shouldDoNothingWhenIdle
  }
];


function shouldDeactivateWhenActive( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'set-state',
    state: {
      isActive: true,
      loadBalancingLoopID: 1
    }
  });

  // --{ ACT }--
  worker.postMessage({
    action: 'stop',
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
      result = result && assert(
        data.wState.loadBalancingLoopID === -1, 'expect "state.loadBalancingLoopID" to equal -1'
      );
      return result;
    })
  );
}

function shouldDoNothingWhenIdle( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'set-state',
    state: {
      isActive: false,
      loadBalancingLoopID: -1
    }
  });

  // --{ ACT }--
  worker.postMessage({
    action: 'stop',
    assert: true
  });

  return prepareAssertion( worker ).then(
    ({ response, data }) => executeAssertionBlock(() => {
      // --{ ASSERT }--
      let result = assert(
        !response, 'expect "response" to be false'
      );
      result = result && assert(
        !data.wState.isActive, 'expect "state.isActive" to be false'
      );
      result = result && assert(
        data.wState.loadBalancingLoopID === -1, 'expect "state.loadBalancingLoopID" to equal -1'
      );
      return result;
    })
  );
}
