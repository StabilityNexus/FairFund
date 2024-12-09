import { InfoIcon } from 'lucide-react';
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';

export default function MoreInfo({
    message,
    iconSize = 15,
}: {
    message: string;
    iconSize: number;
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild className="cursor-pointer">
                    <InfoIcon size={iconSize} />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{message}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
