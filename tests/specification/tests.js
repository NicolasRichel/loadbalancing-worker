import { testSuites } from './test-suites.js';
import { TestRunner } from './test-runner.js';
import { TestRenderer } from './test-renderer.js';


let testRunner = null;
let testRenderer = null;

const workerFileInput = document.getElementById('worker-file');
const workerFileMessage = document.getElementById('worker-file-message');
const initButton = document.getElementById('init-btn');
let runAllButton = null;
let runButtons = null;


initButton.addEventListener(
  'click',
  () => {
    workerFileInput.classList.remove('error');
    workerFileMessage.textContent = '';
    let workerFile = workerFileInput.value;
    workerFile = workerFile.endsWith('.js') ? workerFile : workerFile+'.js';
    checkWorkerFile(workerFile).then(
      () => {
        testRunner = new TestRunner( workerFile, testSuites );
        testRenderer = new TestRenderer( testSuites );
        testRenderer.initializeView();
        initRunAllButton();
        initRunButtons();
      }
    ).catch(
      error => {
        workerFileInput.classList.add('error');
        workerFileMessage.textContent = error;
      }
    );
  }
);


async function checkWorkerFile( workerFile ) {
  // Check that worker file exists
  const response = await fetch(
    `${window.location.origin}/workers/${workerFile}`,
    { method: 'HEAD', cache: 'no-cache' }
  );
  if (response.status !== 200)
    throw 'unable to load worker file';
  return;
}

function initRunAllButton() {
  runAllButton = document.getElementById('run-all-btn');
  runAllButton.onclick = () => testRunner && testRunner.runAllTestSuites().then(
    testSuiteResults => testRenderer.renderAllTestSuites( testSuiteResults )
  );
  runAllButton.style.visibility = 'visible';
  runAllButton.disabled = false;
}

function initRunButtons() {
  runButtons = document.getElementsByClassName('run-btn');
  Array.prototype.forEach.call(
    runButtons,
    btn => btn.onclick = () => testRunner && testRunner.runTestSuite( btn.name ).then(
      testSuiteResult => testRenderer.renderTestSuite( testSuiteResult )
    )
  );
}
