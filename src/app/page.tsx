'use client'
import Image from 'next/image'
import ktp from '../../public/ktp.jpeg'
import { CodeBlock } from 'react-code-blocks'
export default function Home() {
  return (
    <main className="row min-h-screen items-center justify-between p-24">
      <div className='col'>
        <div className='text-lg text-center'>
          IdentityReader
        </div>
      <div className='text-sm text-center'>Change From Image Identity to json</div>
      </div>
      <div className='col mt-2'>
      <Image alt='Image' 
            width={300}
            height={300}
            src={ktp.src}/>
            <CodeBlock text={`{
              "Provinsi": "DKI JAKARTA",
              "Kota": "JAKARTA BARAT",
              "NIK": "3171234567890123",
              "Nama": "MIRA SETIAWAN",
              "TempatLahir": "JAKARTA",
              "TanggalLahir": "18-02-1986",
              "JenisKelamin": "PEREMPUAN",
              "GolonganDarah": "B",
              "Alamat": "JL. PASTI CEPAT A7/66",
              "RT": "007",
              "RW": "008",
              "Kelurahan": "PEGADUNGAN",
              "Kecamatan": "KALIDERES",
              "Agama": "ISLAM",
              "StatusPerkawinan": "KAWIN",
              "Pekerjaan": "PEGAWAI SWASTA",
              "Kewarganegaraan": "WNI",
              "BerlakuHingga": "22-02-2017"
          }`}/>
      </div>
      <div className='col mt-2'>
        <p>Exmple Request</p>
        <CodeBlock text={`curl --location '../api/read' \
            --header 'Content-Type: application/json' \
            --data '{
                "url":"http://yourdomain.com/mage.jpeg"
            }`}/>
      </div>
   
      
        
    </main>
  )
}
