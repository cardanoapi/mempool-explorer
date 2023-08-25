import {toast} from "react-toastify";

export function copyToClipboard(content: string) {
    navigator.clipboard
        .writeText(content)
        .then(() => {
            toast.info('Text copied to clipboard');
        })
        .catch((error) => {
            toast.error('Could not copy to clipboard');
        });
}

function bufferToString(buffer: any) {
    return buffer ? Buffer.from(buffer).toString('hex') : null;
}

// @ts-ignore
export function convertBuffersToString(obj: any) {
    if (obj === null) {
        return obj;
    }

    if (obj.constructor.name === "String") return obj.toString();

    if (obj.constructor.name === "Date") {
        return obj.toISOString()
        
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
                newObj[key] = value.map((item) => convertBuffersToString(item))
            } else if (typeof value === 'object') {
                newObj[key] = convertBuffersToString(value);
            } else if (typeof value === "bigint") {
                newObj[key] = parseInt(String(value))
            } else {
                newObj[key] = value;
            }
        }
    }
    return newObj;
}