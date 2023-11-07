// import getConfig from 'next/config';
// 
// const config = getConfig();

// console.log('config:', config);
// let publicRuntimeConfig: any = {};
// let serverRuntimeConfig: any = {};
// if (config && config.publicRuntimeConfig) {
//     publicRuntimeConfig = config.publicRuntimeConfig;
// }

// if (config && config.serverRuntimeConfig) {
//     serverRuntimeConfig = config.serverRuntimeConfig;
// }

// const environments = {
//     WS_URL: publicRuntimeConfig.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws',
//     CARDANO_NETWORK: publicRuntimeConfig.NEXT_PUBLIC_CARDANO_NETWORK ?? 'mainnet'
// };

const environments = {
    WS_URL: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws',
    CARDANO_NETWORK: process.env.NEXT_PUBLIC_CARDANO_NETWORK ?? 'mainnet'
};

export default environments;
