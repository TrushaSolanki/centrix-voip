"use client";

import {
  faCcAmex,
  faCcMastercard,
  faCcVisa,
} from "@fortawesome/free-brands-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader2, MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useGetPaymentMethodData } from "@/state/billing/billing.hook";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import AppLoader from "@/components/app-loader/AppLoader";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  isDefault: boolean;
  expiryDate: string;
  name: string;
  expires: string;
  cardType: string;
  billingAddress: string;
  cardNumber?: string;
  country?: string;
  zipCode?: string;
}

export default function PaymentMethods() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [allowDialogClose, setAllowDialogClose] = useState(true);
  const [editingCard, setEditingCard] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvc?: string;
    cardholderName?: string;
    country?: string;
    zipCode?: string;
    expiration?: string;
  }>({});

  const {
    data: paymentMethodListData,
    isPending: isLoadingPaymentMethodList,
  } = useGetPaymentMethodData();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    if (paymentMethodListData && paymentMethodListData.length > 0) {
      setPaymentMethods(
        paymentMethodListData.map((paymentMethod: any) => ({
          id: paymentMethod.id,
          type: paymentMethod.card?.brand || "unknown",
          last4: paymentMethod.card?.last4 || "",
          isDefault: false,
          expiryDate: `${paymentMethod.card?.expMonth
            ?.toString()
            .padStart(2, "0")}/${paymentMethod.card?.expYear % 100}`,
          name: "Cardholder",
          expires: `${new Date(
            paymentMethod.card?.expYear,
            paymentMethod.card?.expMonth - 1
          ).toLocaleString("default", {
            month: "long",
          })} / ${paymentMethod.card?.expYear}`,
          cardType: `${paymentMethod.card?.brand} credit card`,
          billingAddress: "Not Provided",
          cardNumber: "",
          country: paymentMethod.card?.country || "unknown",
          zipCode: "",
        }))
      );
    }
  }, [paymentMethodListData]);

  const openEditDialog = (card: PaymentMethod) => {
    setEditingCard(card);
    setExpiryMonth(card.expiryDate.split("/")[0]);
    setExpiryYear(card.expiryDate.split("/")[1]);
    setCardholderName(card.name);
    setCountry(card.country || "");
    setZipCode(card.zipCode || "");
    setErrors({}); //This line is added
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Recurring monthly charges will be billed to your primary payment
          method, with a backup payment method used in case the primary one
          fails.
        </p>
        <Elements
          stripe={stripePromise}
          options={{
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#f333a6",
              },
            },
          }}
        >
          <PaymentForm key={"payment-form"} />
        </Elements>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Credit card</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {!isLoadingPaymentMethodList && paymentMethods?.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No payment methods found.
                </TableCell>
              </TableRow>
            </TableBody>
          ) : null}

          <TableBody>{
            isLoadingPaymentMethodList ?
              <TableRow>
                <TableCell colSpan={6}>
                  <p className="flex items-center !w-full justify-center overflow-hidden h-[350px]">
                    <Loader2 className="mr-2 h-[50px]  w-full align-middle animate-spin" />
                  </p>
                </TableCell>
              </TableRow>
              : paymentMethods && paymentMethods.length !== 0 && (
                paymentMethods.map((method) => (
                  <React.Fragment key={method.id}>
                    <TableRow
                      onClick={() =>
                        setExpandedCard(
                          expandedCard === method.id ? null : method.id
                        )
                      }
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={
                              method.type === "visa"
                                ? faCcVisa
                                : method.type === "mastercard"
                                  ? faCcMastercard
                                  : faCreditCard
                            }
                            className="h-6 w-6"
                          />
                          <span>•••• {method.last4}</span>
                        </div>
                      </TableCell>
                      <TableCell>{method.expiryDate}</TableCell>
                      <TableCell>
                        {method.isDefault ? <Badge>Default</Badge> : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                setPaymentMethods(
                                  paymentMethods.map((card) => ({
                                    ...card,
                                    isDefault: card.id === method.id,
                                  }))
                                );
                                toast({
                                  title: "Default Card Set",
                                  description: `Your ${method.cardType} ending in ${method.last4} is now the default payment method.`,
                                });
                              }}
                            >
                              Set as default
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                              onSelect={() => openEditDialog(method)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onSelect={() => {
                                setPaymentMethods(
                                  paymentMethods.filter(
                                    (card) => card.id !== method.id
                                  )
                                );
                                toast({
                                  title: "Card Deleted",
                                  description: `Your ${method.cardType} ending in ${method.last4} has been removed.`,
                                });
                              }}
                            >
                              Delete
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {expandedCard === method.id && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div
                            className="overflow-hidden transition-all duration-300 ease-in-out"
                            style={{
                              maxHeight:
                                expandedCard === method.id ? "500px" : "0",
                            }}
                          >
                            <div className="p-4 bg-muted rounded-md">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="font-medium mb-1">
                                    Cardholder Name
                                  </div>
                                  <div className="text-muted-foreground">
                                    {method.name}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium mb-1">Expires</div>
                                  <div className="text-muted-foreground">
                                    {method.expires}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium mb-1">
                                    Card type
                                  </div>
                                  <div className="text-muted-foreground">
                                    {method.cardType}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium mb-1">
                                    Billing Address
                                  </div>
                                  <div className="text-muted-foreground whitespace-pre-line">
                                    {method.billingAddress}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
          </TableBody>

        </Table>
      </div>
    </div>
  );
}
