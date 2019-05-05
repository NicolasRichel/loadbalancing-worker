// Test Suites

export const testSuites = [
  {
    name: 'Initialize',
    file: 'api-test_init.js',
    tests: [
      {
        description: 'should initialize worker configuration',
        testFunction: 'shouldInitializeConfig'
      },
      {
        description: 'should update worker configuration',
        testFunction: 'shouldUpdateConfig'
      },
      {
        description: 'should stop load balancing loop (if running)',
        testFunction: 'shouldStopLoadBalancingLoop'
      }
    ]
  },
  {
    name: 'Is-Active',
    file: 'api-test_is-active.js',
    tests: [
      {
        description: 'should return false if worker is idle',
        testFunction: 'shouldBeFalseWhenIdle'
      },
      {
        description: 'should return true if worker is active',
        testFunction: 'shouldBeTrueWhenActive'
      }
    ]
  }
];
