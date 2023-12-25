
const environments = {
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL ?? 'wss://mempool.cardanoapi.io/ws',
    CARDANO_NETWORK: process.env.NEXT_PUBLIC_CARDANO_NETWORK ?? 'mainnet',
    // @ts-ignore
    ENABLE_CONNECT_WALLET: (process.env.ENABLE_CONNECT_WALLET && (process.env.ENABLE_CONNECT_WALLET === 'true' || process.env.ENABLE_CONNECT_WALLET === true)) ?? false,
    API_URL: process.env.API_URL ?? 'http://localhost:8080/api/v1',
};

export default environments;
