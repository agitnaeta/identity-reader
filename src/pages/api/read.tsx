import type { NextApiRequest, NextApiResponse } from 'next'
import read from '@/app/read';
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) 
{

    read(req.body.url,res)
}

