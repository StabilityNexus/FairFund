"use client";
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}


export default function DataTableToolbar<TData>({
    table
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="ml-1 flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter description..."
                    value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
            </div>
        </div>
    )
}