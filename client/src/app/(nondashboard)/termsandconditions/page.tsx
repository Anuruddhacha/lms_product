'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center mt-10 px-4 pt-[100px] min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-500">
          Terms and Conditions
        </h1>

        <div className="prose max-w-none text-gray-800 dark:text-gray-200 space-y-4">
  <p>
    By proceeding, you agree to our <strong>Terms & Conditions</strong> and <strong>Privacy Policy</strong>.
  </p>

  <h2 className="text-xl font-semibold">
    For the purposes of this document, the term “SASDI” shall hereinafter refer to:
  </h2>
  <p>
    <strong>SANATHANA AYURVEDA SKILLS DEVELOPMENT INSTITUTE (PVT) LTD.</strong>
  </p>

  <h3 className="text-lg font-semibold">Payment Terms</h3>
  <ul className="list-disc pl-5">
    <li>All payments must be made in Sri Lankan Rupees (LKR).</li>
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
    All the transactions should be informed to <strong>Dr. Dhanushke Dissanayake</strong> via WhatsApp (
    <a href="tel:+94704221188" className="text-blue-600 underline">+94 704 221 188</a>) along with a properly generated PDF document to confirm your payment with SANATHANA AYURVEDA SKILLS DEVELOPMENT INSTITUTE (PVT) LTD.
  </p>

  <p>
    For any technical support, please contact <strong>Dr. Sameera Chandrasekara</strong> (
    <a href="tel:+94777293232" className="text-blue-600 underline">+94 77 729 3232</a>).
  </p>

  <h3 className="text-lg font-semibold">Fee Clarifications</h3>
  <p>
    All payment amounts (which may change from time to time based on SASDI decisions and the courses offered)
    should be verified through the SASDI website (
    <a href="https://www.sasdi.lk" target="_blank" className="text-blue-600 underline">www.sasdi.lk</a>) or by contacting the finance administration personnel of the institution.
  </p>

  <h3 className="text-lg font-semibold">Overpayments</h3>
  <p>
    In case of overpayment, the individual must provide all required proof of payment. The refund will be processed within 10–15 working days after verification. Any institutional losses during this process will be deducted before the refund is issued.
  </p>
</div>


        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.back()}
            className="h-12 px-6 font-semibold rounded-md bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:scale-[1.02] text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            Back
          </button>
          {/* Optional: add an "Agree" button if you want to confirm acceptance here */}
        </div>
      </div>

      <div className="fixed bottom-10 left-0 right-0 flex justify-center">
        <Image
          src="/SASDI_WD.png"
          alt="Sasdi Logo"
          width={150}
          height={150}
          className="opacity-20"
        />
      </div>
    </div>
  );
}
