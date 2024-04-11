import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

type LoadingButtonProps = {
    isLoading: boolean
} & ButtonProps

export default function LoadingButton({children, isLoading, ...props}: LoadingButtonProps){
    return (
        <Button className='flex gap-2' {...props} disabled={props.disabled || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </Button>
    )
}