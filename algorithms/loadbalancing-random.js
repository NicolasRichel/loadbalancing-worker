/**
 * Random Load Balancing
 * =====================
 */

function loadBalancing(endpoints) {
  const n = Math.floor( Math.random() * (endpoints.length + 1) );
  return Promise.resolve( endpoints[n] );
}
