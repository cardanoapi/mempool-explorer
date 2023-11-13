import { useEffect } from 'react';

function useScrollableTable() {
    useEffect(() => {
        const tables = document.querySelectorAll('.scrollable-table');

        tables.forEach((table: Element, index: number) => {
            const scrollableTable = table as HTMLElement;
            scrollableTable.addEventListener('scroll', function (this: HTMLElement) {
                const scrollY = this.scrollTop;
                const isAtTop = scrollY === 0;
                const isAtBottom = this.scrollHeight - scrollY === this.clientHeight;

                if (isAtTop || isAtBottom) {
                    window.scrollBy(0, isAtTop ? -1 : 1);
                }
            });
        });

        return () => {
            tables.forEach((table) => {
                table.removeEventListener('scroll', () => {});
            });
        };
    }, []); // Run the effect only once when the component mounts
}

export default useScrollableTable;
