import { deposit } from "./function.js"
import fs from "fs"
import { logger, randomDelay } from "./helpers.js"
import { general } from "./settings.js"






const privates = fs.readFileSync("private.txt").toString().replace(/\r\n/g,'\n').split('\n');


for(let i = 0; i < privates.length; i++){
    logger.info(`Starting with wallet ${i+1}/${privates.length}`)
    await deposit(privates[i], general.token)
    await randomDelay(general.minDelay, general.maxDelay)
}




