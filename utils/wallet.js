const { createPublicClient, createWalletClient, http, publicActions } = require('viem');
const { scrollSepolia } = require('viem/chains');
const dotenv = require('dotenv');
const { privateKeyToAccount } = require('viem/accounts');

dotenv.config();

const getWalletClient = () => {
  // Ensure the private key is properly formatted
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY is not defined in environment variables');
  }

  // Remove any potential 0x prefix if present
  const cleanedPrivateKey = privateKey.startsWith('0x')
    ? privateKey.slice(2)
    : privateKey;

  const account = privateKeyToAccount(`0x${cleanedPrivateKey}`);

  // Wallet client is used to sign transactions and messages
  const walletClient = createWalletClient({
    account,
    chain: scrollSepolia,
    transport: http()
  }).extend(publicActions);

  // Public client is used to read data from the blockchain
  const publicClient = createPublicClient({
    chain: scrollSepolia,
    transport: http()
  });

  return {
    walletClient,
    publicClient,
    account
  };
}

module.exports = {
  getWalletClient
}