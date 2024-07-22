import { ICentre, IVendor } from "@/types"
import { Paragraph, ImageRun, HorizontalPositionRelativeFrom, HorizontalPositionAlign, VerticalPositionRelativeFrom, VerticalPositionAlign, TextWrappingType, TextWrappingSide, TextRun, HeadingLevel, Table, TableBorders, TableCell, TableRow, WidthType, AlignmentType } from "docx"

type tStyle = "Heading1" | "Heading2" | "Heading3" | "Heading4" | "Heading5" | "Heading6" | "Title" | undefined

export const centreHeader = (
    logo: string, centre: ICentre, 
    style: tStyle = undefined,
    displayEmail: boolean = true
) => {
    const { name: centreName, address } = centre
    const {street:centreStreet, kabupaten:centreKab, kelurahan: centreKel, kecamatan: centreKec, postCode} = 
        address

    const centreAddress = centreStreet + ", "  + centreKel + "-" + centreKec + "-" + centreKab
    return (
        new Paragraph({
            children:[
                new ImageRun({
                    data: logo,
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
                    color:"000000",                
                }),
                new TextRun({
                    text: `SENTRA "${centreName.toUpperCase()}" DI JAKARTA`,
                    break: 1
                }),
                new TextRun({
                    text: `${(centreAddress + " " +  postCode).toUpperCase()}`,
                    break: 1
                }),                
                new TextRun({
                    text: `TELEPON (021) 8400631    FAKSIMILE: (021) 8415717`,
                    break: 1
                }),
                new TextRun({
                    text: `http://mulyajaya.depsos.go.id/${displayEmail?"  EMAIL: pskw_mulyajaya@depsos.go.id":""}`,
                    break: 1
                })
            ],                            
            heading: style, 
            border: {
                bottom: {
                    color: "000000",
                    space: 2,
                    style: "double",
                    size: 8,
                },
            }                               
        })
    )
}

export const vendorHeader = ( logo: string, vendor: IVendor, style: tStyle = undefined, ) => {
    const headerLogo = new Paragraph({
        children: [
            new ImageRun({
                data: logo,
                transformation: {
                    width: 450,
                    height: 110
                }
            }),
        ],
    })

    const { address:{ street, rtRw, kelurahan, kecamatan, kabupaten, propinsi, postCode}, email, phone } = vendor
    
    const headerText = new Table({
        borders: TableBorders.NONE,
        columnWidths: [4505, 4505],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 10,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text: "Alamat"
                                    })
                                ],
                                heading: style,
                            }),
                            
                        ],                                        
                    }),
                    new TableCell({
                        width: {
                            size: 2,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text: ":"
                                    })
                                ],
                                heading: style,
                            }),
                            
                        ],                                        
                    }),
                    new TableCell({
                        width: {
                            size: 88,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text: street + ", " + kelurahan + ", " + 
                                                kecamatan + ", " + kabupaten + ", " +  propinsi + ", Kode Pos: " + postCode
                                    })
                                ],
                                heading: style,
                            })
                        ],
                    }),
                ],                                                
            }),
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 10,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text: "Email"
                                    })
                                ],
                                heading: style,
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: 2,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text: ":"
                                    })
                                ],
                                heading: style,
                            }),
                            
                        ],                                        
                    }),
                    new TableCell({
                        width: {
                            size: 88,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text:email
                                    })
                                ],
                                heading: style,
                            }),
                        ],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 10,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text: "Telp"
                                    })
                                ],
                                heading: style,
                            })
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: 2,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text: ":"
                                    })
                                ],
                                heading: style,
                            }),
                            
                        ],                                        
                    }),
                    new TableCell({
                        width: {
                            size: 88,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text:phone
                                    })
                                ],
                                heading: style,
                            })
                        ],
                    }),
                ],
            }),                                                        
        ],
        width:{
            size: 100, type: WidthType.PERCENTAGE
        }                       
    })

    return (
        [ headerLogo, headerText,
            new Paragraph({
                text:"",
                border: {
                    bottom: {
                        color: "000000",
                        space: 2,
                        style: "double",
                        size: 8,
                    },
                } 
            })

         ]
    )
}

export const textRun = (text:string, bold:boolean = false, lineBreak: number = 0, 
    italics: boolean = false) => {
    return (
        new TextRun({
            text, bold, break: lineBreak, italics
        })
    )
}

type tTableContentParam = { 
    label: string | Table;
    width?: number;
    bold?: boolean;
    italics?: boolean;
    style?: tStyle;
}

export const tableAsContent = (param1: tTableContentParam, param2: tTableContentParam, 
    tableWidth:number = 100, style: tStyle = undefined) => {
    const { label, width = 25, bold = false, italics = false } = param1
    const { label: label2, width: width2 = 70, bold: bold2 = false, italics: italics2 = false } = param2

    const paragraphChild = ( label: string, bold: boolean ) => {
        return (
            new Paragraph({
                children:[
                    textRun(label, bold, 0, italics)
                ], 
                heading: style,
            })
        )
    }
    return (
        new Table({
            borders: TableBorders.NONE,                                                                                        
            rows: [
                new TableRow({
                    children:[
                        new TableCell({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: width
                            },
                            children: [
                                typeof label === "string"?
                                    paragraphChild(label, bold):label
                            ]
                        }),
                        new TableCell({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: 5
                            },
                            children: [
                                new Paragraph({
                                    text: label!==""?":":"", 
                                    heading: style
                                })
                            ]
                        }),
                        new TableCell({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: width2
                            },
                            children: [
                                typeof label2 === "string"?
                                    paragraphChild(label2, bold2):label2
                            ]
                        })
                    ],                                                        
                })
            ],
            width:{
                size: tableWidth, type: WidthType.PERCENTAGE
            }
        })
    )
}

export const tableAsListItem = (idx: number | string, content: Table[] | Paragraph[], style: tStyle = undefined) => {
    
    return (
        new Table({
            borders: TableBorders.NONE,
            columnWidths: [4505, 4505],
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: {
                                size: 3,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    children:[
                                        new TextRun({
                                            text: `${idx}.`
                                        })
                                    ],
                                    heading: style,
                                }),
                                
                            ],                                        
                        }),                                    
                        new TableCell({
                            width: {
                                size: 97,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                ...content    
                            ],
                        }),
                    ],                                                
                }),
                                                                                                   
            ],
            width:{
                size: 100, type: WidthType.PERCENTAGE
            }                       
        })
    )
}

export const fifty2Table = (param1: tTableContentParam, param2: tTableContentParam) => {
    const { label, width = 50, bold = false, style = undefined } = param1
    const { label: label2, width: width2 = 50, bold: bold2 = false, style: style2 = undefined } = param2

    const paragraphChild = ( label: string, bold: boolean, style: tStyle ) => {
        return (
            new Paragraph({
                children:[
                    textRun(label, bold)
                ], 
                heading: style,
                alignment: AlignmentType.CENTER
            })
        )
    }
    return (
        new Table({
            borders: TableBorders.NONE,                                                                                        
            rows: [
                new TableRow({
                    children:[
                        new TableCell({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: width
                            },
                            children: [
                                typeof label === "string"?paragraphChild(label, bold, style):label
                            ]
                        }),
                        new TableCell({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: width2
                            },
                            children: [
                                typeof label2 === "string"?paragraphChild(label2, bold2, style2):label2
                            ]
                        })
                    ],                                                        
                })
            ],
            width:{
                size: 100, type: WidthType.PERCENTAGE
            }
        })
    )
}