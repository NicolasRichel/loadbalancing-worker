const testList = [
  './init-test.js',
  './start-test.js',
  './get-server-test.js',
  './is-active-test.js',
  './stop-test.js',
  './destroy-test.js'
];

function runAllTests() {
  Promise.all(
    testList.map(
      testFile => import(testFile).then( module => { return module.test(); } )
    )
  ).then(
    results => {
      displayTestResults(results);
      displayTestReport(results);
    }
  );
}

function displayTestResults(results) {
  results.forEach(result => {
    document.getElementById('test-results')
      .insertAdjacentHTML('beforeend', `
        <div class="test">
          <div class="circle ${result.success ? 'success' : 'failure'}"></div>
          <span class="test-msg"><b>${result.testName}</b> : ${result.description}</span>
        </div>
      `);
  });
}

function displayTestReport(results) {
  const nbSuccess = results.filter(result => result.success).length;
  const nbFailure = results.length - nbSuccess;
  document.getElementById('test-report')
    .insertAdjacentHTML('beforeend', `
      <div class="circle success"></div> ${nbSuccess} success
      <div class="circle failure"></div> ${nbFailure} failure
    `);
}

runAllTests();
