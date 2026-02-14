// Register Telegram webhook for PRODUCTION
// Usage: node scripts/setup-production-webhook.js

const botToken = '8031057657:AAFcCyMkx3CrwUlZXDqfF3OyhAWrYenKUWo';
const webhookSecret = '40191a5522ec8e403c76cfc4d6160e6b';
const productionUrl = 'https://YOUR_DOMAIN.com'; // CHANGE THIS!

const webhookUrl = `${productionUrl}/api/telegram/webhook`;

console.log('🚀 Registering PRODUCTION webhook...\n');
console.log(`📍 Webhook URL: ${webhookUrl}`);
console.log(`🔐 Secret Token: ${webhookSecret.substring(0, 8)}...`);
console.log('');

if (productionUrl.includes('YOUR_DOMAIN')) {
  console.error('❌ Error: Please update the productionUrl in this script!');
  console.log('\nEdit scripts/setup-production-webhook.js and change:');
  console.log('  const productionUrl = "https://YOUR_DOMAIN.com"');
  console.log('to your actual domain, e.g.:');
  console.log('  const productionUrl = "https://flooringbournemouth.com"\n');
  process.exit(1);
}

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
      console.log('✅ Production webhook registered successfully!\n');
      console.log('━'.repeat(60));
      console.log('✓ Webhook URL:', webhookUrl);
      console.log('✓ Status: Active');
      console.log('━'.repeat(60));
      console.log('\n📝 Next steps:');
      console.log('   1. Test by sending a message on your website');
      console.log('   2. Check if topic appears in Telegram');
      console.log('   3. Reply in Telegram and verify it appears on site\n');
    } else {
      console.error('❌ Failed to register webhook:', data.description);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
