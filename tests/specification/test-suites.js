// Test Suites

export const testSuites = [
  {
    file: 'api-test_init.js',
    name: 'Initialize',
    tests: [
      {
        description: 'should initialize worker configuration',
        testFunction: 'shouldInitializeConfig'
      },
      {
        description: 'should stop load balancing loop (if running)',
        testFunction: 'shouldStopLoadBalancingLoop'
      }
    ]
  }
];
