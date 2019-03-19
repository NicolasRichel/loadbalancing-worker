/**
 * First load balancing algorithm.
 */

const TIMEOUT = 2000;
const LOAD_ALGORITHM = ''

async function loadBalancing(servers) {
  try {
    const loads = await Promise.all(
      servers.map( server => getLoad(server) )
    );
    return balance(loads);
  }
  catch (err) {
    return servers[0];
  }
}

async function getLoad(server) {
  try {
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
    });
  }
  catch (err) {
    return Promise.resolve({
      server: server,
      load: +Infinity,
      error: err
    });
  }
}

function balance(loads) {
  return loads
    .sort( (x, y) => x.load-y.load )
    .map( x => x.server )[0];
}
