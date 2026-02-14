// Script to register Telegram webhook
// Usage: node scripts/setup-telegram-webhook.js

require('dotenv').config({ path: '.env.local' });

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!botToken || !webhookSecret || !siteUrl) {
  console.error('❌ Missing required environment variables!');
  console.log('\nPlease ensure these are set in .env.local:');
  console.log('  - TELEGRAM_BOT_TOKEN');
  console.log('  - TELEGRAM_WEBHOOK_SECRET');
  console.log('  - NEXT_PUBLIC_SITE_URL');
  process.exit(1);
}

// Check if URL is localhost (need ngrok)
if (siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1')) {
  console.error('❌ Cannot use localhost URL for webhook!');
  console.log('\n📝 For local development:');
  console.log('   1. Install ngrok: npm install -g ngrok');
  console.log('   2. Run: ngrok http 3000');
  console.log('   3. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)');
  console.log('   4. Set that as NEXT_PUBLIC_SITE_URL in .env.local');
  console.log('   5. Restart this script\n');
  process.exit(1);
}

const webhookUrl = `${siteUrl}/api/telegram/webhook`;

console.log('🚀 Registering Telegram webhook...\n');
console.log(`📍 Webhook URL: ${webhookUrl}`);
console.log(`🔐 Secret Token: ${webhookSecret.substring(0, 8)}...`);
console.log('');

fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: webhookUrl,
    secret_token: webhookSecret,
    allowed_updates: ['message'],
  }),
})
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log('✅ Webhook registered successfully!\n');
      console.log('━'.repeat(60));
      console.log('✓ Webhook URL:', webhookUrl);
      console.log('✓ Status: Active');
      console.log('━'.repeat(60));
      console.log('\n📝 Next steps:');
      console.log('   1. Make sure your dev server is running (npm run dev)');
      console.log('   2. Test by replying in Telegram');
      console.log('   3. Check if reply appears in chat widget\n');
    } else {
      console.error('❌ Failed to register webhook:', data.description);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
