import { prepareAssertion } from '../test-utils.js';


export const run = {
  shouldActivate: shouldActivate
};


function shouldActivate( worker ) {
  return Promise.resolve({
    message: '',
    success: false
  });
};
