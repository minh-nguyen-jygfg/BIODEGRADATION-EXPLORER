import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = 'AIzaSyDbE-P6SlobXMF4OW7Gn80r6X2QS-ivYrE'

const HEALTH_SYSTEM_INSTRUCTION = `Bạn là trợ lý tư vấn sức khỏe thân thiện, chuyên nghiệp trong ứng dụng theo dõi sức khỏe (calo, tập luyện, giấc ngủ, nước uống).
- Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu.
- Chỉ đưa ra gợi ý chung về dinh dưỡng, vận động, giấc ngủ; không chẩn đoán bệnh hay thay thế bác sĩ.
- Khuyến khích người dùng duy trì thói quen lành mạnh và theo dõi chỉ số trong app.
- Nếu câu hỏi ngoài phạm vi sức khỏe chung, nhẹ nhàng hướng lại về chủ đề sức khỏe.`

export type ChatMessage = {
  id: string
  role: 'user' | 'model'
  text: string
  createdAt: Date
}

function getModel() {
  if (!GEMINI_API_KEY) {
    throw new Error('EXPO_PUBLIC_GEMINI_API_KEY chưa được cấu hình. Vui lòng thêm API key vào file .env')
  }
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    systemInstruction: HEALTH_SYSTEM_INSTRUCTION,
  })
}

/**
 * Send user message and get model reply (single turn).
 * For multi-turn, pass previous messages as history.
 * Gemini requires history to start with 'user' — we strip any leading 'model' messages.
 */
export async function sendHealthChatMessage(
  userMessage: string,
  history: { role: 'user' | 'model'; text: string }[] = []
): Promise<string> {
  const model = getModel()

  // Gemini rule: first content must be role 'user'. Strip leading 'model' messages.
  let normalized = history
  while (normalized.length > 0 && normalized[0].role === 'model') {
    normalized = normalized.slice(1)
  }

  if (normalized.length === 0) {
    const result = await model.generateContent(userMessage)
    const response = result.response
    const text = response.text()
    if (!text) throw new Error('Không nhận được phản hồi từ AI')
    return text
  }

  const chat = model.startChat({
    history: normalized.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    })),
  })

  const result = await chat.sendMessage(userMessage)
  const response = result.response
  const text = response.text()
  if (!text) throw new Error('Không nhận được phản hồi từ AI')
  return text
}

export function isHealthChatConfigured(): boolean {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0)
}
