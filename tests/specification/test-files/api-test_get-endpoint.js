const NAME = 'Get Endpoint';
const TEST_1 = 'should return an endpoint';


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
