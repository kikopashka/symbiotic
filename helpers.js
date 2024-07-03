import { ethers } from "ethers"
import { general } from "./settings.js"
import winston from "winston"

export async function gasPriceL1(){
  try{
  const provider = new ethers.JsonRpcProvider(general.ethereum)
  const gasPrice = (await provider.getFeeData()).gasPrice;
  const gwei = ethers.formatUnits(gasPrice, 'gwei');
  await delay(10000)
  return gwei;
  } catch(e){
    await gasPriceL1();
  }
}


export async function delayTx(min, max) {           //тут в секундах
  let number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
  //logger.info(`Delay ${number / 1000} seconds after transaction is started...`)
  await delay(number)
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function amountConsole(amount){
  let decimals = 18
  let amountWithDecimals = ethers.formatUnits(amount, decimals)
  return amountWithDecimals
}

export const logger = winston.createLogger({
  format: winston.format.combine(
      winston.format.colorize({
        all: false,
        colors: { error: 'red' } 
      }),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs.log",
      level: "info"
    })
  ]
});





export async function randomDelay(min, max) {
  let number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
  logger.info(`Delay ${number / 1000}  started...`)
  await delay(number)
}