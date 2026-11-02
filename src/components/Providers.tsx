"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { usePerformanceMonitor } from "@/hooks/use-performance";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { NetworkProvider } from "@/context/NetworkContext";
import NetworkStatusIndicator from "@/components/NetworkStatusIndicator";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InteractivePet from "@/components/InteractivePet";

export function Providers({ children }: { children: React.ReactNode }) {
    // Initialize performance monitoring
    usePerformanceMonitor();

    return (
        <NetworkProvider>
            <CurrencyProvider>
                <TooltipProvider delayDuration={0}>
                    {children}
                    <InteractivePet />
                    <Toaster />
                    <NetworkStatusIndicator />
                    <ServiceWorkerRegister />
                </TooltipProvider>
            </CurrencyProvider>
        </NetworkProvider>
    );
}
