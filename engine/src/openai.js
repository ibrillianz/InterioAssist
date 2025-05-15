// engine/src/openai.js
export async function callOpenAI(botName, userMessage, context, session) {
  return `🤖 [${botName}] fallback reply for "${userMessage}"`;
}
