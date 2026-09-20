'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center mt-10 px-4 pt-[100px] min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-500">
          Terms and Conditions
        </h1>

        <div className="prose max-w-none text-gray-800 dark:text-gray-200 space-y-4">
  <p>
    By proceeding, you agree to our <strong>Terms & Conditions</strong> and <strong>Privacy Policy</strong>.
  </p>

  <h2 className="text-xl font-semibold">
    For the purposes of this document, the term “the Platform” shall hereinafter refer to:
  </h2>
  <p>
    <strong>LMS PLATFORM.</strong>
  </p>

  <h3 className="text-lg font-semibold">Payment Terms</h3>
  <ul className="list-disc pl-5">
    <li>Please ensure your payment details are accurate.</li>
    <li>All payments are processed securely using encrypted technology.</li>
    <li>Transactions are final and non-refundable unless stated otherwise by the merchant.</li>
    <li>Ensure all details entered are accurate before submitting payment.</li>
    <li>Unauthorized or fraudulent use may result in legal action.</li>
    <li>We do not store your card details.</li>
    <li>Payment confirmation will be sent via email/SMS (if applicable).</li>
    <li>Service availability and delivery are the sole responsibility of the merchant.</li>
    <li>Disputes related to the transaction should be directed to the merchant.</li>
    <li>By making payment, you authorize us to debit the specified amount.</li>
  </ul>

  <h3 className="text-lg font-semibold">Post-Payment Instructions</h3>
  <p>
    All transactions should be confirmed with our finance team along with a properly generated PDF document to confirm your payment with LMS Platform.
  </p>

  <p>
    For any technical support, please contact our support team via the <a href="/contactus" className="text-blue-600 underline">Contact Us</a> page.
  </p>

  <h3 className="text-lg font-semibold">Fee Clarifications</h3>
  <p>
    All payment amounts (which may change from time to time based on decisions and the courses offered)
    should be verified through the Platform website or by contacting the finance administration personnel of the institution.
  </p>

  <h3 className="text-lg font-semibold">Overpayments</h3>
  <p>
    In case of overpayment, the individual must provide all required proof of payment. The refund will be processed within 10–15 working days after verification. Any institutional losses during this process will be deducted before the refund is issued.
  </p>
</div>


        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.back()}
            className="h-12 px-6 font-semibold rounded-md bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:scale-[1.02] text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            Back
          </button>
          {/* Optional: add an "Agree" button if you want to confirm acceptance here */}
        </div>
      </div>

      <div className="fixed bottom-10 left-0 right-0 flex justify-center">
        <Image
          src="/logo.svg"
          alt="LMS Platform Logo"
          width={150}
          height={150}
          className="opacity-20"
        />
      </div>
    </div>
  );
}
