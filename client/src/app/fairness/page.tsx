'use client';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import markdownContent from '../../../FAIRNESS.md';
import styles from './fairness.module.css';

export default function Fairness() {
    console.log(markdownContent);
    return (
        <div className={`${styles['markdown-container']} px-4 py-4 lg:px-10 lg:py-8`}>
            <ReactMarkdown remarkPlugins={[gfm]}>{markdownContent}</ReactMarkdown>
        </div>
    );
}
