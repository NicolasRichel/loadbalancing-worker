const NAME = 'Stop';
const TEST_1 = 'should stop load balancing loop';


export function test() {
  return Promise.resolve([
    {
      testName: NAME,
      description: TEST_1,
      message: '',
      success: false
    }
  ]);
};
