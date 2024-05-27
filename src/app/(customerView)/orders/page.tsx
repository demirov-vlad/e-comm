"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import EmailOrderHistory from "@/actions/orders";

const MyOrdersPage = () => {
  const [data, action] = useFormState(EmailOrderHistory, {});
  return (
    <form action={action} className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Enter your email and we will send You your order history and
            download links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Email"
            />
            {data.error && <div className="text-destructive">{data.error}</div>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          {data.message && <p className="mb-4">{data.message}</p>}
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
};

export default MyOrdersPage;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" size="lg" disabled={pending} type="submit">
      {pending ? "Sending..." : "Send"}
    </Button>
  );
}
