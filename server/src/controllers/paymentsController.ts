import { Request, Response } from "express";

export const createPaymentSession = async (req: Request, res: Response) => {

  const cbcMerchantId = process.env.CBC_MPGS_MERCHANT_ID;
  const ntbMerchantId = process.env.NTB_MPGS_MERCHANT_ID;
  const cbcPassword = process.env.CBC_MPGS_PASSWORD;
  const ntbPassword = process.env.NTB_MPGS_PASSWORD;

  if (!cbcMerchantId || !ntbMerchantId || !cbcPassword || !ntbPassword) {
    res.status(500).json({ error: "Merchant credentials not configured" });
  }

  const { amount, description, isNTB } = req.body || {};
  const orderAmount = typeof amount === 'number' && amount > 0 ? amount.toFixed(2) : "100.00";
  const orderDescription = description || "Test Payment Order";


  const merchantId = isNTB ? ntbMerchantId : cbcMerchantId;
  const password = isNTB ? ntbPassword : cbcPassword;
  const orderId = `order-${Date.now()}`;


  const gatewayBase = isNTB
    ? "https://nationstrustbankplc.gateway.mastercard.com"
    : "https://cbcmpgs.gateway.mastercard.com";

  const apiUrl = `${gatewayBase}/api/rest/version/72/merchant/${merchantId}/session`;
  const encodedAuth = Buffer.from(`merchant.${merchantId}:${password}`).toString("base64");

  const body = {
    apiOperation: "INITIATE_CHECKOUT",
    interaction: {
      operation: "PURCHASE",
      displayControl:{
       billingAddress : "HIDE",
      },
      merchant: {
        name: isNTB ? "SASDI" : "SANATHANALKR",
      },
    },
    order: {
      currency: "LKR",
      amount: orderAmount,
      id: orderId,
      description: orderDescription,
    },
  };


  try {
    const response = await fetch(
      apiUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedAuth}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    res.status(response.status).json({
  data: {
    session: data.session,
    successIndicator: data.successIndicator,
    result: data.result,
    orderId: orderId,
  },
});

  } catch (error) {
    console.error("MPGS session error:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};



export const verifyPayment = async (req: Request, res: Response) => {
  const { orderId } = req.query;
  const merchantId = process.env.MPGS_MERCHANT_ID;
  const password = process.env.MPGS_PASSWORD;

  if (!merchantId || !password) {
     res.status(500).json({ error: "Missing merchant credentials" });
  }

  const encodedAuth = Buffer.from(`merchant.${merchantId}:${password}`).toString("base64");

  try {
    const response = await fetch(
      `https://nationstrustbankplc.gateway.mastercard.com/api/rest/version/72/merchant/${merchantId}/order/${orderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${encodedAuth}`,
        },
      }
    );

    const result = await response.json();

    // Ensure the response contains a 'data' field
    res.status(response.status).json({ data: result });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      error: "Failed to verify payment",
    });
  }
};


