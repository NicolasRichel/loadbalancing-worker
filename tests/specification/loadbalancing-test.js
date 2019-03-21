/**
 * Test script for load balancing.
 * ===============================
 * 
 * This script aim at providing a kind of 'mock'
 * for load balancing algorithm in order to test
 * the loadbalancing-worker behavior.
 */

function loadBalancing(servers) {
  return Promise.resolve( servers[0] );
}
