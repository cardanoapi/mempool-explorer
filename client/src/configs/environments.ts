const environments = {
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL ?? 'wss://mempool.cardanoapi.io/ws',
    CARDANO_NETWORK: process.env.NEXT_PUBLIC_CARDANO_NETWORK ?? 'mainnet',
    // @ts-ignore
    ENABLE_CONNECT_WALLET: (process.env.ENABLE_CONNECT_WALLET && (process.env.ENABLE_CONNECT_WALLET === 'true' || process.env.ENABLE_CONNECT_WALLET === true)) ?? false,
    // @ts-ignore
    ENABLE_PERCENTILE_POOL_GRAPH: (process.env.ENABLE_PERCENTILE_POOL_GRAPH && (process.env.ENABLE_PERCENTILE_POOL_GRAPH === 'true' || process.env.ENABLE_PERCENTILE_POOL_GRAPH === true)) ?? false,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'https://mempool-api.cardanoapi.io/api/v1',
    API_URL: process.env.API_URL ?? 'http://localhost:8080/api/v1'
};

export default environments;
