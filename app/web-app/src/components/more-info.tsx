import { InfoIcon } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

const MoreInfo = ({message, iconSize = 15}: {message: string, iconSize: number}) => {
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
export default MoreInfo