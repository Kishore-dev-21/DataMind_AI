import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Conversation, Message, ErrorPayload } from "@/types";
import { processSteps, titleFor } from "@/lib/ai-engine";
import { formatResponse } from "@/lib/response-formatter";
import { DATABASES } from "@/lib/mock-data";
import { askDataMind, ApiError } from "@/services/api";

// ==========================================
// SPECIAL QUERY HANDLER (no backend needed)
// ==========================================

const ER_DIAGRAM_MERMAID = `erDiagram
  customers {
    TEXT customer_id PK
    TEXT customer_unique_id
    TEXT customer_city
    TEXT customer_state
  }
  orders {
    TEXT order_id PK
    TEXT customer_id FK
    TEXT order_status
    TEXT order_purchase_timestamp
  }
  order_items {
    TEXT order_id FK
    TEXT product_id FK
    TEXT seller_id FK
    REAL price
    REAL freight_value
  }
  payments {
    TEXT order_id FK
    TEXT payment_type
    REAL payment_value
    INTEGER payment_installments
  }
  products {
    TEXT product_id PK
    TEXT product_category_name FK
    REAL product_weight_g
  }
  sellers {
    TEXT seller_id PK
    TEXT seller_city
    TEXT seller_state
  }
  reviews {
    TEXT review_id PK
    TEXT order_id FK
    INTEGER review_score
  }
  category_translation {
    TEXT product_category_name PK
    TEXT product_category_name_english
  }
  customers ||--o{ orders : "places"
  orders ||--|{ order_items : "contains"
  order_items }|--|| products : "references"
  order_items }|--|| sellers : "fulfilled by"
  orders ||--o{ payments : "paid via"
  orders ||--o{ reviews : "reviewed in"
  products }o--|| category_translation : "translated by"`;

const ORDER_WORKFLOW_MERMAID = `flowchart LR
  A([Customer Places Order]) --> B[created]
  B --> C[approved]
  C --> D[processing]
  D --> E[shipped]
  E --> F([delivered])
  C --> G([canceled])
  D --> G`;

function handleSpecialQuery(question: string): { content: string; mermaid?: { title: string; code: string } } | null {
  const q = question.toLowerCase().trim();

  if (q.includes("er diagram") || q.includes("entity relationship") || q.includes("erd")) {
    return {
      content: "Here is the **Entity-Relationship Diagram** for the Olist e-commerce database showing all 8 tables and their relationships.",
      mermaid: { title: "E-Commerce Database ER Diagram", code: ER_DIAGRAM_MERMAID },
    };
  }

  if (q.includes("order workflow") || q.includes("order flow") || q.includes("order lifecycle")) {
    return {
      content: "Here is the **order lifecycle workflow** showing how an order moves from creation to delivery or cancellation.",
      mermaid: { title: "Order Status Workflow", code: ORDER_WORKFLOW_MERMAID },
    };
  }

  if ((q.includes("explain") || q.includes("describe")) && (q.includes("schema") || q.includes("database"))) {
    return {
      content: `## Olist E-Commerce Database Schema\n\nThis database contains **8 tables** from the Brazilian Olist e-commerce platform:\n\n| Table | Rows | Description |\n|---|---|---|\n| **customers** | 99,441 | Buyer profiles with city and state |\n| **orders** | 99,441 | Order headers with status and timestamps |\n| **order_items** | 112,650 | Line items linking orders to products and sellers |\n| **payments** | 103,886 | Payment records (credit_card, boleto, voucher, debit_card) |\n| **products** | 32,951 | Product catalog with category and dimensions |\n| **sellers** | 3,095 | Seller profiles with location |\n| **reviews** | 99,224 | Customer review scores (1-5) and comments |\n| **category_translation** | 71 | Portuguese to English category name translations |\n\n### Key Relationships\n- A **customer** places many **orders**\n- Each **order** has many **order_items**, **payments**, and **reviews**\n- Each **order_item** links to a **product** and a **seller**\n\n> Try: *"Show total payment value by payment type"* or *"Show the top 10 products by revenue"*`,
    };
  }

  if (q === "inventory status" || (q.includes("inventory") && q.includes("status"))) {
    return {
      content: `## Inventory Overview\n\nThe database tracks **32,951 products** across multiple categories:\n\n- **Total order items sold**: 112,650 across all orders\n- **Unique sellers**: 3,095 active sellers\n- **Product categories**: 71 unique categories (translated to English)\n\n> Try: *"Show the top 10 products by total sales value"* or *"Show the number of orders for each product category"*`,
    };
  }

  return null;
}

const uid = () => Math.random().toString(36).slice(2, 11);



export interface AppSettings {
  theme: "olist" | "emerald" | "forest" | "oled";
  autoSendVoice: boolean;
  voiceLanguage: string;
  defaultRowLimit: number;
  autoShowCharts: boolean;
  autoShowSql: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "olist",
  autoSendVoice: false,
  voiceLanguage: "en-US",
  defaultRowLimit: 10,
  autoShowCharts: true,
  autoShowSql: true,
};

interface ChatState {
  conversations: Conversation[];
  activeId: string;
  isStreaming: boolean;
  activeDatabaseId: string;
  provider: string;
  model: string;
  timers: ReturnType<typeof setTimeout>[];
  settings: AppSettings;

  newConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  togglePin: (id: string) => void;
  setDatabase: (id: string) => void;
  setModel: (model: string) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;

  send: (text: string) => void;
  stop: () => void;
  regenerate: () => void;
  setFeedback: (
    messageId: string,
    value: "up" | "down"
  ) => void;
}

// ==========================================
// EMPTY CONVERSATION
// ==========================================

const emptyConversation = (): Conversation => ({
  id: uid(),
  title: "New conversation",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  pinned: false,
  messages: [],
});

// ==========================================
// ERROR PAYLOAD BUILDER
// ==========================================

function buildErrorPayload(error: unknown): ErrorPayload {
  if (error instanceof ApiError) {
    const hints: Record<string, string> = {
      connection: "Make sure the FastAPI server is running: uvicorn main:app --reload --port 8000",
      quota: "Check your Gemini API quota at https://ai.google.dev/",
      model_unavailable: "Verify GEMINI_API_KEY and model name in backend/.env",
      timeout: "Try a simpler question or check backend performance",
      sql_error: "The AI-generated SQL had an issue. Try rephrasing your question.",
      auth: "Verify GEMINI_API_KEY in backend/.env",
    };

    return {
      title:
        error.errorType === "connection"
          ? "Connection Error"
          : error.errorType === "quota"
          ? "Rate Limit Reached"
          : error.errorType === "timeout"
          ? "Request Timeout"
          : error.errorType === "sql_error"
          ? "Query Error"
          : "Analysis Error",
      message: error.userMessage,
      hint: hints[error.errorType],
    };
  }

  if (error instanceof TypeError) {
    return {
      title: "Connection Error",
      message: "Unable to connect to the DataMind AI backend.",
      hint: "Make sure the FastAPI server is running at http://127.0.0.1:8000",
    };
  }

  return {
    title: "Unexpected Error",
    message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
  };
}

// ==========================================
// STORE (WITH PERSISTENCE)
// ==========================================

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => {
      const first = emptyConversation();

      const clearTimers = () => {
        get().timers.forEach((timer) => clearTimeout(timer));
        set({ timers: [] });
      };

      const patchActive = (
        fn: (conversation: Conversation) => Conversation
      ) => {
        set((state) => ({
          conversations: state.conversations.map(
            (conversation) =>
              conversation.id === state.activeId
                ? fn(conversation)
                : conversation
          ),
        }));
      };

      const patchMessage = (
        id: string,
        patch: Partial<Message>
      ) => {
        patchActive((conversation) => ({
          ...conversation,
          updatedAt: Date.now(),
          messages: conversation.messages.map(
            (message) =>
              message.id === id
                ? { ...message, ...patch }
                : message
          ),
        }));
      };

      const advanceSteps = (
        assistantId: string,
        stepIndex: number,
        status: "active" | "done"
      ) => {
        const state = get();
        const conversation = state.conversations.find(
          (c) => c.id === state.activeId
        );
        const message = conversation?.messages.find(
          (m) => m.id === assistantId
        );
        if (!message?.steps) return;

        const newSteps = message.steps.map((step, i) => {
          if (i < stepIndex) return { ...step, status: "done" as const };
          if (i === stepIndex) return { ...step, status };
          return step;
        });

        patchMessage(assistantId, { steps: newSteps });
      };

      // ==========================================
      // REAL BACKEND REQUEST & RESPONSE FORMATTING
      // ==========================================

      const run = async (question: string) => {
        const assistantId = uid();
        const steps = processSteps();

        patchActive((conversation) => ({
          ...conversation,
          messages: [
            ...conversation.messages,
            {
              id: assistantId,
              role: "assistant",
              content: "",
              createdAt: Date.now(),
              streaming: true,
              steps,
              feedback: null,
            },
          ],
        }));

        set({ isStreaming: true });

        try {
          // Step animations
          advanceSteps(assistantId, 0, "done");
          advanceSteps(assistantId, 1, "active");
          await new Promise((r) => setTimeout(r, 60));
          advanceSteps(assistantId, 1, "done");
          advanceSteps(assistantId, 2, "active");

          // Call backend
          const response = await askDataMind(question);

          advanceSteps(assistantId, 2, "done");
          advanceSteps(assistantId, 3, "active");
          await new Promise((r) => setTimeout(r, 60));
          advanceSteps(assistantId, 3, "done");
          advanceSteps(assistantId, 4, "active");
          await new Promise((r) => setTimeout(r, 60));
          advanceSteps(assistantId, 4, "done");
          advanceSteps(assistantId, 5, "active");
          await new Promise((r) => setTimeout(r, 60));
          advanceSteps(assistantId, 5, "done");
          advanceSteps(assistantId, 6, "active");
          await new Promise((r) => setTimeout(r, 60));
          advanceSteps(assistantId, 6, "done");

          // Handle unsuccessful backend responses
          if (!response.success) {
            const fallbackMsg =
              "I'm sorry, I couldn't find a relevant result for your query. Please check the spelling and avoid using abbreviations or shortened forms.\n" +
              "For the best results, please ask questions related to the available e-commerce data and analytics, such as revenue, orders, customers, products, payments, or trends.\n" +
              "You can also explore the Analytics Dashboard to discover the available insights and supported analyses.";

            const errorMsg = response.answer || fallbackMsg;
            patchMessage(assistantId, {
              content: errorMsg,
              streaming: false,
              steps: undefined,
              // Do NOT set error — show as plain assistant message, not a red error card
            });
            set({ isStreaming: false, timers: [] });
            return;
          }

          // Pass directly to UniversalResponseFormatter
          const formatted = formatResponse(question, response);

          // Store formatted payloads directly on message
          patchMessage(assistantId, {
            content: formatted.content,
            sql: formatted.sql,
            table: formatted.table,
            chart: formatted.chart ?? undefined,
            csvOnly: formatted.csvOnly,
            insights: formatted.insights,
            streaming: false,
            steps: processSteps().map((step) => ({
              ...step,
              status: "done" as const,
            })),
          });

          set({ isStreaming: false, timers: [] });
        } catch (error) {
          console.error("DataMind API Error:", error);

          const errorPayload = buildErrorPayload(error);

          patchMessage(assistantId, {
            content: errorPayload.message,
            streaming: false,
            steps: undefined,
            error: errorPayload,
          });

          set({ isStreaming: false, timers: [] });
        }
      };

      return {
        conversations: [first],
        activeId: first.id,
        isStreaming: false,
        activeDatabaseId: DATABASES[0].id,
        provider: "SQL Engine",
        model: "DataMind AI",
        timers: [],
        settings: {
          theme: "oled",
          autoSendVoice: false,
          voiceLanguage: "en-US",
          defaultRowLimit: 10,
          autoShowCharts: true,
          autoShowSql: true,
        },

        newConversation: () => {
          clearTimers();
          const conversation = emptyConversation();
          set((state) => ({
            conversations: [conversation, ...state.conversations],
            activeId: conversation.id,
            isStreaming: false,
          }));
        },

        selectConversation: (id) => {
          clearTimers();
          set({ activeId: id, isStreaming: false });
        },

        deleteConversation: (id) =>
          set((state) => {
            const remaining = state.conversations.filter(
              (conversation) => conversation.id !== id
            );
            const next =
              remaining.length > 0 ? remaining : [emptyConversation()];
            return {
              conversations: next,
              activeId:
                state.activeId === id ? next[0].id : state.activeId,
            };
          }),

        clearAllConversations: () => {
          clearTimers();
          const fresh = emptyConversation();
          set({
            conversations: [fresh],
            activeId: fresh.id,
            isStreaming: false,
          });
        },

        updateSettings: (patch) =>
          set((state) => ({
            settings: { ...state.settings, ...patch },
          })),

        togglePin: (id) =>
          set((state) => ({
            conversations: state.conversations.map(
              (conversation) =>
                conversation.id === id
                  ? { ...conversation, pinned: !conversation.pinned }
                  : conversation
            ),
          })),

        setDatabase: (id) => set({ activeDatabaseId: id }),
        setModel: (model) => set({ model }),

        send: (text) => {
          const question = text.trim();
          if (!question || get().isStreaming) return;

          patchActive((conversation) => ({
            ...conversation,
            title:
              conversation.messages.length === 0
                ? titleFor(question)
                : conversation.title,
            updatedAt: Date.now(),
            messages: [
              ...conversation.messages,
              {
                id: uid(),
                role: "user",
                content: question,
                createdAt: Date.now(),
              },
            ],
          }));

          // Intercept special queries locally (no backend needed)
          const special = handleSpecialQuery(question);
          if (special) {
            const assistantId = uid();
            patchActive((conversation) => ({
              ...conversation,
              messages: [
                ...conversation.messages,
                {
                  id: assistantId,
                  role: "assistant",
                  content: special.content,
                  createdAt: Date.now(),
                  streaming: false,
                  feedback: null,
                  ...(special.mermaid ? { mermaid: special.mermaid } : {}),
                },
              ],
            }));
            return;
          }

          run(question);
        },

        stop: () => {
          clearTimers();
          patchActive((conversation) => ({
            ...conversation,
            messages: conversation.messages.map(
              (message) =>
                message.streaming
                  ? { ...message, streaming: false, steps: undefined }
                  : message
            ),
          }));
          set({ isStreaming: false });
        },

        regenerate: () => {
          const state = get();
          const conversation = state.conversations.find(
            (conversation) => conversation.id === state.activeId
          );

          if (!conversation || state.isStreaming) return;

          const lastUserMessage = [...conversation.messages]
            .reverse()
            .find((message) => message.role === "user");

          if (!lastUserMessage) return;

          patchActive((conversation) => {
            const index = conversation.messages.findIndex(
              (message) => message.id === lastUserMessage.id
            );
            return {
              ...conversation,
              messages: conversation.messages.slice(0, index + 1),
            };
          });

          run(lastUserMessage.content);
        },

        setFeedback: (messageId, value) =>
          patchActive((conversation) => ({
            ...conversation,
            messages: conversation.messages.map(
              (message) =>
                message.id === messageId
                  ? {
                      ...message,
                      feedback: message.feedback === value ? null : value,
                    }
                  : message
            ),
          })),
      };
    },
    {
      name: "datamind-chat-storage",
      storage: createJSONStorage(() => 
        typeof window !== "undefined" ? window.localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        } as any
      ),

      partialize: (state) => ({
        conversations: state.conversations.map((c) => ({
          ...c,
          messages: c.messages.map((m) => ({
            ...m,
            streaming: false,
            steps: undefined,
          })),
        })),
        activeId: state.activeId,
        activeDatabaseId: state.activeDatabaseId,
        settings: state.settings,
      }),

      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Ensure settings are merged with default values to prevent undefined crashes on rehydration
        state.settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };

        // Reset streaming states
        state.conversations = (state.conversations || []).map((c) => ({
          ...c,
          messages: (c.messages || []).map((m) => ({
            ...m,
            streaming: false,
            steps: undefined,
          })),
        }));

        if (state.conversations.length === 0) {
          const first = emptyConversation();
          state.conversations = [first];
          state.activeId = first.id;
        }

        const exists = state.conversations.some((c) => c.id === state.activeId);
        if (!exists) {
          state.activeId = state.conversations[0].id;
        }
      },
    }
  )
);

export const useActiveConversation = () =>
  useChatStore(
    (state) =>
      state.conversations.find(
        (conversation) => conversation.id === state.activeId
      ) ?? state.conversations[0]
  );

export const useActiveDatabase = () =>
  useChatStore(
    (state) =>
      DATABASES.find(
        (database) => database.id === state.activeDatabaseId
      ) ?? DATABASES[0]
  );