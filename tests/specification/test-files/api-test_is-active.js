const NAME = 'Is Active';
const TEST_1 = 'should return false if worker is idle';
const TEST_2 = 'should return true if worker is active';


export function test() {
  return Promise.resolve([
    {
      testName: NAME,
      description: TEST_1,
      message: '',
      success: false
    },
    {
      testName: NAME,
      description: TEST_2,
      message: '',
      success: false
    }
  ]);
};
