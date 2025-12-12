#!/usr/bin/env ts-node
/**
 * Environment validation script for vLLM integration
 * 
 * Usage:
 *   npx ts-node validate-env.ts
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

function validateEnvironment() {
    console.log('🔍 Validating vLLM Integration Environment');
    console.log('=======================================\n');

    const requiredVars = [
        { name: 'AI_PROVIDER', expected: 'server', current: process.env.AI_PROVIDER },
        { name: 'AI_API_URL', expected: 'http://server:port/v1/chat/completions', current: process.env.AI_API_URL },
        { name: 'AI_MODEL_NAME', expected: 'your-model-name', current: process.env.AI_MODEL_NAME },
    ];

    const optionalVars = [
        { name: 'AI_API_KEY', expected: 'your-api-key', current: process.env.AI_API_KEY },
        { name: 'AI_ENABLE_MCP_TOOLS', expected: 'true', current: process.env.AI_ENABLE_MCP_TOOLS },
        { name: 'AI_USE_SIMPLE_MODE', expected: 'false', current: process.env.AI_USE_SIMPLE_MODE },
    ];

    let hasErrors = false;

    console.log('Required Variables:');
    console.log('------------------');
    for (const { name, expected, current } of requiredVars) {
        if (!current) {
            console.log(`❌ ${name}: NOT SET (expected: ${expected})`);
            hasErrors = true;
        } else {
            console.log(`✅ ${name}: ${current}`);
        }
    }

    console.log('\nOptional Variables:');
    console.log('------------------');
    for (const { name, expected, current } of optionalVars) {
        if (!current) {
            console.log(`⚠️  ${name}: NOT SET (expected: ${expected})`);
        } else {
            console.log(`✅ ${name}: ${current}`);
        }
    }

    // Specific validations
    console.log('\nValidation Checks:');
    console.log('------------------');

    // Check AI_PROVIDER
    if (process.env.AI_PROVIDER !== 'server') {
        console.log('❌ AI_PROVIDER should be "server" for vLLM integration');
        hasErrors = true;
    } else {
        console.log('✅ AI_PROVIDER correctly set to "server"');
    }

    // Check AI_API_URL format
    const apiUrl = process.env.AI_API_URL;
    if (apiUrl) {
        if (!apiUrl.includes('/v1/chat/completions')) {
            console.log('❌ AI_API_URL should end with /v1/chat/completions for vLLM');
            hasErrors = true;
        } else {
            console.log('✅ AI_API_URL has correct vLLM format');
        }

        if (!apiUrl.startsWith('http')) {
            console.log('❌ AI_API_URL should start with http:// or https://');
            hasErrors = true;
        } else {
            console.log('✅ AI_API_URL has correct protocol');
        }
    }

    // Check MCP tools configuration
    if (process.env.AI_ENABLE_MCP_TOOLS === 'false') {
        console.log('⚠️  AI_ENABLE_MCP_TOOLS is disabled - tools won\'t work');
    } else {
        console.log('✅ AI_ENABLE_MCP_TOOLS is enabled');
    }

    if (process.env.AI_USE_SIMPLE_MODE === 'true') {
        console.log('⚠️  AI_USE_SIMPLE_MODE is enabled - tools won\'t work');
    } else {
        console.log('✅ AI_USE_SIMPLE_MODE is disabled (good for tools)');
    }

    // Check API key warning
    if (!process.env.AI_API_KEY) {
        console.log('⚠️  AI_API_KEY not set - server may require authentication');
    } else {
        console.log('✅ AI_API_KEY is configured');
    }

    console.log('\n' + '='.repeat(50));
    if (hasErrors) {
        console.log('❌ Configuration has errors - please fix before testing');
        process.exit(1);
    } else {
        console.log('✅ Configuration looks good for vLLM integration!');
        console.log('\nNext steps:');
        console.log('1. Run: npm run test:vllm');
        console.log('2. Start your server and test /api/v1/ai/tools endpoint');
        console.log('3. Try a chat request with tool calling');
    }
}

// Run validation
if (require.main === module) {
    validateEnvironment();
}

export { validateEnvironment };