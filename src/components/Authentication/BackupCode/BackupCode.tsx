"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getItem, removeItem } from "@/lib/localStorage";
import withStepGuard from "@/lib/stepAuthGuard";
import { Eye, EyeOff, Loader2, Copy, ArrowDownToLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useState } from "react";

function BackupCode() {
  const router = useRouter();
  const storedCode = localStorage.getItem("RecoveryCodes") ?? "";
  const [backupCodes, setBackupCodes] = useState<any>([]);
  const { toast } = useToast();
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    if (storedCode !== null && storedCode !== undefined && storedCode !== "") {
      setBackupCodes(JSON.parse(storedCode));
    }
  }, [storedCode]);

  const handleDownload = () => {
    const textContent: any = backupCodes
      .map((code: string | any, index: any) => `Code ${index + 1}: ${code}`)
      .join("\n");
    const blob = new Blob([textContent], { type: "text/plain" });
    if (typeof window !== 'undefined') {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "centrix_backup_codes.txt";
      link.click();
    }
    // router.push("/login");
  };

  const handleCopyBackupCodes = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"));
      toast({
        title: "Backup Codes Copied",
        description: "Your backup codes have been copied to the clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to Copy",
        description:
          "There was an error copying your backup codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="w-full max-w-[90%] md:max-w-[620px] mx-auto space-y-6 flex flex-col justify-center p-6">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium">Backup Codes</h3>
          <p className="text-sm text-muted-foreground">
            Please save these backup codes in a secure place. You can use these
            codes to log in if you lose access to your authenticator app.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {backupCodes.map((code: string, index: number) => (
            <div key={index} className="font-mono text-sm bg-muted p-2 rounded">
              {code}
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex mt-10 flex-col w-full sm:flex-row gap-2 items-center">
            <Button
              onClick={handleCopyBackupCodes}
              className="text-sm w-full sm:w-1/2"
              disabled={isCopying}
            >
              {isCopying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Copying...
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Backup Codes
                </>
              )}
            </Button>
            <Button
              // className="py-2 px-14 w-full bg-green-600 text-white rounded-md"
              className="text-sm w-full sm:w-1/2"
              onClick={handleDownload}
            >
              <ArrowDownToLine />
              Download .txt file
            </Button>
          </div>
          <Button
            onClick={() => {
              router.push("/login");
              removeItem("RecoveryCodes");
            }}
            className="w-full"
          >
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withStepGuard(BackupCode);
