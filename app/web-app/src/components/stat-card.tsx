import { Card, CardContent } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: any;
    description: string;
    className?: string;
}

export function StatCard({
    title,
    icon,
    value,
    description,
    className,
}: StatCardProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card
                        className={cn(
                            'transition-all duration-200 hover:shadow-lg',
                            className
                        )}
                    >
                        <CardContent className="flex items-center p-6">
                            <div className="mr-4 bg-gray-100 p-3 rounded-full">
                                {icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground">
                                    {title}
                                </h3>
                                <p className="text-2xl font-bold">{value}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default StatCard;
