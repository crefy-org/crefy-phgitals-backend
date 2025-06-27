const tokenService = require('../services/token.service');
const mintingService = require('../services/minting.service');
const User = require('../models/user.model');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserTokens = async (req, res) => {
    try {
        const tokens = await tokenService.getUserTokens(req.user._id);
        res.json(tokens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.mintToken = async (req, res) => {
    try {
        console.log('req.user', req.user);
        const token = await tokenService.mintToken(req.user._id);
        console.log('token', token);
        res.json(token);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.batchMintTokens = async (req, res) => {
    try {
        const { numberOfMints } = req.body;
        const account = req.user.address; // Assuming user has a wallet address field

        if (!numberOfMints || numberOfMints <= 0) {
            return res.status(400).json({ error: 'Invalid number of mints specified' });
        }

        const result = await mintingService.batchMintTokens(account, numberOfMints);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json({
            success: true,
            transactions: result.transactions,
            message: result.message
        });
    } catch (error) {
        console.error('Batch mint error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.redeemToken = async (req, res) => {
    console.log('req.user', req.user);
    try {
        console.log('req.params.tokenId', req.params.tokenId);
        console.log('req.body.data.userId', req.body.data.userId);
        console.log('req.body.adminId', req.body);
        const token = await tokenService.redeemToken(
            req.params.tokenId,
            req.body.data.userId,
        );
        res.json(token);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.generateQRCode = async (req, res) => {
    try {
        const qrCode = await tokenService.generateQRCode(req.params.tokenId, req.user._id);
        res.json({ qrCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.batchUpdateScanBalances = async (req, res) => {
    try {
        const { holders, amounts } = req.body;
        console.log('holders', holders);
        const account = req.user.address; 

        const result = await mintingService.batchUpdateScanBalances(account, holders, amounts);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json({
            success: true,
            transactionHash: result.transactionHash,
            message: result.message
        });
    } catch (error) {
        console.error('Batch scan update error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.checkMultipleScanBalances = async (req, res) => {
    try {
        const { userAddresses } = req.body;

        const result = await mintingService.checkMultipleScanBalances(userAddresses);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json({
            success: true,
            results: result.results
        });
    } catch (error) {
        console.error('Check scan balances error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHoldersWithBalances = async (req, res) => {
    try {
        const result = await mintingService.getAllHoldersWithBalances();

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json({
            success: true,
            holders: result.holders
        });
    } catch (error) {
        console.error('Get holders error:', error);
        res.status(500).json({ error: error.message });
    }
};