import CardWrapper from "@/components/dashboard-card-wrapper";
import TableWrapper from "@/components/dashboard-table/table-wrapper";

export default function DashboardPage(){
    return (
        <div className="p-8 w-full h-full flex justify-center items-center flex-col gap-4">
           <div className="m-2 w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapper/>
           </div>
           <div className="w-full border-2 shadow-sm rounded-lg overflow-hidden min-h-96">
                <TableWrapper/>
          </div>
        </div>
    );
}