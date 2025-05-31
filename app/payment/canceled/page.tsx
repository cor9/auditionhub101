"use client";

import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentCanceledPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Payment Canceled</h1>
        <p className="mt-2 text-muted-foreground">
          Your payment was canceled. No charges were made to your account.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/services">Return to Services</Link>
        </Button>
      </div>
    </div>
  );
}