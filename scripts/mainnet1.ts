import { ethers, network } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";
import { BigNumber } from "ethers";

async function main() {
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const DAIHolder = "0xaD0135AF20fa82E106607257143d0060A7eB5cBf";
    const DAIADDRESS = await ethers.getContractAt("IUSDT", DAI);
    // const [owner, holder1, holder2, holder3] = await ethers.getSigners();
    const [owner, holder1] = await ethers.getSigners();
    //////////////////////////////////////////////////////////
    //deploy staking token
    //////////////////////////////////////////////////////////
//     const stakeToken = await ethers.getContractFactory("StakingToken");
//    //@ts-ignore
//     const StakedToken = await stakeToken.deploy("DAI", "DAI", 100000000);
//     await StakedToken.deployed();
   
//     console.log(`Your staked token is ${StakedToken.address}`);
   
    //////////////////////////////////////////////////////////
    //deploy staking contract
    //////////////////////////////////////////////////////////
   
    const stakeContract = await ethers.getContractFactory("StakERC20");
    
     const StakedContract = await stakeContract.deploy();
     await StakedContract.deployed();
    
     console.log(`Your staking contract is ${StakedContract.address}`);
    
      //////////////////////////////////////////////////////////
    //deploy reward contract
    //////////////////////////////////////////////////////////
   
    const rewardContract = await ethers.getContractFactory("rewardToken");
    
    const RewardContract = await rewardContract.deploy("REWARD", "RWD", 100000000, StakedContract.address);
    await RewardContract.deployed();
   
    console.log(`Your reward token contract is ${RewardContract.address}`);
   
   //////////////////////////////////////////////////////////
    //contract interaction begins here
    //////////////////////////////////////////////////////////
   
    const stakeContractBalance = await RewardContract.balanceOf(StakedContract.address);
    console.log(`Your staked contract balance is ${stakeContractBalance}`);
   
    const setStakedToken = await StakedContract.setStakeToken(DAI);
    const setRewardToken = await StakedContract.setRewardToken(RewardContract.address);
    console.log(`reward and stake tokens set sucessfully`);
   


    //////////////////
    ///IMPERSONATE A DAI HOLDER FIRST
    const helpers = require("@nomicfoundation/hardhat-network-helpers");

    const address = DAIHolder;
    await helpers.impersonateAccount(address);
    const impersonatedSigner = await ethers.getSigner(address);

    const balance = await DAIADDRESS.connect(impersonatedSigner).balanceOf(impersonatedSigner.address);
    console.log(`balance is ${balance}`);


   


    /////////////////
    ///staking
   const stakeDai = await ethers.utils.parseEther("50");
   const approve = await DAIADDRESS.connect(impersonatedSigner).approve(StakedContract.address, stakeDai);
   console.log(`infinit ammount approved`);
   const stake = await StakedContract.connect(impersonatedSigner).stake(stakeDai);
   console.log(`you just staked`);
   
   await ethers.provider.send("evm_mine", [1708037999]);
   
   const updateReward = await StakedContract.connect(impersonatedSigner).updateReward();
   const userDetails = await StakedContract.userInfo(impersonatedSigner.address);
   console.log(userDetails);
   
   const withdrawReward = await StakedContract.connect(impersonatedSigner).claimReward(8000000);
   const userDetails1 = await StakedContract.userInfo(impersonatedSigner.address);
   console.log(`after withdrawing reward`);
   console.log(userDetails1);
   
   const claimStaked = await StakedContract.connect(impersonatedSigner).withdrawStaked(5000000);
   const userDetails2 = await StakedContract.userInfo(impersonatedSigner.address);
   console.log(`after withdrawing staked`);
   console.log(userDetails2);
   }
   main().catch((error) => {
       console.error(error);
       process.exitCode = 1;
     });