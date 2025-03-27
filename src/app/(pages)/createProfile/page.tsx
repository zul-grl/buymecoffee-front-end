"use client";
import PaymentForm from "@/app/_components/PaymentForm";
import ProfileForm from "@/app/_components/ProfileForm";
import { useState } from "react";

const createProfile = () => {
  const [step, setStep] = useState(0);
  [ProfileForm, PaymentForm][step];
  const Next = () => {
    return setStep(1);
  };
  return (
    <div className="flex items-center h-full">
      {step === 0 ? <ProfileForm Next={Next} /> : <PaymentForm />}
    </div>
  );
};
export default createProfile;
