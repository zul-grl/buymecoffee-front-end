
"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <DotLottieReact
        src="/anim.json"
        loop
        autoplay
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};
