import { testSuites } from './test-suites.js';
import { TestRunner } from './test-runner.js';
import { TestRenderer } from './test-renderer.js';


let testRunner = null;

const testRenderer = new TestRenderer( testSuites );

const workerNameInput = document.getElementById('worker-name');
const workerNameMessage = document.getElementById('worker-name-message');
const initButton = document.getElementById('init-btn');
const runAllButton = document.getElementById('run-all-btn');
let runButtons = null;


initButton.addEventListener(
  'click',
  () => {
    workerNameInput.classList.remove('error');
    workerNameMessage.textContent = '';
    let workerName = workerNameInput.value;
    workerName = workerName.endsWith('.js') ? workerName : workerName+'.js';
    checkWorkerName(workerName).then(
      workerNameOK => {
        if ( workerNameOK ) {
          testRunner = new TestRunner( workerName, testSuites );
          testRenderer.initializeView();
          initRunAllButton();
          initRunButtons();
        } else {
          workerNameInput.classList.add('error');
          workerNameMessage.textContent = 'unable to load worker file';
        }
      }
    );
  }
);
runAllButton.style.visibility = 'hidden';
runAllButton.disabled = true;
runAllButton.addEventListener(
  'click',
  () => testRunner && testRunner.runAllTestSuites().then(
    testSuiteResults => testRenderer.renderAllTestSuites( testSuiteResults )
  )
);


async function checkWorkerName( workerName ) {
  try {
    const response = await fetch(
      `${window.location.origin}/workers/${workerName}`,
      { method: 'HEAD', cache: 'no-cache' }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

function initRunAllButton() {
  runAllButton.style.visibility = 'visible';
  runAllButton.disabled = false;
}

function initRunButtons() {
  runButtons = document.getElementsByClassName('run-btn');
  Array.prototype.forEach.call(
    runButtons,
    btn => btn.addEventListener(
      'click',
      () => testRunner && testRunner.runTestSuite( btn.name ).then(
        testSuiteResult => testRenderer.renderTestSuite( testSuiteResult )
      )
    )
  );
}
