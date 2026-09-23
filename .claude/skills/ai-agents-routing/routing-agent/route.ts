import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateObject,
  streamText,
  toUIMessageStream,
} from "ai";
import type { UIMessage } from "ai";
import z from "zod";

import { getAgentConfig } from "../lib/ai-routing-types";
import type {
  AgentConfig,
  RoutingMetadata,
  RoutingUIMessage,
} from "../lib/ai-routing-types";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Used when the classifier call fails, so the user still gets an answer
const FALLBACK_CLASSIFICATION: Classification = {
  complexity: "simple",
  confidence: 0,
  type: "general_support",
};

/**
 * POST handler for routing agent
 *
 * Note: Rate limiting is handled at the route wrapper level
 * See: app/(view)/view/[name]/api/[...slug]/route.ts
 */
export async function POST(req: Request) {
  const {
    messages,
    webSearch = false,
  }: {
    messages: UIMessage[];
    webSearch?: boolean;
  } = await req.json();

  // Get the latest user message
  const lastMessage = messages.at(-1);
  let userInput = "";

  if (lastMessage?.role === "user") {
    const content = "content" in lastMessage ? lastMessage.content : undefined;

    if (typeof content === "string") {
      userInput = content;
    } else if (Array.isArray(content)) {
      userInput = content.find((part) => part.type === "text")?.text || "";
    } else if ("parts" in lastMessage && Array.isArray(lastMessage.parts)) {
      // Handle message with parts array
      const textPart = lastMessage.parts.find(
        (part): part is { type: "text"; text: string } => part.type === "text"
      );
      userInput = textPart?.text || "";
    }
  }

  // Create a UIMessage stream for agentic routing workflow
  const stream = createUIMessageStream<RoutingUIMessage>({
    execute: async ({ writer }) => {
      const startTime = Date.now();

      // Stage 1: Classification Stage - Classify the user input
      writer.write({
        data: { m: "Classifying user input", s: "1. Classification" },
        transient: true,
        type: "data-transient-stage-data",
      });
      const classificationResult = await classifyRequest(userInput);
      const classification =
        classificationResult.data ?? FALLBACK_CLASSIFICATION;

      // Stage 2: Routing Stage - Build agent config based on classification
      writer.write({
        data: { m: `Routing to ${classification.type}`, s: "2. Routing" },
        transient: true,
        type: "data-transient-stage-data",
      });
      const agentConfig = getAgentConfig(classification.type);
      const systemPrompt = buildSystemPrompt(agentConfig, classification);
      const responseModel = webSearch
        ? "perplexity/sonar"
        : getResponseModel(classification);

      // Stage 3: Agent Response Generation Stage
      const agentResult = streamText({
        instructions: systemPrompt,
        messages: await convertToModelMessages(messages),
        model: responseModel,
      });

      const buildMetadata = (endTime: number): RoutingMetadata => ({
        agent: {
          color: agentConfig.color,
          icon: agentConfig.icon,
          task: agentConfig.task,
        },
        classification: {
          complexity: classification.complexity,
          confidence: classification.confidence,
          type: classification.type,
        },
        model: {
          name: responseModel,
          provider: responseModel.split("/")[0] ?? "unknown",
        },
        processing: {
          duration: endTime - startTime,
          endTime,
          startTime,
        },
      });

      // Merge the agentResult into our UIMessage stream
      writer.merge(
        toUIMessageStream({
          messageMetadata: ({ part }) => {
            //! Usefull for routing agent inside of a chat application.
            // Stream custom routing agent info as dataparts before the text stream
            if (part.type === "start-step") {
              writer.write({
                data: { m: `${agentConfig.task}`, s: "3. Agent Response" },
                transient: true,
                type: "data-transient-stage-data",
              });

              writer.write({
                data: {
                  color: agentConfig.color,
                  icon: agentConfig.icon,
                  systemPrompt: agentConfig.systemPrompt,
                  task: agentConfig.task,
                },
                transient: false,
                type: "data-agent-info",
              });
            }
            if (part.type === "finish") {
              return buildMetadata(Date.now());
            }
          },
          onEnd: () => {
            // Add data parts to the final message
            writer.write({
              data: buildMetadata(Date.now()),
              transient: false,
              type: "data-agent-metadata",
            });
          },
          sendReasoning: true, // If we want to send reasoning to the client
          sendSources: true, // If we want to send sources to the client
          stream: agentResult.stream,
        })
      );
    },
  });

  return createUIMessageStreamResponse({ stream });
}

async function classifyRequest(input: string) {
  try {
    // First, classify the type using enum output for reliability
    const { object: typeClassification } = await generateObject({
      model: "deepseek/deepseek-v4.1-flash-0731",
      prompt: `You are a customer support classification agent. Classify the customer query into the appropriate category and return a JSON object with type, complexity, and confidence.

CLASSIFICATION CATEGORIES:
- general_support: General questions, information requests, or non-specific support needs
- product_support: Questions about product features, functionality, usage, or feature requests  
- technical_support: Technical issues, API problems, implementation help, or debugging
- refund_support: Requests for refunds, returns, or money back
- account_support: Login issues, password resets, account access problems
- billing_support: Billing questions, payment issues, subscription changes, pricing
- other: Off-topic conversations, chit chat, or anything that doesn't fit above categories

EXAMPLES:
- "I need to export my data in CSV format" → product_support
- "I can't log into my account" → account_support  
- "I was charged twice" → refund_support
- "What's the difference between Pro and Enterprise plans?" → billing_support
- "I'm getting a 401 error with your API" → technical_support
- "What are data security best practices?" → general_support
- "Do you have restaurant recommendations?" → other

CUSTOMER QUERY: ${input}`,
      schema: z.object({
        complexity: z
          .enum(["simple", "complex"])
          .describe("The complexity of the request"),
        confidence: z
          .number()
          .min(0)
          .max(1)
          .describe("The confidence of the classification"),
        type: z
          .enum([
            "general_support",
            "product_support",
            "technical_support",
            "refund_support",
            "account_support",
            "billing_support",
            "other",
          ])
          .describe("The type of the request"),
      }),
    });

    return {
      data: {
        complexity: typeClassification.complexity,
        confidence: typeClassification.confidence,
        type: typeClassification.type,
      },
      success: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Classification failed",
      success: false,
    };
  }
}

interface Classification {
  type: string;
  complexity: "simple" | "complex";
  confidence: number;
}

function buildSystemPrompt(
  agentConfig: AgentConfig,
  classification: Classification
) {
  let { systemPrompt } = agentConfig;

  // Add complexity context
  if (classification.complexity === "complex") {
    systemPrompt +=
      "\n\n🔍 COMPLEX REQUEST: This is a complex request requiring detailed analysis and comprehensive response.";
  }

  return systemPrompt;
}

function getResponseModel(classification: Classification) {
  // Use appropriate model based on complexity
  return classification.complexity === "simple"
    ? "deepseek/deepseek-v4.1-flash"
    : "deepseek/deepseek-r1";
}
