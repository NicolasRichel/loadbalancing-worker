/**
 * First load balancing algorithm.
 */

const TIMEOUT = 2000;
const LOAD_ALGORITHM = ''

function loadBalancing(servers) {
  return Promise.all(
    servers.map( server => getLoad( server ) )
  )
  .then(loads => {
    return balance(loads);
  })
  .catch(err => {
    return servers[0];
  });
}

function getLoad(server) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('timeout'), TIMEOUT);
    fetch(`${server}/load-ping?algorithm=${LOAD_ALGORITHM}`)
      .then(res => {
        return res.json();
      })
      .then(load => {
        resolve({
          server: server,
          load: load.value,
          error: null
        });
      });
  })
  .catch(err => {
    return {
      server: server,
      load: +Infinity,
      error: err
    };
  });
}

function balance(loads) {
  return loads
    .sort( (x, y) => x.load-y.load )
    .map( x => x.server )[0];
}
