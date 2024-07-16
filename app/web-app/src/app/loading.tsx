import LoaderIcon from 'lucide-react/dist/esm/icons/loader';

export default function LoadingComponent() {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoaderIcon className="animate-spin w-10 h-10" />
        </div>
    );
}
