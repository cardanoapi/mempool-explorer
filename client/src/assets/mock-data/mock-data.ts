export const SocketResponseMock = [
    {
        hash: 'test1',
        action: 'add',
        amount: '20.23',
        inputs: ['addr1wxc45xspppp73takl93mq029905ptdfnmtgv6g7cr8pdyqgvks3s8'],
        outputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60nwfgjmdtwsfdheh2uxeccydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff', 'addrfj60n9qkq0pspgjmdtwswfedheh2uxeccydvcp6l0dxr4qq7drmx59xr7nmulgsff'],
        fee: '10',
        arrival_time: '07/12/2023 11:57:31 AM'
    },
    {
        hash: 'test2',
        action: 'add',
        amount: '13.23',
        inputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgjmdtwsfdheh2decydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff'],
        outputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgjmdtwsfdheh2uxeccydvcp6l0dxr4qqdeer7nmulgs0c3gff', 'addrfj60n9qkq0pspgjmdtwsfdheeccydvcp6l0dxr4qq7drmx59xr7nmulgsff'],
        fee: '2',
        arrival_time: '07/12/2023 11:57:31 AM'
    },
    {
        hash: 'test3',
        action: 'add',
        amount: '40.50',
        inputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgjmdtwsfdheh2uydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff'],
        outputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgjmdtwsfdheh2uxeccydvcp64qq7drmx59xr7nmulgs0c3gff', 'addrfj60n9qkq0pftwsfdheh2uxeccydvcp6l0dxr4qq7drmx59xr7nmulgsff'],
        fee: '1.1',
        arrival_time: '07/12/2023 11:57:31 AM'
    },
    {
        hash: 'test5',
        action: 'add',
        amount: '30.23',
        inputs: ['addr1q8swx9tfdgwum7e5z6x6x3c7knjdc4dfj60nspgjmdtwsfdheh2uxeccydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff'],
        outputs: 'addr1q8swx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgjmdtwsfdheh2edfcxeccydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff',
        fee: '2',
        arrival_time: '07/12/2023 11:57:31 AM'
    },
    {
        hash: 'test4',
        action: 'add',
        amount: '30.23',
        inputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgjmdtwsfdheh2uxeccydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff'],
        outputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgjmdtwsfdheh2uxeccydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff'],
        fee: '2',
        arrival_time: '07/12/2023 11:57:31 AM'
    },
    {
        hash: 'test1',
        action: 'remove',
        amount: '30.4',
        inputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgfewsfdheh2uxeccydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff'],
        outputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgjfesfdheh2uxeccydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff', 'addrfj60n9qkq0fegjmdtwsfdheh2uxeccydvcp6l0dxr4qq7drmx59xr7nmulgsff'],
        fee: '2',
        arrival_time: '07/12/2023 11:57:31 AM'
    },
    {
        hash: 'test3',
        action: 'remove',
        amount: '30.33',
        inputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgjmdtwsfdhefxeccydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff'],
        outputs: 'addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgjmdtwsfdhehccydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff',
        fee: '2',
        arrival_time: '07/12/2023 11:57:31 AM'
    },
    {
        hash: 'test4',
        action: 'reject',
        amount: '20.23',
        inputs: ['addr1q85wx9tfdgwum7e5z6x6x3c7knjdc4dfj60n9qkq0pspgfefdheh2uxeccydvcp6l0dxr4qq7drmx59xr7nmulgs0c3gff'],
        outputs: [],
        fee: '2',
        arrival_time: '07/12/2023 11:57:31 AM'
    }
];

export const txs = [
    {
        hash_id: '1953653d066f17567d59d9d4dbf40e8d8f0c1b123eecd24dec7c3691d8f28735',
        fee: '45',
        arrival_time: '2023-05-02'
    },
    {
        hash_id: '02023c57608d1966ca9035941c62b07b80393c96e0efca1e299b007bce7e2b81',
        fee: '30',
        arrival_time: '2022-02-01'
    },
    {
        hash_id: '2f7e42982dcdde9ac46f0ced2f6ff0815ad8a26c70c8cb552ff381d2facaec79',
        fee: '7.9999',
        arrival_time: '2023-03-02'
    },
    {
        hash_id: '1953653d066f17567d59d9d4dbf40e8d8f0c1b123eecd24dec7c3691d8f28785',
        fee: '12',
        arrival_time: '2023-05-02'
    },
    {
        hash_id: 'd4ab872e0d2bf36bef994f7236d3c7dce4371c3bf95238c8f3fd61216df7e',
        fee: '3.4523',
        arrival_time: '2022-02-01'
    },
    {
        hash_id: 'd4ab872e0d2bf36bef994f845723c7dce4371c3bf95238c8f3fd61216df7e',
        fee: '3.4523',
        arrival_time: '2022-02-01'
    },
    {
        hash_id: 'd4a72e0d2bf36bef994f8457236d3c7371c3bf95238c8f3fd61216df7e',
        fee: '3.4523',
        arrival_time: '2022-02-01'
    },
    {
        hash_id: 'd4ab872e0d26bef994f8457236d3c7371c3bf95238c8f3fd61216df7e',
        fee: '3.4523',
        arrival_time: '2022-02-01'
    },
    {
        hash_id: 'b872e0d2bf36bef994f57236d3c7371c3bf95238c8f3fd61216df7e',
        fee: '3.4523',
        arrival_time: '2022-02-01'
    },
    {
        hash_id: 'b872e0d2bf36bef994f845736d3c7371c3bf95238c8f3fd61216df7e',
        fee: '3.4523',
        arrival_time: '2022-02-01'
    },
    {
        hash_id: '2e0d2bf36bef994f8457236d3c7371c3bf95238c8f3fd61216df7e',
        fee: '3.4523',
        arrival_time: '2022-02-01'
    }
];

export const TxDetail = [
    {
        pool_id: 'pool1953653d066f17567d59d9d4dbf40e8d8f0c1b123eecd24dec7c3691d8f28735',
        block_hash: '1953653d066f17567d59d9d4dbf40e8d8f0c1b123eecd24dec7c3691d8f28735',
        slot_no: '2302323',
        block_no: '22342',
        block_time: '2023/23/11'
    }
];
