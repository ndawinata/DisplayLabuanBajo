$(document).ready(function () {
    bsCustomFileInput.init()
})

let hdwr = JSON.parse($('#my-data').data().hardware.replace(/'/g, '"'))
let data = null

function dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}


$(document).ready(function () {
    $('#kode').change((c)=>{
        axios.get("/metadata/"+ $('#kode').val())
        .then((dat)=>{
            if(dat.data.success){
                $('#kode').val(dat.data.kode)
                $('#tipe').val(dat.data.tipe)
                $('#latitude').val(dat.data.latitude)
                $('#longitude').val(dat.data.longitude)
                $('#altitude').val(dat.data.altitude)
                $('#wilayah_waktu').val(dat.data.wilayah_waktu)
                $('#tahun').val(dat.data.tahun)
                $('#nama').val(dat.data.nama)
                $('#alamat').val(dat.data.alamat)
                $('#kelurahan').val(dat.data.kelurahan)
                $('#kecamatan').val(dat.data.kecamatan)
                $('#kota_kab').val(dat.data.kota_kab)
                $('#provinsi').val(dat.data.provinsi)
                $('#nama_cp').val(dat.data.nama_cp)
                $('#jabatan_cp').val(dat.data.jabatan_cp)
                $('#hp_cp').val(dat.data.hp_cp)
                $('#stasiun_pj').val(dat.data.stasiun_pj)
                $('#alamat_pj').val(dat.data.alamat_pj)
                $('#telp_pj').val(dat.data.telp_pj)
                $('#kelurahan_pj').val(dat.data.kelurahan_pj)
                $('#kecamatan_pj').val(dat.data.kecamatan_pj)
                $('#kota_kab_pj').val(dat.data.kota_kab_pj)
                $('#provinsi_pj').val(dat.data.provinsi_pj)
                $('#jabatan_cp_site').val(dat.data.jabatan_cp_site)
                $('#nama_cp_site').val(dat.data.nama_cp_site)
                $('#no_cp_site').val(dat.data.no_cp_site)
                $('#akses_lokasi').val(dat.data.akses_lokasi)
                $('#status').val(dat.data.status)
                $('#ruangan').val(dat.data.ruangan)
                $('#par_denah').html(`<img src="data:image/png;base64,${dat.data.denah}" style="width:30%;" alt="foto_denah">`)
                $('#par_peta_lokasi').html(`<img src="data:image/png;base64,${dat.data.peta_lokasi}" style="width:30%;" alt="foto_denah">`)
                hdwr.map((c)=>{
                    c.sub.map((d)=>{
                        if(dat.data[c.key]==null){
                            $('#'+c.key+"_"+d).val(null)
                        }else{
                            $('#'+c.key+"_"+d).val(dat.data[c.key][d])
                        }
                    })
                })
            }else{
                $('input:not([name="kode"])').val('')
                $('#par_denah').empty()
                $('#par_peta_lokasi').empty()
            }

        })
    })
    
});