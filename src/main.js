import fs from 'fs';
import {update} from './update.js';

const itemsPath = process.argv[2];
if (itemsPath === undefined) {
  console.error("The first argument must include a path to the items JSON file");
  console.log();
  console.log("Usage (using `npm`):");
  console.log("\t$ npm run update -- src/items.json");
  console.log();
  console.log("Usage (using `node`):");
  console.log("\t$ node --experimental-vm-modules src/main.js src/items.json");
  process.exit(1);
}

update(itemsPath);

JSON.parse(fs.readFileSync(itemsPath).toString())
  .forEach(({name, sellIn, quality}) => console.log(`${name} [${sellIn} ${quality}]`));
