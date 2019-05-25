// ****************************************************************************
// ASSERTION FUNCTIONS


export function executeAssertionBlock(assertionBlock) {
  let success = true;
  let message = '';
  try {
    success = assertionBlock();
  } catch (error) {
    success = false;
    message = error.message;
  }
  return { success, message };
}

export function assert(condition, failMessage) {
  return condition || (() => {throw new Error(failMessage);})();
}

export function assertConfigEqual(actual, expected) {
  let success = assert(
    !!actual, 'expect "config" to be defined'
  );
  success = success && assert(
    !(actual.endpoints<expected.endpoints || actual.endpoints>expected.endpoints),
    `expect "config.endpoints" to equal [${expected.endpoints.toString()}] but was [${actual.endpoints.toString()}]`
  );
  success = success && assert(
    actual.loadBalancingScript === expected.loadBalancingScript,
    `expect "config.loadBalancingScript" to equal '${expected.loadBalancingScript}' but was '${actual.loadBalancingScript}'`
  );
  success = success && assert(
    actual.interval === expected.interval,
    `expect "config.interval" to equal ${expected.interval} but was ${actual.interval}`
  );
  return success;
}

export function assertStateEqual(actual, expected) {
  let result = assert(
    !!actual, 'expect "state" to be defined'
  );
  result = result && assert(
    actual.isActive === expected.isActive,
    `expect "state.isActive" to be ${expected.isActive.toString()} but was ${actual.isActive.toString()}`
  );
  result = result && assert(
    actual.targetEndpoint === expected.targetEndpoint,
    `expect "state.targetEndpoint" to equal '${expected.targetEndpoint}' but was '${actual.targetEndpoint}'`
  );
  result = result && assert(
    actual.loadBalancingLoopID === expected.loadBalancingLoopID,
    `expect "state.loadBalancingLoopID" to equal ${expected.loadBalancingLoopID} but was ${actual.loadBalancingLoopID}`
  );
  return result;
}

export function assertActionCalls(actual, expected) {
  return !!actual && expected.reduce(
    (result, action) => result && assert(
      actual.some(actionCall => actionCall.action===action),
      `expect action '${action}' to have been called`
    ),
    true
  );
}

export function prepareAssertion(worker) {
  return new Promise(
    (resolve, reject) => {
      let response;
      worker.onmessage = (e) => {
        if (e.data.assert && e.data.type === 'proxy-data') {
          resolve({ response: response, data: e.data });
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

export function flushWorkerMessages(worker) {
  const messagePromise = new Promise(
    (resolve, reject) => {
      worker.onmessage = () => resolve();
      worker.onerror = () => resolve();
    }
  );
  messagePromise.then(() => {});
}
