import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { useCreateStripePaymentIntentMutation } from "@/state/api";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import Loading from "@/components/Loading";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const appearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#a435f0",
    colorBackground: "#ffffff",
    colorText: "#1c1d1f",
    colorDanger: "#df1b41",
    colorTextPlaceholder: "#6a6f73",
    fontFamily: "Inter, system-ui, sans-serif",
    spacingUnit: "3px",
    borderRadius: "6px",
    fontSizeBase: "14px",
  },
};

const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  const [clientSecret, setClientSecret] = useState<string | "">("");
  const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();
  const { course } = useCurrentCourse();

  useEffect(() => {
    if (!course) return;
    const fetchPaymentIntent = async () => {
      const result = await createStripePaymentIntent({
        amount: course?.price ?? 9999999999999,
      }).unwrap();

      setClientSecret(result.clientSecret);
    };

    fetchPaymentIntent();
  }, [createStripePaymentIntent, course?.price, course]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  if (!clientSecret) return <Loading />;

  return (
    <Elements stripe={stripePromise} options={options} key={clientSecret}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
