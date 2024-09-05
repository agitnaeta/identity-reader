import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from "fs";
import path from "path";
import  { File, IncomingForm } from 'formidable';
import read from '@/app/read';


export const config = {
    api: {
        bodyParser: false,
    }
};

type ProcessedFiles = Array<[string, File]>;

const upload = async (req: NextApiRequest, res: NextApiResponse) => {

    let status = 200,
        resultBody = { status: 'ok', message: 'Files were uploaded successfully' };
    let location=""; 

    /* Get files using formidable */
    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new IncomingForm();
        const files: ProcessedFiles = [];
        form.on('file', function (field, file) {
            files.push([field, file]);
        })
        form.on('end', () => resolve(files));
        form.on('error', err => reject(err));
        form.parse(req, () => {
            //
        });
    }).catch(e => {
        console.log(e);
        status = 500;
        resultBody = {
            status: 'fail', message: 'Upload error'
        }
    });

    if (files?.length) {

        /* Create directory for uploads */
        const targetPath = path.join(process.cwd(), `/public/uploads/`);
        console.log(targetPath)
        try {
            await fs.access(targetPath);
        } catch (e:any) {
            console.log(e.message)
            await fs.mkdir(targetPath);
        }

        /* Move uploaded files to directory */
        for (const file of files) {
            const tempPath = file[1].filepath;
            const random = new Date().getTime();
            location = targetPath + random +file[1].originalFilename;
            try{
                await fs.rename(tempPath, location);
            }catch(e:any){
                console.log(e.message)
            }
            read(location,res)
        }
    }
    else{
        read(location,res)
    }
}

export default upload;