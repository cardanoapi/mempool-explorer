import * as kafka from 'kafka-node'
import logger from './lib/logger';
import * as dotenv from 'dotenv';
dotenv.config();

// import {startBrust}  from './lib/brust'
export const kafkaClient = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_BROKERS
});

const maxBytes = 1024*10;



export const consumer = (newGroup:boolean) =>
    {
        console.log(process.env.KAFKA_BROKERS)
        let consumer = new kafka.Consumer(kafkaClient,[{topic:process.env.KAFKA_TOPIC_NAME}],
            {
                encoding: "buffer",
                keyEncoding:"utf8",
                groupId: process.env.KAFKA_GROUP_ID,
                autoCommit: false,
                fetchMaxBytes: maxBytes,
            });
        
        consumer.on('error', function (err) {
            logger.log('Kafka Consumer Error:',err);
            process.exit(1);
        })
        
        consumer.on('offsetOutOfRange', function (err) {
            logger.log('offsetOutOfRange:',err);
            process.exit(1);
        })
        return consumer;
    }