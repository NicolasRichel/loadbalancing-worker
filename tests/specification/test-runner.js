// Test Runner

export class TestRunner {

  constructor( workerName, testSuites ) {
    this._workerName = workerName;
    this._testSuites = testSuites;
  }


  runTestSuite( testSuiteName ) {
    const testSuite = this._testSuites.find( testSuite => testSuite.name===testSuiteName );
    if (testSuite) {
      return this._run( testSuite );
    }
    return Promise.reject( `Test suite '${testSuiteName}' does not exist.` );
  }

  runAllTestSuites() {
    return Promise.all(
      this._testSuites.map( testSuite => this._run( testSuite ) )
    );
  }


  /**
   * Run all the tests in the given test suite.
   * Returns a promise that resolve to an object with the following form :
   * {
   *   name: < test suite name >,
   *   results: [
   *     {
   *       description: < 1st test description >,
   *       message: < 1st test message >,
   *       success: < boolean >
   *     },
   *     {
   *       description: < 2nd test description >,
   *       message: < 2nd test message >,
   *       success: < boolean >
   *     },
   * 
   *     ...
   * 
   *   ]
   * }
   * 
   * @param {*} testSuite a test suite definition
   * @returns {Promise<Object>}
   */
  _run( testSuite ) {
    return import( `./test-files/${testSuite.file}` )
      .then(
        testModule => Promise.all(
          testModule.tests.map(
            test => {
              const worker = new Worker('/specification/worker-proxy.js');
              this._beforeEach( worker );
              return test.testFunction( worker ).then(
                result => {
                  this._afterEach( worker );
                  return Object.assign( result, { description: test.description } );
                }
              );
            }
          )
        )
      )
      .then(
        testsResults => ({
          name: testSuite.name,
          results: testsResults
        })
      );
  }

  /**
   * Proceed to initialization step (executed before each test).
   * 
   * @param {Worker} worker worker-proxy that will be used for the test
   */
  _beforeEach( worker ) {
    worker.postMessage({
      action: 'proxy-init',
      workerName: this._workerName
    });
  }

  /**
   * Proceed to finalization step (executed after each test).
   * 
   * @param {Worker} worker worker-proxy that was used for the test
   */
  _afterEach( worker ) {
    worker.terminate();
  }

}
