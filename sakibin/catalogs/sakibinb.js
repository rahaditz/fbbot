const { readdirSync, readFileSync, writeFileSync } = require("fs-extra");
const { join, resolve } = require('path')
const { execSync } = require('child_process');
const axios = require('axios')
const config = require("../../sakibin.json");
const chalk = require("chalk");
const listPackage = JSON.parse(readFileSync('../../package.json')).dependencies;
const packages = JSON.parse(readFileSync('../../package.json'));
const fs = require("fs");
//const login = require("chatbox-fca-remake");
//const login require('aryan-fca');
//const login = require("priyanshu-fca");
//const login = require("@dongdev/fca-unofficial");
const login = require("../system/ws3-fca");
const moment = require("moment-timezone");
const logger = require("./sakibinc.js");
const gradient = require("gradient-string");
const process = require("process");
const listbuiltinModules = require("module").builtinModules;
const cnslEvent = require("../configs/console.json");
const send = require('../system/notification/mail.js');



global.client = new Object({
  commands: new Map(),
  events: new Map(),
  aliases: new Map(),
  cooldowns: new Map(),
  eventRegistered: new Array(),
  handleSchedule: new Array(),
  handleReaction: new Array(),
  handleReply: new Array(),
  mainPath: process.cwd(),
  configPath: new String(),
  apisakibinPath: new String(),
  sakibinPath: new String(),
  premiumListsPath: new String(),
  approvedListsPath: new String(),
  getTime: function(option) {
    switch (option) {
      case "seconds":
        return `${moment.tz("Asia/Manila").format("ss")}`;
      case "minutes":
        return `${moment.tz("Asia/Manila").format("mm")}`;
      case "hours":
        return `${moment.tz("Asia/Manila").format("HH")}`;
      case "date":
        return `${moment.tz("Asia/Manila").format("DD")}`;
      case "month":
        return `${moment.tz("Asia/Manila").format("MM")}`;
      case "year":
        return `${moment.tz("Asia/Manila").format("YYYY")}`;
      case "fullHour":
        return `${moment.tz("Asia/Manila").format("HH:mm:ss")}`;
      case "fullYear":
        return `${moment.tz("Asia/Manila").format("DD/MM/YYYY")}`;
      case "fullTime":
        return `${moment.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY")}`;
    }
  },
  timeStart: Date.now()
});
global.data = new Object({
  threadInfo: new Map(),
  threadData: new Map(),
  userName: new Map(),
  userBanned: new Map(),
  threadBanned: new Map(),
  commandBanned: new Map(),
  threadAllowNSFW: new Array(),
  allUserID: new Array(),
  allCurrenciesID: new Array(),
  allThreadID: new Array(),
});
global.utils = require("./sakibind.js");
global.loading = require("./sakibinc.js");
global.send = require('../system/notification/mail.js');

global.nodemodule = new Object();
global.config = new Object();
global.sakibin = new Object();
global.apisakibin = new Object();
global.premium = new Object();
global.approved = new Object();
global.configModule = new Object();
global.moduleData = new Array();
global.language = new Object();
global.account = new Object();

const cheerful = gradient.fruit
const crayon = gradient('yellow', 'lime', 'green');
const sky = gradient('#3446eb', '#3455eb', '#3474eb');
const BLUE = ('#3467eb');
const errorMessages = [];
if (errorMessages.length > 0) {
  console.log("commands with errors : ");
  errorMessages.forEach(({ command, error }) => {
    console.log(`${command}: ${error}`);
  });
}

var apisakibinValue;
try {
  global.client.apisakibinPath = join(global.client.mainPath, "../configs/api.json");
  apisakibinValue = require(global.client.apisakibinPath);
} catch (e) {
  return;
}
try {
  for (const apiKeys in apisakibinValue) global.apisakibin[apiKeys] = apisakibinValue[apiKeys];
} catch (e) {
  return;
}
var sakibinValue;
try {
  global.client.sakibinPath = join(global.client.mainPath, "../configs/sakibin.json");
  sakibinValue = require(global.client.sakibinPath);
} catch (e) {
  return;
}
try {
  for (const Keys in sakibinValue) global.sakibin[Keys] = sakibinValue[Keys];
} catch (e) {
  return;
}
var configValue;
try {
  global.client.configPath = join(global.client.mainPath, "../../sakibin.json");
  configValue = require(global.client.configPath);
  logger.loader(`deploying ${chalk.blueBright('sakibin')} file`);
} catch (e) {
  return logger.loader(`cant read ${chalk.blueBright('sakibin')} file`, "error");
}
try {
  for (const key in configValue) global.config[key] = configValue[key];
  logger.loader(`deployed ${chalk.blueBright('sakibin')} file`);
} catch (e) {
  return logger.loader(`can't deploy ${chalk.blueBright('sakibin')} file`, "error")
}

var approvedListsValue;
try {
  global.client.approvedListsPath = join(global.client.mainPath, "../botdata/approvedlists.json");
  approvedListsValue = require(global.client.approvedListsPath);
  if (config.approval) {
  logger.loader(`deploying ${chalk.blueBright(`approved database`)}`);
  } else {
    logger(`${chalk.blueBright(`approval`)} system is turned off`, 'warn');
  }
} catch (e) {
  return logger(`can't read approved database`, 'error');
}
try {
  for (const approvedListsKeys in approvedListsValue) global.approved[approvedListsKeys] = approvedListsValue[approvedListsKeys];
  if (config.approval) {
    logger.loader(`deployed ${chalk.blueBright(`approved database`)}`)
  }
} catch (e) {
  return logger(`can't deploy approved groups database`, 'error')
}

var premiumListsValue;
try {
  global.client.premiumListsPath = join(global.client.mainPath, "../botdata/premiumlists.json");
  premiumListsValue = require(global.client.premiumListsPath);
  if (config.premium) {
  logger.loader(`deploying ${chalk.blueBright(`premium database`)}`);
  } else {
    logger(`${chalk.blueBright(`premium`)} system is turned off`, 'warn');
  }
} catch (e) {
  return logger(`can't read premium database`, 'error')
}
try {
  for (const premiumLists in premiumListsValue) global.premium[premiumLists] = premiumListsValue[premiumLists];
  if (config.premium) {
    logger.loader(`deployed ${chalk.blueBright(`premium database`)}`);
  }
} catch (e) {
  return logger(`can't deploy premium database`, 'error');
}


const { Sequelize, sequelize } = require("../system/database/index.js");
for (const property in listPackage) {
  try {
    global.nodemodule[property] = require(property)
  } catch (e) { }
}

const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, {
  encoding: 'utf-8'
})).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
  const getSeparator = item.indexOf('=');
  const itemKey = item.slice(0, getSeparator);
  const itemValue = item.slice(getSeparator + 1, item.length);
  const head = itemKey.slice(0, itemKey.indexOf('.'));
  const key = itemKey.replace(head + '.', '');
  const value = itemValue.replace(/\\n/gi, '\n');
  if (typeof global.language[head] == "undefined") global.language[head] = new Object();
  global.language[head][key] = value;
}
global.getText = function(...args) {
  const langText = global.language;
  if (!langText.hasOwnProperty(args[0])) {
    throw new Error(`${__filename} - not found key language : ${args[0]}`);
  }
  var text = langText[args[0]][args[1]];
  if (typeof text === 'undefined') {
    throw new Error(`${__filename} - not found key text : ${args[1]}`);
  }
  for (var i = args.length - 1; i > 0; i--) {
    const regEx = RegExp(`%${i}`, 'g');
    text = text.replace(regEx, args[i + 1]);
  }
  return text;
};

try {
  if (!global.config.BOTNAME) {
    logger.error(`please enter your bot name in ${chalk.blueBright('sakibin.json')} file`);
    process.exit(0);
  }
  if (!global.config.EMAIL) {
    logger.err(`please enter your email address in ${chalk.blueBright('sakibin.json')} file`)
    process.exit(0);
  }
  if (!global.config.PREFIX) {
    logger.error(`please enter your bot prefix in ${chalk.blueBright('sakibin.json')} file`)
    process.exit(0);
  }
  if (global.config.author != "sakibin") {
    logger.error(`detected : author was changed at ${chalk.blueBright('sakibin.json')}`);
    process.exit(0);
  }
  if (packages.author != "sakibin") {
    logger.error(`detected : author was changed at ${chalk.blueBright('package.json')}`);
    process.exit(0);
  }
  if (packages.name != "sakibin") {
    logger.error(`detected : project name was changed at ${chalk.blueBright('package.json')}`);
    process.exit(0);
  }
} catch (error) {
  return;
}

try {
  var appStateFile = resolve(join(global.client.mainPath, "../../sakibinstate.json"));
  var appState = ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && (fs.readFileSync(appStateFile, 'utf8'))[0] != "[" && sakibin.encryptSt) ? JSON.parse(global.utils.decryptState(fs.readFileSync(appStateFile, 'utf8'), (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER))) : require(appStateFile);
  logger.loader(`deployed ${chalk.blueBright('sakibinstate')} file`)
} catch (e) {
  return logger.error(`can't read ${chalk.blueBright('sakibinstate')} file`)
}

function onBot({ models: botModel }) {
  const loginData = {};
  loginData.appState = appState;
  login(loginData, async (err, api) => {
    if (err) {
        console.log(err)
        return process.exit(0)
      }
    api.setOptions(global.sakibin.loginoptions);
    const fbstate = api.getAppState();
    let d = api.getAppState();
    d = JSON.stringify(d, null, '\x09');
    if ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && global.sakibin.encryptSt) {
      d = await global.utils.encryptState(d, process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER);
      writeFileSync(appStateFile, d)
    } else {
      writeFileSync(appStateFile, d)
    }
    global.client.api = api
    global.sakibin.version = config.version,
      (async () => {
        const commandsPath = `../../scripts/commands`;
        const listCommand = readdirSync(commandsPath).filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.disabledcmds.includes(command));
  console.clear();
  console.log(chalk[`${cnslEvent.logger.colors.cmdStarter}`](`${cnslEvent.logger.strings.cmdStarter}`));
        for (const command of listCommand) {
          try {
            const module = require(`${commandsPath}/${command}`);
            const { config } = module;

            if (!config?.category) {
              try {
                throw new Error(`command - ${command} category is not in the correct format or empty`);
              } catch (error) {
                console.log(chalk.red(error.message));
                continue;
              }
            }
            const configures = require(`../../sakibin.json`);
            if (configures.premium) {
              if (!config?.hasOwnProperty('premium')) {
                console.log(`command -`, chalk.hex("#ff0000")(command) + ` does not have the "premium" property.`);
                continue;
              }
            }
            if (!config?.hasOwnProperty('prefix')) {
              console.log(`command -`, chalk.hex("#ff0000")(command) + ` does not have the "prefix" property.`);
              continue;
            }

            if (global.client.commands.has(config.name || '')) {
              console.log(chalk.red(`command - ${chalk.hex("#FFFF00")(command)} module is already deployed.`));
              continue;
            }
            //const { dependencies, envConfig } = config;
            const { dependencies, envConfig, aliases = [] } = config;
            
            if (dependencies) {
              Object.entries(dependencies).forEach(([reqDependency, dependencyVersion]) => {
                if (listPackage[reqDependency]) return;
                try {
                  execSync(`npm install --save ${reqDependency}${dependencyVersion ? `@${dependencyVersion}` : ''}`, {
                    stdio: 'inherit',
                    env: process.env,
                    shell: true,
                    cwd: join('../../node_modules')
                  });
                  require.cache = {};
                } catch (error) {
                  const errorMessage = `failed to install package ${reqDependency}\n`;
                  global.loading.err(chalk.hex('#ff7100')(errorMessage), 'command');
                }
              });
            }

            if (envConfig) {
              const moduleName = config.name;
              global.configModule[moduleName] = global.configModule[moduleName] || {};
              global.sakibin[moduleName] = global.sakibin[moduleName] || {};
              for (const envConfigKey in envConfig) {
                global.configModule[moduleName][envConfigKey] = global.sakibin[moduleName][envConfigKey] ?? envConfig[envConfigKey];
                global.sakibin[moduleName][envConfigKey] = global.sakibin[moduleName][envConfigKey] ?? envConfig[envConfigKey];
              }
              var sakibinPath = require('../configs/sakibin.json');
              sakibinPath[moduleName] = envConfig;
              writeFileSync(global.client.sakibinPath, JSON.stringify(sakibinPath, null, 4), 'utf-8');
            }


            if (module.onLoad) {
              const moduleData = {};
              moduleData.api = api;
              moduleData.models = botModel;
              try {
                module.onLoad(moduleData);
              } catch (error) {
                const errorMessage = "unable to load the onLoad function of the module."
                throw new Error(errorMessage, 'error');
              }
            }

            for (const alias of aliases) {
              if (global.client.aliases.has(alias)) {
                throw new Error(
                  `[ ALIAS ERROR ] Alias '${alias}' already exists in another command`,
                );
              }
              global.client.aliases.set(alias, module);
            }

            
            if (module.handleEvent) global.client.eventRegistered.push(config.name);
            global.client.commands.set(config.name, module);
            try {
              global.loading(`${crayon(``)}Install Success ${chalk.blueBright(config.name)}`, `${cnslEvent.logger.strings.cmdLoader}`);
            } catch (err) {
              console.error("an error occurred while deploying the command : ", err);
            }

            console.err
          } catch (error) {
            global.loading.err(`${chalk.hex('#ff7100')(``)}Install failed ${chalk.hex("#FFFF00")(command)} ` + error + '\n', "command");
          }
        }
      })(),

      (async () => {
        const events = readdirSync(join(global.client.mainPath, '../../scripts/events')).filter(ev => ev.endsWith('.js') && !global.config.disabledevents.includes(ev));
        console.log(`\n` + chalk[`${cnslEvent.logger.colors.evntStarter}`](`${cnslEvent.logger.strings.evntStarter}`));
        for (const ev of events) {
          try {
            const event = require(join(global.client.mainPath, '../../scripts/events', ev));
            const { config, onLoad, run } = event;
            if (!config || !config.name || !run) {
              global.loading.err(`${chalk.hex('#ff7100')(``)} ${chalk.hex("#FFFF00")(ev)} module is not in the correct format. `, "event");
              continue;
            }


            if (errorMessages.length > 0) {
              console.log("commands with errors :");
              errorMessages.forEach(({ command, error }) => {
                console.log(`${command}: ${error}`);
              });
            }

            if (global.client.events.has(config.name)) {
              global.loading.err(`${chalk.hex('#ff7100')(``)} ${chalk.hex("#FFFF00")(ev)} module is already Installed.`, "event");
              continue;
            }
            if (config.dependencies) {
              const missingDeps = Object.keys(config.dependencies).filter(dep => !global.nodemodule[dep]);
              if (missingDeps.length) {
                const depsToInstall = missingDeps.map(dep => `${dep}${config.dependencies[dep] ? '@' + config.dependencies[dep] : ''}`).join(' ');
                execSync(`npm install --no-package-lock --no-save ${depsToInstall}`, {
                  stdio: 'inherit',
                  env: process.env,
                  shell: true,
                  cwd: join('../../node_modules')
                });
                Object.keys(require.cache).forEach(key => delete require.cache[key]);
              }
            }
            if (config.envConfig) {
              const configModule = global.configModule[config.name] || (global.configModule[config.name] = {});
              const configData = global.sakibin[config.name] || (global.sakibin[config.name] = {});
              for (const evt in config.envConfig) {
                configModule[evt] = configData[evt] = config.envConfig[evt] || '';
              }
              writeFileSync(global.client.sakibinPath, JSON.stringify({
                ...require(global.client.sakibinPath),
                [config.name]: config.envConfig
              }, null, 2));
            }
            if (onLoad) {
              const eventData = {};
              eventData.api = api, eventData.models = botModel;
              await onLoad(eventData);
            }
            global.client.events.set(config.name, event);
            global.loading(`${crayon(``)}successfully deployed ${chalk.blueBright(config.name)}`, "event");
          }
          catch (err) {
            global.loading.err(`${chalk.hex("#ff0000")('')}${chalk.blueBright(ev)} failed with error : ${err.message}` + `\n`, "event");
          }



        }
      })();
    console.log(chalk.blue(`\n` + `●──LOADING DATA──●`));
    global.loading(`${crayon(``)}deployed ${chalk.blueBright(`${global.client.commands.size}`)} commands and ${chalk.blueBright(`${global.client.events.size}`)} events`, "data");
    global.loading(`${crayon(``)}deployed time : ${chalk.blueBright(((Date.now() - global.client.timeStart) / 1000).toFixed() + 's')}`, "data");
    const listenerData = {};
    listenerData.api = api;
    listenerData.models = botModel;
    const listener = require('../system/listen.js')(listenerData);
    global.custom = require('../../sakibin.js')({ api: api });
    global.handleListen = api.listenMqtt(async (error, message) => {
      if (error) {
        logger.error(error);
        return process.exit(0);
      }
      if (['presence', 'typ', 'read_receipt'].some(data => data === message.type)) return;
      return listener(message);
    });
  });
}
(async () => {
  try {
    await sequelize.authenticate();
    const authentication = {};
    const chalk = require('chalk');
    authentication.Sequelize = Sequelize;
    authentication.sequelize = sequelize;
    const models = require('../system/database/model.js')(authentication);
    logger(`deployed ${chalk.blueBright('database')} system`, "sakibin");
    const botData = {};
    botData.models = models;
    onBot(botData);
  } catch (error) { logger(`can't deploy ${chalk.blueBright('database')} system`, "sakibin") }
})();