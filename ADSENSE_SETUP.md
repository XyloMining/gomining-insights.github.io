# Google AdSense Setup Guide

This guide explains how to set up Google AdSense on your GoMining Crypto Insights website and configure PayPal payouts.

## Step 1: Get Your Site Live

Your website is currently deployed at: **[Your Manus domain will appear here once published]**

You need a live, public website URL to apply for Google AdSense.

## Step 2: Apply for Google AdSense

1. Visit [Google AdSense](https://www.google.com/adsense/start/)
2. Sign in with your Google account
3. Enter your website URL
4. Complete the application form
5. Google will review your site (typically takes 24-48 hours)

## Step 3: Get Your Publisher ID

Once approved, Google will provide you with:
- **Publisher ID** (format: `ca-pub-xxxxxxxxxxxxxxxx`)
- **Ad Slot IDs** for each ad placement

## Step 4: Configure Environment Variables

Add your Publisher ID to your environment variables:

```
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

## Step 5: Update Ad Slot IDs

Replace the placeholder slot IDs in `client/src/pages/Home.tsx`:

- `1234567890` → Your actual ad slot ID
- `0987654321` → Your actual ad slot ID
- `1122334455` → Your actual ad slot ID

## Step 6: Configure PayPal Payouts

1. Log into your Google AdSense account
2. Go to **Payments** → **Payment Methods**
3. Click **Add Payment Method**
4. Select **PayPal** as your payment method
5. Enter your PayPal business account email
6. Verify the connection

## Ad Placements on Your Website

Your website has 3 minimal ad placements:

1. **Between Features and Latest Post** - Auto-responsive ad
2. **Between Latest Post and CTA** - Auto-responsive ad
3. **Between CTA and Footer** - Auto-responsive ad

Plus a disclaimer banner at the top explaining ads help keep the site running.

## Important Notes

- **Minimum Earnings Threshold**: Google AdSense requires $100 in earnings before PayPal payout
- **Payment Schedule**: Payments are made monthly if threshold is met
- **Ad Quality**: Google will monitor ad quality; ensure your content complies with AdSense policies
- **Referral Links**: Your GoMining referral link (WCAZD0T) is separate from ad revenue

## Compliance

Your website includes:
- ✅ Ad disclaimer banner
- ✅ Footer disclosure about affiliate links and ads
- ✅ Minimal, non-intrusive ad placements
- ✅ Responsive ad formats

## Support

For AdSense support, visit: https://support.google.com/adsense/

For PayPal integration issues, visit: https://www.paypal.com/us/business/
