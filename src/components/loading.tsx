import { HouseIcon } from 'lucide-react';

export default function Loading() {
    return (
        <div className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center animate-pulse">
            <HouseIcon className="size-24 md:size-36" />
            <span className="md:text-xl font-semibold">Ruang Undiksha</span>
        </div>
    );
}