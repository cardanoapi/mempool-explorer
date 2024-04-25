import { useMemo } from 'react';

import { useParams } from 'next/navigation';

import { Address } from '@emurgo/cardano-serialization-lib-asmjs';

export function useGenerateCardanoScanLink(setError: (error: any) => void) {
    const router = useParams();

    const baseUrl = 'https://cardanoscan.io/';

    return useMemo(() => {
        try {
            if (!router?.id) {
                return '';
            }

            const id = router.id as string;
            const isAddress = id.startsWith('addr');
            const isPool = id.startsWith('pool');

            if (isAddress) {
                const addr = Address.from_bech32(id);
                const hex = Buffer.from(addr.to_bytes()).toString('hex');
                return `${baseUrl}address/${hex}`;
            } else if (isPool) {
                return `${baseUrl}pool/${id}`;
            } else {
                return '';
            }
        } catch (e) {
            setError({ message: 'Could not generate cardano scan link!', status: 500 });
            return '';
        }
    }, [router?.id, setError]);
}
