export const run = {
  shouldDeactivate: shouldDeactivate
};


export function shouldDeactivate( worker ) {
  return Promise.resolve({
    message: '',
    success: false
  });
};
