import { Document, Packer, Paragraph, TextRun, Table as TableDocx, TableBorders, TableCell as TableCellDocx, 
    TableRow as TableRowDocx, ImageRun, Header, Footer, HeadingLevel, WidthType, 
    ShadingType,
    UnderlineType,
    AlignmentType,
    LevelFormat,
    convertInchesToTwip,
    convertMillimetersToTwip,
    HorizontalPositionRelativeFrom,
    VerticalPositionRelativeFrom,
    TextWrappingType,
    TextWrappingSide,
    VerticalPositionAlign,
    HorizontalPositionAlign} from "docx";
import { displayIDR } from "./functions";
import { defaultOfficer } from "@/variables-and-constants";
import { PersonRecipientWItems, IOfficer } from "@/types";

export const createBASTDocs = (
    bastNo: string = "591/BAST/4.11/5/2024", 
    recipient: PersonRecipientWItems, 
    officer: IOfficer = defaultOfficer, 
    nominalInWords: string = "(Nilai Barang Dalam Rupiah)", 
    receptor: string = "Dodi Rusdi",
    picData: string
) => {
    
    const {name, ids:{nik}, address:{street, rtRw, kabupaten, kecamatan, kelurahan},
        items
    } = recipient
    const recipientAddress = street + ", " + kelurahan + "-" + kecamatan + "-" + kabupaten
    const {name: itemName, unit, price} = items[0]

    const {name:officerName, NIP, rank, address:officerAddress} = officer
    const {street:officerStreet, kabupaten:officerKab, kelurahan: officerKel, kecamatan: officerKec} = 
        officerAddress

    const officerAddr = officerStreet + ", "  + officerKel + "-" + officerKec + "-" + officerKab
    
    const BASTdoc = new Document({
        styles: {
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
        },
        numbering: {
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
                }
            ]
        },
        sections: [
            {                            
                children: [                                        
                    new Paragraph({
                        children:[
                            new ImageRun({
                                data: picData,
                                transformation: {
                                    width: 70,
                                    height: 80
                                },
                                floating: {
                                    horizontalPosition: {
                                        relative: HorizontalPositionRelativeFrom.COLUMN,
                                        align: HorizontalPositionAlign.LEFT
                                    },
                                    verticalPosition: {
                                        relative: VerticalPositionRelativeFrom.PARAGRAPH,
                                        align: VerticalPositionAlign.CENTER
                                    },
                                    wrap: {
                                        type: TextWrappingType.SQUARE,
                                        side: TextWrappingSide.BOTH_SIDES,
                                    },
                                },
                            }),                                    
                            new TextRun({
                                text:"KEMENTRIAN SOSIAL REPUBLIK INDONESIA",                                
                                color:"000000"
                            }),
                            new TextRun({
                                text: `SENTRA "MULYA JAYA" DI JAKARTA`,
                                break: 1
                            }),
                            new TextRun({
                                text: `JALAN TAT TWAM ASI NO. 47 KOMPLEKS DEPO PASAR REBO`,
                                break: 1
                            }),
                            new TextRun({
                                text: `JAKARTA TIMUR 13760`,
                                break: 1
                            }),
                            new TextRun({
                                text: `TELEPON (021) 8400631    FAKSIMILE: (021) 8415717`,
                                break: 1
                            }),
                            new TextRun({
                                text: `http://mulyajaya.depsos.go.id/  EMAIL: pskw_mulyajaya@depsos.go.id`,
                                break: 1
                            })
                        ],                            
                        heading: HeadingLevel.HEADING_1, 
                        border: {
                            bottom: {
                                color: "000000",
                                space: 2,
                                style: "double",
                                size: 8,
                            },
                        }                               
                    }),                    
                    new Paragraph({
                        children:[
                            new TextRun({
                                text: "BERITA ACARA SERAH TERIMA BANTUAN",
                                underline: {
                                    type: UnderlineType.SINGLE, color: "000000"
                                }
                            })
                        ],                    
                        heading: HeadingLevel.HEADING_1                                                    
                    }),
                    new Paragraph({
                        text: bastNo,
                        heading: HeadingLevel.HEADING_1
                    }),
                    new Paragraph(""),
                    new Paragraph({
                        text: "Pada Hari Jumat Tanggal Tiga Bulan Mei Tahun Dua Ribu Dua Puluh Empat, berdasarkan Surat Keputusan Kuasa Pengguna Anggaran Sentra Mulya Jaya di Jakarta Nomor : 2592/4.11/RH.00.01/4/2024 Tanggal 29 April 2024 tentang Penerima Bantuan  Asistensi Rehabilitasi Sosial (ATENSI) Alat Bantu Jakarta Tahun 2024.",
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.LEFT                    
                    
                    }),
                    new Paragraph({text:"", heading: HeadingLevel.HEADING_6, alignment: AlignmentType.LEFT                    
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Nama 		: " + officerName,                            
                            }),
                            new TextRun({
                                text: "NIP		: " + NIP,
                                break: 1
                            }),
                            new TextRun({
                                text: "Jabatan	: " + rank,                            
                                break: 1
                            }),
                            new TextRun({
                                text: "Alamat		: " + officerAddr,                            
                                break: 1
                            })
                        ],
                        numbering: {
                            reference: "number-reference",
                            level: 0,
                        },
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.LEFT                    
                    
                    }),
                    new Paragraph({
                        children:[
                            new TextRun({
                                text: "Selanjutnya disebut "
                            }), 
                            new TextRun({
                                text: "PIHAK PERTAMA",
                                bold: true
                            }),
                            new TextRun(", dalam hal ini diwakili sesuai petugas yang ditunjuk.")
                        ],
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.LEFT                    
                    
                    }),
                    new Paragraph({text:"", heading: HeadingLevel.HEADING_6, alignment: AlignmentType.LEFT                    
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Nama 		: " + name,                            
                            }),
                            new TextRun({
                                text: "NIK		: " + nik,
                                break: 1
                            }),                        
                            new TextRun({
                                text: "Alamat		: " + recipientAddress,
                                break: 1
                            })
                        ],
                        numbering: {
                            reference: "number-reference",
                            level: 0,
                        },
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.LEFT                    
                    
                    }),
                    new Paragraph({
                        children:[
                            new TextRun({
                                text: "Selanjutnya disebut "
                            }), 
                            new TextRun({
                                text: "PIHAK KEDUA",
                                bold: true,                            
                            }),                        
                        ],
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.LEFT                                    
                    }),
                    new Paragraph({
                        children:[
                            new TextRun({
                                text:"Dengan ini menerangkan bahwa :",
                                break: 1
                            })
                        ],
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.LEFT                    
                    
                    }),
                    new Paragraph({
                        children: [
                            new TextRun("PIHAK PERTAMA telah menyerahkan barang berupa "),
                            new TextRun({
                                text:"Alat Bantu", bold: true
                            }),
                            new TextRun(" Senilai "),
                            new TextRun({
                                text:displayIDR(price) + ",- " + nominalInWords, bold: true
                            }),
                            new TextRun({
                                text: " sebagaimana yang terlampir kepada PIHAK KEDUA dan PIHAK KEDUA telah menerima barang tersebut dari PIHAK PERTAMA.",                            
                            })
                        ],
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.LEFT                    
                    
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Demikianlah berita acara serah terima bantuan ATENSI ini dibuat oleh kedua belah pihak. Adapun barang-barang (terlampir) dalam keadaan baik dan cukup, sejak penandatanganan berita acara ini, maka barang tersebut menjadi tanggung jawab PIHAK KEDUA untuk dapat dipergunakan dengan sebaik-baiknya.",
                                break: 1
                            })
                        ],                    
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.LEFT                    
                    ,
                    
                    }),
                    new Paragraph({text:"", heading: HeadingLevel.HEADING_6}),
                    new TableDocx({
                        borders: TableBorders.NONE,
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRowDocx({
                                children: [
                                    new TableCellDocx({
                                        width: {
                                            size: 60,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            
                                        ],                                        
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: "Dikeluarkan di      : Jakarta"
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    }),
                                ],                                                
                            }),
                            new TableRowDocx({
                                children: [
                                    new TableCellDocx({
                                        width: {
                                            size: 60,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"Pada tanggal    :  3 Mei 2024", 
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
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
                    new Paragraph({text:"", heading: HeadingLevel.HEADING_6}),
                    new Paragraph({text:"", heading: HeadingLevel.HEADING_6}),
                    new TableDocx({
                        borders: TableBorders.NONE,
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRowDocx({
                                children: [
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"PIHAK KEDUA", bold: true
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],                                        
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 20,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"PIHAK PERTAMA", bold: true, 
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    }),
                                ],                                                
                            }),
                            new TableRowDocx({
                                children: [
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"Penerima Manfaat", 
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],                                        
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 20,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: rank,
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    }),
                                ],                                                
                            }),
                            new TableRowDocx({
                                children: [
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],                                        
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 20,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"Sentra Mulya Jaya",
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
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
                    new TableDocx({
                        borders: TableBorders.NONE,
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRowDocx({
                                children: [
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: name, bold: true
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],                                        
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 20,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: officerName, bold: true, 
                                                        underline: {
                                                            type: "single"
                                                        }
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    }),
                                ],                                                
                            }),
                            new TableRowDocx({
                                children: [
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 20,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"NIP. " + NIP, 
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
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
                    new Paragraph({text:"", heading: HeadingLevel.HEADING_6}),
                    new Paragraph({text:"", heading: HeadingLevel.HEADING_6}),
                    new Paragraph({
                        children:[
                            new TextRun({ text: "Petugas Yang Menyerahkan", bold: true})
                        ], 
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({text:""}),
                    new Paragraph({text:""}),
                    new Paragraph({text:""}),
                    new Paragraph({children:[new TextRun({text:"......................"})], heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER}),
                    new Paragraph({children:[new TextRun({text:"NIP......................"})], heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER})
                ],
            },
        ],
    });
    
    const attachmentDoc = new Document({
        styles: {
            default: {            
                heading6: {
                    run: {
                        size: 22,
                        color: "000000",
                        font: "Arial"
                    }
                },
            }
        },    
        sections: [
            {
                            
                children: [
                    new Paragraph({
                        text:"Lampiran :  Berita Acara Serah Terima Bantuan ATENSI", heading: HeadingLevel.HEADING_6,
                        alignment: AlignmentType.LEFT
                    }),
                    new Paragraph({
                        text:"Nomor	:	 " + bastNo, heading: HeadingLevel.HEADING_6,
                        alignment: AlignmentType.LEFT
                    }),
                    new Paragraph(""),                                 
                    new TableDocx({
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRowDocx({
                                height:{
                                    value: 500,
                                    rule: "exact"
                                },
                                children: [
                                    new TableCellDocx({
                                        width: {
                                            size: 10,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"No", bold: true
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],                                        
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 60,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"Nama Barang", bold: true
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 15,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"Volume", bold: true,                                                     
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 15,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"Satuan", bold: true,                                                     
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    })
                                ],                                                
                            }),
                            new TableRowDocx({
                                height:{
                                    value: 500,
                                    rule: "exact"
                                },
                                children: [
                                    new TableCellDocx({
                                        width: {
                                            size: 10,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"1", bold: true
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],                                        
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 60,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:  itemName, 
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 15,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: unit + ""
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 15,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: "Unit"
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    })
                                ],                                                
                            }),                                                        
                        ],
                        width:{
                            size: 100, type: WidthType.PERCENTAGE
                        }                        
                    }),
                    new Paragraph(""),
                    new TableDocx({
                        columnWidths: [4505, 4505],
                        borders: TableBorders.NONE,
                        rows: [
                            new TableRowDocx({                            
                                children: [                                
                                    new TableCellDocx({
                                        width: {
                                            size: 70,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                        ],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 30,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({text:"Jakarta, 3 Mei 2024"})
                                                ], heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER})
                                        ],
                                    }),
                                    
                                ],                                                
                            }),
                            new TableRowDocx({
                                children: [new TableCellDocx({children:[]})]
                            }),
                            new TableRowDocx({                            
                                children: [                                
                                    new TableCellDocx({
                                        width: {
                                            size: 70,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                        ],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 30,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({text:"Yang Menerima"})
                                                ], heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER})
                                        ],
                                    }),
                                    
                                ],                                                
                            }),
                            new TableRowDocx({
                                children: [new TableCellDocx({children:[]})]
                            }),
                            new TableRowDocx({
                                children: [new TableCellDocx({children:[]})]
                            }),
                            new TableRowDocx({
                                children: [new TableCellDocx({children:[]})]
                            }),
                            new TableRowDocx({                            
                                children: [                                
                                    new TableCellDocx({
                                        width: {
                                            size: 70,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                        ],
                                    }),
                                    new TableCellDocx({
                                        width: {
                                            size: 30,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({text: receptor})
                                                ], heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER})
                                        ],
                                    }),
                                    
                                ],                                                
                            }),                                                      
                        ],
                        width:{
                            size: 100, type: WidthType.PERCENTAGE
                        }                        
                    })                               
                ],
            },
        ],
    });

    return {
        BASTdoc, attachmentDoc
    }
}