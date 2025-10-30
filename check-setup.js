// Quick setup checker
const fs = require('fs');

console.log('\n🔍 Checking InvoiceThai Setup...\n');

// Check 1: Environment Variables
console.log('1️⃣ Checking Environment Variables...');
try {
  const envContent = fs.readFileSync('.env.local', 'utf-8');

  const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://');
  const hasKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ');

  if (hasUrl && hasKey) {
    console.log('   ✅ Environment variables are set correctly');
  } else {
    console.log('   ❌ Environment variables are missing or incorrect');
    if (!hasUrl) console.log('      - NEXT_PUBLIC_SUPABASE_URL is not set');
    if (!hasKey) console.log('      - NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  }
} catch (error) {
  console.log('   ❌ .env.local file not found');
}

// Check 2: Required Files
console.log('\n2️⃣ Checking Required Files...');
const requiredFiles = [
  'app/(auth)/login/page.tsx',
  'app/(auth)/register/page.tsx',
  'app/(dashboard)/dashboard/page.tsx',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'middleware.ts',
  'supabase-schema.sql'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

// Check 3: Node Modules
console.log('\n3️⃣ Checking Dependencies...');
if (fs.existsSync('node_modules/@supabase/supabase-js')) {
  console.log('   ✅ Supabase packages installed');
} else {
  console.log('   ❌ Supabase packages not installed');
  console.log('      Run: npm install');
}

// Summary
console.log('\n📋 Summary:\n');
console.log('Next Steps:');
console.log('1. Make sure database schema is set up in Supabase SQL Editor');
console.log('2. Disable email confirmation in Supabase Auth Settings');
console.log('3. Register at http://localhost:3000/register');
console.log('4. Login at http://localhost:3000/login\n');

console.log('Common Issues:');
console.log('- "Invalid login credentials" → Register first!');
console.log('- "Database error" → Run supabase-schema.sql');
console.log('- "Email not confirmed" → Disable it in Supabase settings\n');

console.log('🔗 Supabase Dashboard:');
console.log('https://supabase.com/dashboard/project/vtcpvvzlxpqwmnjvvldv\n');
