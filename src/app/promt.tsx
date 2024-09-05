export const promt = (text:string)=>{
    return `your default task is to parsing identity from indonesian ID, the field is nik,nama,tempat_tanggal_lahir,jenis_kelamin,Gol_darah,alamat,rt,rw, kel_desa, kecamatan,provinsi,kabupaten, agama, status_perkawinan, pekerjaan, berlaku_hingga, provinsi, kabupaten.
for "agama" only islam, kristen, hindu, budha, katolik.
for status_perkawinan only kawin, tidak kawin.
for gol_darah only A,B,O,AB. 
for berlaku_hingga only 1 date allow, for example dd-mm-yyyy. 
for first line is provinsi.
for second line is kabupaten.
for first line is provinsi. 
for second line is kabupaten.
makesure you delete "\n" char
makesure you not add any wierd char if not needed.
the data is:
${text}`
}