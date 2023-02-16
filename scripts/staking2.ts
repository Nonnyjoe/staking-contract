import {ethers, network} from "hardhat";
//import { time } from "@nomicfoundation/hardhat-network-helpers";

async function main() {
 const [owner, holder1] = await ethers.getSigners();
 //////////////////////////////////////////////////////////
 //deploy staking token
 //////////////////////////////////////////////////////////
 const stakeToken = await ethers.getContractFactory("StakingToken");
//@ts-ignore
 const StakedToken = await stakeToken.deploy("DAI", "DAI", 100000000);
 await StakedToken.deployed();

 console.log(`Your staked token is ${StakedToken.address}`);

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
 
 const RewardContract = await rewardContract.deploy("REWARD", "RWD", 100000000, "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
 await RewardContract.deployed();

 console.log(`Your reward token contract is ${RewardContract.address}`);

//////////////////////////////////////////////////////////
 //contract interaction begins here
 //////////////////////////////////////////////////////////

 const stakeContractBalance = await RewardContract.balanceOf(StakedContract.address);
 console.log(`Your staked contract balance is ${stakeContractBalance}`);

 const setStakedToken = await StakedContract.setStakeToken(StakedToken.address);
 const setRewardToken = await StakedContract.setRewardToken(RewardContract.address);
 console.log(`reward and stake tokens set sucessfully`);

 /////////////////
 ///staking
const approve = await StakedToken.approve(StakedContract.address, 1000000000000);
console.log(`infinit ammount approved`);
const stake = await StakedContract.stake(50000000);
console.log(`you just staked`);

await ethers.provider.send("evm_mine", [1708037999]);

const updateReward = await StakedContract.updateReward();
const userDetails = await StakedContract.userInfo(owner.address);
console.log(userDetails);

const withdrawReward = await StakedContract.claimReward(8000000);
const userDetails1 = await StakedContract.userInfo(owner.address);
console.log(`after withdrawing reward`);
console.log(userDetails1);

const claimStaked = await StakedContract.withdrawStaked(5000000);
const userDetails2 = await StakedContract.userInfo(owner.address);
console.log(`after withdrawing staked`);
console.log(userDetails2);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
