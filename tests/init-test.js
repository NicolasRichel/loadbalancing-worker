const NAME = 'Initialize';
const DESCRIPTION = 'should initialize worker state via configuration';

export function test() {

  const worker = new Worker('/worker.js');
  let result = false;

  worker.onmessage = (e) => result = e.data;
  worker.onerror = () => result = false;

  worker.postMessage({
    msg: 'init',
    config: {
      servers: ['A', 'B', 'C'],
      loadBalancingScript: '/tests/loadbalancing-test.js'
    }
  });

  return {
    testName: NAME,
    description: DESCRIPTION,
    message: '',
    success: result
  };
};
