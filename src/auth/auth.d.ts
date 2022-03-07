type Bip = 118 | 330

type Wallet =
  | SingleWallet
  | PreconfiguredWallet
  | MultisigWallet
  | LedgerWallet
  | LatticeWallet

type LocalWallet = SingleWallet | MultisigWallet // wallet with name

interface SingleWallet {
  address: string
  name: string
  lock?: boolean
}

interface PreconfiguredWallet extends SingleWallet {
  mnemonic: string
}

interface MultisigWallet extends SingleWallet {
  multisig: true
}

interface LedgerWallet {
  address: string
  ledger: true
  index: number
  bluetooth: boolean
}

interface LatticeWallet {
  address: string
  lattice: true
  deviceId: string
  index: number
  token: string
}

interface StoredWallet extends SingleWallet {
  encrypted: string
}

interface StoredWalletLegacy extends SingleWallet {
  wallet: string
}
