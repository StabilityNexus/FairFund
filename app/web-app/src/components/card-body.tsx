import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardBodyProps {
    title: string;
    icon: React.ElementType;
    body: any;
    bodyClassName?: string;
    titleClassName?: string;
    className?: string;
}

export default function CardBody({
    title,
    icon: Icon,
    body,
    bodyClassName,
    titleClassName,
    className,
}: CardBodyProps) {
    return (
        <Card
            className={cn('h-[150px] flex flex-col justify-around', className)}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                    className={cn('text-sm font-medium', titleClassName)}
                >
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div
                    className={cn('truncate text-2xl font-bold', bodyClassName)}
                >
                    {body}
                </div>
            </CardContent>
        </Card>
    );
}
