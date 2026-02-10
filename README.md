# backend-technical-case
This is a full specification, but it’s completely acceptable if not all requirements are met.

## Running the app

### Docker (recommended)
Build and run:
```
docker compose up --build
```

The server runs on:
http://localhost:3000

Run unit tests (Docker):
```
docker compose run --rm app npm test
```
If the container is already running:
```
docker compose exec app npm test
```
If you recently changed dependencies, rebuild the image so the container picks them up:
```
docker compose down
docker compose up --build -d
```

### Local
Install dependencies:
```
npm install
```

Run the app:
```
node index
```

For auto-restart during development:
```
npm install -g nodemon
npm run dev
```

The server runs on:
http://localhost:3000

You can test endpoints using Postman (e.g. `x-www-form-urlencoded` or JSON). Authentication headers can be added manually.

Tested with Node v22.4.

---

## What is the case?

Build a **chat system** between **companies** and **influencers**.

Communication is strictly between the two parties:
- influencer ↔ company  
- influencer ↔ influencer and company ↔ company are **out of scope**

The chat must act as a **single timeline** where multiple types of items can appear.

### Chat must support
- **Messages**
- **Attachments**
- **Posted content** (e.g. shared posts/content references)
- **Transfers** (e.g. payments or value transfers)

Transfers must support **state handling**, at minimum:
- `initiated`
- `succeeded`

All of the above must be **visible and retrievable through the chat**, ordered correctly as a unified conversation.

We don’t expect you to spend more than **1–3 hours** on the assignment.  
If you don’t finish within that time, that’s completely fine — we’ll use it as a basis to discuss your prioritization and trade-offs.

You are allowed to use AI tools.


---

## Required functionality

You should implement:

1. **Conversation preview endpoint**
   - Returns a list of conversations
   - Each conversation should show the **latest chat item** (not just messages)
   - Includes relevant counterpart information (company or influencer)

2. **Conversation detail endpoint**
   - Returns the **full chat timeline** with a specific counterpart
   - Includes all supported chat item types

3. **Create chat item endpoint**
   - Used to send messages

4. **Database design**
   - Design and implement the necessary tables
   - The database is reset by deleting `main.db` and restarting the app
   - Schema design is part of the evaluation

---

## Constraints & expectations

- How you model chat items, state, and relations is **entirely up to you**
- No concrete implementation hints are enforced
- Focus on:
  - Data modeling
  - Query design
  - API structure

---

## Purpose of the case

The goal is not to finish everything perfectly, but to:
- Demonstrate how you approach backend design
- Show how you reason about data modeling and APIs
- Give us a solid basis for a technical discussion afterward

We’ll use your solution to talk through trade-offs, assumptions, and possible improvements.
