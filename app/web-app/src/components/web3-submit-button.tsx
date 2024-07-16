import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

interface Web3SubmitButtonProps extends ButtonProps {
    isLoading: boolean;
    children: React.ReactNode;
}

export function Web3SubmitButton({
    isLoading,
    children,
    onClick,
    ...props
}: Web3SubmitButtonProps) {
    return (
        <Button
            type={onClick ? 'button' : 'submit'}
            disabled={isLoading || props.disabled}
            onClick={onClick}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : (
                children
            )}
        </Button>
    );
}
