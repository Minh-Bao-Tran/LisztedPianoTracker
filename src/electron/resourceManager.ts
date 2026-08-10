import osUtils from "os-utils";
import fs from "fs";
import { BrowserWindow } from "electron";

const POLLING_INTERVAL = 500;

function getcpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}

function getramUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: `${Math.floor(total / 1000000000)}GB`,
    usage: 1 - free / total,
  };
}

export function getStaticData(){
  return "static Data"
}

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getcpuUsage();
    const ramUsage = getramUsage();
    const storage = getStorageData();
    mainWindow.webContents.send("statistics", {
      cpuUsage: cpuUsage,
      ramUsage: ramUsage,
      storage: storage.usage,
    });
  }, POLLING_INTERVAL);
}
