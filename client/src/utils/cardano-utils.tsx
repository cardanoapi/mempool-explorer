import {decode} from "cbor-x";
import {toMidDottedStr} from "@app/utils/string-utils";

export const getLatestEpoch = () => {
    const firstEpochReferenceTime = new Date("2017-09-23 21:44:51").getTime();
    const latestEpochReferenceTime = new Date().getTime();
    const differenceTimeInMillisecond = latestEpochReferenceTime - firstEpochReferenceTime;
    return Math.floor(differenceTimeInMillisecond / (5 * 24 * 60 * 60 * 1000))
}

interface Transaction {
    block_hash: ArrayBuffer;
    block_no: bigint;
    confirmation_time: Date;
    epoch: number;
    pool_id: string;
    slot_no: bigint;
    tx_hash: ArrayBuffer;
    wait_time: any;
}

const convertToAppropriateDate = (dateString: string) => {
    const date = new Date(dateString);

// Extract the components of the date
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

// Format the date in the desired format
    const formattedDate = `${getDayName(date.getDay())} ${getMonthName(month)} ${day} ${year} ${formatTime(hours, minutes, seconds)}`;

// Helper function to get the day name
    function getDayName(dayIndex:string) {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[dayIndex];
    }

// Helper function to get the month name
    function getMonthName(monthIndex:string) {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return months[monthIndex];
    }

// Helper function to format the time as "HH:MM:SS"
    function formatTime(hours, minutes, seconds) {
        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }

// Helper function to pad a number with leading zeros
    function padZero(number) {
        return number.toString().padStart(2, '0');
    }

    return formattedDate;
}

export const convertToTableData = (data: Array<Transaction>) => {
    return data?.map((item) => {
        return {
            ...item,
            slot_no: item.slot_no.toString(10),
            wait_time: parseFloat(item.wait_time),
            confirmation_time: convertToAppropriateDate(item.confirmation_time.toString()),
            block_hash: toMidDottedStr(Buffer.from(item.block_hash).toString('hex')),
            tx_hash: toMidDottedStr(Buffer.from(item.tx_hash).toString('hex')),
            block_no: item.block_no.toString(10),
        }
    })
}