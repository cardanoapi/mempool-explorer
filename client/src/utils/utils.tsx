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