console.clear();
const express = require("express");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { spawn } = require("child_process");

const app = express();
const PORT = 3023;

const logger = require("./sakibinc.js");
const STATE_FILE = path.join(__dirname, "../../sakibinstate.json");

let botProcess = null;
global.countRestart = 0;

// Middleware
app.use(express.static(path.join(__dirname, 'website')));
app.use(express.json({ limit: '1mb' }));

// Serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "website/sakibin.html"));
});

// API: Save appstate and restart bot
app.post("/update-appstate", (req, res) => {
  const appstate = req.body;

  if (!Array.isArray(appstate) || !appstate.every(cookie => cookie.key && cookie.value)) {
    return res.status(400).json({ error: "Invalid appstate format. Expected array of key/value cookies." });
  }

  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(appstate, null, 2), "utf8");
    res.json({ message: "Appstate saved successfully. Restarting bot..." });
    restartBot();
  } catch (err) {
    res.status(500).json({ error: "Failed to save appstate", details: err.message });
  }
});

// Start control server
app.listen(PORT, () => {
  console.log(chalk.greenBright(`Control server running at http://localhost:${PORT}`));
  logger.loader(`control server deployed on port ${chalk.blueBright(PORT)}`);
  startBot("initial start");
});

// Start or restart the bot child process
function startBot(message) {
  if (message) logger(message, "starting");

  console.log(chalk.blue("DEPLOYING MAIN SYSTEM"));
  logger.loader(`deploying bot process...`);

  botProcess = spawn("node", ["--trace-warnings", "--async-stack-traces", "sakibinb.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  botProcess.on("close", (codeExit) => {
    if (codeExit !== 0 && global.countRestart < 5) {
      global.countRestart += 1;
      console.log(chalk.yellow(`Bot crashed. Restarting... (${global.countRestart})`));
      startBot();
    }
  });

  botProcess.on("error", (error) => {
    logger("Bot process error: " + JSON.stringify(error), "error");
  });
}

// Kill and restart the bot
function restartBot() {
  logger("Restarting full system...", "info");

  const scriptPath = process.argv[1]; // Full path to the current script
  const args = process.argv.slice(2); // Pass original arguments if any

  // Spawn a new process of this script
  const subprocess = spawn("node", [scriptPath, ...args], {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  });

  // Exit current process after spawning new one
  subprocess.on("spawn", () => {
    logger("Spawned new process, exiting current one...", "info");
    process.exit(0);
  });

  subprocess.on("error", (err) => {
    logger("Failed to restart the full system: " + err.message, "error");
  });
}
