# Ancore Federated Auth: Manual Discovery Architecture

## 1. Sequence Diagram

```mermaid
sequenceDiagram
    participant User as User (App/Browser)
    participant Auth as Auth Server (Hono)
    participant AuthTarget as Target Auth (Hono)
    participant Target as Target Server (Hono)

    AuthTarget->>User: 1. Sends mail with server target invite
    User->>Auth: 2. Add the link to the auth server
    Auth->>AuthTarget: 3. Send a request with the invite id and user name
    AuthTarget-->>Auth: 4. Return an api key
    Note over Auth: Save the api key
    User->>Target: 5. Request
    Target-->>User: 6. Response
```

## 2. Steps Review this in the future

- [ ] Simple login set-up better auth
  - [ ] Login to the auth server
  - [ ] He auth server provides privileges to access the chat/voice server
- [ ] The Manual Discovery
