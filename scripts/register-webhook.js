// Register Telegram Webhook - Production
// Usage: node scripts/register-webhook.js YOUR_PRODUCTION_URL

const args = process.argv.slice(2);
const productionUrl = args[0];

const botToken = '8031057657:AAFcCyMkx3CrwUlZXDqfF3OyhAWrYenKUWo';
const webhookSecret = '40191a5522ec8e403c76cfc4d6160e6b';

if (!productionUrl) {
  console.error('❌ Error: Please provide your production URL\n');
  console.log('Usage:');
  console.log('  node scripts/register-webhook.js https://yourdomain.com\n');
  console.log('Examples:');
  console.log('  node scripts/register-webhook.js https://flooringbournemouth.com');
  console.log('  node scripts/register-webhook.js https://your-project.vercel.app\n');
  process.exit(1);
}

if (!productionUrl.startsWith('https://')) {
  console.error('❌ Error: URL must start with https://\n');
  process.exit(1);
}

const webhookUrl = `${productionUrl}/api/telegram/webhook`;

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
      console.log('   1. Visit your website');
      console.log('   2. Click the support chat button');
      console.log('   3. Send a test message');
      console.log('   4. Check Telegram for new topic');
      console.log('   5. Reply in Telegram');
      console.log('   6. Verify reply appears on website\n');

      console.log('🔍 Verify webhook status:');
      console.log('   node scripts/check-telegram-webhook.js\n');
    } else {
      console.error('❌ Failed to register webhook:', data.description);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
