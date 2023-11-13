'use client';

import React from 'react';

import styled from '@emotion/styled';
import { ToastOptions, toast } from 'react-toastify';

const StyledMessageContainer = styled.div<{ color: string }>`
    h6 {
        color: ${(props) => props.color};
        font-size: 13pt !important;
        margin-bottom: 0.25rem;
    }

    p,
    text {
        margin: 0;
        padding: 0;
        font-size: 10pt !important;
        color: #b9b9b9;
    }
`;

interface MessageContainerProps {
    title: string;
    description?: string;
    color?: string;
}

const MessageContainer = ({ title, description, color = '#B9B9B9' }: MessageContainerProps) => (
    <StyledMessageContainer color={color}>
        <h6>{title}</h6>
        {description && <p className="text-base">{description}</p>}
    </StyledMessageContainer>
);

MessageContainer.defaultProps = {
    description: '',
    color: '#B9B9B9'
};

export const toastifySuccess = (title: string, description?: string, options?: ToastOptions | undefined) => toast.success(<MessageContainer title={title} description={description} color={'#99FFD4'} />, options);

export const toastifyWarning = (title: string, description?: string, options?: ToastOptions | undefined) => toast.warning(<MessageContainer title={title} description={description} color={'#FF9141'} />, options);

export const toastifyInfo = (title: string, description?: string, options?: ToastOptions | undefined) => toast.info(<MessageContainer title={title} description={description} color={'#60B3FF'} />, options);

export const toastifyError = (title: string, description?: string, options?: ToastOptions | undefined) => toast.error(<MessageContainer title={title} description={description} color={'#FF6D6D'} />, options);

export const toastifyPromise = (fetcher: Promise<any>, title: string, description?: string, options?: ToastOptions | undefined) =>
    toast.promise(
        fetcher,
        {
            pending: 'Please wait...',
            success: {
                render() {
                    return <MessageContainer title={title} description={description} color={'#99FFD4'} />;
                }
            },
            error: {
                render() {
                    return <MessageContainer title={title} description={description} color={'#FF6D6D'} />;
                }
            }
        },
        options
    );
