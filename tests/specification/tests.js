import { testSuites } from './test-suites.js';
import { TestRunner } from './test-runner.js';
import { TestRenderer } from './test-renderer.js';


const testRunner = new TestRunner( testSuites );
const testRenderer = new TestRenderer( testSuites );


testRenderer.initializeView();

document.getElementById('run-all-btn')
  .addEventListener(
    'click',
    () => testRunner.runAllTestSuites().then(
      testSuiteResults => testRenderer.renderAllTestSuites( testSuiteResults )
    )
  );
