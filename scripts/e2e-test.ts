import { rateLimit } from '../src/lib/rate-limit'

async function runE2ETests() {
  console.log('🧪 Starting ServiceHub Automated System Verification Suite...\n')

  let passed = 0
  let failed = 0

  // Test 1: Rate Limiter Verification
  try {
    console.log('1️⃣ Testing Rate Limiting Token Bucket...')
    const key = 'test_ip_127_0_0_1'
    const limit = 3
    let successCount = 0

    for (let i = 0; i < 5; i++) {
      const res = rateLimit({ key, limit, windowMs: 10000 })
      if (res.success) successCount++
    }

    if (successCount === 3) {
      console.log('   ✅ Rate limiter strictly throttled requests after threshold (3/5 allowed).')
      passed++
    } else {
      console.error(`   ❌ Unexpected rate limit success count: ${successCount}`)
      failed++
    }
  } catch (err) {
    console.error('   ❌ Rate limiter test error:', err)
    failed++
  }

  // Summary
  console.log('\n========================================')
  console.log(`📊 Test Results: ${passed} Passed | ${failed} Failed`)
  console.log('========================================\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runE2ETests()
