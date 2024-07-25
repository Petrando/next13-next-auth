import { AlignmentType, LevelFormat, convertInchesToTwip, Document, Paragraph, TextRun, HeadingLevel } from "docx";
import { CalendarDate } from "@internationalized/date";
import { vendorHeader as header, textRun, tableAsContent, tableAsListItem, fifty2Table } from "./shared";
import { localizeDate, displayIDR, dateDiff } from "@/lib/functions";
import { ICentre, IOperator, IVendor } from "@/types";

type tPoint = {
    about: string; description: string;
}
export const createPaymentReqDoc = (
    receipt: {
        receiptNum: string, date: CalendarDate
    },
    spk:{
        spkNum: string, date: CalendarDate
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

    const {street:centreStreet, kabupaten:centreKab, kelurahan: centreKel, kecamatan: centreKec, postCode} = 
        centre.address

    const centreAddress = centreStreet + ", "  + centreKel + "-" + centreKec + "-" + centreKab

    const { todate, bulan, year } = localizeDate(receipt.date)
    const { todate: spkTodate, bulan: spkBulan, year: spkYear } = localizeDate(spk.date)
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
                    new Paragraph(""),
                    fifty2Table(
                        {
                            content: tableAsContent(
                                { content:"Nomor" }, 
                                { content: spk.spkNum },
                                100, HeadingLevel.HEADING_3
                            ),
                        },
                        {
                            content: `Jakarta, ${todate} ${bulan} ${year}`,
                            style: HeadingLevel.HEADING_3
                        }
                    ),
                    fifty2Table(
                        {
                            content: tableAsContent(
                                { content:"Lampiran" }, 
                                { content: "1 (satu) berkas" },
                                100, HeadingLevel.HEADING_3
                            )
                        },
                        { content: ""}
                    ),
                    fifty2Table(
                        {
                            content: tableAsContent(
                                { content:"Perihal" }, 
                                { content: "Permohonan Pembayaran", bold: true },
                                100, HeadingLevel.HEADING_3
                            )
                        },
                        {
                            content: ""
                        }
                    ),
                    new Paragraph({
                        children:[
                            textRun("Kepada Yth :", false, 1),
                            textRun(`Pejabat Pembuat Komitment Sentra "${centre.name}"`, true, 1),
                            textRun('di', false, 1),
                            textRun(`   ${centreAddress}`, false, 1, true),
                            //first paragraph
                            textRun('Sehubungan dengan telah selesainya ', false, 2),
                            textRun(`${purpose} `, true),
                            textRun(`sesuai SPK nomor ${spk.spkNum} tanggal ${spkTodate} ${spkBulan} ${spkYear} Bersama kami dari Rekanan Pelaksana memohon agar diberikan pembayaran pekerjaan tersebut sebesar `),
                            textRun(`${displayIDR(payment.value)} (${payment.inWords}).`, true),
                            //2nd paragraph
                            textRun(`Demikian Surat Permohonan Pembayaran ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.`, false, 2)
                        ],
                        heading: HeadingLevel.HEADING_3
                    }),
                    new Paragraph(""),
                    fifty2Table(
                        {
                            content:""
                        },
                        {
                            content: "Hormat Kami,", style: HeadingLevel.HEADING_3
                        }
                    ),
                    fifty2Table(
                        {
                            content:""
                        },
                        {
                            content: vendor.name, bold: true, style: HeadingLevel.HEADING_3
                        }
                    ),
                    new Paragraph({
                        children:[
                            textRun("", false, 3)
                        ]
                    }),                    
                    fifty2Table(
                        {
                            content:""
                        },
                        {
                            content: vendor.owner.name, bold: true, style: HeadingLevel.HEADING_3
                        }
                    ),
                    fifty2Table(
                        {
                            content:""
                        },
                        {
                            content: vendor.owner.rank, bold: true, style: HeadingLevel.HEADING_3
                        }
                    )                                      
                ]
            }
        ]
    })

    return { doc }
}