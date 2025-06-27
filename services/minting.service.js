const { getWalletClient } = require('../utils/wallet')
const { CONTRACT_ADDRESS, CONTRACT_ABI } = require('../utils/mint.abi')

// Get the wallet and public clients
const { walletClient, publicClient } = getWalletClient()

async function batchMintTokens(account, numberOfMints = 0) {
    try {
        const transactions = []

        // Check remaining mints first 
        const remainingMints = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getRemainingMints',
            args: [account]
        })

        console.log(`Remaining mints for ${account}: ${remainingMints}`)

        if (remainingMints < numberOfMints) {
            throw new Error(`Insufficient mint allowance. Remaining: ${remainingMints}, Requested: ${numberOfMints}`)
        }

        // Create multiple mint transactions
        for (let i = 0; i < numberOfMints; i++) {
            const { request } = await publicClient.simulateContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'mintToken',
                account
            })

            const hash = await walletClient.writeContract(request)
            transactions.push(hash)
        }

        return {
            success: true,
            transactions,
            message: `Successfully initiated ${numberOfMints} mint transactions`
        }
    } catch (error) {
        console.error('Batch mint error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Batch update scan balances (redeem functionality)
 */
async function batchUpdateScanBalances(account, holders, amounts) {
    try {
        // Validate inputs
        if (!Array.isArray(holders) || !Array.isArray(amounts)) {
            throw new Error('Holders and amounts must be arrays')
        }

        if (holders.length !== amounts.length) {
            throw new Error('Holders and amounts arrays must have the same length')
        }

        // Check if caller is owner (only owner can call batchUpdateScan)
        const owner = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'owner'
        })

        if (account.toLowerCase() !== owner.toLowerCase()) {
            throw new Error('Only contract owner can batch update scan balances')
        }

        // Simulate the transaction first
        const { request } = await publicClient.simulateContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'batchUpdateScan',
            args: [holders, amounts],
            account
        })

        // Execute the transaction
        const hash = await walletClient.writeContract(request)

        return {
            success: true,
            transactionHash: hash,
            message: `Successfully updated scan balances for ${holders.length} holders`
        }
    } catch (error) {
        console.error('Batch scan update error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Check scan status for multiple users
 */
async function checkMultipleScanBalances(userAddresses) {
    try {
        const results = []

        for (const address of userAddresses) {
            const remainingBalance = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'getRemainingScanBalance',
                args: [address]
            })

            const canBeScanned = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'canUserBeScanned',
                args: [address]
            })

            results.push({
                address,
                remainingScanBalance: remainingBalance,
                canBeScanned
            })
        }

        return {
            success: true,
            results
        }
    } catch (error) {
        console.error('Check scan balances error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Get all token holders and their balances
 */
async function getAllHoldersWithBalances() {
    try {
        const holders = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getTokenHolders'
        })

        const holdersWithBalances = []

        for (const holder of holders) {
            // Assuming token ID is 1, adjust if needed
            const balance = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'balanceOf',
                args: [holder, 1n]
            })

            holdersWithBalances.push({
                address: holder,
                balance: balance.toString()
            })
        }

        return {
            success: true,
            holders: holdersWithBalances
        }
    } catch (error) {
        console.error('Get holders error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Helper function to convert numbers to bigint for amounts
 */
const numbersToBigInt = (numbers) => {
    return numbers.map(num => BigInt(num))
}

module.exports = {
    batchMintTokens,
    batchUpdateScanBalances,
    checkMultipleScanBalances,
    getAllHoldersWithBalances,
    numbersToBigInt
}