'use strict';

const fs = require('fs');
const path = require('path');
const Docker = require('dockerode');

const { sequelize, BotModel } = require('models');

(async () => {
  await sequelize.sync();

  const bots = await BotModel.findAll();
  const [flowsAttachment] = await sequelize.query(
    `SELECT
       "b"."botId",
       "f"."flowId",
       "f"."flowData"
     FROM "flowsAttachment" AS "fa"
     INNER JOIN "bots" AS "b" ON "fa"."botId" = "b"."id"
     INNER JOIN "flows" AS "f" ON "fa"."flowId" = "f"."id"
     WHERE "f"."enabled" = TRUE;`
  );

  const botsForRun = bots.map((bot) => {
    const attachedFlows = flowsAttachment
      .filter((attachment) => attachment.botId === bot.botId)
      .map(({ flowData }) => flowData);

    return {
      botId: bot.botId,
      start: bot.startText,
      help: bot.helpText,
      settings: bot.settingsText,
      flows: attachedFlows,
    };
  });

  const docker = new Docker();
  const containersList = await docker.listContainers({ all: true });

  for (const botForRun of botsForRun) {
    try {
      const dirPath = path.join(__dirname, `./volumes/bot_${botForRun.botId}`);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(
        `${dirPath}/data.json`,
        JSON.stringify(botForRun),
        'utf8'
      );

      const containerName = `/bot_${botForRun.botId}`;
      const foundContainer = containersList.find((container) =>
        container.Names.includes(containerName)
      );

      if (!foundContainer) {
        const newContainer = await docker.createContainer({
          Image: 'tg_bot',
          name: `bot_${botForRun.botId}`,
          AttachStdin: false,
          AttachStdout: true,
          AttachStderr: true,
          Tty: true,
          OpenStdin: false,
          StdinOnce: false,
          HostConfig: {
            Binds: [`${dirPath}:/usr/src/volumes/:rw`],
          },
        });

        await newContainer.start();
      } else {
        await docker.getContainer(foundContainer.Id).restart();
        console.dir({ tyt: 1 }, { depth: 10 });
      }
    } catch (e) {
      console.dir({ e }, { depth: 10 });
    }
  }

  //Names: [ '/bot_1b6224e1-d796-4643-8960-e7b5ff4f64f7' ]
  // State: 'running'  State: 'exited'
  //console.dir(containersList, { depth: 10 });
})();
