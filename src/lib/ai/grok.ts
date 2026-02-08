import type { FlooringType } from "@/lib/validators/visualize.schema";

interface VisualizationParams {
  imageBase64: string;
  mimeType: string;
  flooringType: FlooringType;
}

interface VisualizationResult {
  imageBase64: string;
  revisedPrompt?: string;
}

const FLOORING_PROMPTS: Record<FlooringType, string> = {
  hardwood: "rich, warm hardwood flooring with natural wood grain patterns and a polished finish",
  laminate: "modern laminate flooring with realistic wood-look finish and clean lines",
  vinyl: "luxury vinyl plank flooring with contemporary design and subtle texture",
  marble: "elegant white marble flooring with subtle grey veining and polished surface",
  tile: "ceramic tile flooring with clean, modern finish in neutral tones",
};

export async function generateFlooringVisualization(
  params: VisualizationParams
): Promise<VisualizationResult> {
  const { imageBase64, mimeType, flooringType } = params;

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY environment variable is not set");
  }

  const flooringDescription = FLOORING_PROMPTS[flooringType];

  // Build the generation prompt
  const prompt = `You are an expert interior designer and image editor. Take this room photo and replace the existing floor with ${flooringDescription}.

CRITICAL REQUIREMENTS:
- Keep the exact same room perspective, walls, furniture, and all objects
- Replace ONLY the floor surface with the new flooring material
- Match the lighting conditions and shadows naturally
- Maintain realistic reflections on the new floor
- Preserve all furniture, rugs, decorations in their exact positions
- The new flooring should extend to all visible floor areas
- Make the result photorealistic, as if a professional photographer took the photo
- The floor replacement should look natural and professionally installed

Generate a single photorealistic image of this room with the new ${flooringType} flooring.`;

  // Call Grok Image API
  const response = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-2-image",
      prompt: prompt,
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Grok API error:", errorData);
    throw new Error(
      errorData.error?.message || `Grok API error: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();

  if (!result.data?.[0]?.b64_json) {
    throw new Error("No image generated from Grok API");
  }

  return {
    imageBase64: result.data[0].b64_json,
    revisedPrompt: result.data[0].revised_prompt,
  };
}

export async function analyzeRoomWithVision(
  imageBase64: string,
  mimeType: string
): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY environment variable is not set");
  }

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-2-vision-1212",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
              },
            },
            {
              type: "text",
              text: `Analyze this room photo for flooring replacement. Describe:
1. The room type (living room, bedroom, kitchen, etc.)
2. Current flooring type and boundaries
3. Furniture and objects on the floor
4. Lighting conditions
5. Key details to preserve when replacing the floor

Keep your response concise (under 200 words).`,
            },
          ],
        },
      ],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Vision API error: ${response.status}`
    );
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || "Room analysis unavailable";
}
