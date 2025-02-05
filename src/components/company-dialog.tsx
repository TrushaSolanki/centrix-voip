"use client";

import * as React from "react";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  useCreateOrganization,
  useGetAccountData,
} from "@/state/dashboard/dashboard.hook";
import { useAddUserInAccount } from "@/state/user/user.hook";
import { toast } from "@/hooks/use-toast";
import { readCookie } from "@/lib/cookieManagment";

const formSchema = z.object({
  companyName: z
    .string()
    .min(4, {
      message: "Company name must be at least 4 characters.",
    })
    .max(50, {
      message: "Company name must not exceed 50 characters.",
    }),
});

export function AddCompanyDialog() {
  const [open, setOpen] = React.useState(false);
  const { refetch } = useGetAccountData();
  const handleSuccessAddAccount = () => {
    toast({
      title: "Company added successfully",
      description: "",
    });
    refetch();
  };
  const { mutate: addUser, isPending: CompanyAddpending } = useAddUserInAccount(
    handleSuccessAddAccount
  );
  const userId = readCookie("UserId");
  const handleSuccess = (data: any) => {
    if (userId && data.id) {
      let payload: any = {
        accountId: data?.id,
        userId: userId,
      };
      addUser(payload);
    } else {
      toast({
        title: "User not found or failed to create company",
        description: "",
      });
    }
  };
  const {
    mutateAsync: CreateOrganization,
    isError: CreateUserPending,
    isPending: CreateUserError,
  } = useCreateOrganization(handleSuccess);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically handle the company creation logic

    const payload: any = {
      name: values.companyName,
      provider: "Telnyx",
      properties: {
        ApiKey: "",
      },
    };
    const res = await CreateOrganization(payload);

    setOpen(false);
    form.reset();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 p-2">
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">
            Add new company
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">
            Enter a name for your new company
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g., ABC Inc."
                      {...field}
                      className="rounded-lg border-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {CompanyAddpending || CreateUserPending ? (
                <Button type="submit">
                  <Loader2 className="animate-spin" />
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
