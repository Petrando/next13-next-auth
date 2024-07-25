import { AlignmentType, LevelFormat, convertInchesToTwip, Document, Paragraph, TextRun, HeadingLevel } from "docx";
import { CalendarDate } from "@internationalized/date";
import { vendorHeader as header, textRun, tableAsContent, tableAsListItem, fifty2Table } from "./shared";
import { localizeDate, displayIDR, dateDiff } from "@/lib/functions";
import { ICentre, IOperator, IVendor } from "@/types";
    
export const createSphDoc = (
    sph: {
        sphNum: string, date: CalendarDate
    },
    centre: ICentre, decidingOperator: IOperator,
    vendor: IVendor,
    value: {
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
    const { todate, bulan, year } = localizeDate(sph.date)
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
                                { content: sph.sphNum },
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
                                { content: "Surat Penawaran Harga", bold: true },
                                100, HeadingLevel.HEADING_3
                            )
                        },
                        {
                            content: ""
                        }
                    ),
                    new Paragraph({
                        children:[
                            textRun({ text: "Kepada Yth :", lineBreak: 1}),
                            textRun({ text: `Pejabat Pembuat Komitment Sentra "${centre.name}"`, lineBreak: 1}),
                            textRun({ text: 'di', lineBreak: 1 }),
                            textRun({ text: `   ${centreAddress}`, lineBreak: 1, italics: true}),
                            //first paragraph
                            textRun({ text: `Sehubungan dengan Pengadaan Langsung ${purpose} Sentra ${centre.name}, dan setelah kami pelajari dengan saksama Dokumen Pengadaan, dengan ini kami mengajukan penawaran untuk Pengadaan Bantuan Atensi Alat Bantu Di Kota Tangerang Sentra “${centre.name}” Di Jakarta Tahun 2024 `, lineBreak: 2 }),                            
                            textRun({ text: `${displayIDR(value.value)} (${value.inWords}).`, bold: true}),
                            //2nd paragraph
                            textRun({ text: `Penawaran ini sudah memperhatikan ketentuan dan persyaratan yang tercantum dalam Dokumen Pengadaan Langsung  untuk melaksanakan pekerjaan tersebut di atas.`, lineBreak: 2 }),
                            //3rd paragraph
                            textRun({ text: `Kami akan melaksanakan pekerjaan tersebut dengan jangka waktu pelaksanaan pekerjaan Selama 8 Hari Kalender. Penawaran ini berlaku selama 14 (empat belas hari) hari kalender sejak tanggal surat penawaran ini. Surat Penawaran beserta lampirannya kami sampaikan sebanyak 1 (satu) rangkap dokumen asli.`, lineBreak: 2 }),
                            //4th paragraph
                            textRun({ text: `Dengan disampaikannya Surat Penawaran ini, maka kami menyatakan sanggup dan akan tunduk pada semua ketentuan yang tercantum dalam Dokumen Pengadaan.`, lineBreak: 2})
                        ],
                        heading: HeadingLevel.HEADING_3
                    }),
                    new Paragraph(""),
                    new Paragraph(""),
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
                            textRun({text: "", lineBreak: 3 })
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