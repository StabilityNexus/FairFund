import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface CardBodyProps {
    title: string;
    icon: React.ElementType;
    body: number;
}


export default function CardBody({
    title,
    icon:Icon,
    body
}: CardBodyProps) {
    return (
        <Card className="h-[150px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon  className="h-4 w-4 text-muted-foreground"  />
            </CardHeader>
            <CardContent>
                <div className="truncate text-2xl font-bold">
                    {body}
                </div>
            </CardContent>
        </Card>
    )
}