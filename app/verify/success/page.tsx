export default function VerifySuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600">✅ Email Verified!</h1>
        <p className="mt-4 text-gray-700">
          Your email has been successfully verified. You can now proceed to checkout.
        </p>
        <a
          href="/shop"
          className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Continue shopping
        </a>
      </div>
    </div>
  );
}
