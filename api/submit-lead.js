// api/submit-lead.js - Secure lead capture backend
export default async function handler(req, res) {
  // Enable CORS for frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientId, botSelected, userData, quote } = req.body;

    // Validate required fields
    if (!clientId || !userData?.name || !userData?.phone || !userData?.email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Client configurations (environment variables)
    const CLIENT_CONFIGS = {
      'tener-interiors': {
        googleScriptId: process.env.TENER_SCRIPT_ID,
        email: 'leads@tenerinteriors.com'
      }
      // Add more clients here easily
    };

    // Get client configuration
    const clientConfig = CLIENT_CONFIGS[clientId];
    if (!clientConfig || !clientConfig.googleScriptId) {
      return res.status(400).json({ error: 'Invalid client or missing configuration' });
    }

    // Prepare data for Google Sheets
    const leadData = {
      timestamp: new Date().toISOString(),
      clientId,
      botSelected,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      quote,
      source: 'InterioAssist Chatbot'
    };

    // Submit to Google Sheets via Apps Script
    const googleScriptUrl = `https://script.google.com/macros/s/${clientConfig.googleScriptId}/exec`;
    
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });

    if (!response.ok) {
      throw new Error(`Google Script error: ${response.status}`);
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Lead captured successfully',
      leadId: `${clientId}-${Date.now()}`
    });

  } catch (error) {
    console.error('Lead submission error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit lead'
    });
  }
}
