const NAME = 'Initialize';
const DESCRIPTION = 'should initialize worker state via configuration';

export function test() {
  
  let result = false;
  const worker = new Worker('/worker.js');

  worker.onmessage = (e) => result = e.data;
  worker.onerror = () => result = false;

  worker.postMessage({
    msg: 'init',
    config: {
      servers: ['A', 'B', 'C'],
      loadBalancingScript: '/tests/loadbalancing-test.js'
    }
  });

  // TODO assert that worker state has been properly initialized

  return {
    testName: NAME,
    description: DESCRIPTION,
    message: '',
    success: result
  };
};
