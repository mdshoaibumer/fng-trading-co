require('dotenv').config({ path: '.env.local' });
const apiKey = process.env.OPENROUTER_API_KEY;
const modelsToTest = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'meta-llama/llama-3-8b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'google/gemini-exp-1206:free',
  'google/gemini-2.5-flash:free',
  'qwen/qwen-2-7b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'huggingfaceh4/zephyr-7b-beta:free',
  'openchat/openchat-7b:free'
];

async function test() {
  for (const model of modelsToTest) {
    console.log(`Testing ${model}...`);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Say hello' }]
      })
    });
    
    if (response.ok) {
      console.log(`SUCCESS! ${model} is working.`);
      const data = await response.json();
      console.log('Response:', data.choices[0].message.content);
      return; // Stop on first success
    } else {
      console.log(`Failed: ${response.status}`);
    }
  }
}

test();
