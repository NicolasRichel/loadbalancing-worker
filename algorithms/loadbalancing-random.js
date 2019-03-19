/**
 * Random Load Balancing
 * =====================
 */

function loadBalancing(servers) {
  const n = Math.floor( Math.random() * (servers.length + 1) );
  return Promise.resolve( servers[n] );
}
