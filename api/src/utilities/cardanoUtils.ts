export const getLatestEpoch = () => {
    const firstEpochReferenceTime = new Date('2017-09-23 21:44:51').getTime();
    const latestEpochReferenceTime = new Date().getTime();
    const differenceTimeInMillisecond =
        latestEpochReferenceTime - firstEpochReferenceTime;
    return Math.floor(differenceTimeInMillisecond / (5 * 24 * 60 * 60 * 1000));
};

export const toMidDottedStr = (
    str: string,
    leadingVisible = 12,
    firstIndex = 0
) => {
    if (str === undefined || str.length < 15) return str;
    const total = str.toString().length;
    const leadingStr = str.toString().substring(firstIndex, leadingVisible);
    const trailingStr = str.toString().substring(total - leadingVisible);
    return `${leadingStr}...${trailingStr}`;
};

export const toEndDottedStr = (
    str: string | number,
    leadingVisible = 12,
    firstIndex = 0
) => {
    if (str === undefined) return str;
    if (str.toString().length <= leadingVisible) return str.toString();
    const leadingStr = str.toString().substring(firstIndex, leadingVisible);
    return `${leadingStr}...`;
};

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
    if (!dateString) return 'N/A';
    const date: any = new Date(dateString);

    // Extract the components of the date
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Format the date in the desired format
    const formattedDate: any = `${getDayName(date.getDay())} ${getMonthName(
        month
    )} ${day} ${year} ${formatTime(hours, minutes, seconds)}`;

    // Helper function to get the day name
    function getDayName(dayIndex: string) {
        const days: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[dayIndex];
    }

    // Helper function to get the month name
    function getMonthName(monthIndex: string) {
        const months: any = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        return months[monthIndex];
    }

    // Helper function to format the time as "HH:MM:SS"
    function formatTime(hours: any, minutes: any, seconds: any) {
        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }

    // Helper function to pad a number with leading zeros
    function padZero(number: any) {
        return number.toString().padStart(2, '0');
    }

    return formattedDate;
};

export const convertToTableData = (data: Array<Transaction>) => {
    return data?.map((item) => {
        return {
            ...item,
            slot_no: item.slot_no.toString(10),
            wait_time: !item.wait_time ? 'N/A' : parseFloat(item.wait_time),
            confirmation_time: convertToAppropriateDate(
                item.confirmation_time.toString()
            ),
            block_hash: toMidDottedStr(
                Buffer.from(item.block_hash).toString('hex')
            ),
            tx_hash: Buffer.from(item.tx_hash).toString('hex'),
            block_no: item.block_no.toString(10)
        };
    });
};

export const transformToClientSideData = (data: any) => {
    return data?.map((item: any) => {
        return {
            ...item,
            tx_count: item.tx_count.toString(10),
            avg_wait_time: parseFloat(item.avg_wait_time).toFixed(2),
            min_wait_time: parseFloat(item.min_wait_time).toFixed(2),
            max_wait_time: parseFloat(item.max_wait_time).toFixed(2),
            median_wait_time: parseFloat(item.median_wait_time).toFixed(2),
            best_5_percent: parseFloat(item.best_5_percent).toFixed(2),
            worst_5_percent: parseFloat(item.worst_5_percent).toFixed(2)
        };
    });
};

export function getUrlObject(urlStr: string) {
    return new URL(urlStr);
}

export function getRelativeTime(arrivalTime: any) {
    // Get the current time
    const currentTime: any = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference: any = currentTime - arrivalTime;

    // Calculate the time difference in seconds, minutes, hours, and days
    const seconds = Math.floor(timeDifference / 1000);

    return seconds > 1 ? `${seconds} seconds ago` : `${seconds} second ago`;
}

function bufferToString(buffer: any) {
    return buffer ? Buffer.from(buffer).toString('hex') : null;
}

export function convertBuffersToString(obj: any): any {
    if (obj === null) {
        return obj;
    }

    if (obj.constructor.name === 'String') return obj.toString();

    if (obj.constructor.name === 'Date') {
        return obj.toISOString();
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => convertBuffersToString(item));
    }

    const newObj: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (Buffer.isBuffer(value)) {
                newObj[key] = bufferToString(value);
            } else if (Array.isArray(value)) {
                newObj[key] = value.map((item) => convertBuffersToString(item));
            } else if (typeof value === 'object') {
                newObj[key] = convertBuffersToString(value);
            } else if (typeof value === 'bigint') {
                newObj[key] = parseInt(String(value));
            } else {
                newObj[key] = value;
            }
        }
    }
    return newObj;
}
