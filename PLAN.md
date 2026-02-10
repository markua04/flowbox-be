# Backend Technical Case Plan

## Goal
Implement a unified chat timeline between companies and influencers, including messages, attachments, posted content, and transfers (with state handling).

## Assumptions
- Conversations are strictly between one company and one influencer.
- Conversation ID is used in `/:id` routes to avoid ambiguity.
- Transfers require at least `initiated` and `succeeded` states.

## Data Model (SQLite)
- `conversations`: links `company_id` and `influencer_id`, unique pair.
- `chat_items`: timeline rows with `type`, `sender_type`, `sender_id`, `created_at` and a reference to a type table.
- `messages`: `text`.
- `attachments`: `url`, `mime_type`, `file_name`, `size_bytes`.
- `posted_contents`: `platform`, `url`, `title`, `caption`.
- `transfers`: `amount`, `currency`, `state`, `reference`.
- Indexes on `chat_items(conversation_id, created_at, id)` and `conversations(company_id)` / `conversations(influencer_id)`.

## API Endpoints
- `GET /company/messages` and `GET /influencer/messages`
  - List conversations with latest chat item and counterpart info.
- `GET /company/messages/:id` and `GET /influencer/messages/:id`
  - Full unified timeline for a single conversation.
- `POST /company/messages/:id` and `POST /influencer/messages/:id`
  - Create a message in a conversation.

## Implementation Steps
1) Add tables and indexes in `src/repositories/schemaRepository.ts` and seed a minimal dataset in `src/seeds/seedRepository.ts` via `src/services/databaseService.ts`.
2) Build preview query to return latest chat item per conversation.
3) Build detail query to return ordered timeline items with type payloads.
4) Implement message creation (insert into `messages` + `chat_items`).
5) Validate via Bruno collection requests in `collection/`.

## Validation
- Use the Bruno collection under `collection/` with the `local` environment.
- Confirm latest-item ordering, timeline ordering, and transfer state values.
