import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            throw new Error('Invalid ID');
        }

        const existingUser = await prismadb.user.findUnique({
            where: {
                id: userId
            }
        });

        const followersCount = await prismadb.user.count({
            where: {
                followingIds: {
                    has: userId,
                }
            }
        });

        return res.status(200).json({ ...existingUser, followersCount });

    } catch (error) {
        console.log(error);
        res.status(400).end();
    }
}