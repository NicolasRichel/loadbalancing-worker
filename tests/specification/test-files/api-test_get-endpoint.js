import {
  assert,
  prepareAssertion,
  executeAssertionBlock
} from "../test-utils.js";


export const tests = [
  {
    description: 'should return target endpoint',
    testFunction: shouldGetTargetEndpoint
  },
  {
    description: 'should return null if worker is idle',
    testFunction: shouldBeNullWhenIdle
  }
];


function shouldGetTargetEndpoint( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'set-state',
    state: {
      isActive: true,
      targetEndpoint: 'http://xyz.com'
    }
  });

  // --{ ACT }--
  worker.postMessage({
    action: 'get-endpoint',
    assert: true
  });

  return prepareAssertion( worker ).then(
    ({ response, data }) => executeAssertionBlock(() => {
      let result = assert(
        response === 'http://xyz.com', 'expect "response" to be target endpoint'
      );
      result = result && assert(
        data.wState.isActive, 'expect "state.isActive" to be true'
      );
      return result;
    })
  );
}


function shouldBeNullWhenIdle( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'set-state',
    state: {
      isActive: false,
      targetEndpoint: 'http://xyz.com'
    }
  });

  // --{ ACT }--
  worker.postMessage({
    action: 'get-endpoint',
    assert: true
  });

  return prepareAssertion( worker ).then(
    ({ response, data }) => executeAssertionBlock(() => {
      let result = assert(
        response === null, 'expect "response" to be null'
      );
      result = result && assert(
        !data.wState.isActive, 'expect "state.isActive" to be false'
      );
      return result;
    })
  );
};
