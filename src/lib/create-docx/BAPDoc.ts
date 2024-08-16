import { AlignmentType, convertInchesToTwip, Document, HeadingLevel, LevelFormat, PageBreak, Paragraph, Table, TableCell, TableRow, TextDirection, TextRun, VerticalAlign, WidthType } from "docx";
import { CalendarDate } from "@internationalized/date";
import { centreHeader, fifty2Table, tableAsContent, tableAsListItem, textRun } from "./shared";
import { localizeDate, displayIDR } from "../functions";
import { ICentre, IOperator, IVendor } from "@/types";

const displayValue = (value: number) => (
    value > 0?displayIDR(value):"Rp. -"
)

type tTableRow = {
    label: string; netto: number; ppn: number; value: number;
}

const rekapTable = (rows: tTableRow[]) => {
    const renderRows = rows.map((d:tTableRow, i: number) =>(
        new TableRow({
            children: [
                new TableCell({
                    children: [
                        new Paragraph({
                            text: (i + 1).toString(),
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.LEFT
                        }),
                    ],
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            text: d.label,
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.LEFT
                        }),
                    ],
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            text: displayValue(d.netto),
                            alignment: AlignmentType.LEFT
                        }),
                    ],                    
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            text: displayValue(d.ppn),
                            alignment: AlignmentType.LEFT
                        }),
                    ],                    
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            text: displayValue(d.value),
                            alignment: AlignmentType.LEFT
                        }),
                    ],                    
                }),
            ],
        })
    ))
    return (
        new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph(
                                {text: "No", alignment: AlignmentType.CENTER})],
                            verticalAlign: VerticalAlign.CENTER,                            
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: 5
                            }
                        }),
                        new TableCell({
                            children: [new Paragraph(
                                {text: "Uraian", alignment: AlignmentType.CENTER})],
                            verticalAlign: VerticalAlign.CENTER,
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: 35
                            }
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: "Netto (Rp)", alignment: AlignmentType.CENTER })],
                            verticalAlign: VerticalAlign.CENTER,
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: 20
                            }
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: "PPN (Rp)", alignment: AlignmentType.CENTER })],
                            verticalAlign: VerticalAlign.CENTER,
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: 20
                            }
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: "Nilai Kontrak", alignment: AlignmentType.CENTER })],
                            verticalAlign: VerticalAlign.CENTER,
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: 20
                            }
                        })
                    ],
                }),
                ...renderRows
            ],
            width:{
                size: 100, type: WidthType.PERCENTAGE
            }
        })
    )
}

export const createBAPDoc = (
    bap:{
        bapDate: CalendarDate, bapNo: string
    },
    centre: ICentre,
    decidingOperator: IOperator,
    vendor: IVendor,
    dipa:{
        dipaNo: string, dipaDate: CalendarDate
    },
    spkNo: string,
    payments:{
        contractValue:{
            value: number, inWords: string
        },
        paymentUntilNow: number, valueUntilLastGig: number, currentPayment: number,
        discounts:{
            retention: number, refund: number
        },
        currentNetPayment: number, taxes: number
    },
    gigData:{
        gig: string, program: string, satKer: string, instansi: string
    },
    vendorBank:{
        bank: string, accNum: string
    },
    logo: string
) => {
    const run = {
        size: 20, color: "000000", font: "Calibri"
    }
    const styles = {
        default: {
            heading1: {
                run,
                paragraph: {
                    alignment:AlignmentType.CENTER,                    
                },
            },
            heading2: {
                run: {
                    size: 22,                
                    color: "000000",
                    font: "Arial",
                    bold: true
                },
                paragraph: {
                    alignment:AlignmentType.CENTER,                    
                },
            },
            heading3: {
                run,
                paragraph: {
                    alignment:AlignmentType.LEFT,                    
                },
            }
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

    const { NIP, name, rank } = decidingOperator

    const { name: centreName, address } = centre
    const {street:centreStreet, kabupaten:centreKab, kelurahan: centreKel, kecamatan: centreKec, postCode} = 
        address

    const centreAddress = centreStreet + " "  + centreKel + " " + centreKec + " " + centreKab
    
    const { 
        owner: { name: ownerName, rank: ownerRank }, 
        address : {
            street: vendorStreet, rtRw: vendorRtRw, kelurahan: vendorKelurahan, 
            kecamatan: vendorKecamatan, kabupaten: vendorKabupaten, propinsi: vendorPropinsi,
            postCode: vendorPostCode
        },
        name: vendorName
    } = vendor

    const vendorAddress = vendorStreet + " "  + vendorKelurahan + " " + vendorKecamatan + " " + vendorKabupaten    

    const lineName = tableAsContent(
        { content: "Nama", width: 15 }, 
        { content: name, width: 80, bold: true }, 80, HeadingLevel.HEADING_3)
    const lineRank = tableAsContent(
        { content: "Jabatan", width: 15 }, 
        { content: "Pejabat Pembuat Komitmen", width: 80 }, 80, HeadingLevel.HEADING_3)
    const lineAddress = tableAsContent(
        { content: "Alamat", width: 15}, 
        { content: centreAddress, width: 80 }, 80, HeadingLevel.HEADING_3)
    const lineParty = tableAsContent(
        { content: "Selanjutnya disebut", width: 15}, 
        { content: "PIHAK PERTAMA", width: 80 }, 80, HeadingLevel.HEADING_3)

    const lineName2 = tableAsContent(
        { content: "Nama", width: 15 }, 
        { content: ownerName, width: 80, bold: true }, 80, HeadingLevel.HEADING_3)
    const lineRank2 = tableAsContent(
        { content: "Jabatan", width: 15 }, 
        { content: `${ownerRank} ${vendorName}`, width: 80 }, 80, HeadingLevel.HEADING_3)
    const lineAddress2 = tableAsContent(
        { content: "Alamat", width: 15}, 
        { content: vendorAddress, width: 80 }, 80, HeadingLevel.HEADING_3)
    const lineParty2 = tableAsContent(
        { content: "Selanjutnya disebut", width: 15}, 
        { content: "PIHAK KEDUA", width: 80 }, 80, HeadingLevel.HEADING_3)

    const { gig, program, satKer, instansi } = gigData
    const {
        paymentUntilNow, valueUntilLastGig, currentPayment,
        discounts:{
            retention, refund
        },
        currentNetPayment, taxes
    } = payments

    const rekapRows: tTableRow[] = [
        { label: "Nilai Kontrak", netto: currentNetPayment, ppn: taxes, value: currentPayment },
        { label: "Pembayaran s/d BAP yang lalu", netto: 0, ppn: 0, value: 0 },
        { label: "Pembayaran BAP ini", netto: currentNetPayment, ppn: taxes, value: currentPayment },
        { label: "Total Pembayaran s/d BAP ini", netto: currentNetPayment, ppn: taxes, value: currentPayment },
        { label: "Sisa dana", netto: 0, ppn: 0, value: 0 },
    ]

    const { todate, hari, tanggal, bulan, tahun, year } = localizeDate(bap.bapDate)
    const { todate: dipaTodate, bulan: dipaBulan, year: dipaYear } = localizeDate(dipa.dipaDate)
        
    const doc = new Document({
        styles,
        numbering,        
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1000,
                            right: 1200,
                            bottom: 700,
                            left: 1200,
                        },
                    },
                },
                children: [
                    centreHeader(logo, centre, HeadingLevel.HEADING_1, false),
                    new Paragraph({
                        children:[
                            new TextRun({
                                text: "Berita Acara Pembayaran", break:1,                                
                            }),
                            new TextRun({
                                text: `No. ${ bap.bapNo }`, break:1,                                
                            })
                        ],
                        heading: HeadingLevel.HEADING_2,                        
                    }),
                    new Paragraph({
                        children:[
                            new TextRun({
                                text: `Pada hari ini, ${hari} Tanggal ${tanggal} Bulan ${bulan} Tahun ${tahun}, yang bertanda tangan di bawah ini : `, 
                                break:2,                                
                            })
                        ],
                        heading: HeadingLevel.HEADING_3                        
                    }),
                    new Paragraph(""),
                    tableAsListItem(1, [lineName, lineRank, lineAddress, lineParty]),
                    new Paragraph(""),
                    tableAsListItem(2, [lineName2, lineRank2, lineAddress2, lineParty2]),                    
                    new Paragraph({
                        children:[
                            new TextRun({
                                text: `Berdasarkan : `, 
                                break:2,                                
                            })
                        ],
                        heading: HeadingLevel.HEADING_3                        
                    }),
                    tableAsListItem(
                        1,
                        [
                            tableAsListItem(
                                "a",
                                [
                                    tableAsContent(
                                        { content: "No dan Tanggal DIPA", width: 20 }, 
                                        { content: `${dipa.dipaNo} tanggal ${dipaTodate} ${dipaBulan} ${dipaYear}`, width: 80, }, 100, HeadingLevel.HEADING_3
                                    ),                                        
                                ]
                            ),
                            tableAsListItem(
                                "b",
                                [
                                    tableAsContent(
                                        { content: "Nilai Kontrak ", width: 20 }, 
                                        { content: `${displayIDR(payments.contractValue.value)}`, width: 75, }, 100, HeadingLevel.HEADING_3
                                    ),
                                    tableAsContent(
                                        { content: "", width: 15 }, 
                                        { content: `(${payments.contractValue.inWords})`, width: 75, italics: true }, 100, HeadingLevel.HEADING_3
                                    )
                                ]
                            ),
                            tableAsListItem(
                                "c",
                                [
                                    tableAsContent(
                                        { content: "Uraian Pekerjaan ", width: 20 }, 
                                        { content: `${gig}`, width: 75, italics: true }, 100, HeadingLevel.HEADING_3
                                    )
                                ]
                            ),
                            tableAsListItem(
                                "d",
                                [
                                    tableAsContent(
                                        { content: "Lokasi ", width: 20 }, 
                                        { content: `${centreAddress}`, width: 75 }, 100, HeadingLevel.HEADING_3
                                    )
                                ]
                            ),
                            tableAsListItem(
                                "e",
                                [
                                    tableAsContent(
                                        { content: "Program ", width: 20 }, 
                                        { content: `${program}`, width: 75 }, 100, HeadingLevel.HEADING_3
                                    )
                                ]
                            ),
                            tableAsListItem(
                                "f",
                                [
                                    tableAsContent(
                                        { content: "Unit Organisasi / Satker ", width: 20 }, 
                                        { content: `${satKer}`, width: 75 }, 100, HeadingLevel.HEADING_3
                                    )
                                ]
                            ),
                            tableAsListItem(
                                "g",
                                [
                                    tableAsContent(
                                        { content: "Instansi / Lembaga ", width: 20 }, 
                                        { content: `${instansi}`, width: 75 }, 100, HeadingLevel.HEADING_3
                                    )
                                ]
                            )
                        ]
                    ),
                    tableAsListItem(
                        2,
                        [
                            tableAsListItem(
                                "a",
                                [
                                    tableAsContent(
                                        { content: "Sesuai SPK", width: 20 }, 
                                        { content: `${spkNo}`, width: 80, }, 100, HeadingLevel.HEADING_3
                                    ), 
                                ]
                            ),
                            tableAsListItem(
                                "b",
                                [
                                    new Paragraph({
                                        children: [
                                            textRun(
                                                {text: "Sesuai Surat Perintah Kerja Pengadaan Barang di Panti tentang cara pembayaran, maka PIHAK KEDUA berhak menerima pembayaran langsung dari PIHAK PERTAMA dengan rincian sebagai berikut :"})
                                        ],
                                        heading: HeadingLevel.HEADING_3,
                                    }),
                                    tableAsListItem(
                                        "I",
                                        [
                                            new Paragraph({
                                                children: [
                                                    textRun({text: "Perhitungan Pembayaran"})
                                                ],
                                                heading: HeadingLevel.HEADING_3,
                                            }),
                                            tableAsListItem(
                                                "a",
                                                [
                                                    tableAsContent(
                                                        { content: "Pembayaran  s/d BAP ini (bruto)", width: 20 }, 
                                                        { content: `${displayValue(paymentUntilNow)}`, width: 80, }, 100, HeadingLevel.HEADING_3
                                                    )
                                                ]
                                            ),
                                            tableAsListItem(
                                                "b",
                                                [
                                                    tableAsContent(
                                                        { content: "Nilai Pekerjaan s/d BAP yang lalu", width: 20 }, 
                                                        { 
                                                            content: `${displayValue(valueUntilLastGig)}`, 
                                                            width: 80, 
                                                        }, 100, HeadingLevel.HEADING_3
                                                    )
                                                ]
                                            ),
                                            tableAsListItem(
                                                "c",
                                                [
                                                    tableAsContent(
                                                        { content: "Pembayaran BAP ini", width: 20 }, 
                                                        { 
                                                            content: `${displayValue(currentPayment)}`, 
                                                            width: 80, 
                                                        }, 100, HeadingLevel.HEADING_3
                                                    )
                                                ]
                                            ),
                                            tableAsListItem(
                                                "d",
                                                [
                                                    new Paragraph({
                                                        children: [
                                                            textRun({text: "Potongan Pembayaran"})
                                                        ],
                                                        heading: HeadingLevel.HEADING_3,
                                                    }),
                                                    tableAsListItem(
                                                        "a",
                                                        [
                                                            tableAsContent(
                                                                { content: "Uang Jaminan / Retensi", width: 20 }, 
                                                                { 
                                                                    content: `${displayValue(retention)}`, 
                                                                    width: 80, 
                                                                }, 100, HeadingLevel.HEADING_3
                                                            )
                                                        ]
                                                    ),
                                                    tableAsListItem(
                                                        "b",
                                                        [
                                                            tableAsContent(
                                                                { content: "Pengembalian Uang Muka", width: 20 }, 
                                                                { 
                                                                    content: `${displayValue(refund)}`, 
                                                                    width: 80, 
                                                                }, 100, HeadingLevel.HEADING_3
                                                            )
                                                        ]
                                                    ),
                                                    tableAsListItem(
                                                        "c",
                                                        [
                                                            tableAsContent(
                                                                { content: "Jumlah Potongan", width: 20 }, 
                                                                { 
                                                                    content: `${displayValue(retention + refund)}`, 
                                                                    width: 80, 
                                                                }, 100, HeadingLevel.HEADING_3
                                                            )
                                                        ]
                                                    ),
                                                    tableAsListItem(
                                                        "d",
                                                        [
                                                            tableAsContent(
                                                                { content: "Pembayaran Fisik BAP ini	(Netto)", width: 20 }, 
                                                                { 
                                                                    content: `${displayValue(currentNetPayment)}`, 
                                                                    width: 80, 
                                                                }, 100, HeadingLevel.HEADING_3
                                                            )
                                                        ]
                                                    ),
                                                    tableAsListItem(
                                                        "e",
                                                        [
                                                            tableAsContent(
                                                                { content: "PPN 11%", width: 20 }, 
                                                                { 
                                                                    content: `${displayValue(taxes)}`, 
                                                                    width: 80, 
                                                                }, 100, HeadingLevel.HEADING_3
                                                            )
                                                        ]
                                                    )
                                                ]
                                            )
                                        ]
                                    ),
                                    tableAsListItem(
                                        "II", 
                                        [
                                            new Paragraph({
                                                children: [
                                                    textRun({text: "Rekapitulasi Pembayaran Kontrak :"})
                                                ],
                                                heading: HeadingLevel.HEADING_3,
                                            })
                                        ]
                                    ) 
                                ]
                            )
                        ]
                    ),
                    new Paragraph({
                        children:[new PageBreak()]
                    }),
                    rekapTable(rekapRows),
                    new Paragraph({
                        children:[
                            new TextRun({
                                text: `PIHAK KEDUA sepakat atas jumlah pembiayaan tersebut diatas dan melalui : No Rekening. ${vendorBank.accNum} ${vendorBank.bank} ${vendorName}`,                                                                 
                            })
                        ],
                        heading: HeadingLevel.HEADING_3                        
                    }),
                    new Paragraph({
                        children:[
                            new TextRun({
                                text: `Demikian Berita Acara Pembayaran ini dibuat 10 rangkap untuk dipergunakan seperlunya.`,                                                                 
                            })
                        ],
                        heading: HeadingLevel.HEADING_3                        
                    }),
                    new Paragraph(""),
                    new Paragraph(""),
                    fifty2Table(
                        { content:"", style: HeadingLevel.HEADING_3 },
                        { content: `Jakarta ${todate} ${bulan} ${year}`, style: HeadingLevel.HEADING_3}
                    ),
                    fifty2Table(
                        { content: "PIHAK KEDUA", bold: true, style: HeadingLevel.HEADING_3 },
                        { content: `PIHAK PERTAMA`, bold: true, style: HeadingLevel.HEADING_3 }
                    ),
                    new Paragraph(""),
                    new Paragraph(""),
                    new Paragraph(""),
                    fifty2Table(
                        { content: `${ownerName}`, bold: true, style: HeadingLevel.HEADING_3 },
                        { content: `${name}`, bold: true, style: HeadingLevel.HEADING_3 }
                    ),
                ]
            }
        ]
    })

    return { doc }
}