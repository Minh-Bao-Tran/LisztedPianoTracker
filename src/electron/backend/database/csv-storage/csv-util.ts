import path from "node:path";

import { readFileSync, writeFile } from "node:fs";

const STORAGE_DIR = path.join(process.cwd(), "storage-files");

export function readAllCSV(file: string): string[][] {
  const filedir = path.join(STORAGE_DIR, file);

  const rawData = readFileSync(filedir, { encoding: "utf-8" });
  //Transform raw data into each csv row
  const transformedRow = rawData.trim().split("\n");

  //Split each row into an array
  const data = transformedRow.map((row: string) => {
    return row.trim().split(",");
  });
  return data;
}

export async function writeCSV(file: string, data: string[]) {
  const filedir = path.join(STORAGE_DIR, file);

  const csvData: string = data.join("\n");

  writeFile(filedir, csvData, "utf8", (err: any) => {
    if (err) {
      throw new Error(err.message);
    }
    console.log("WriteFile Successfully");
  });
}
