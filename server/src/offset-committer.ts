import { Message } from 'kafka-node';

let arrayOfMessages = []; 
let processedMessages = []
let index = 0;



export const addMessage = (message: Message) => {
    arrayOfMessages.push(message.offset);
}

export const processedMessage = (message: Message,cb) => {
    //binary search the processedMessages array to insert the message offset
    let low = 0;
    let high = processedMessages.length - 1;
    while(low<=high){    
        let mid = Math.floor((low+high)/2);
        if(processedMessages[mid] < message.offset){
            low = mid + 1;
        }
        else{
            high = mid-1;
        }
    }
    processedMessages.splice(low, 0, message.offset);
    if(arrayOfMessages[index] === message.offset) {
        while(index<arrayOfMessages.length && low<processedMessages.length && arrayOfMessages[index] === processedMessages[low]) {
            index++;
            low++;
        }
        const toCommit = processedMessages[low-1];
        arrayOfMessages = arrayOfMessages.slice(index);
        processedMessages = processedMessages.slice(low);
        index = 0;
        return cb(toCommit+1);
    }
}
