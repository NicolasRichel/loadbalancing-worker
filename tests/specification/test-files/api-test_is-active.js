import {
  assert,
  prepareAssertion,
  executeAssertionBlock
} from '../test-utils.js';


export const tests = [
  {
    description: 'should return false if worker is idle',
    testFunction: shouldBeFalseWhenIdle
  },
  {
    description: 'should return true if worker is active',
    testFunction: shouldBeTrueWhenActive
  }
];


function shouldBeFalseWhenIdle( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'set-state',
    state: {
      isActive: false
    }
  });

  // --{ ACT }--
  worker.postMessage({
    action: 'is-active?',
    assert: true
  });

  return prepareAssertion( worker ).then(
    ({response, data }) => executeAssertionBlock(() => {
      // --{ ASSERT }--
      let result = assert(
        !response, 'expect "response" to be false'
      );
      result = result && assert(
        !data.wState.isActive, 'expect "state.isActive" to be false'
      );
      return result;
    })
  );
}


function shouldBeTrueWhenActive( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'set-state',
    state: {
      isActive: true
    }
  });

  // --{ ACT }--
  worker.postMessage({
    action: 'is-active?',
    assert: true
  });

  return prepareAssertion( worker ).then(
    ({ response, data }) => executeAssertionBlock(() => {
      // --{ ASSERT }--
      let result = assert(
        response, 'expect "response" to be true'
      );
      result = result && assert(
        data.wState.isActive, 'expect "state.isActive" to be true'
      );
      return result;
    })
  );
}
