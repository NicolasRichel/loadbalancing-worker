// Test Runner

export class TestRunner {

  constructor( testSuites ) {
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
    ).then(
      results => results.reduce(
        (acc, testSuiteResult) => acc.concat( [testSuiteResult] ), []
      )
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
        testSuite.tests.map(
          test => testModule.run[test.testFunction]().then(
            result => Object.assign(
              result,
              { description: test.description }
            )
          )
        )
      )
    )
    .then(
      testsResults => Object.assign(
        { name: testSuite.name },
        { results: testsResults }
      )
    );
  }

}
