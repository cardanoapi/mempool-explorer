import * as kafka from 'kafka-node'
import logger from './lib/logger';
import * as dotenv from 'dotenv';
dotenv.config();

// import {startBrust}  from './lib/brust'
export const kafkaClient = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_BROKERS
});

const maxBytes = 1000*30;



export const consumer = (latestOffset:number, blockOffset:number) =>
    {
        latestOffset = latestOffset - 1;
        console.log(process.env.KAFKA_BROKERS)
        let consumer = new kafka.Consumer(kafkaClient,[{topic:process.env.KAFKA_TOPIC_NAME, offset:latestOffset}, {topic:process.env.KAFKA_BLOCK_TOPIC_NAME, offset:blockOffset-2}],
            {
                encoding: "buffer",
                keyEncoding:"buffer",
                groupId: process.env.KAFKA_GROUP_ID,
                autoCommit: false,
                fetchMaxBytes: maxBytes,
                fromOffset: true,

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


export const blockConsumer = (latestOffset:number) =>
    {
        console.log(process.env.KAFKA_BROKERS)
        latestOffset = 0;
        console.log(latestOffset);
        let consumer = new kafka.Consumer(kafkaClient,[{topic:process.env.KAFKA_BLOCK_TOPIC_NAME, offset:latestOffset}],
            {
                encoding: "buffer",
                keyEncoding:"buffer",
                groupId: process.env.KAFKA_BLOCK_GROUP_ID,
                autoCommit: false,
                fetchMaxBytes: maxBytes,
                fromOffset: true,

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