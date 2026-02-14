// Script to check Telegram webhook status
// Usage: node scripts/check-telegram-webhook.js

require('dotenv').config({ path: '.env.local' });

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in .env.local');
  process.exit(1);
}

console.log('🔍 Checking webhook status...\n');

fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
  .then(res => res.json())
  .then(data => {
    if (!data.ok) {
      console.error('❌ Error:', data.description);
      process.exit(1);
    }

    const info = data.result;

    console.log('━'.repeat(60));
    console.log('📊 WEBHOOK STATUS');
    console.log('━'.repeat(60));

    if (info.url) {
      console.log('✅ Status: ACTIVE');
      console.log(`📍 URL: ${info.url}`);
      console.log(`🔐 Has Secret: ${info.has_custom_certificate ? 'Yes' : 'No'}`);
      console.log(`📬 Pending Updates: ${info.pending_update_count}`);

      if (info.last_error_date) {
        const lastErrorDate = new Date(info.last_error_date * 1000);
        console.log(`\n⚠️  Last Error: ${info.last_error_message}`);
        console.log(`⏰ Time: ${lastErrorDate.toLocaleString()}`);
      } else {
        console.log('\n✓ No errors');
      }

      if (info.pending_update_count > 0) {
        console.log(`\n⚠️  Warning: ${info.pending_update_count} pending updates`);
        console.log('   This might indicate webhook is not responding correctly.');
      }
    } else {
      console.log('❌ Status: NOT CONFIGURED');
      console.log('\n📝 Run this command to set up webhook:');
      console.log('   node scripts/setup-telegram-webhook.js');
    }

    console.log('━'.repeat(60));
    console.log('');
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
