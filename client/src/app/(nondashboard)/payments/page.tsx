'use client';

import { useCreatePaymentSessionMutation } from '@/state/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from "next/image";


export default function PaymentsPage() {
  const [createSession] = useCreatePaymentSessionMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [cardType, setCardType] = useState<'cbc' | 'ntb'>('cbc'); // default to Visa/Master (cbc)

  const [agreed, setAgreed] = useState(false);


  // Splash screen loading timeout
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);


  // Load the MPGS script
  /*useEffect(() => {
    const script = document.createElement('script');
    //script.src = 'https://nationstrustbankplc.gateway.mastercard.com/static/checkout/checkout.min.js';
    script.src = 'https://cbcmpgs.gateway.mastercard.com/static/checkout/checkout.min.js'
    script.setAttribute('data-error', 'errorCallback');
    script.setAttribute('data-cancel', 'cancelCallback');
    script.async = true;

    script.onload = () => {
      setCheckoutReady(true);
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);*/


  const loadCheckoutScript = (isNTB: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Remove any existing Checkout script first
    const existingScript = document.querySelector('script[src*="gateway.mastercard.com/static/checkout"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = isNTB
      ? 'https://nationstrustbankplc.gateway.mastercard.com/static/checkout/checkout.min.js'
      : 'https://cbcmpgs.gateway.mastercard.com/static/checkout/checkout.min.js';

    script.setAttribute('data-error', 'errorCallback');
    script.setAttribute('data-cancel', 'cancelCallback');
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load payment script'));

    document.body.appendChild(script);
  });
};


  // Setup global callbacks
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.errorCallback = (error) => {
      console.error('Payment failed or encountered an error.', error);
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.cancelCallback = () => {
      console.warn('Payment was cancelled by the user.');
    };
  }, []);

  const handlePay = async () => {
    if (isProcessing) return; // Prevent duplicate calls
    /*if (!checkoutReady) {
      alert('Checkout not ready yet. Please wait a moment.');
      return;
    }*/

    if (!amount || Number(amount) <= 0) {
    alert('Please enter a valid payment amount.');
    return;
  }

   if (!description.trim()) {
    alert('Please enter a valid payment description.');
    return;
  }

   const isNTB = cardType === 'ntb';

    try {
      setIsProcessing(true); // Block further clicks

        // Load correct MPGS script
      await loadCheckoutScript(isNTB);
      setCheckoutReady(true);

      const res = await createSession({ amount: Number(amount), description: description.trim() || "Payment Description", isNTB:isNTB }).unwrap();

      if (res.session?.id) {
        sessionStorage.setItem('successIndicator', res.successIndicator ?? '');
        sessionStorage.setItem('orderId', res.orderId ?? '');

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.Checkout.configure({
          session: {
            id: res.session.id,
          }
        });
         setIsExpanded(true);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.Checkout.showEmbeddedPage('#embed-target');

        // Smooth scroll to the embed section
        document.getElementById('embed-target')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setIsProcessing(false); // Re-enable if error
      console.error('Failed to create payment session', err);
    }
  };


    // Show logo splash while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <Image
          src="/logo.svg"
          alt="LMS Platform"
          width={200}
          height={200}
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10 px-4 pt-[100px]">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-500">Secure Payment</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-black">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300 text-black"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border text-black border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Your Email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Amount (LKR)</label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300 text-black"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Payment Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300 text-black"
              placeholder="Course Fee Payment"
            />
          </div>
        </div>


  <div className="mt-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">Select Card Type</label>
  <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6 space-x-4">
    {/* Visa / MasterCard */}
    <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border ${
      cardType === 'cbc' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
    }`}>
      <input
        type="radio"
        name="cardType"
        value="cbc"
        checked={cardType === 'cbc'}
        onChange={() => setCardType('cbc')}
        className="form-radio text-blue-500"
      />
      <div className="flex items-center space-x-3">
    <Image src="/combank_logos.jpg" alt="Visa and MasterCard" width={130} height={80} />
    <span className="text-gray-800 font-medium ">Visa / MasterCard / UnionPay</span>
   </div>


    </label>

    {/* Amex */}
    <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border ${
      cardType === 'ntb' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
    }`}>
      <input
        type="radio"
        name="cardType"
        value="ntb"
        checked={cardType === 'ntb'}
        onChange={() => setCardType('ntb')}
        className="form-radio text-blue-500"
      />
      <div className="flex items-center space-x-2">
        <Image src="/ntb_logo.jpg" alt="Amex" width={130} height={80} />
        <span className="text-gray-800 font-medium">Amex / Discover</span>
      </div>
    </label>
  </div>
</div>



<div className="mt-6 flex flex-col space-y-2">
  <p className="text-sm text-gray-700">
    📄 Please read the important information before proceeding with payment.
  </p>
  <a
    href="/read-before-pay.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center space-x-2 text-blue-600 underline hover:text-blue-800"
  >
    <span>View “Read Before You Pay”</span>
  </a>
</div>


<div className="mt-6">
  <label className="inline-flex items-start space-x-2">
    <input
      type="checkbox"
      className="mt-1"
      checked={agreed}
      onChange={() => setAgreed(!agreed)}
    />
    <span className="text-sm text-gray-700">
      I agree to the{' '}
      <button
        onClick={() => router.push('/termsandconditions')} // Adjust this path if your terms page is different
        className="text-blue-600 underline hover:text-blue-800"
        type="button"
      >
        Terms and Conditions
      </button>
    </span>
  </label>
</div>


    <div className="mt-8">
  <button
    onClick={handlePay}
    disabled={isProcessing || !agreed}
    className={`w-full h-12 inline-flex items-center justify-center font-semibold rounded-md text-white shadow-md transition-all duration-300 ease-in-out
    ${(isProcessing || !agreed) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:shadow-lg hover:scale-[1.02]'}
    `}
  >
    Pay Now
  </button>
</div>


      </div>

      {/* This is where the embedded MPGS UI renders */}
      <div className="w-full max-w-4xl mt-12 px-4 mx-auto">
  <div
    id="embed-target"
    className={`transition-all duration-500 ease-in-out overflow-hidden rounded-2xl border-2 border-dashed shadow-xl p-6 flex items-center justify-center ${
      isExpanded ? 'min-h-[700px]' : 'min-h-[100px]'
    }`}
  >
    {!isExpanded && (
      <p className="text-sm">Click Pay Now to launch secure payment window</p>
    )}
  </div>
</div>
            <div className="mt-8 pb-5">  
           <button
            onClick={() => router.push('/')} // Adjust this path if your homepage is different
            className="h-12 px-6 inline-flex items-center justify-center font-semibold rounded-md bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Home
          </button>
          </div>



    </div>
  );
}
