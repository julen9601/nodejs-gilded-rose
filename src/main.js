import fs from 'fs';
import {update} from './update.js';

update('./items.json');

JSON.parse(fs.readFileSync('./items.json').toString())
  .forEach(({name, sellIn, quality}) => console.log(`${name} [${sellIn} ${quality}]`));
