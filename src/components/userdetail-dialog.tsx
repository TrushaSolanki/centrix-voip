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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useOrganizationStore } from "@/store/auth";
import { useUpdateUserDetails } from "@/state/user/user.hook";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z
    .string()
    .min(4, {
      message: "First name must be at least 4 characters.",
    })
    .max(50, {
      message: "First name must not exceed 50 characters.",
    }),
  lastName: z
    .string()
    .min(4, {
      message: "First name must be at least 4 characters.",
    })
    .max(50, {
      message: "First name must not exceed 50 characters.",
    }),
});

export function EditCompany({
  UserProfileDataRefetch,
}: {
  UserProfileDataRefetch: any;
}) {
  const [open, setOpen] = React.useState(false);
  const { FirstName, LastName } = useOrganizationStore();
  const handleUserUpdateSuccess = () => {
    UserProfileDataRefetch();
    toast({
      title: "Profile updated successfully",
      description: "",
    });
  };

  const { mutate: updateUserDetails, isPending: updateInfoPending } =
    useUpdateUserDetails(handleUserUpdateSuccess);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: FirstName,
      lastName: LastName,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload: any = {
      firstName: values.firstName,
      lastName: values.lastName,
    };
    const res = await updateUserDetails(payload);
    setOpen(false);
    form.reset();
  }
  React.useEffect(() => {
    form.reset({
      firstName: FirstName,
      lastName: LastName,
    });
  }, [FirstName, LastName]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-9">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">
            Edit User detail
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              {updateInfoPending ? (
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
