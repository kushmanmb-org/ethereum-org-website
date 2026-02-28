export const DEPOSIT_CONTRACT_ADDRESS =
  "0x00000000219ab540356cBB839Cbe05303d7705Fa"

export interface ContractMetadata {
  address: string
  owner?: string
  manager?: string
}

export const WETH_CONTRACT: ContractMetadata = {
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  owner: "Yaketh.eth",
  manager: "0x6fb9e80dDd0f5DC99D7cB38b07e8b298A57bF253",
}
