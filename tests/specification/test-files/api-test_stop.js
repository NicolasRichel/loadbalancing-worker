
export const tests = [
  {
    description: 'should deactivate if worker is active',
    testFunction: shouldDeactivate
  }
];


export function shouldDeactivate( worker ) {
  return Promise.resolve({
    success: false,
    message: ''
  });
};
