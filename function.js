import { ethers } from "ethers"
import { general } from "./settings.js"
import config from "./config.json" assert {type: "json"}
import abi from "./abi.json" assert {type: "json"}
import { delayTx, logger,amountConsole } from "./helpers.js"





export async function deposit(key, tokenName){
    try{
        const provider = new ethers.JsonRpcProvider(general.ethereum)
        const wallet = new ethers.Wallet(key, provider)
        const depositContract = new ethers.Contract(config.depositAddress[tokenName], abi.depositContract, provider)
        const tokenContract = new ethers.Contract(config.tokens[tokenName], abi.erc20, provider)

        const tokenBalance = await tokenContract.balanceOf(wallet.address)
        if(general.lowestBalance >= Number(ethers.formatUnits(tokenBalance, 18))){
            const allowance = await tokenContract.allowance(wallet.address, depositContract.target)
            if(allowance < tokenBalance){
                const txEstimateApprove = await tokenContract.connect(wallet).approve.estimateGas(
                    depositContract.target,
                    tokenBalance
                )
                const txApprove = await tokenContract.connect(wallet).approve(
                    depositContract.target,
                    tokenBalance
                )
                await txApprove.wait()
                await delayTx(15,20)
            }
    
            const gasPrice = (await provider.getFeeData()).gasPrice
            const txEstimate = await depositContract.connect(wallet).deposit.estimateGas(
                wallet.address,
                tokenBalance
            )
            const tx = await depositContract.connect(wallet).deposit(
                wallet.address,
                tokenBalance,
                {
                    gasPrice: gasPrice * 105n/100n
                }
            ) 
            await tx.wait()
            logger.info(`${amountConsole(tokenBalance)} ${tokenName} deposited`)
        }else{
            logger.warn(`Amount lower than ${general.lowestBalance}`)
        }


    }catch(e){
        logger.error(`Inknown error - ${e}`)
    }
}