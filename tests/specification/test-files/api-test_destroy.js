const NAME = 'Destroy';
const TEST_1 = 'should terminate worker execution';


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
