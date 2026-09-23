---
name: ai-agents-routing
description: Route user queries to specialized AI agents based on context and intent. Includes dynamic agent selection, model selection by complexity, and fallback handling. Use when building a support chat or any endpoint that should classify a message and hand it to a specialist agent.
---

# ai-agents-routing

A three-stage routing pipeline built on the Vercel AI SDK (`ai` v7) and `zod`:

1. **Classification**: `generateObject` sorts the latest user message into one of seven support categories, with a complexity (`simple` / `complex`) and a confidence score.
2. **Routing**: `getAgentConfig` maps the category to a specialist agent (task name, icon, color, system prompt). Complex requests get extra instructions appended to the system prompt.
3. **Response**: `streamText` answers with a model picked by complexity, or with `perplexity/sonar` when `webSearch` is true.

The response is a UI message stream. Along with the text it carries custom data parts:

| Part | Transient | Contents |
| --- | --- | --- |
| `data-transient-stage-data` | yes | `{ s, m }` progress label for each stage |
| `data-agent-info` | no | the selected agent's config |
| `data-agent-metadata` | no | classification, model, and timing (`RoutingMetadata`) |

The same `RoutingMetadata` is also attached as message metadata on `finish`.

## Files

- `routing-agent/route.ts`: the `POST` handler (Next.js App Router route).
- `lib/ai-routing-types.ts`: `RoutingUIMessage`, `RoutingMetadata`, `AgentConfig`, and `getAgentConfig` with the seven agent configs.

## Using it in a project

1. Install dependencies: `npm i ai zod` (and `@ai-sdk/react` for the client).
2. Copy `route.ts` to e.g. `app/api/routing-agent/route.ts` and the types file to `lib/ai-routing-types.ts`. Fix the relative import at the top of `route.ts` to match.
3. Models are plain `"provider/model"` strings resolved by the AI Gateway, so set `AI_GATEWAY_API_KEY` (or swap in provider instances).
4. On the client, `useChat<RoutingUIMessage>()` with `onData` to show the transient stage labels. Read `message.metadata` for the final routing info.

## Fallback behavior

- If classification throws, the request is routed to `general_support` with `confidence: 0` rather than failing.
- An unknown category from `getAgentConfig` also falls back to `general_support`.
- The reported `model.provider` is taken from the model ID prefix (e.g. `deepseek`, `perplexity`).

## Customizing

- Categories: edit the enum and prompt in `classifyRequest`, and the `SupportType` / `AGENT_CONFIGS` in the types file, together.
- Models: edit `getResponseModel` and the classifier model ID in `classifyRequest`.
- Rate limiting is expected to happen in a wrapper route, not here.
