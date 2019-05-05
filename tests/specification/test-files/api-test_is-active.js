import { prepareAssertion } from '../test-utils.js';


export const run = {
  shouldBeFalseWhenIdle: shouldBeFalseWhenIdle,
  shouldBeTrueWhenActive: shouldBeTrueWhenActive
};


function shouldBeFalseWhenIdle( worker ) {
  // --{ ARRANGE }--
  worker.postMessage({
    action: 'init',
    config: {
      endpoints: ['A', 'B', 'C'],
      loadBalancingScript: 'hello-world.js'
    }
  });

  const resultPromise = prepareAssertion(
    worker,
    (response, data) => {
      // --{ ASSERT }--
      let result = true;
      result = result && !response;
      result = result && !data.wState.isActive;
      return result;
    }
  );

  // --{ ACT }--
  worker.postMessage({
    action: 'is-active?'
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


function shouldBeTrueWhenActive( worker ) {
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
      result = result && data.wState.isActive;
      return result;
    }
  );

  // --{ ACT }--
  worker.postMessage({
    action: 'is-active?'
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
