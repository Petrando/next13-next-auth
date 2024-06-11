'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
        DatePicker, Input,  Skeleton, 
            Link
 } from "@nextui-org/react"
import { TableItem } from '../shared/TableItemCard';
import { TableContact } from '../shared/TableContact';
import { TotalRow } from '../shared/TotalTableRow';
import { TotalCard } from '../shared/TotalCard';
import CurrencyFormat from 'react-currency-format';
import { PrintIcon } from '@/components/Icon';
import { createDateString } from '@/lib/functions';
import { emptyRAB, emptyPerson } from '@/variables-and-constants';
import { IRAB, PersonRecipientWItems, OrderedItem } from '@/types';
import { saveAs } from "file-saver";

import { Document, Packer, Paragraph, TextRun, Table as TableDocx, TableBorders, TableCell as TableCellDocx, 
    TableRow as TableRowDocx, Header, Footer, HeadingLevel, WidthType, 
    ShadingType,
    UnderlineType,
    AlignmentType,
    LevelFormat,
    convertInchesToTwip} from "docx";

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
                    size: 22,
                    color: "000000",
                    font: "Arial"
                },
                paragraph: {
                    alignment:AlignmentType.RIGHT
                },
            },
            heading6: {
                run: {
                    size: 22,
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
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            children:[
                                new TextRun({
                                    text:"KEMENTRIAN SOSIAL REPUBLIK INDONESIA",
                                    break: 1,
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
                                    space: 3,
                                    style: "double",
                                    size: 10,
                                },
                            }
                        })
                    ]
                }),
            },            
            children: [
                new Paragraph(""),
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
                    text: "NOMOR:  591/BAST/4.11/5/2024",
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
                            text: "Nama 		: Santi Nurhayati",                            
                        }),
                        new TextRun({
                            text: "NIP		: 19660503 199102 001",
                            break: 1
                        }),
                        new TextRun({
                            text: "Jabatan	: Pejabat Pembuat Komitmen",                            
                            break: 1
                        }),
                        new TextRun({
                            text: "Alamat		: Jl. Tat Twam Asi No. 47 Komplek Depsos Pasar Rebo, Jakarta Timur",                            
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
                            text: "Nama 		: Herlina",                            
                        }),
                        new TextRun({
                            text: "NIK		: 3171045607670001",
                            break: 1
                        }),                        
                        new TextRun({
                            text: "Alamat		: Jl. Kenari II RT.4 RW.4 Kel. Kenari Kec. Senen Kota Jakarta Pusat Provinsi DKI Jakarta",
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
                            text:"Rp.325.000,- (Tiga Ratus Dua Puluh Lima Ribu Rupiah)", bold: true
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
                new Paragraph({
                    text: "Dikeluarkan di   : Jakarta",
                    heading: HeadingLevel.HEADING_5
                }),
                new Paragraph({
                    text: "Pada tanggal    :  3 Mei 2024",
                    heading: HeadingLevel.HEADING_5
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
                                                    text:"Pejabat Pembuat Komitmen",
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
                                                    text:"Herlina", bold: true
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
                                                    text:"Santi Nurhayati", bold: true, 
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
                                                    text:"NIP. 19660503 199102 001", 
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
                new Paragraph({text:"", heading: HeadingLevel.HEADING_6}),
                new Paragraph({text:"", heading: HeadingLevel.HEADING_6}),
                new Paragraph({text:"", heading: HeadingLevel.HEADING_6}),
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
                    text:"Nomor	:	 591/BAST/4.11/5/2024", heading: HeadingLevel.HEADING_6,
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
                                                    text:"Kursi Roda Standar", 
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
                                                    text:"1"
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
                                                    text:"Unit"
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
                                                new TextRun({text:"Dodi Rusdi"})
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

export const RABDetail = () => {
    const [RAB, setRAB] = useState<IRAB>(emptyRAB)
    const [fetchState, setFetchState] = useState("loading")

    const searchParams = useSearchParams()
    const rabId = searchParams.get("_id")

    const getRAB = async (_id:string) => {
        const filter = {_id}
        const projection = {}
        const limit = 1
        const offset = 0

        setFetchState("loading")
        try{
            const response = await fetch('/api/RAB/list', {
                method: 'POST',
                body: JSON.stringify({ filter, projection, limit, offset }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();            
            setRAB(data.data[0])
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
            setFetchState("complete")
        } 
    }
    
    useEffect(()=>{
        if(rabId && rabId !== ""){
            getRAB(rabId)
        }
    }, [rabId])

    const { title, date, recipients } = RAB

    const totalPrice = recipients
        .filter((d:PersonRecipientWItems) => d.items.length > 0)
        .map((d:PersonRecipientWItems) => d.items).flat()
        .reduce((acc:number, curr:OrderedItem) => {            
            return acc + curr.price
        }, 0)

    const renderElement = recipients.length > 0?recipients.concat(emptyPerson):[]    

    function saveDocumentToFile(doc:any, fileName:string) {
        
        const mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        Packer.toBlob(doc).then((blob:any) => {
            const docblob = blob.slice(0, blob.size, mimeType);
            saveAs(docblob, fileName);
        });
    }

    return (
        <div className="flex flex-col w-screen px-1 md:px-2">            
            <div className="px-0 py-2 flex items-center flex-wrap">
                <div className="w-fit p-1">
                    <DatePicker 
                        label="Tanggal" className="max-w-[284px]" 
                        value={createDateString(new Date(date))} 
                        isReadOnly
                    />
                </div>
                <div className="flex-auto p-1">
                    <Input size="lg" variant="underlined" fullWidth label="Judul RAB" value={title} 
                        isReadOnly                        
                    />
                </div>
            </div>
            <Table aria-label="Tabel Penerima Bantuan">
                <TableHeader>
                    <TableColumn>
                        <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                            NAMA
                        </Skeleton>
                    </TableColumn>
                    <TableColumn>
                        <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                            ALAMAT
                        </Skeleton>
                    </TableColumn>
                    <TableColumn>
                        <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                            NIK
                        </Skeleton>
                    </TableColumn>
                    <TableColumn>
                        <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                            No KK
                        </Skeleton>
                    </TableColumn>
                    <TableColumn>
                        <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                            Kontak
                        </Skeleton>
                    </TableColumn>
                    <TableColumn>
                        <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                            Bantuan
                        </Skeleton>
                    </TableColumn>
                    <TableColumn>
                        <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                            BAST
                        </Skeleton>
                    </TableColumn>
                </TableHeader>                
                <TableBody>
                    {
                        renderElement.map((d:PersonRecipientWItems, i:number)=>{
                            const isEmptyElement = d.name === "" && d.ids.nik === ""
                            if(isEmptyElement){
                                return <TableRow key={i.toString()}>
                                    <TableCell colSpan={0}>{''}</TableCell>
                                    <TableCell colSpan={0}>{''}</TableCell>
                                    <TableCell colSpan={0}>{''}</TableCell>
                                    <TableCell colSpan={0}>{''}</TableCell>
                                    <TableCell colSpan={0}>{''}</TableCell>
                                    <TableCell colSpan={6}>
                                        <TotalCard total={totalPrice} />   
                                    </TableCell>
                                    <TableCell colSpan={1}>{''}</TableCell>
                                </TableRow>
                            }                            
                            return (
                                <TableRow key={i.toString()}>
                                    <TableCell>                                        
                                        {d.name}                                        
                                    </TableCell>
                                    <TableCell>                                        
                                        {d.address.street}, {d.address.rtRw}, {d.address.kelurahan}, {d.address.kecamatan}, {d.address.kabupaten}                                        
                                    </TableCell>
                                    <TableCell>
                                        {d.ids.nik}                                        
                                    </TableCell>
                                    <TableCell>
                                        {d.ids.noKk}                                        
                                    </TableCell>
                                    <TableCell>
                                        <TableContact contact={d.contact} />                                                                                
                                    </TableCell>
                                    <TableCell>
                                        <TableItem item={d.items[0]} editable={false} />                                        
                                    </TableCell>
                                    <TableCell>
                                        <Button size='sm' color='primary' startContent={<PrintIcon className='size-4' />}
                                            onPress={()=>{
                                                saveDocumentToFile(attachmentDoc, 'attachment.docx')
                                            }}
                                        >
                                            BAST <br/>(maintenance)   
                                        </Button>                                        
                                    </TableCell>                                    
                                </TableRow>
                            )
                        })
                    }                    
                </TableBody>
            </Table>
            <div className="flex items-center justify-end px-2 py-3">
                <Link href="/RAB" isDisabled={fetchState === "loading"} color="primary" underline="hover"
                    className="mx-4"
                >
                    Daftar RAB
                </Link>
            </div>
        </div>
    )
}