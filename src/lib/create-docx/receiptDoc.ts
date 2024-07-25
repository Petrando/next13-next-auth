import { AlignmentType, LevelFormat, convertInchesToTwip, Document, Paragraph, TextRun, HeadingLevel } from "docx";
import { CalendarDate } from "@internationalized/date";
import { vendorHeader as header, textRun, tableAsContent, tableAsListItem, fifty2Table } from "./shared";
import { localizeDate, displayIDR, dateDiff } from "@/lib/functions";
import { ICentre, IOperator, IVendor } from "@/types";

type tPoint = {
    about: string; description: string;
}
export const createReceiptDoc = (
    receipt: {
        receiptNum: string, date: CalendarDate
    },
    centre: ICentre, decidingOperator: IOperator,
    vendor: IVendor,
    payment: {
        value: number, inWords: string
    },
    purpose: string,
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

    const points: tPoint[] = [
        {
            about:"Telah Terima Dari", description: `Pejabat Pembuat Komitmen Sentra "${name}" ${propinsi}`
        },
        {
            about:"Uang Sebanyak", description: payment.inWords
        },
        {
            about:"Untuk Pembayaran", description: purpose
        }
    ]

    const renderPoints = points.map((d:tPoint, i: number) =>         
        tableAsContent(
            {
                content: d.about, bold: true
            },
            {
                content: d.description, bold: true
            },
            100,
            HeadingLevel.HEADING_2
        )
    )

    const { todate, bulan, year } = localizeDate(receipt.date)
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
                            new TextRun({
                                text: "KUITANSI", break: 1
                            })
                        ],
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,                        
                    }),                    
                    new Paragraph({
                        text: `No. ${receipt.receiptNum}`,
                        heading: HeadingLevel.HEADING_3,
                        alignment: AlignmentType.CENTER,
                        
                    }),
                    new Paragraph(""),
                    ...renderPoints,
                    new Paragraph(""),
                    new Paragraph(""),
                    new Paragraph({
                        text:displayIDR(payment.value), heading: HeadingLevel.HEADING_4
                    }),
                    new Paragraph(""),
                    new Paragraph(""),
                    fifty2Table(
                        {content:""},
                        {content:`Jakarta, ${todate} ${bulan} ${year}`, style: HeadingLevel.HEADING_5}
                    ),
                    fifty2Table(
                        {content:""},
                        {content:vendor.name, style: HeadingLevel.HEADING_5}
                    ),
                    new Paragraph(""),
                    new Paragraph(""),
                    new Paragraph(""),
                    fifty2Table(
                        {content:""},
                        {content:vendor.owner.name, style: HeadingLevel.HEADING_6, bold: true }
                    ),
                    fifty2Table(
                        {content:""},
                        {content:vendor.owner.rank, style: HeadingLevel.HEADING_5}
                    ),
                    
                ]
            }
        ]
    })

    return { doc }
}