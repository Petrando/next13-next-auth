import { AlignmentType, LevelFormat, convertInchesToTwip, Document, Paragraph, TextRun, HeadingLevel, TableCell, TableRow, WidthType, Table } from "docx";
import { CalendarDate } from "@internationalized/date";
import { vendorHeader as header, textRun, tableAsContent, tableAsListItem, fifty2Table } from "./shared";
import { localizeDate, displayIDR, dateDiff } from "@/lib/functions";
import { ICentre, IOperator, IVendor, OrderedItem } from "@/types";
    
export const createSjDoc = (
    sj: {
        sjNum: string, date: CalendarDate
    },
    centre: ICentre, decidingOperator: IOperator,
    vendor: IVendor,
    sendTo: string,
    items: OrderedItem[],
    logo: string
) => {
    const run = {
        size: 25, color: "000000", font: "Calibri"
    }
    const styles = {
        default: {
            heading1: {
                run:{
                    size: 40, color: "000000", font: "Arial", bold: true,
                },
                paragraph: {
                    alignment:AlignmentType.CENTER,                    
                },
            },
            heading2: {
                run: {
                    size: 25,                
                    color: "000000",
                    font: "Arial",
                    bold: true
                }
            },
            heading3: {
                run,
                paragraph: {
                    alignment:AlignmentType.LEFT,                    
                },
            },
            heading4: {
                run: {
                    size: 32,                
                    color: "000000",
                    font: "Arial",
                    bold: true
                },
                paragraph: {
                    alignment:AlignmentType.LEFT,                    
                },
            },
            heading5: {
                run: {
                    size: 24,                
                    color: "000000",
                    font: "Arial",                    
                },
                paragraph: {
                    alignment:AlignmentType.CENTER,                    
                },
            },
            heading6: {
                run: {
                    size: 24,                
                    color: "000000",
                    font: "Arial",
                    bold: true                    
                },
                paragraph: {
                    alignment:AlignmentType.CENTER,                    
                },
            }
        }
    }

    const { name, address:{propinsi} } = centre
        
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

    const {street:centreStreet, kabupaten:centreKab, kelurahan: centreKel, kecamatan: centreKec, postCode} = 
        centre.address

    const centreAddress = centreStreet + ", "  + centreKel + "-" + centreKec + "-" + centreKab
    const { todate, bulan, year } = localizeDate(sj.date)

    const totalItem = items.reduce((acc: number, curr: OrderedItem) => {
        const newAmt = acc + curr.amount
        return newAmt
    }, 0)

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
                                heading: HeadingLevel.HEADING_5,
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
                                heading: HeadingLevel.HEADING_5,
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
                                        text:  d.amount.toString(), 
                                    })
                                ],
                                heading: HeadingLevel.HEADING_5,
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
                                heading: HeadingLevel.HEADING_5,
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
                                        text: "Lengkap"
                                    })
                                ],
                                heading: HeadingLevel.HEADING_5,
                                alignment: AlignmentType.CENTER
                            })
                        ],
                    })
                ],                                                
            })
        )
    })

    const doc = new Document({
        styles,
        numbering,        
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 800,
                            right: 1000,
                            bottom: 700,
                            left: 1000,
                        },
                    },
                },
                children: [
                    ...header(logo, vendor, HeadingLevel.HEADING_3),
                    new Paragraph({
                        children: [
                            textRun("Kepada Yth. ", false, 1),
                            textRun(sendTo, false, 1),
                            textRun(`Bersama ini kami kirimkan ${totalItem} unit. Perincian per barang adalah sebagai berikut : `, false, 2)
                        ],
                        heading: HeadingLevel.HEADING_5,
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
                                                        text:"Vol", bold: true
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
                                                        text:"Keterangan", bold: true,                                                     
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
                    fifty2Table(
                        { content: ""},
                        { content: `Jakarta, ${todate} ${bulan} ${year}`, style: HeadingLevel.HEADING_5}
                    ),
                    new Paragraph(""),
                    new Paragraph(""),                                                          
                    fifty2Table(
                        { content: sendTo, style: HeadingLevel.HEADING_5 },
                        { content: vendor.name, style: HeadingLevel.HEADING_5 }
                    ),
                    new Paragraph(""),
                    new Paragraph(""),
                    new Paragraph(""),
                    fifty2Table(
                        { content: "", style: HeadingLevel.HEADING_5 },
                        { content: vendor.owner.name, style: HeadingLevel.HEADING_6, bold: true }
                    ),
                    fifty2Table(
                        { content: "", style: HeadingLevel.HEADING_5 },
                        { content: vendor.owner.rank, style: HeadingLevel.HEADING_5 }
                    ),
                    new Paragraph(""),
                    new Paragraph({
                        children: [
                            textRun("Mengetahui", false, 1),
                            textRun(`Sentra ${centre.name} di Jakarta`, false, 1)
                        ],
                        heading: HeadingLevel.HEADING_5,
                        alignment: AlignmentType.CENTER
                    })
                ]
            }
        ]
    })

    return { doc }
}