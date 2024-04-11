import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const borrowLogicArtifact = await deploy("BorrowLogic", {
    from: deployer,
    args: [],
    ...COMMON_DEPLOY_PARAMS,
  });
  console.log("deployer");
  console.log(deployer);
  let currentNonce = await (
    await hre.ethers.getSigner(deployer)
  ).getTransactionCount();
  console.log(currentNonce)
  console.log("deployer");
  await Promise.all([
    deploy("SupplyLogic", {
      from: deployer,
      args: [],
      nonce: currentNonce++,
      ...COMMON_DEPLOY_PARAMS,
    }),
    deploy("LiquidationLogic", {
      from: deployer,
      ...COMMON_DEPLOY_PARAMS,
      nonce: currentNonce++,
    }),
    deploy("EModeLogic", {
      nonce: currentNonce++,
      from: deployer,
      ...COMMON_DEPLOY_PARAMS,
    }),
    deploy("BridgeLogic", {
      from: deployer,
      nonce: currentNonce++,
      ...COMMON_DEPLOY_PARAMS,
    }),
    deploy("ConfiguratorLogic", {
      from: deployer,
      nonce: currentNonce++,
      ...COMMON_DEPLOY_PARAMS,
    }),
    deploy("FlashLoanLogic", {
      from: deployer,
      nonce: currentNonce++,
      ...COMMON_DEPLOY_PARAMS,
      libraries: {
        BorrowLogic: borrowLogicArtifact.address,
      },
    }),
    deploy("PoolLogic", {
      from: deployer,
      nonce: currentNonce++,
      ...COMMON_DEPLOY_PARAMS,
    }),
  ]);

  return true;
};

func.id = "LogicLibraries";
func.tags = ["core", "logic"];

export default func;
