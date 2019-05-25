// Test Renderer

export class TestRenderer {

  constructor( testSuites ) {
    this._testSuites = testSuites;
    this._container = document.getElementById('test-suites-results');
  }


  initializeView() {
    this._container.innerHTML = '';
    this._testSuites.forEach(
      testSuite => this._container.insertAdjacentHTML(
        'beforeend', `
        <div id="${testSuite.name}" class="test-suite">
          <h2 class="test-suite-name">${testSuite.name}</h2>
          <button class="run-btn" name="${testSuite.name}">Run Tests</button>
          <div class="tests-results"></div>
        <div>
      `)
    );
  }

  renderTestSuite( testSuiteResult ) {
    this._render( testSuiteResult );
  }

  renderAllTestSuites( testSuiteResults ) {
    testSuiteResults.forEach(
      testSuiteResult => this._render( testSuiteResult )
    );
  }


  _render( testSuiteResult ) {
    const wrapper = this._container.querySelector( `#${testSuiteResult.name} > .tests-results` );
    wrapper.innerHTML = '';
    testSuiteResult.results.forEach(
      (result, i) => setTimeout(
        () => wrapper.insertAdjacentHTML(
          'beforeend', `
          <div class="result">
            <div class="circle ${result.success ? 'success' : 'failure'}"></div>
            <span class="test-description">${result.description}</span>
            ${result.success ? '' : `<div class="test-message">${result.message}</div>`}
          </div>
        `),
        100*(i+1)
      )
    );
  }

}
