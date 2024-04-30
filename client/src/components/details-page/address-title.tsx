import { useParams } from 'next/navigation';

import { Address, BaseAddress, PoolMetadata, PoolMetadataHash } from '@emurgo/cardano-serialization-lib-asmjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LinkIcon from '@app/assets/svgs/link-icon';
import CardanoIcon from '@app/atoms/Icon/Cardano';
import CopyIcon from '@app/atoms/Icon/Copy';
import { copyToClipboard } from '@app/utils/utils';

export default function AddressTitle() {
    const router = useParams();

    function generateCardanoScanLink() {
        const baseUrl = 'https://cardanoscan.io/';
        if (((router?.id as string) || '').startsWith('addr')) {
            const addr = Address.from_bech32((router?.id as string) || '');
            const hex = Buffer.from(addr.to_bytes()).toString('hex');
            return baseUrl + 'address' + `/${hex}`;
        } else if (((router?.id as string) || '').startsWith('pool')) {
            return baseUrl + 'pool/' + (router?.id || '');
        }
    }

    return (
        <div className={'flex flex-col justify-center items-center'}>
            <div className={'flex items-center gap-2 mb-4'}>
                <CardanoIcon />
                <div className={'flex flex-col items-start'}>
                    <p className={'text-gray-500 text-sm'}>Address</p>
                    <div className={'flex items-center'}>
                        <p className={'font-bold mr-1'}>{router?.id}</p>
                        <div className={'cursor-pointer mr-2'} onClick={() => copyToClipboard((router?.id as string) || '')}>
                            <CopyIcon />
                        </div>
                        <a target={'_blank'} className={'cursor-pointer'} href={generateCardanoScanLink()} >
                            <LinkIcon />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
