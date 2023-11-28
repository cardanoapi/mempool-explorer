import { PrismaClient } from '@prisma/client';
import * as os from 'os';

function readEnv(key: string, def: string = ''): string {
    return process.env[key] || def;
}

function escape(password: string) {
    const encodingTable = {
        ':': '%3A',
        '/': '%2F',
        '?': '%3F',
        '#': '%23',
        '[': '%5B',
        ']': '%5D',
        '@': '%40',
        '!': '%21',
        $: '%24',
        '&': '%26',
        "'": '%27',
        '(': '%28',
        ')': '%29',
        '*': '%2A',
        '+': '%2B',
        ',': '%2C',
        ';': '%3B',
        '=': '%3D',
        '%': '%25',
        ' ': '%20'
    };

    let encodedPassword = '';

    for (let i = 0; i < password.length; i++) {
        const char = password.charAt(i);
        //@ts-ignore
        encodedPassword += char in encodingTable ? encodingTable[char] : char;
    }

    return encodedPassword;
}

export const discoveryDbClient = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
                ? process.env.DATABASE_URL
                : `postgresql://${readEnv(
                      'PGUSER',
                      os.userInfo().username
                  )}:${escape(readEnv('PGPASSWORD'))}@${readEnv(
                      'PGHOST',
                      process.env.NODE_ENV == 'development'
                          ? 'localhost'
                          : 'postgres'
                  )}:${readEnv('PGPORT', '5432')}/${readEnv(
                      'PGDATABASE'
                  )}?schema=public&application_name=mempool-webapp`
        }
    }
});

export const dbSyncDbClient = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DBSYNC_DATABASE_URL
                ? process.env.DBSYNC_DATABASE_URL
                : `postgresql://${readEnv(
                      'SRC_PGUSER',
                      os.userInfo().username
                  )}:${escape(readEnv('SRC_PGPASSWORD'))}@${readEnv(
                      'SRC_PGHOST',
                      process.env.NODE_ENV == 'development'
                          ? 'localhost'
                          : 'postgres'
                  )}:${readEnv('SRC_PGPORT', '5432')}/${readEnv(
                      'SRC_PGDATABASE'
                  )}?schema=public&application_name=mempool-webapp`
        }
    }
});

let isSetup = true;

export default async function setup() {
    return discoveryDbClient.$queryRaw`SELECT version()`
        .then((res: any) => {
            console.log('Connected:', res[0].version);
            return discoveryDbClient;
        })
        .catch((e) => {
            console.error('Database Setup failed', e);
            process.exit(1);
        });
}
