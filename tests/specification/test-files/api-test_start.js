const NAME = 'Start';
const TEST_1 = 'should start load balancing loop';


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
