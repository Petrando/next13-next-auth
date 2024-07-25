import { AlignmentType, LevelFormat, convertInchesToTwip, Document, Paragraph, TextRun, HeadingLevel } from "docx";
import { CalendarDate } from "@internationalized/date";
import { centreHeader as header, textRun, tableAsContent, tableAsListItem, fifty2Table } from "./shared";
import { localizeDate, displayIDR, dateDiff } from "@/lib/functions";
import { ICentre, IOperator, IVendor } from "@/types";

type tPoint = {
    about: string; description: string;
}
export const createHpsDoc = (
    hps: {
        hpsNo: string, date: CalendarDate
    },
    centre: ICentre, decidingOperator: IOperator,
    vendor: IVendor,
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
                    size: 23, color: "000000", font: "Arial", bold: true,
                },
                paragraph: {
                    alignment:AlignmentType.CENTER,                    
                },
            },
            heading2: {
                run: {
                    size: 22,                
                    color: "000000",
                    font: "Arial",
                }
            },
            heading3: {
                run: {
                    size: 22,                
                    color: "000000",
                    font: "Arial",
                    italic: true
                }
            },            
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

    const { todate, bulan, year } = localizeDate(hps.date)
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
                    header(logo, centre, HeadingLevel.HEADING_1, true),
                    new Paragraph({
                        children:[
                            textRun("PENENTUAN STANDARD HARGA PERKIRAAN SENDIRI/OWNER’S ESTIMATE (HPS/OE)", false, 1),
                            textRun(purpose.toUpperCase(), false, 1),
                            textRun("TAHUN ANGGARAN 2024", false, 1)
                        ],                        
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER  
                    }),
                    new Paragraph({
                        text: "",
                        border: {
                            bottom: {
                                color: "000000",
                                space: 1,
                                style: "dashed",
                                size: 8,
                            },
                        }
                    }),
                    new Paragraph({
                        children:[
                            textRun(`Nomor : ${hps.hpsNo}`, true, 1)
                        ],
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER
                    }),
                    new Paragraph(""),
                    new Paragraph({
                        children: [
                            textRun(`Berdasarkan ketentuan BAB III pasal 11 angka (1) huruf d Peraturan Presiden Republik Indonesia Nomor 12 tahun 2021 tentang Pengadaan Barang/Jasa Pemerintah dan Peraturan Presiden Republik Indonesia Nomor 12 tahun 2023 tentang Perubahan atas Peraturan Presiden Republik Indonesia Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah bahwa pengguna barang/jasa wajib mempersiapkan Harga Perkiraan Sendiri (HPS/OE).`, false, 0)
                        ],
                        heading: HeadingLevel.HEADING_2
                    }),
                    new Paragraph({
                        children: [
                            textRun(`Sehubungan adanya rencana Pengadaan Bantuan Atensi Alat Bantu Di Kota Tangerang Sentra Mulya Jaya, Pejabat Pembuat Komitmen telah mengadakan penelitian harga dengan hasil sebagaimana terlampir, dengan spesifikasi bahan terlampir.`, false, 1)
                        ],
                        heading: HeadingLevel.HEADING_2
                    }),
                    new Paragraph({
                        children: [
                            textRun(`Demikian Harga Perkiraan Sendiri (HPS/OE) ini dibuat untuk dipergunakan sebagaimana mestinya.`, false, 1)
                        ],
                        heading: HeadingLevel.HEADING_2
                    }),
                    new Paragraph(""),
                    fifty2Table(
                        { content: ""},
                        {
                            content: "Disahkan Di : Jakarta",
                            style: HeadingLevel.HEADING_2
                        }
                    ),
                    fifty2Table(
                        { content: ""},
                        {
                            content: `Pada Tanggal ${todate} ${bulan} ${year}`,
                            style: HeadingLevel.HEADING_2                            
                        }
                    ),
                    new Paragraph(""),
                    fifty2Table(
                        { content: ""},
                        {
                            content: "Pejabat Pembuat Komitmen",
                            style: HeadingLevel.HEADING_2
                            
                        }
                    ),
                    fifty2Table(
                        { content: ""},
                        {
                            content: `Sentra "${centre.name}" di Jakarta`,
                            style: HeadingLevel.HEADING_3
                            
                        }
                    ),
                    new Paragraph(""),
                    new Paragraph(""),
                    new Paragraph(""),                                                                               
                    fifty2Table(
                        { content: ""},
                        {
                            content: `${decidingOperator.name}`,
                            bold: true,
                            style: HeadingLevel.HEADING_2
                            
                        }
                    ),
                    fifty2Table(
                        { content: ""},
                        {
                            content: `NIP. ${decidingOperator.NIP}`,
                            style: HeadingLevel.HEADING_2
                            
                        }
                    ),
                ]
            }
        ]
    })

    return { doc }
}