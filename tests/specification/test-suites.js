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
    name: 'Start',
    file: 'api-test_start.js',
    tests: [
      {
        description: 'should activate worker',
        testFunction: 'shouldActivate'
      }
    ]
  },
  {
    name: 'Stop',
    file: 'api-test_stop.js',
    tests: [
      {
        description: 'should deactivate worker',
        testFunction: 'shouldDeactivate'
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
  },
  {
    name: 'Get-Endpoint',
    file: 'api-test_get-endpoint.js',
    tests: []
  },
  {
    name: 'Destroy',
    file: 'api-test_destroy.js',
    tests: []
  }
];
