import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Expired = () => {
  return (
    <>
      <h1 className="text-4xl mb-4">Download link expired</h1>
      <Button asChild size="lg">
        <Link href="/orders">Get New Link</Link>
      </Button>
    </>
  );
};

export default Expired;