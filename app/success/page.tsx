import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
