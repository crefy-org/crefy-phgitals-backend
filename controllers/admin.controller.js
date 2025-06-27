// controllers/admin.controller.js
const User = require('../models/user.model');
const CoffeeToken = require('../models/coffeeToken.model');
const mongoose = require('mongoose');

// Get all users (admin only)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all users with their tokens (admin only)
exports.getUsersWithTokens = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'coffeetokens',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'tokens'
                }
            },
            {
                $project: {
                    __v: 0,
                    'tokens.__v': 0
                }
            }
        ]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get simplified user data for mobile display
exports.getUsersForMobile = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'coffeetokens',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'tokens'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    wallet_address: 1,
                    coffee_tokens: 1,
                    tokenCount: { $size: '$tokens' },
                    mintedTokens: {
                        $map: {
                            input: '$tokens',
                            as: 'token',
                            in: {
                                token_id: '$$token.token_id',
                                status: '$$token.status',
                                created_at: '$$token.created_at'
                            }
                        }
                    }
                }
            },
            { $sort: { name: 1 } }
        ]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Single bulkMintTokens implementation
exports.bulkMintTokens = async (req, res) => {
    try {
        const { userIds, tokenData } = req.body;

        if (!userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ error: 'Invalid user IDs array' });
        }

        const validUserIds = userIds.filter(id => mongoose.Types.ObjectId.isValid(id));
        if (validUserIds.length !== userIds.length) {
            return res.status(400).json({ error: 'One or more invalid user IDs' });
        }

        const users = await User.find({ _id: { $in: validUserIds } });
        if (users.length !== validUserIds.length) {
            return res.status(404).json({ error: 'One or more users not found' });
        }

        const tokens = [];
        const now = new Date();

        for (const userId of validUserIds) {
            const tokenId = new mongoose.Types.ObjectId().toString();
            const tokenObj = {
                user: userId,
                token_id: tokenId,
                status: 'issued',
                created_at: now
            };

            if (tokenData && tokenData[userId]) {
                tokenObj.metadata = tokenData[userId];
            }
            tokens.push(tokenObj);
        }

        const createdTokens = await CoffeeToken.insertMany(tokens);
        const updateOps = validUserIds.map(userId => ({
            updateOne: {
                filter: { _id: userId },
                update: { $inc: { coffee_tokens: 1 } }
            }
        }));

        await User.bulkWrite(updateOps);

        res.json({
            message: `Successfully minted ${createdTokens.length} tokens`,
            count: createdTokens.length,
            tokens: createdTokens.map(t => ({
                token_id: t.token_id,
                user_id: t.user,
                status: t.status
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during bulk mint' });
    }
};