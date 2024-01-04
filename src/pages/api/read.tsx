import { createWorker } from 'tesseract.js';
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';
 


async function load(res:NextApiResponse, urlImage: string) {
    try{
        const worker = await createWorker('ind');
        const ret = await worker.recognize(urlImage);
        await worker.terminate();
        return cleanUp(ret.data.text,res)
    }catch(error:any){
        return res.status(500).json(error.message)
    }
}


async function cleanUp(text:string,res:NextApiResponse) {
    const openAI = new OpenAI({
        apiKey:process.env.OPEN_AI_KEY
    })
    try{
        const completion = await openAI.chat.completions.create({
            messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output JSON.",
            },
            { role: "user", content: `Parsing this to json format ${text}, make rt & rw as diff key` },
            ],
            model: "gpt-3.5-turbo-1106",
            response_format: { type: "json_object" },
        });

        const data:any= JSON.parse(completion.choices[0].message.content ?? '')
        return res.status(200).json(data)
    }
    catch(error){
        throw new Error('Failed loading data')
    }
      
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    load(res,req.body.url)
}