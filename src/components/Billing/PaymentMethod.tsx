"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle2, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faCcVisa } from "@fortawesome/free-brands-svg-icons";
interface PaymentCard {
  id: string;
  type: string;
  last4: string;
  name: string;
  expireMonth: string;
  expireYear: string;
  billingAddress: string;
  isDefault: boolean;
}

export default function PaymentMethodsList() {
  const [cards, setCards] = useState<PaymentCard[]>([]);

  // Handle setting a card as default
  const handleSetDefault = (cardId: string) => {
    setCards(
      cards.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  // Handle card deletion
  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  // Placeholder for edit functionality
  const handleEditCard = (card: PaymentCard) => {
    // Implement edit logic or open a modal
    // console.log('Editing card:', card);
  };
  return (
    <div className="container ">
      <div className="my-4">
        <div className=" flex justify-between items-center">
          <h2 className="text-xl">Payment Methods</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
        <p className="text-muted-foreground mt-1">
          reacurring monthly charges will be billed to your payment method, with
          a backup paymeny method used in case the primary one fails.
        </p>
      </div>
      <div className="container py-4 w-full">
        {cards.map((card) => (
          <Card key={card.id} className="mb-4 shadow-md">
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex items-center space-x-2">
                {card.type === "Visa" ? (
                  <FontAwesomeIcon icon={faCreditCard} />
                ) : (
                  <FontAwesomeIcon icon={faCcVisa} />
                )}
                <span className="font-semibold">
                  {card.type} **** {card.last4}
                </span>
              </div>
              {card.isDefault && (
                <span className="text-green-500 text-sm flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4" /> Default
                </span>
              )}
            </CardHeader>
            <CardContent>
              <p>Name: {card.name}</p>
              <p>
                Expires: {card.expireMonth} {card.expireYear}
              </p>
              <p>Billing Address: {card.billingAddress}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditCard(card)}
                  className="hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteCard(card.id)}
                  className="hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              {!card.isDefault && (
                <Button
                  variant="outline"
                  onClick={() => handleSetDefault(card.id)}
                  className="text-sm"
                >
                  Set as Default
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
