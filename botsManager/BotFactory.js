'use strict';

const { Telegraf, Scenes, session, Composer, Markup } = require('telegraf');
const axios = require('axios');
const _ = require('lodash');

const { validatorMapping } = require('./validator');
const { asserter } = require('./asserter');

const replaceMessagePlaceholders = (message, ctx) => {
  const matchedPlaceholders = message.match(
    // eslint-disable-next-line max-len
    /{{(message\.from|session\.state\.([a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}))(\.(\w+))+}}/g
  );

  if (!matchedPlaceholders) {
    return message;
  }

  const uniquePlaceholders = Array.from(new Set(matchedPlaceholders));
  let replacedMassage = message;

  for (let i = 0; i < uniquePlaceholders.length; i += 1) {
    const propertyPath = uniquePlaceholders[i]
      .replace('{{', '')
      .replace('}}', '');
    const replacement = _.get(ctx, propertyPath, '');
    replacedMassage = replacedMassage.replaceAll(
      uniquePlaceholders[i],
      replacement
    );
  }

  return replacedMassage;
};

const nextTask = (ctx) => {
  if (ctx.wizard.steps[ctx.wizard.cursor + 1] instanceof Composer) {
    return ctx.wizard.next();
  } else {
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  }
};

const andConditionByFilters = (ctx, filters) => {
  for (let i = 0; i < filters.length; i += 1) {
    const { taskId, condition, property, value } = filters[i];
    const assert = asserter[condition];

    if (!assert(ctx.session.state[taskId][property], value)) {
      return;
    }
  }

  return true;
};

const shouldSkipByFilter = (task, ctx) => {
  const filters = ctx.session.state[task.taskId].filters;

  if (!filters) {
    return false;
  }

  for (let i = 0; i < filters.length; i += 1) {
    if (andConditionByFilters(ctx, filters[i])) {
      return false;
    }
  }

  return true;
};

const tasksRunner = {
  message: (task) => async (ctx) => {
    if (shouldSkipByFilter(task, ctx)) {
      return nextTask(ctx);
    }

    await ctx.reply(replaceMessagePlaceholders(task.taskData.text, ctx));

    return nextTask(ctx);
  },

  question: (task) => async (ctx) => {
    if (shouldSkipByFilter(task, ctx)) {
      return nextTask(ctx);
    }

    if (task.taskData.type === 'text') {
      await ctx.reply(replaceMessagePlaceholders(task.taskData.question, ctx));
    }

    if (task.taskData.type === 'choice') {
      await ctx.reply(
        replaceMessagePlaceholders(task.taskData.question, ctx),
        Markup.keyboard(task.taskData.choices.map(({ text }) => text))
          .oneTime()
          .resize()
      );
    }

    return nextTask(ctx);
  },

  questionTextAnswer: (task) => async (ctx) => {
    if (shouldSkipByFilter(task, ctx)) {
      return nextTask(ctx);
    }

    if (task.taskData.validation) {
      // eslint-disable-next-line operator-assignment
      ctx.session.state[task.taskId].numberOfInvalidAnswers =
        ctx.session.state[task.taskId].numberOfInvalidAnswers - 1;

      if (ctx.session.state[task.taskId].numberOfInvalidAnswers === 0) {
        await ctx.reply(
          'Выход из сценария. Превышено количество попыток ответа.'
        );

        return ctx.scene.leave();
      }

      const validator = validatorMapping[task.taskData.validation];

      try {
        ctx.session.state[task.taskId].answer = validator.validateSync(
          ctx.message.text
        );

        return nextTask(ctx);
      } catch (e) {
        await ctx.reply(task.taskData.customValidationMessage || e.errors[0]);
        ctx.wizard.back();
      }
    }

    ctx.session.state[task.taskId].answer = ctx.message.text;

    return nextTask(ctx);
  },

  questionChoiceAnswers: (task) => {
    const choiceAnswers = [];

    for (let i = 0; i < task.taskData.choices.length; i += 1) {
      const choice = task.taskData.choices[i];

      choiceAnswers.push(async (ctx) => {
        if (shouldSkipByFilter(task, ctx)) {
          return nextTask(ctx);
        }

        ctx.session.state[task.taskId].answer = choice.value;

        return nextTask(ctx);
      });
    }

    return choiceAnswers;
  },

  image: (task) => async (ctx) => {
    if (shouldSkipByFilter(task, ctx)) {
      return nextTask(ctx);
    }

    if (task.taskData.isGif) {
      await ctx.replyWithAnimation({ url: task.taskData.url });
    } else {
      await ctx.replyWithPhoto({
        url: task.taskData.url,
      });
    }

    return nextTask(ctx);
  },

  video: (task) => async (ctx) => {
    if (shouldSkipByFilter(task, ctx)) {
      return nextTask(ctx);
    }

    await ctx.reply(task.taskData.url);

    return nextTask(ctx);
  },

  card: (task) => async (ctx) => {
    if (shouldSkipByFilter(task, ctx)) {
      return nextTask(ctx);
    }

    await ctx.replyWithHTML(
      // eslint-disable-next-line max-len
      `<b>${task.taskData.title}</b>\n${task.taskData.text}\n<a href="${task.taskData.imageUrl}">_</a>`,
      Markup.inlineKeyboard([
        Markup.button.url(
          task.taskData.linkText || 'Подробнее',
          task.taskData.linkUrl
        ),
      ])
    );

    return nextTask(ctx);
  },

  http: (task) => async (ctx) => {
    try {
      // result.taskData.method = _taskData.method;
      // result.taskData.httpHeaders = _taskData.httpHeaders;
      // result.taskData.httpBody = _taskData.httpBody;
      // result.taskData.timeout = _taskData.timeout;
      // result.taskData.basicUsername = _taskData.basicUsername;
      // result.taskData.basicPassword = _taskData.basicPassword;
      // result.taskData.isUseProxy = _taskData.isUseProxy;
      // result.taskData.proxyUrl = _taskData.proxyUrl;

      const axiosConfig = {
        url: task.taskData.url,
        method: task.taskData.method,
        headers: task.taskData.httpHeaders,
        data: task.taskData.httpBody,
        timeout: task.taskData.timeout,
      };

      const { data, status } = await axios(axiosConfig);

      ctx.session.state[task.taskId].response = data ?? {};
      ctx.session.state[task.taskId].status = status;

      // await ctx.reply(JSON.stringify(data ?? {}));
    } catch (e) {
      console.dir({ e }, { depth: 10 });
    }

    return nextTask(ctx);
  },

  notifyTelegram: (task) => async (ctx) => {
    if (shouldSkipByFilter(task, ctx)) {
      return nextTask(ctx);
    }

    const ids = task.taskData.chatIds.split('\n');

    for (let chatIdsIndex = 0; chatIdsIndex < ids.length; chatIdsIndex += 1) {
      const chatId = ids[chatIdsIndex];
      const notifyMessage = replaceMessagePlaceholders(task.taskData.text, ctx);

      try {
        await ctx.telegram.sendMessage(chatId, notifyMessage);
        ctx.session.state[task.taskId].resolved = 'true';
      } catch (e) {
        console.dir(e, { depth: 10 });
      }
    }

    return nextTask(ctx);
  },

  end: async (ctx) => ctx.scene.leave(),
};

class BotFactory {
  static factory(token, template) {
    const bot = new Telegraf(token);

    const scenes = [];
    const scenesMetadata = [];

    for (let i = 0; i < template.flows.length; i += 1) {
      const flow = template.flows[i];
      const steps = [];

      for (let j = 0; j < flow.tasks.length; j += 1) {
        const task = flow.tasks[j];

        if (task.taskType === 'message') {
          steps.push(tasksRunner.message(task));
        }

        if (task.taskType === 'question') {
          steps.push(tasksRunner.question(task));

          const questionComposer = new Composer();

          if (task.taskData.type === 'text') {
            questionComposer.on('text', tasksRunner.questionTextAnswer(task));
          }

          if (task.taskData.type === 'choice') {
            const choicesHearsHandlers =
              tasksRunner.questionChoiceAnswers(task);

            for (
              let choiceIndex = 0;
              choiceIndex < task.taskData.choices.length;
              choiceIndex += 1
            ) {
              const choice = task.taskData.choices[choiceIndex];

              questionComposer.hears(
                choice.value,
                choicesHearsHandlers[choiceIndex]
              );
            }
          }

          steps.push(questionComposer);
        }

        if (task.taskType === 'image') {
          steps.push(tasksRunner.image(task));
        }

        if (task.taskType === 'video') {
          steps.push(tasksRunner.video(task));
        }

        if (task.taskType === 'card') {
          steps.push(tasksRunner.card(task));
        }

        if (task.taskType === 'http') {
          steps.push(tasksRunner.http(task));
        }

        if (task.taskType === 'notifyTelegram') {
          steps.push(tasksRunner.notifyTelegram(task));
        }
      }

      steps.push(tasksRunner.end);

      scenes.push(new Scenes.WizardScene(flow.flowId, ...steps));
      scenesMetadata.push({
        sceneId: flow.flowId,
        triggers: flow.triggers,
        initialSession: flow.initialSession,
      });
    }

    const stage = new Scenes.Stage(scenes);

    bot.use(session());
    bot.use(stage.middleware());

    bot.start((ctx) => ctx.reply(template.start));
    bot.help((ctx) => ctx.reply(template.help));
    bot.settings((ctx) => ctx.reply(template.settings));

    for (let i = 0; i < scenesMetadata.length; i += 1) {
      const { triggers, sceneId, initialSession } = scenesMetadata[i];
      bot.hears(triggers, async (ctx) => {
        ctx.session.state = _.cloneDeep(initialSession);
        await ctx.scene.enter(sceneId);
      });
    }

    return bot;
  }
}

module.exports = BotFactory;
