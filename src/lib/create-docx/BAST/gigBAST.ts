import {
    AlignmentType,
    convertInchesToTwip,
    Document,
    HeadingLevel,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    LevelFormat,
    TextRun,
    WidthType,
    PageBreak,
} from "docx";
import { vendorHeader as header, textRun, tableAsContent, tableAsListItem, fifty2Table } from "../shared";
import { CalendarDate } from "@internationalized/date";
import { localizeDate, displayIDR, dateDiff } from "@/lib/functions";
import { ICentre, IOperator, IVendor } from "@/types";

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

    const gigTable = tableAsContent({ content: "Pekerjaan" }, {content: gig })
    const bastNoTable = tableAsContent({ content: "Nomor" }, { content: bastNo })

    const locationTable = tableAsContent({ content:"Lokasi" }, { content: location })
    const dateTable = tableAsContent({ content: "Tanggal" }, { content: "25 Maret 2024" })
    const attachmentTable = tableAsContent({ content: "Lampiran" }, { content: "-" })

    const { NIP, name, rank } = decidingOperator
    const line1 = tableAsContent({ content: "Nama", width: 15 }, { content: name, width: 80, bold: true }, 80, HeadingLevel.HEADING_6)
    const line2 = tableAsContent({ content: "Jabatan", width: 15 }, { content: "Pejabat Pembuat Komitmen", width: 80 }, 80, HeadingLevel.HEADING_6)
    const line3 = tableAsContent({ content: "Alamat", width: 15}, { content: "Jl. Tat Twam Asi No. 47 Komplek Depsos Pasar Rebo Jakarta Timur", width: 80 }, 80, HeadingLevel.HEADING_6)
    const line4 = tableAsContent(
        { content: "", width: 15 }, 
        { content: "Dalam hal ini bertindak untuk dan atas nama Sentra ’’Mulya Jaya’’ di Jakarta, yang selanjutnya disebut PIHAK PERTAMA", bold: true, width: 80 }, 80, HeadingLevel.HEADING_6)    

    const { 
        owner: { name: ownerName, rank: ownerRank }, 
        address : {
            street: vendorStreet, rtRw: vendorRtRw, kelurahan: vendorKelurahan, 
            kecamatan: vendorKecamatan, kabupaten: vendorKabupaten, propinsi: vendorPropinsi,
            postCode: vendorPostCode
        },
        name: vendorName
    } = vendor
    const line21 = tableAsContent(
        { content: "Nama", width: 15 }, 
        { content: ownerName, width: 80, bold: true }, 80, HeadingLevel.HEADING_6
    )
    const line22 = tableAsContent(
        { content: "Jabatan", width: 15 }, 
        { content: `${ownerRank} ${vendor.name}`, width: 80 }, 80, HeadingLevel.HEADING_6
    )
    const line23 = tableAsContent(
        { content: "Alamat", width: 15}, 
        { content: `${vendorStreet} desa/kelurahan ${vendorKelurahan}, kec. ${vendorKecamatan}, 
            ${vendorKabupaten}, provinsi ${vendorPropinsi}, kode pos: ${vendorPostCode}`, width: 80 }, 
        80, HeadingLevel.HEADING_6)
    const line24 = tableAsContent(
        { content: "", width: 15 }, 
        { content: `Dalam hal ini bertindak untuk dan atas nama ${vendorName} yang Selanjutnya disebut PIHAK KEDUA`, 
        bold: true, width: 80 }, 80, HeadingLevel.HEADING_6)        
    
    const { todate, hari, tanggal, bulan, tahun, year } = localizeDate(endDate)
    const { todate: todateStart, bulan: bulanStart,  year: yearStart } = localizeDate(startDate)

    const line31 = tableAsContent(
        { content: "Pekerjaaan", width: 15 },
        { content: gig, width: 80 },
        100,
        HeadingLevel.HEADING_6
    )
    const line32 = tableAsContent(
        { content: "Lokasi", width: 15 },
        { content: location, width: 80 },
        100,
        HeadingLevel.HEADING_6
    )
    const line33 = tableAsContent(
        { content: "Daftar Isian", width: 15 },
        { content: `Sentra "Mulya Jaya" Di Jakarta`, width: 80 },
        100,
        HeadingLevel.HEADING_6
    )
    const line34 = tableAsContent(
        { content: `Pelaksanaan Anggaran (DIPA) Tahun Anggaran ${year}`, width: 15 },
        { content: year.toString(), width: 80 },
        100,
        HeadingLevel.HEADING_6
    )
    const line35 = tableAsContent(
        { content: "Kontraktor Pelaksana", width: 15 },
        { content: vendorName, width: 80, bold: true },
        100,
        HeadingLevel.HEADING_6
    )
    const line36 = tableAsContent(
        { content: "Surat Perintah Kerja", width: 15 },
        { content: `${spkNo} Tanggal ${todateStart} ${bulanStart} ${yearStart}`, width: 80 },
        100,
        HeadingLevel.HEADING_6
    )
    
    const line41 = tableAsContent(
        { content: "Biaya Pelaksanaan", width: 15 },
        { content: `${displayIDR(total)} (${nominalInWords.nominal})`, width: 80, bold: true },
        100,
        HeadingLevel.HEADING_6
    )    
    const line42 = tableAsContent(
        { content: "Jangka Waktu", width: 15 },
        { content: `${dateDiff(
            new Date(startDate.year + "-" + startDate.month + "-" + startDate.day),
            new Date(endDate.year + "-" + endDate.month + "-" + endDate.day))} hari kerja`, width: 80 },
        100,
        HeadingLevel.HEADING_6
    )
    const line43 = tableAsContent(
        { content: "Pelaksanaan", width: 15 },
        { content: `${todateStart} ${bulanStart} sampai ${todate} ${bulan} ${year}`, width: 80 },
        100,
        HeadingLevel.HEADING_6
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
                    ...header(logo, vendor, HeadingLevel.HEADING_6),                    
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
                                                    new TextRun({
                                                        text:`Kementrian Sosial RI Sentra "Mulya Jaya" di Jakarta`.toUpperCase(), 
                                                        bold:true
                                                    })
                                                ],
                                                heading: HeadingLevel.HEADING_6,
                                                alignment: AlignmentType.CENTER
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
                                                    new TextRun(
                                                        {
                                                            text: "Berita Acara Serah Terima Pelaksanaan Pekerjaan".toUpperCase(),
                                                            bold: true
                                                        }
                                                    )
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
                            textRun({ text: "Pada hari ini, "}),
                            textRun({ text: hari, bold: true }),
                            textRun({ text: " tanggal " }), textRun({ text: tanggal, bold: true }),
                            textRun({ text: " bulan "}), textRun({ text: bulan, bold: true }),
                            textRun({ text: " tahun "}), textRun({ text: tahun, bold: true }),
                            textRun({ text: ", kami yang bertandatangan dibawah ini : "})
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
                            textRun({ text: `Berdasarkan Surat Perintah Kerja Nomor : ${spkNo}, Tanggal ${todateStart} ${bulanStart} ${yearStart} Pekerjaan Pengadaan Bantuan Atensi Alat Bantu Di Kota Tangerang Pada Sentra ‘’Mulya Jaya’’ Di Jakarta PIHAK PERTAMA dan PIHAK KEDUA telah setuju dan sepakat bahwa untuk :` }),                            
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
                        { content: "PIHAK KEDUA", style: HeadingLevel.HEADING_6 }, 
                        { content: "PIHAK PERTAMA", style: HeadingLevel.HEADING_6 }
                    ),
                    fifty2Table(
                        { content: vendorName, bold: true, style: HeadingLevel.HEADING_6 }, 
                        { content: "PEJABAT PENERIMA HASIL PEKERJAAN", style: HeadingLevel.HEADING_6 }
                    ),
                    fifty2Table(
                        { content: "", style: HeadingLevel.HEADING_6 }, 
                        { content: "Sentra Mulya Jaya di Jakarta", bold: true, style: HeadingLevel.HEADING_6 }
                    ),
                    lineBreaker("", 3),
                    fifty2Table(
                        { content: name, bold: true, style: HeadingLevel.HEADING_6 }, 
                        { content: ownerName, bold: true, style: HeadingLevel.HEADING_6 }
                    ),
                    fifty2Table(
                        { content: ownerRank, style: HeadingLevel.HEADING_6 }, 
                        { content: `NIP. ${NIP}`, style: HeadingLevel.HEADING_6 }
                    ),
                ],
            },
        ],
    });

    return { doc }

}