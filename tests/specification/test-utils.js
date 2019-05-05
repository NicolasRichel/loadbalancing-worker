/******************************************************************************
 * ASSERT FUNCTIONS
 */

export function assertConfigEqual(actual, expected) {
  let result = !!actual;
  result = result && !(
    actual.endpoints < expected.endpoints || 
    actual.endpoints > expected.endpoints
  );
  result = result && (actual.loadBalancingScript === expected.loadBalancingScript);
  result = result && (actual.interval === expected.interval);
  return result;
}

export function assertStateEqual(actual, expected) {
  let result = !!actual;
  result = result && (actual.isActive === expected.isActive);
  result = result && (actual.targetEndpoint === expected.targetEndpoint);
  result = result && (actual.loadBalancingLoopID === expected.loadBalancingLoopID);
  return result;
}

export function assertActionCalls(actual, expected) {
  return !!actual &&  actual.reduce(
    (result, actionCall) => result && expected.includes(actionCall.action),
    true
  );
}


/******************************************************************************
 * OTHER FUNCTIONS
 */

export function prepareAssertion(worker, assertFunction) {
  return new Promise(
    (resolve, reject) => {
      let response;
      worker.onmessage = (e) => {
        if (e.data.type === 'proxy-data') {
          resolve( assertFunction(response, e.data) );
        } else {
          response = e.data;
        }
      };
      worker.onerror = () => {
        resolve( false );
      };
    }
  );
}
