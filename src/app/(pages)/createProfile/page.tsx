"use client";
import PaymentForm from "@/app/_components/PaymentForm";
import ProfileForm from "@/app/_components/ProfileForm";
import { CompleteProfileResponse } from "@/app/_lib/type";
import { useProfile } from "@/app/context/ProfileContext";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateProfile = () => {
  const [step, setStep] = useState(0);
  const { userId } = useUser();
  const router = useRouter();
  const { fetchProfileData } = useProfile();

  useEffect(() => {
    const getProfileData = async () => {
      const data: CompleteProfileResponse = await fetchProfileData();

      console.log("saved step", data);

      if (!data.profile) {
        setStep(0);
      } else if (!data.bankCard) {
        setStep(1);
      } else {
        router.push("/");
      }
    };
    if (userId) {
      getProfileData();
    }
  }, [userId]);

  const handleNext = () => {
    setStep(1);
  };

  return (
    <div className="flex items-center h-full">
      {step === 0 ? <ProfileForm Next={handleNext} /> : <PaymentForm />}
    </div>
  );
};

export default CreateProfile;
