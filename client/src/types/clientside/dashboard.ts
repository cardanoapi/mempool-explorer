/** mempool types **/
import {MempoolLiveViewTableHeaderEnum} from "@app/constants/constants";

export interface MempoolTransactionClientsideType {
    [MempoolLiveViewTableHeaderEnum.hash]: string;
    [MempoolLiveViewTableHeaderEnum.inputs]: Array<string>;
    [MempoolLiveViewTableHeaderEnum.outputs]: Array<string>;
    [MempoolLiveViewTableHeaderEnum.received_time]: string;
    [MempoolLiveViewTableHeaderEnum.arrival_time]: string;
}