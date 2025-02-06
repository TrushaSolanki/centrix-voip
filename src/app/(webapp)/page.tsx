import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default async function page() {
    const queryClient = new QueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex h-screen p-6 flex-col gap-4 justify-center items-center">
                <Loader2 className="mr-2 h-20 w-20 animate-spin text-green-700" />
                <p className="text-lg font-semibold">Welcome to Centrix</p>
            </div>
        </HydrationBoundary>
    );
}
