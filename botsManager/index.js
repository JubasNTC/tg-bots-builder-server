'use strict';

const path = require('path');

const Docker = require('dockerode');

(async () => {
  try {
    const docker = new Docker();
    const container = await docker.createContainer({
      Image: 'tg_bot',
      Name: 'test_bot',
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      OpenStdin: false,
      StdinOnce: false,
      HostConfig: {
        Binds: [`${path.join(__dirname, './volumes')}:/usr/src/volumes/:rw`],
      },
    });

    // console.dir({ bind: `tmp:/${path.join(__dirname, './volumes')}:rw` });
    //
    // container.defaultOptions.start.Binds = [
    //   `${path.join(__dirname, './volumes')}:/tmp:rw`,
    // ];

    console.dir({ container }, { depth: 10 });

    await container.start();
  } catch (e) {
    console.dir({ e }, { depth: 10 });
  }
})();
