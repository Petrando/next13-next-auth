import { Document, Paragraph, TextRun, Table, TableBorders, TableCell, 
    TableRow, HeadingLevel, WidthType, 
    UnderlineType,
    AlignmentType,
    LevelFormat,
    convertInchesToTwip } from "docx";
import { centreHeader as header } from "../shared";
import { displayIDR, totalPrice, localizeDate, rtRwFormatter } from "../../functions";
import { emptyOperator } from "@/variables-and-constants";
import { PersonRecipientWItems, IRABCharityOrg,  IOperator, ICentre, OrderedItem } from "@/types";
import { CalendarDate } from "@internationalized/date";

const createAttachment1 = (
    date: CalendarDate,
    bastNo: string = "591/BAST/4.11/5/2024", 
    recipient: PersonRecipientWItems,      
    receptor: string = "Dodi Rusdi",    
) => {
    const { todate, bulan, year } = localizeDate(date)

    const { items } = recipient    
    const { name: itemName, unit, amount } = items[0]                         
    
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
                    new Table({
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRow({
                                height:{
                                    value: 500,
                                    rule: "exact"
                                },
                                children: [
                                    new TableCell({
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
                                    new TableCell({
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
                                    new TableCell({
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
                                    new TableCell({
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
                            new TableRow({
                                height:{
                                    value: 500,
                                    rule: "exact"
                                },
                                children: [
                                    new TableCell({
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
                                    new TableCell({
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
                                    new TableCell({
                                        width: {
                                            size: 15,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: amount + ""
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 15,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: unit
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
                    new Table({
                        columnWidths: [4505, 4505],
                        borders: TableBorders.NONE,
                        rows: [
                            new TableRow({                            
                                children: [                                
                                    new TableCell({
                                        width: {
                                            size: 70,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                        ],
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 30,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({text:`Jakarta, ${todate} ${bulan} ${year}`})
                                                ], heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER})
                                        ],
                                    }),
                                    
                                ],                                                
                            }),
                            new TableRow({
                                children: [new TableCell({children:[]})]
                            }),
                            new TableRow({                            
                                children: [                                
                                    new TableCell({
                                        width: {
                                            size: 70,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                        ],
                                    }),
                                    new TableCell({
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
                            new TableRow({
                                children: [new TableCell({children:[]})]
                            }),
                            new TableRow({
                                children: [new TableCell({children:[]})]
                            }),
                            new TableRow({
                                children: [new TableCell({children:[]})]
                            }),
                            new TableRow({                            
                                children: [                                
                                    new TableCell({
                                        width: {
                                            size: 70,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                        ],
                                    }),
                                    new TableCell({
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

    return attachmentDoc
    
}

const createAttachment2 = (
    date: CalendarDate,
    bastNo: string = "591/BAST/4.11/5/2024", 
    recipient: IRABCharityOrg,
    items: OrderedItem[],      
    receptor: string = "Dodi Rusdi",    
) => {
    const { todate, bulan, year } = localizeDate(date)
        
    const itemsRow = items.map((d:OrderedItem, i:number) => {
        return (
            new TableRow({
                height:{
                    value: 500,
                    rule: "exact"
                },
                children: [
                    new TableCell({
                        width: {
                            size: 10,
                            type: WidthType.PERCENTAGE,
                        },
                        verticalAlign: "center",
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text:(i + 1).toString(), bold: true
                                    })
                                ],
                                heading: HeadingLevel.HEADING_6,
                                alignment: AlignmentType.CENTER
                            })
                        ],                                        
                    }),
                    new TableCell({
                        width: {
                            size: 30,
                            type: WidthType.PERCENTAGE,
                        },
                        verticalAlign: "center",
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text:  d.name, 
                                    })
                                ],
                                heading: HeadingLevel.HEADING_6,
                                alignment: AlignmentType.CENTER
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: 30,
                            type: WidthType.PERCENTAGE,
                        },
                        verticalAlign: "center",
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text:  d.productName, 
                                    })
                                ],
                                heading: HeadingLevel.HEADING_6,
                                alignment: AlignmentType.CENTER
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: 15,
                            type: WidthType.PERCENTAGE,
                        },
                        verticalAlign: "center",
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text: (d.amount).toString()
                                    })
                                ],
                                heading: HeadingLevel.HEADING_6,
                                alignment: AlignmentType.CENTER
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: 15,
                            type: WidthType.PERCENTAGE,
                        },
                        verticalAlign: "center",
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text: d.unit
                                    })
                                ],
                                heading: HeadingLevel.HEADING_6,
                                alignment: AlignmentType.CENTER
                            })
                        ],
                    })
                ],                                                
            })
        )
    })
    
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
                    new Table({
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRow({
                                height:{
                                    value: 500,
                                    rule: "exact"
                                },
                                children: [
                                    new TableCell({
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
                                    new TableCell({
                                        width: {
                                            size: 30,
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
                                    new TableCell({
                                        width: {
                                            size: 30,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:"Spesifikasi", bold: true
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
                                            })
                                        ],
                                    }),
                                    new TableCell({
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
                                    new TableCell({
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
                            ...itemsRow,                                                                                    
                        ],
                        width:{
                            size: 100, type: WidthType.PERCENTAGE
                        }                        
                    }),
                    new Paragraph(""),
                    new Table({
                        columnWidths: [4505, 4505],
                        borders: TableBorders.NONE,
                        rows: [
                            new TableRow({                            
                                children: [                                
                                    new TableCell({
                                        width: {
                                            size: 70,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                        ],
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 30,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({text:`Jakarta, ${todate} ${bulan} ${year}`})
                                                ], heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER})
                                        ],
                                    }),
                                    
                                ],                                                
                            }),
                            new TableRow({
                                children: [new TableCell({children:[]})]
                            }),
                            new TableRow({                            
                                children: [                                
                                    new TableCell({
                                        width: {
                                            size: 70,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                        ],
                                    }),
                                    new TableCell({
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
                            new TableRow({
                                children: [new TableCell({children:[]})]
                            }),
                            new TableRow({
                                children: [new TableCell({children:[]})]
                            }),
                            new TableRow({
                                children: [new TableCell({children:[]})]
                            }),
                            new TableRow({                            
                                children: [                                
                                    new TableCell({
                                        width: {
                                            size: 70,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        verticalAlign: "center",
                                        children: [
                                        ],
                                    }),
                                    new TableCell({
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

    return attachmentDoc
    
}

export const createReceiverBASTDocs = (
    date: CalendarDate,
    bastNo: string = "591/BAST/4.11/5/2024", 
    recipient: PersonRecipientWItems | IRABCharityOrg, 
    decidingOperator: IOperator,
    fieldOperator: IOperator | undefined = undefined,
    centre: ICentre,
    helpType: string, 
    nominalInWords: {
        nominal: string, display: boolean
    } = {
        nominal: "(Nilai Barang Dalam Rupiah)", display: true
    }, 
    receptor: string = "Dodi Rusdi",
    picData: string
) => {
    const {todate, hari, tanggal, bulan, tahun, year} = localizeDate(date)
    
    const recType = recipientType(recipient)
    const {
        name, nik, street, rtRw, kecamatan, kelurahan, kabupaten, items
    } = recType === "person"?
        destructurePersonRecipient(recipient as PersonRecipientWItems):
            destructureOrgRecipient(recipient as IRABCharityOrg)
        
    const recipientAddress = street + ", " + rtRwFormatter(rtRw) + " " + kelurahan + "-" + kecamatan + "-" + kabupaten    
    const price = totalPrice(items)

    const { name:officerName, NIP, rank } = decidingOperator 
    
    const { name:fieldOperatorName, NIP: fieldOperatorNip, rank: fieldOperatorRank } = fieldOperator || emptyOperator
    const noFieldOperator = fieldOperatorName === "" && fieldOperatorNip === ""    

    const { name: centreName, address } = centre
    const {street:centreStreet, rtRw: centreRtRw, kabupaten:centreKab, kelurahan: centreKel, kecamatan: centreKec, postCode} = 
        address    

    const centreAddress = centreStreet + ", " + rtRwFormatter(centreRtRw) + " "  + centreKel + "-" + centreKec + "-" + centreKab
    
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
                    header(picData, centre, HeadingLevel.HEADING_1),                   
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
                        text: `Pada Hari ${hari} Tanggal ${tanggal} Bulan ${bulan} Tahun ${tahun}, berdasarkan Surat Keputusan Kuasa Pengguna Anggaran Sentra Mulya Jaya di Jakarta Nomor : 2592/4.11/RH.00.01/4/2024 Tanggal 29 April 2024 tentang Penerima Bantuan  Asistensi Rehabilitasi Sosial (ATENSI) Jakarta Tahun ${year}.`,
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
                                text: "Alamat		: " + centreAddress,                            
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
                            new TextRun("PIHAK PERTAMA telah menyerahkan bantuan berupa "),
                            new TextRun({
                                text:helpType, bold: true
                            }),
                            new TextRun(" Senilai "),
                            new TextRun({
                                text:`${displayIDR(price)} ${nominalInWords.display?",-" + nominalInWords.nominal:""}`, 
                                bold: true
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
                    new Table({
                        borders: TableBorders.NONE,
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 60,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            
                                        ],                                        
                                    }),
                                    new TableCell({
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
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 60,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text:`Pada tanggal    :  ${todate} ${bulan} ${year}`, 
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
                    new Table({
                        borders: TableBorders.NONE,
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
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
                                    new TableCell({
                                        width: {
                                            size: 20,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCell({
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
                            new TableRow({
                                children: [
                                    new TableCell({
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
                                    new TableCell({
                                        width: {
                                            size: 20,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCell({
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
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],                                        
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 20,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [
                                            new Paragraph({
                                                children:[
                                                    new TextRun({
                                                        text: `Sentra ${centreName}`,
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
                    new Table({
                        borders: TableBorders.NONE,
                        columnWidths: [4505, 4505],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
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
                                    new TableCell({
                                        width: {
                                            size: 20,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCell({
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
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 40,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 20,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        children: [],
                                    }),
                                    new TableCell({
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
                    new Paragraph({
                        children:[
                            new TextRun({ text: fieldOperatorRank})
                        ], 
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                        children:[
                            new TextRun({ text: noFieldOperator?"":`Sentra ${centreName}`})
                        ], 
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({text:""}),
                    new Paragraph({children:[
                        new TextRun({ text: noFieldOperator?"......................":fieldOperatorName })], 
                        heading: HeadingLevel.HEADING_6, alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({children:[
                        new TextRun({ text:`NIP. ${noFieldOperator?"":fieldOperatorNip}`})], 
                        heading: HeadingLevel.HEADING_6, 
                        alignment: AlignmentType.CENTER,
                        /*indent:{
                            right:noFieldOperator?2000:0
                        }*/
                    })
                ],
            },
        ],
    });    

    const attachmentDoc = recType === "person"?
        createAttachment1(date, bastNo, recipient as PersonRecipientWItems, receptor):
            createAttachment2(date, bastNo, recipient as IRABCharityOrg, items, receptor)

    return {
        BASTdoc, attachmentDoc
    }
}

/*
    How to decide wether recipient is charity organization or person?
    Person has ids prop, charity org does not
*/

const recipientType = (recipient:PersonRecipientWItems | IRABCharityOrg) => {
    return "ids" in recipient?"person":"charity-org"
}

const destructurePersonRecipient = (recipient: PersonRecipientWItems) => {
    const {name, ids:{nik}, address:{street, rtRw, kabupaten, kecamatan, kelurahan},
        items
    } = recipient

    return {
        name, nik, street, rtRw, kecamatan, kelurahan, kabupaten, items
    }
}

const destructureOrgRecipient = (recipient:IRABCharityOrg) => {
    const {recipient:charityOrg, items} = recipient
    const {address, name} = charityOrg
    const { street, rtRw, kecamatan, kelurahan, kabupaten } = address

    return { name, items, street, rtRw, kecamatan, kelurahan, kabupaten, nik:"" }
}