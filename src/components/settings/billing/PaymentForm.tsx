import { Button } from "@/components/ui/button";
import { useGetUserProfileData } from "@/state/auth/auth.hook";
import {
    useAddPaymentMethod,
    useGetPaymentMethodData,
} from "@/state/billing/billing.hook";
import * as Dialog from "@radix-ui/react-dialog";
import {
    AddressElement,
    CardElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import "./PaymentForm.css";

const PaymentForm: React.FC = () => {
    const { data: userDetailData } = useGetUserProfileData();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false); // Modal state
    const [address, setAddress] = useState<any>({});
    const [cardElementKey, setCardElementKey] = useState(0);
    const [addressElementKey, setAddressElementKey] = useState(1);

    useEffect(() => {
        if (modalOpen === false && elements) {
            const addressElement = elements.getElement(AddressElement);
            const cardElement = elements.getElement(CardElement);
            // Clear AddressElement
            if (addressElement) {
                addressElement.update({ defaultValues: {} }); // This resets AddressElement
                addressElement.clear();
                addressElement.destroy();
            }
            // Clear CardElement}
            if (cardElement) {
                cardElement.clear();
                cardElement.destroy();
            }
        }
    }, [modalOpen, elements]);

    const { refetch: getPaymentMethodData, isLoading: isAddingPaymentMethod } =
        useGetPaymentMethodData();

    const handleSuccess = async () => {
        await getPaymentMethodData();
        handleClose();
    };
    const { mutate: addPaymentMethods } = useAddPaymentMethod(handleSuccess);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
            console.error("Stripe.js has not loaded yet.");
            setError("Stripe has not been initialized");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const userName =
                (e.target as HTMLFormElement).cardholder_name.value !== ""
                    ? (e.target as HTMLFormElement).cardholder_name.value
                    : `${userDetailData?.firstName || ""} ${userDetailData?.lastName || ""
                    }`;
            const userCountry = address?.country ?? "";
            const userPostalCode = address?.postal_code ?? "";

            // Create Payment Method
            const { error: stripeError, paymentMethod } =
                await stripe.createPaymentMethod({
                    type: "card",
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        name: userName,
                        email: userDetailData?.email || "",
                        address: {
                            country: userCountry || "",
                            postal_code: userPostalCode || "",
                        },
                    },
                });

            if (stripeError) {
                setError(stripeError.message || "Failed to create payment method.");
                setLoading(false);
                return;
            }

            const payload: any = {
                paymentMethodId: paymentMethod?.id,
            };

            await addPaymentMethods(payload);
            setModalOpen(false);
        } catch (apiError: any) {
            setError(
                apiError.response?.data?.message || "Error linking payment method."
            );
        } finally {
            setLoading(false);
            setAddress({});
        }
    };

    // const cardElementOptions = {
    //     hidePostalCode: true,
    //     style: {
    //         base: {
    //             fontSize: '16px',
    //             color: '#424770',
    //             fontFamily: 'Arial, sans-serif',
    //         },
    //     },
    // }

    const handleClose = () => {
        setModalOpen(false);
        setAddress({});
        setError(null);
        setAddressElementKey((prevKey) => prevKey + 1); // Change key to reset element
        setCardElementKey((prevKey) => prevKey + 1);
    };

    return (
        <div>
            <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
                <Dialog.Trigger asChild>
                    <Button
                        className="payment-button"
                        onClick={() => {
                            setModalOpen(true);
                            setAddress({});
                            setError(null);
                            setAddressElementKey((prevKey) => prevKey + 1); // Change key to reset element
                            setCardElementKey((prevKey) => prevKey + 1);
                        }}
                    >
                        Add new payment method
                    </Button>
                </Dialog.Trigger>

                <Dialog.Portal>
                    <Dialog.Overlay className="dialog-overlay" />
                    <Dialog.Content className="dialog-content max-h-[90vh] overflow-y-auto">
                        <Dialog.Title className="dialog-title">Add a card</Dialog.Title>
                        <Dialog.Description className="text-muted-foreground">
                            rovide your card information to streamline future purchases and
                            payments
                        </Dialog.Description>
                        <Dialog.Close asChild>
                            <button className="dialog-close" onClick={handleClose}>
                                <X />
                            </button>
                        </Dialog.Close>
                        <form onSubmit={handleSubmit} className="space-y-4 !mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Card number</label>
                                <div
                                    className={`p-3 border rounded-md ${loading ? "opacity-50" : ""
                                        }`}
                                >
                                    <CardElement
                                        key={cardElementKey}
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: "16px",
                                                    color: "#424770",
                                                    "::placeholder": {
                                                        color: "#a0aec0",
                                                    },
                                                },
                                            },
                                            hidePostalCode: true,
                                            disabled: loading,
                                        }}
                                    />
                                </div>
                            </div>
                            <hr className="!mt-10 !mb-6" />
                            <div className="space-y-2">
                                <div>
                                    <AddressElement
                                        key={addressElementKey}
                                        options={{
                                            mode: "billing",
                                            fields: {
                                                phone: "never", // Hide phone
                                            },
                                        }}
                                        onChange={(event) => {
                                            setAddress(event.value.address);
                                        }}
                                    />
                                </div>
                            </div>
                            <p className="text-red-600">
                                <i>{error}</i>
                            </p>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    disabled={loading}
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    disabled={!stripe || loading || isAddingPaymentMethod}
                                >
                                    {loading || isAddingPaymentMethod
                                        ? "Processing..."
                                        : "Add card"}
                                </Button>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default PaymentForm;
