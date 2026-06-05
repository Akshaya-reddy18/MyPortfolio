import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { parsePortfolioDocument } from "../src/lib/portfolio/document-guards";
import { migrateV1ToV2 } from "../src/lib/portfolio/migrate-v1";

const root = join(import.meta.dirname, "..");
const sourcePath = join(root, "portfolio_data.json");
const backupPath = join(root, "portfolio_data.v1.backup.json");
const examplePath = join(root, "docs", "schema", "portfolio_data.v2.example.json");
const publicPath = join(root, "public", "portfolio_data.json");

const write = process.argv.includes("--write");
const exampleOnly = process.argv.includes("--example-only");

function main() {
  const raw: unknown = JSON.parse(readFileSync(sourcePath, "utf8"));

  let document;
  if (Array.isArray(raw)) {
    document = migrateV1ToV2(raw);
    console.log(`Migrated ${raw.length} v1 entries → v2 document`);
  } else {
    document = parsePortfolioDocument(raw);
    console.log("Source file is already schema v2");
  }

  mkdirSync(join(root, "docs", "schema"), { recursive: true });
  writeFileSync(examplePath, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Wrote example → ${examplePath}`);

  if (exampleOnly) {
    return;
  }

  if (write) {
    if (Array.isArray(raw)) {
      copyFileSync(sourcePath, backupPath);
      console.log(`Backup → ${backupPath}`);
    }
    writeFileSync(sourcePath, `${JSON.stringify(document, null, 2)}\n`);
    writeFileSync(publicPath, `${JSON.stringify(document, null, 2)}\n`);
    console.log(`Updated → ${sourcePath} and public copy`);
  } else {
    console.log("Dry run. Pass --write to update portfolio_data.json");
  }
}

main();
