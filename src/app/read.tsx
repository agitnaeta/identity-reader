import { createWorker } from 'tesseract.js';
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promt } from '@/app/promt';



export default function read(
    image: string,
    res: NextApiResponse
  ) {
    load(res,image)
  }


async function load(res:NextApiResponse, urlImage: string) {
    try{
        const worker = await createWorker('ind');
        const ret = await worker.recognize(urlImage);
        await worker.terminate();
        return cleanUpGemini(ret.data.text,res)
    }catch(error:any){
        return res.status(500).json(error.message)
    }
}
async function cleanUpGemini(text:string,res:NextApiResponse)
{
    try{
        const key: string  = process.env.GEMINI_AI_KEY ?? "";
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" ,  generationConfig: { responseMimeType: "application/json" },});
        const prompt = promt(text)
        const result = await model.generateContent(prompt);
        return res.status(200).json(JSON.parse(result.response.text()))

    }catch(error:any){
        return res.status(500).json({
            "info": "our source limited for now, if you found this helpfull you can donate https://ko-fi.com/agitnaeta"
        })
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
            { role: "user", content:  promt(text)},
            ],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
        });
        const data:any= JSON.parse(completion.choices[0].message.content ?? '')
        return res.status(200).json(data)
    }
    catch(error:any){
        console.log(error.message)
    }
      
}




async function cleanUpLama(text:string,res:NextApiResponse) {
    const url = process.env.AI_URL+"/api/generate"; 
    try{
        const request = await axios.post(url,{
            "model": "ktpai",
            "prompt": promt(text),
            "format": "json",
            "stream": false
        })
        
        const data:any= JSON.parse(request.data.response)
        console.log(data)
        return res.status(200).json(data)
    }
    catch(error){
        throw new Error('Failed loading data')
    }
      
}