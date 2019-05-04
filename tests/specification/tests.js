import { testSuites } from './test-suites.js';
import { TestRunner } from './test-runner.js';
import { TestRenderer } from './test-renderer.js';


let testRunner = null;

const testRenderer = new TestRenderer( testSuites );
testRenderer.initializeView();


document.getElementById('init-btn')
  .addEventListener(
    'click',
    () => {
      const workerName = document.getElementById('worker-name').value;
      testRunner = new TestRunner( workerName, testSuites );
    }
  );

document.getElementById('run-all-btn')
  .addEventListener(
    'click',
    () => testRunner && testRunner.runAllTestSuites().then(
      testSuiteResults => testRenderer.renderAllTestSuites( testSuiteResults )
    )
  );

Array.prototype.forEach.call(
  document.getElementsByClassName('run-btn'),
  btn => btn.addEventListener(
    'click',
    () => testRunner && testRunner.runTestSuite( btn.name ).then(
      testSuiteResult => testRenderer.renderTestSuite( testSuiteResult )
    )
  )
);
