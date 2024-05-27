import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "@/email/components/OrderInformation";
import React from "react";

type OrderHistoryEmailProps = {
  orders: {
    id: string;
    pricePaidInCents: number;
    createdAt: Date;
    downloadVerificationId: string;
    product: {
      name: string;
      imagePath: string;
      description: string;
    };
  }[];
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 1599,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product Name",
        imagePath: "/products/7d59b369-67b6-4e08-a7ea-fb033ca1f46b-campers.PNG",
        description: "Some Description",
      },
    },
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 2000,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product Name 2",
        imagePath: "/products/7d59b369-67b6-4e08-a7ea-fb033ca1f46b-campers.PNG",
        description: "Some Description 2",
      },
    },
  ],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
