$(document).ready(function () {
    bsCustomFileInput.init()
})

let state = {
    "sblm_pm":"",
    "pm": {},
    "ssd_pm": {},
    "rekomendasi": {},
}

// input data disini
let data = JSON.parse($('#my-data').data().initialdata.replace(/None/g, 'null').replace(/'/g, '"'))

let tabel = Object.keys(state)

let prep = JSON.parse($('#my-data').data().prep.replace(/'/g, '"'))
let sblm_pm = JSON.parse($('#my-data').data().sblm_pm.replace(/'/g, '"'))
let pm = JSON.parse($('#my-data').data().pm.replace(/'/g, '"'))
let ssd_pm = JSON.parse($('#my-data').data().ssd_pm.replace(/'/g, '"'))
let rekomendasi = JSON.parse($('#my-data').data().rekomendasi.replace(/'/g, '"'))

$(document).ready(() => {
    let idUploadFile = $('form [type="file"]').map(function () {
        return this.id;
    }).get();

    var reader = new FileReader();

    let tgl = moment().format("YYYY-MM-DD hh:mm:ss")

    prep[0].sub.map((c)=>{
        $(`#${c.key}`).change(() => {
            if(c.key == 'kode'){
                let kode = $(`#${c.key}`).val().toUpperCase()
                data.sblm_pm.kode = kode
                data.pm.kode = kode
                data.ssd_pm.kode = kode
                data.rekomendasi.kode = kode
            }
            data.sblm_pm[c.key] = $(`#${c.key}`).val()
        })
    })


    sblm_pm.map((c)=>{
        c.sub.map((d)=>{
            $(`#${c.key}_${d.key}`).change(() => {
                reader.readAsDataURL($(`#${c.key}_${d.key}`).prop('files')[0])
                reader.onloadend = () => {
                    data.sblm_pm[`${c.key}_${d.key}`] = reader.result.split(',')[1]
                }
            })
        })
    })

    pm.map((c)=>{
        c.sub.map((d)=>{
            if(d.model == 'select'){
                $(`#${c.key}_${d.key}`).change(() => {
                    data.pm[`${c.key}`][`${d.key}`] = $(`#${c.key}_${d.key}`).val()
                })
            }
            if(d.type == 'file'){
                $(`#${c.key}_${d.key}`).change(() => {
                    reader.readAsDataURL($(`#${c.key}_${d.key}`).prop('files')[0])
                    reader.onloadend = () => {
                        data.pm[`${c.key}_${d.key}`] = reader.result.split(',')[1]
                    }
                })
            }
            if(d.type == 'text' && d.model == 'input'){
                $(`#${c.key}_${d.key}`).change(() => {
                    data.pm[`${c.key}_${d.key}`] = $(`#${c.key}_${d.key}`).val()
                })
            }

            if(d.sup != undefined ){
                d.sup.map((e)=>{
                    if(e.type == 'file'){
                        $(`#${c.key}_${d.key}_${e.key}`).change(() => {
                            reader.readAsDataURL($(`#${c.key}_${d.key}_${e.key}`).prop('files')[0])
                            reader.onloadend = () => {
                                data.pm[`${c.key}_${d.key}_${e.key}`] = reader.result.split(',')[1]
                            }
                        })
                    }
                    if(e.type == 'text' && e.model == 'input'){
                        $(`#${c.key}_${d.key}_${e.key}`).change(() => {
                            data.pm[`${c.key}`][`${d.key}`][`${e.key}`] = $(`#${c.key}_${d.key}_${e.key}`).val()
                        })
                    }
                })
            }
        })
        // $(`#${c.key}_${d.key}`).change(() => {
        //     data.ssd_pm[`#${c.key}_${d.key}`] = $(`#${c.key}_${d.key}`).val()
        // })
    })

    ssd_pm.map((c)=>{
        c.sub.map((d)=>{
            $(`#x_${c.key}_${d.key}`).change(() => {
                reader.readAsDataURL($(`#x_${c.key}_${d.key}`).prop('files')[0])
                reader.onloadend = () => {
                    data.ssd_pm[`${c.key}_${d.key}`] = reader.result.split(',')[1]
                }
            })
        })
    })

    $(`#rekom`).change(() => {
        data.rekomendasi.rekomendasi_rekom = $(`#rekom`).val()
    })

    $(`#status`).change(() => {
        data.rekomendasi.status = $(`#status`).val()
    })

    
    $('#spt').change(()=>{
        data.sblm_pm.spt = $("#spt").val()
    })

    // ubah datetime
    data.sblm_pm.datetime = tgl
    data.pm.datetime = tgl
    data.ssd_pm.datetime = tgl
    data.rekomendasi.datetime = tgl


    $("#btn_submit").click((e) => {
        e.preventDefault()
        if (data.sblm_pm.kode != null && data.sblm_pm.spt != null && data.sblm_pm.spt != null) {
            e.preventDefault()
            const formData = new FormData();
            
            let dataUp = {
                sblm_pm:data.sblm_pm,
                pm:data.pm,
                ssd_pm:data.ssd_pm,
                rekomendasi:data.rekomendasi
            }

            axios.post('/maintenance', dataUp, {
                
                headers: {
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                responseType:'blob'
            })
            .then((dat) => {
                // dat.data.pipe(fs.)
                let blob = new Blob([dat.data], {
                    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                }) // assume the file is PDF
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = "Laporan_Preventif.docx"
                link.click()
                link.remove()
            })
        } else {
            e.preventDefault()
            alert("Kode, SPT & Tim tidak boleh kosong !")
        }
    })

})