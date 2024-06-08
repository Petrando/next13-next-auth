import { parseDate } from "@internationalized/date";

export const createDateString = (date:Date = new Date()) => {    
    const year = date.getFullYear()
    const month = date.getMonth() + 1
     
    const day = date.getDate()
    const dateString = `${year}-${month < 10?"0" + month:month}-${day<10?"0"+day:day}`

    return parseDate(dateString)
}