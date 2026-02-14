// Script to get Telegram Group ID
// Usage: node scripts/get-telegram-group-id.js YOUR_BOT_TOKEN

const token = process.argv[2];

if (!token) {
  console.error('❌ Error: Please provide your bot token');
  console.log('\nUsage:');
  console.log('  node scripts/get-telegram-group-id.js YOUR_BOT_TOKEN');
  console.log('\nExample:');
  console.log('  node scripts/get-telegram-group-id.js 123456789:ABCdefGHIjklMNOpqrsTUVwxyz');
  process.exit(1);
}

console.log('🔍 Fetching recent updates from Telegram...\n');

fetch(`https://api.telegram.org/bot${token}/getUpdates`)
  .then(res => res.json())
  .then(data => {
    if (!data.ok) {
      console.error('❌ Error:', data.description);
      process.exit(1);
    }

    if (!data.result || data.result.length === 0) {
      console.log('⚠️  No updates found.');
      console.log('\n📝 To get your group ID:');
      console.log('   1. Send a message to your group');
      console.log('   2. Run this script again');
      process.exit(0);
    }

    console.log('📋 Found updates! Looking for group chats...\n');

    const groups = new Map();

    data.result.forEach(update => {
      const chat = update.message?.chat || update.my_chat_member?.chat;

      if (chat && (chat.type === 'group' || chat.type === 'supergroup')) {
        if (!groups.has(chat.id)) {
          groups.set(chat.id, {
            id: chat.id,
            title: chat.title,
            type: chat.type,
            is_forum: chat.is_forum || false
          });
        }
      }
    });

    if (groups.size === 0) {
      console.log('⚠️  No group chats found in recent updates.');
      console.log('\n📝 To get your group ID:');
      console.log('   1. Make sure your bot is added to the group');
      console.log('   2. Send a message to the group');
      console.log('   3. Run this script again');
      process.exit(0);
    }

    console.log('✅ Found group(s):\n');

    groups.forEach(group => {
      console.log('━'.repeat(60));
      console.log(`📊 Group: ${group.title}`);
      console.log(`🆔 Chat ID: ${group.id}`);
      console.log(`📝 Type: ${group.type}`);
      console.log(`💬 Topics/Forum: ${group.is_forum ? '✅ ENABLED' : '❌ DISABLED'}`);
      console.log('━'.repeat(60));
      console.log('');
    });

    const forumGroups = Array.from(groups.values()).filter(g => g.is_forum);

    if (forumGroups.length > 0) {
      console.log('\n✅ Forum-enabled groups found!');
      console.log('\n📋 Copy this Chat ID for TELEGRAM_FORUM_GROUP_ID:');
      console.log(`\n   ${forumGroups[0].id}\n`);
    } else {
      console.log('\n⚠️  Warning: None of these groups have Topics/Forum enabled.');
      console.log('   Please enable Topics in your group settings.');
      console.log('\n   Group Settings → Topics → Enable\n');
    }

  })
  .catch(error => {
    console.error('❌ Error fetching updates:', error.message);
    process.exit(1);
  });
