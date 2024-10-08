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

    let resultBody = { status: 'ok', message: 'Files were uploaded successfully' };
    let location=""; 
    const targetPath = path.join(process.cwd(), `/public/uploads/`);
    console.log(targetPath);
    console.log(req.headers['content-type']);
   try{

     /* Get files using formidable */
     const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
       
        const form = new IncomingForm({
            uploadDir: targetPath, // Set a directory to store uploaded files
            keepExtensions: true, 
            maxFileSize: 100 * 1024 * 1024,  // Adjust as needed
            createDirsFromUploads: true,  
        });
        const files: ProcessedFiles = [];
       
        form.on('file', function (field, file) {
            console.log("Field:", field);   // Check field name
            console.log("File:", file);     // Check file object
            files.push([field, file]);
        });

        form.on('end', () => {
            console.log("uploaded")
            console.log(files)
            resolve(files)
        });
        form.on('error', err => {
            console.log(`rejected ${err}`)
            reject(err)
        });
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log('Error parsing form:', err);
                res.end('Error parsing form');
                return;
            }
            console.log('Form parsed:', fields, files);
        });
        
    });

    if (files?.length) {

        /* Create directory for uploads */
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
        resultBody = {
            status: 'fail', message: 'Upload error'
        }
        return res.status(500).json(resultBody)
    }
   }catch(e:any){
    return res.status(500).json(e.message)
   }

    
}

export default upload;