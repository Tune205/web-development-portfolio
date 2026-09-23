import type { UIMessage } from "ai";

export type SupportType =
  | "general_support"
  | "product_support"
  | "technical_support"
  | "refund_support"
  | "account_support"
  | "billing_support"
  | "other";

export interface AgentConfig {
  task: string;
  icon: string;
  color: string;
  systemPrompt: string;
}

export interface RoutingMetadata {
  agent: Pick<AgentConfig, "color" | "icon" | "task">;
  classification: {
    complexity: "simple" | "complex";
    confidence: number;
    type: string;
  };
  model: {
    name: string;
    provider: string;
  };
  processing: {
    duration: number;
    endTime: number;
    startTime: number;
  };
}

export type RoutingUIMessage = UIMessage<
  RoutingMetadata,
  {
    "transient-stage-data": { m: string; s: string };
    "agent-info": AgentConfig;
    "agent-metadata": RoutingMetadata;
  }
>;

const AGENT_CONFIGS: Record<SupportType, AgentConfig> = {
  account_support: {
    color: "purple",
    icon: "🔐",
    systemPrompt:
      "You are an account support specialist. Help with login issues, password resets, and account access. Never ask for passwords or full payment details. Give clear, step-by-step recovery instructions.",
    task: "Account Support",
  },
  billing_support: {
    color: "green",
    icon: "💳",
    systemPrompt:
      "You are a billing support specialist. Explain plans, pricing, invoices, and subscription changes clearly. Do not promise refunds or credits; point the customer to the refund process when relevant.",
    task: "Billing Support",
  },
  general_support: {
    color: "blue",
    icon: "💬",
    systemPrompt:
      "You are a friendly general support agent. Answer questions clearly and concisely, and point the customer to the right resource when you cannot help directly.",
    task: "General Support",
  },
  other: {
    color: "gray",
    icon: "🤖",
    systemPrompt:
      "You are a support assistant. The request is outside customer support. Reply briefly and politely, then steer the conversation back to how you can help with the product.",
    task: "General Assistant",
  },
  product_support: {
    color: "indigo",
    icon: "📦",
    systemPrompt:
      "You are a product specialist. Explain features, how to use them, and workarounds for gaps. Record feature requests without promising delivery dates.",
    task: "Product Support",
  },
  refund_support: {
    color: "orange",
    icon: "↩️",
    systemPrompt:
      "You are a refund support specialist. Acknowledge the issue with empathy, explain the refund policy and next steps, and gather the details needed to process the request.",
    task: "Refund Support",
  },
  technical_support: {
    color: "red",
    icon: "🛠️",
    systemPrompt:
      "You are a senior technical support engineer. Diagnose API errors, integration problems, and bugs. Ask for error messages and reproduction steps, and include code examples where they help.",
    task: "Technical Support",
  },
};

/** Returns the agent config for a classification type, falling back to general support. */
export function getAgentConfig(type: string): AgentConfig {
  return AGENT_CONFIGS[type as SupportType] ?? AGENT_CONFIGS.general_support;
}
