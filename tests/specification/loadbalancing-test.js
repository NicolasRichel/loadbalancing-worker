/**
 * Test script for load balancing.
 * ===============================
 * 
 * This script aim at providing a kind of 'mock'
 * for load balancing algorithm in order to test
 * the loadbalancing-worker API.
 */

let i = 0;

function loadBalancing(endpoints) {
  endpoint = endpoints[i];
  i = ( ++i ) % endpoints.length;
  return Promise.resolve( endpoint );
}
