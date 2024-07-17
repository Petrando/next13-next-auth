import {
    AlignmentType,
    convertInchesToTwip,
    Document,
    Footer,
    HeadingLevel,
    ImageRun,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TabStopPosition,
    UnderlineType,
    LevelFormat,
    TableBorders,
    TextRun,
    WidthType,
    PageBreak,
} from "docx";
import { ICentre, IOperator, IVendor } from "@/types";
import { CalendarDate } from "@internationalized/date";
import { localizeDate, displayIDR, dateDiff } from "@/lib/functions";

const textRun = (text:string, bold:boolean = false) => {
    return (
        new TextRun({
            text, bold
        })
    )
}

type tTableContentParam = { 
    label: string;
    width?: number;
    bold?: boolean;
}

const tableAsContent = (param1: tTableContentParam, param2: tTableContentParam, tableWidth:number = 100) => {
    const { label, width = 25, bold = false } = param1
    const { label: label2, width: width2 = 70, bold: bold2 = false } = param2

    return (
        new Table({
            borders: TableBorders.NONE,                                                                                        
            rows: [
                new TableRow({
                    children:[
                        new TableCell({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: width
                            },
                            children: [
                                new Paragraph({
                                    children:[
                                        textRun(label, bold)
                                    ], 
                                    heading: HeadingLevel.HEADING_6,
                                })
                            ]
                        }),
                        new TableCell({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: 5
                            },
                            children: [
                                new Paragraph({text: label!==""?":":"", heading: HeadingLevel.HEADING_6,})
                            ]
                        }),
                        new TableCell({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: width2
                            },
                            children: [
                                new Paragraph({
                                    children:[
                                        textRun(label2, bold2)
                                    ], 
                                    heading: HeadingLevel.HEADING_6
                                }),
                            ]
                        })
                    ],                                                        
                })
            ],
            width:{
                size: tableWidth, type: WidthType.PERCENTAGE
            }
        })
    )
}

const tableAsListItem = (idx: number, contents: Table[]) => {
    return (
        new Table({
            borders: TableBorders.NONE,
            columnWidths: [4505, 4505],
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: {
                                size: 3,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    children:[
                                        new TextRun({
                                            text: `${idx}.`
                                        })
                                    ],
                                    heading: HeadingLevel.HEADING_6,
                                }),
                                
                            ],                                        
                        }),                                    
                        new TableCell({
                            width: {
                                size: 97,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                ...contents 
                            ],
                        }),
                    ],                                                
                }),
                                                                                                   
            ],
            width:{
                size: 100, type: WidthType.PERCENTAGE
            }                       
        })
    )
}


const fifty2Table = (param1: tTableContentParam, param2: tTableContentParam) => {
    const { label, width = 50, bold = false } = param1
    const { label: label2, width: width2 = 50, bold: bold2 = false } = param2

    return (
        new Table({
            borders: TableBorders.NONE,                                                                                        
            rows: [
                new TableRow({
                    children:[
                        new TableCell({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: width
                            },
                            children: [
                                new Paragraph({
                                    children:[
                                        textRun(label, bold)
                                    ], 
                                    heading: HeadingLevel.HEADING_6,
                                    alignment: AlignmentType.CENTER
                                })
                            ]
                        }),
                        new TableCell({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: width2
                            },
                            children: [
                                new Paragraph({
                                    children:[
                                        textRun(label2, bold2)
                                    ], 
                                    heading: HeadingLevel.HEADING_6,
                                    alignment: AlignmentType.CENTER
                                }),
                            ]
                        })
                    ],                                                        
                })
            ],
            width:{
                size: 100, type: WidthType.PERCENTAGE
            }
        })
    )
}

const lineBreaker = ( text: string, lineBreak: number, bold: boolean = false ) => {
    return (
        new Paragraph({
            children: [
                new TextRun({
                    text,
                    break: lineBreak,
                    bold
                })
            ]
        })
    )
}

export const createGigBASTDoc = (
    startDate: CalendarDate, endDate: CalendarDate,
    centre: ICentre, decidingOperator: IOperator,
    gig: string,
    location: string,
    vendor: IVendor,
    bastNo: string, spkNo: string,
    nominalInWords: {
        nominal: string, display: boolean
    } = {
        nominal: "(Nilai Barang Dalam Rupiah)", display: true
    },
    total: number,
    logo: string
) => {
    const styles = {
        default: {
            heading1: {
                run: {
                    size: 23,
                    bold: true,
                    color: "000000",
                    font: "Arial"
                },
                paragraph: {
                    /*spacing: {
                        after: 120,
                    },*/
                    alignment:AlignmentType.CENTER
                },
            },
            heading2: {
                run: {
                    size: 23,
                    bold: true,
                    color: "000000",
                    font: "Arial"
                },
                paragraph: {
                    /*spacing: {
                        after: 120,
                    },*/
                    alignment:AlignmentType.CENTER
                },
            },
            heading5: {
                run: {
                    size: 21,
                    color: "000000",
                    font: "Arial"
                },
                paragraph: {
                    alignment:AlignmentType.RIGHT
                },
            },
            heading6: {
                run: {
                    size: 21,
                    color: "000000",
                    font: "Arial"
                }
            },
        }
    }

    const numbering = {
        config: [
            {
                levels: [
                    {
                        level: 0,
                        format: LevelFormat.DECIMAL,
                        text: "%1",
                        alignment: AlignmentType.START,
                        style: {
                            paragraph: {
                                indent: { 
                                    left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.18),                                      
                                },                                
                            },
                        },                        
                    },
                ],
                reference: "number-reference",
            },
            {
                levels: [
                    {
                        level: 0,
                        format: LevelFormat.DECIMAL,
                        text: "%1",
                        alignment: AlignmentType.START,
                        style: {
                            paragraph: {
                                indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.18) },
                            },
                        },
                    },
                ],
                reference: "decimal-numbering",
            }
        ]
    }

    const gigTable = tableAsContent({ label: "Pekerjaan" }, {label: gig })
    const bastNoTable = tableAsContent({ label: "Nomor" }, { label: bastNo })

    const locationTable = tableAsContent({ label:"Lokasi" }, { label: location })
    const dateTable = tableAsContent({ label: "Tanggal" }, { label: "25 Maret 2024" })
    const attachmentTable = tableAsContent({ label: "Lampiran" }, { label: "-" })

    const { NIP, name, rank } = decidingOperator
    const line1 = tableAsContent({ label: "Nama", width: 15 }, { label: name, width: 80, bold: true }, 80)
    const line2 = tableAsContent({ label: "Jabatan", width: 15 }, { label: "Pejabat Pembuat Komitmen", width: 80 }, 80)
    const line3 = tableAsContent({ label: "Alamat", width: 15}, { label: "Jl. Tat Twam Asi No. 47 Komplek Depsos Pasar Rebo Jakarta Timur", width: 80 }, 80)
    const line4 = tableAsContent(
        { label: "", width: 15 }, 
        { label: "Dalam hal ini bertindak untuk dan atas nama Sentra ’’Mulya Jaya’’ di Jakarta, yang selanjutnya disebut PIHAK PERTAMA", bold: true, width: 80 }, 80)    

    const { 
        owner: { name: ownerName, rank: ownerRank }, 
        address : {
            street: vendorStreet, rtRw: vendorRtRw, kelurahan: vendorKelurahan, 
            kecamatan: vendorKecamatan, kabupaten: vendorKabupaten, propinsi: vendorPropinsi,
            postCode: vendorPostCode
        },
        name: vendorName
    } = vendor
    const line21 = tableAsContent({ label: "Nama", width: 15 }, { label: ownerName, width: 80, bold: true }, 80)
    const line22 = tableAsContent({ label: "Jabatan", width: 15 }, { label: `${rank} ${vendor.name}`, width: 80 }, 80)
    const line23 = tableAsContent(
        { label: "Alamat", width: 15}, 
        { label: `${vendorStreet} desa/kelurahan ${vendorKelurahan}, kec. ${vendorKecamatan}, 
            ${vendorKabupaten}, provinsi ${vendorPropinsi}, kode pos: ${vendorPostCode}`, width: 80 }, 80)
    const line24 = tableAsContent(
        { label: "", width: 15 }, 
        { label: `Dalam hal ini bertindak untuk dan atas nama ${vendorName} yang Selanjutnya disebut PIHAK KEDUA`, bold: true, width: 80 }, 80)    

    const { address:{ street, rtRw, kelurahan, kecamatan, kabupaten, propinsi, postCode}, email, phone } = vendor
    
    const { todate, hari, tanggal, bulan, tahun, year } = localizeDate(endDate)
    const { todate: todateStart, bulan: bulanStart,  year: yearStart } = localizeDate(startDate)

    const line31 = tableAsContent(
        { label: "Pekerjaaan", width: 15 },
        { label: gig, width: 80 }
    )
    const line32 = tableAsContent(
        { label: "Lokasi", width: 15 },
        { label: location, width: 80 }
    )
    const line33 = tableAsContent(
        { label: "Daftar Isian", width: 15 },
        { label: "Sentra ‘’Mulya Jaya’’ Di Jakarta", width: 80 }
    )
    const line34 = tableAsContent(
        { label: "Pelaksanaan Anggaran (DIPA) Tahun Anggaran", width: 15 },
        { label: year.toString(), width: 80 }
    )
    const line35 = tableAsContent(
        { label: "Kontraktor Pelaksana", width: 15 },
        { label: vendorName, width: 80, bold: true }
    )
    const line36 = tableAsContent(
        { label: "Surat Perintah Kerja", width: 15 },
        { label: `${spkNo} Tanggal ${todateStart} ${bulanStart} ${yearStart}`, width: 80  }
    )
    
    const line41 = tableAsContent(
        { label: "Biaya Pelaksanaan", width: 15 },
        { label: `${displayIDR(total)} (${nominalInWords.nominal})`, width: 80, bold: true }
    )    
    const line42 = tableAsContent(
        { label: "Jangka Waktu", width: 15 },
        { label: `${dateDiff(
            new Date(endDate.year + "-" + endDate.month + "-" + endDate.day),
            new Date(startDate.year + "-" + startDate.month + "-" + startDate.day))} hari kerja`, width: 80 }
    )
    const line43 = tableAsContent(
        { label: "Pelaksanaan", width: 15 },
        { label: `${todateStart} ${bulanStart} sampai ${todate} ${bulan} ${year}`, width: 80 }
    )
    const doc = new Document({
        styles,
        numbering,
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1000,
                            right: 700,
                            bottom: 700,
                            left: 700,
                        },
                    },
                },
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: logo,
                                transformation: {
                                    width: 450,
                                    height: 110
                                }
                            }),
                        ],
                    }),
                    new Table({
                        borders: TableBorders.NONE,
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 10,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: "Alamat"
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            }),
                                            
                                        ],                                        
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 2,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: ":"
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            }),
                                            
                                        ],                                        
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 88,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: street + ", " + kelurahan + ", " + 
                                                                kecamatan + ", " + kabupaten + ", " +  propinsi + ", Kode Pos: " + postCode
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            })
                                        ],
                                    }),
                                ],                                                
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 10,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: "Email"
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 2,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: ":"
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            }),
                                            
                                        ],                                        
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 88,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:email
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 10,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: "Telp"
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 2,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: ":"
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            }),
                                            
                                        ],                                        
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 88,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:phone
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            })
                                        ],
                                    }),
                                ],
                            }),                                                        
                        ],
                        width:{
                            size: 100, type: WidthType.PERCENTAGE
                        }                       
                    }),
                    new Paragraph({
                        children: [],                        
                        border: {
                            bottom: {
                                color: "000000",
                                space: 2,
                                style: "double",
                                size: 8,
                            },
                        } 
                    }),
                    new Paragraph(""),
                    new Table({
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 50,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun(`Kementrian Sosial RI Sentra "Mulya Jaya" di Jakarta`)
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            }),
                                            
                                        ],                                        
                                    }),                                    
                                    new TableCell({                                        
                                        width: {
                                            size: 50,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun("Berita Acara Serah Terima Pelaksanaan Pekerjaan")
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                            })
                                        ],
                                    }),
                                ],                                                
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children:[
                                            gigTable
                                        ]
                                    }),                                 
                                    new TableCell({                                        
                                        children: [
                                            bastNoTable
                                        ],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children:[
                                            locationTable
                                        ]
                                    }),                                 
                                    new TableCell({                                        
                                        children: [
                                            dateTable, new Paragraph(""), attachmentTable
                                        ],
                                    }),
                                ],
                            })                            
                        ]
                    }),
                    new Paragraph(""),
                    new Paragraph({
                        children:[
                            textRun("Pada hari ini, "),
                            textRun(hari, true),
                            textRun(" tanggal "), textRun(tanggal, true),
                            textRun(" bulan "), textRun(bulan, true),
                            textRun(" tahun "), textRun(tahun, true),
                            textRun(", kami yang bertandatangan dibawah ini : ")
                        ],
                        heading: HeadingLevel.HEADING_6
                    }),
                    new Paragraph(""),                    
                    tableAsListItem(1, [line1, line2, line3, line4]),
                    new Paragraph(""),
                    tableAsListItem(2, [line21, line22, line23, line24]),
                    new Paragraph(""),                    
                    new Paragraph({
                        children:[
                            textRun(`Berdasarkan Surat Perintah Kerja Nomor : ${spkNo}, Tanggal ${todateStart} ${bulanStart} ${yearStart} Pekerjaan Pengadaan Bantuan Atensi Alat Bantu Di Kota Tangerang Pada Sentra ‘’Mulya Jaya’’ Di Jakarta PIHAK PERTAMA dan PIHAK KEDUA telah setuju dan sepakat bahwa untuk :`),                            
                        ],
                        heading: HeadingLevel.HEADING_6
                    }),
                    new Paragraph(""),                    
                    tableAsListItem(1, [ line31, line32, line33, line34, line35, line36 ]),
                    new Paragraph(""),
                    tableAsListItem(2, [ line41, line42, line43 ]),
                    new Paragraph({
                        children:[new TextRun(""), new PageBreak()]
                    }),
                    new Paragraph({
                        children:[new TextRun("PASAL 1")], alignment: AlignmentType.CENTER,
                        heading: HeadingLevel.HEADING_6
                    }),
                    new Paragraph({
                        children:[new TextRun({ text: "LINGKUP PEKERJAAN" })],
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `PIHAK KEDUA Menyerahkan Pekerjaan dengan baik kepada PIHAK PERTAMA, dan diterima oleh PIHAK PERTAMA untuk Pekerjaan : ${gig} Pada Sentra ‘’Mulya Jaya’’ Di Jakarta Tahun Anggaran 2024 yang berlokasi : Jl. Tat Twam Asi No. 47 Komplek Depsos Pasar Rebo Jakarta Timur.`,
                                break: 2
                            })
                        ],
                        heading: HeadingLevel.HEADING_6
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Demikian Berita Acara Serah Terima Pekerjaan ini dibuat dan ditandatangani di Jakarta pada tanggal tersebut diatas dalam rangkap 4 (Empat) untuk dapat dipergunakan seperlunya.",
                                break: 1
                            })
                        ],
                        heading: HeadingLevel.HEADING_6
                    }),
                    lineBreaker("", 2),
                    fifty2Table(
                        { label: "PIHAK KEDUA"}, { label: "PIHAK PERTAMA"}
                    ),
                    fifty2Table(
                        { label: vendorName, bold: true}, { label: "PEJABAT PENERIMA HASIL PEKERJAAN"}
                    ),
                    fifty2Table(
                        { label: "" }, { label: "Sentra Mulya Jaya di Jakarta", bold: true}
                    ),
                    lineBreaker("", 3),
                    fifty2Table(
                        { label: name, bold: true }, { label: ownerName, bold: true}
                    ),
                    fifty2Table(
                        { label: ownerRank }, { label: `NIP. ${NIP}`}
                    ),
                ],
            },
        ],
    });

    return { doc }

}