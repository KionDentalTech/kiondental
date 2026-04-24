# Threat Model — Payment Control & Reminder System
> Methodology: STRIDE | Framework: OWASP ASVS 4.0 | Date: 2026-04-24

---

## 1. SYSTEM OVERVIEW

### 1.1 Purpose
Sistema corporativo de controle de pagamentos com:
- Gestão de pagamentos recorrentes e avulsos
- Alertas automáticos por e-mail (D-7, D-3, D0, D+1)
- Ingestão automática de e-mails com extração de boletos/invoices
- Dashboard de riscos e vencimentos
- Trilha de auditoria imutável

### 1.2 Trust Boundaries

```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET (UNTRUSTED)                   │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────────┐ │
│  │  Browser │   │  E-mail  │   │  External SMTP/IMAP  │ │
│  │  (User)  │   │  Server  │   │  (Fornecedores)      │ │
│  └────┬─────┘   └────┬─────┘   └──────────┬───────────┘ │
└───────┼──────────────┼──────────────────────┼────────────┘
        │              │                      │
        ▼ TLS 1.3      ▼ TLS 1.3             ▼ TLS 1.3
┌───────────────────────────────────────────────────────────┐
│                    DMZ / EDGE LAYER                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │  WAF + Rate Limiter + DDoS Protection              │  │
│  │  (Cloudflare / AWS WAF)                            │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER (TRUSTED)               │
│                                                            │
│  ┌──────────────┐   ┌──────────────┐  ┌───────────────┐  │
│  │  Next.js App │   │  Email Parser│  │  Scheduler    │  │
│  │  (Frontend + │   │  (Isolated)  │  │  (BullMQ)     │  │
│  │   API)       │   │  Sandbox     │  │               │  │
│  └──────┬───────┘   └──────┬───────┘  └───────┬───────┘  │
│         │                  │                  │           │
│         ▼                  ▼                  ▼           │
│  ┌──────────────────────────────────────────────────┐    │
│  │           Message Queue (Redis/BullMQ)            │    │
│  └──────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│                    DATA LAYER (RESTRICTED)                  │
│  ┌──────────────────┐   ┌─────────────────────────────┐  │
│  │  PostgreSQL DB   │   │  Encrypted File Storage     │  │
│  │  (Encrypted at   │   │  (S3/MinIO with SSE)        │  │
│  │   rest, RLS)     │   │                             │  │
│  └──────────────────┘   └─────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### 1.3 Data Flow Diagram

```
User → [Auth/MFA] → Next.js App → [RBAC Check] → API Route
                                                      │
                                    [Audit Log] ◄────┤
                                                      ▼
                                               Prisma ORM
                                                      │
                                          [Encrypt Fields] ▼
                                               PostgreSQL

Email Sender → IMAP Inbox → Email Parser → [Sanitize] → Queue
                                                │
                                    [PDF Scanner] ◄──┤
                                                │
                                    [Confidence Check] ▼
                               ┌──── High ─────────────────────┐
                               │                               │
                           Auto-Register                 Manual Review Queue
                               │
                          [Audit Log]
                               │
                           PostgreSQL
```

---

## 2. STRIDE THREAT ANALYSIS

### 2.1 Spoofing (Identidade)

| ID | Ameaça | Ativo Afetado | Mitigação |
|----|--------|---------------|-----------|
| S1 | Atacante se passa por usuário legítimo | Autenticação | MFA obrigatório, session hardening |
| S2 | E-mail spoofing para injetar pagamentos falsos | Email Parser | SPF/DKIM/DMARC validation, sender allowlist |
| S3 | JWT forjado/alterado | API Routes | Assinatura HS256 com secret forte, rotação |
| S4 | CSRF — ação em nome do usuário | Formulários | CSRF tokens, SameSite=Strict cookies |
| S5 | Spoofing de fornecedor em PDF | Attachment Parser | Confiança mínima + revisão manual |

### 2.2 Tampering (Adulteração)

| ID | Ameaça | Ativo Afetado | Mitigação |
|----|--------|---------------|-----------|
| T1 | Alteração indevida de valor de pagamento | Payments DB | Audit trail imutável, diff de campos, RBAC |
| T2 | Modificação de job na fila (valor/vencimento) | BullMQ | Job signing, idempotency keys |
| T3 | SQL Injection via campos do formulário | Database | Prisma ORM (parameterized), Zod validation |
| T4 | Adulteração de anexo PDF para executar código | File Processor | Sandbox isolado, antimalware scan, tipo verificado |
| T5 | XSS em campos de texto livre (fornecedor, obs.) | Frontend | DOMPurify sanitização, CSP headers |
| T6 | Manipulação de parâmetros de paginação/filtro | API | Zod schema em todos query params |
| T7 | Injeção de headers HTTP via email (CRLF) | Email Parser | Strip CRLF, sanitização completa |

### 2.3 Repudiation (Repúdio)

| ID | Ameaça | Ativo Afetado | Mitigação |
|----|--------|---------------|-----------|
| R1 | Usuário nega ter alterado pagamento | Audit Log | Trilha imutável com userId, timestamp, IP, diff |
| R2 | Negação de aprovação/rejeição de pagamento | Workflow Log | Assinatura digital opcional de aprovações |
| R3 | "Não recebi o alerta" | Reminder Log | Log de envio com timestamp e destinatário |

### 2.4 Information Disclosure (Exposição)

| ID | Ameaça | Ativo Afetado | Mitigação |
|----|--------|---------------|-----------|
| I1 | Exposição de dados financeiros em logs | Logs | Mascaramento de valores sensíveis nos logs |
| I2 | IDOR — acesso a pagamento de outro tenant | API | Scoped queries por organizationId + userId |
| I3 | Dados sensíveis em URLs (valor, fornecedor) | HTTP | Nunca colocar dados sensíveis em GET params |
| I4 | Credenciais em variáveis de ambiente expostas | Infra | Vault/secrets manager, never in code |
| I5 | Dados em cache sem controle | Browser | Cache-Control: no-store em rotas financeiras |
| I6 | Stack trace em erros de produção | API Errors | Erros genéricos para cliente, detalhes só em log |
| I7 | Anexos acessíveis sem autenticação | File Storage | Signed URLs com expiração, autenticação obrigatória |

### 2.5 Denial of Service (Negação de Serviço)

| ID | Ameaça | Ativo Afetado | Mitigação |
|----|--------|---------------|-----------|
| D1 | Flood de requisições na API | API Routes | Rate limiting por IP + por usuário |
| D2 | Upload de PDF gigante para exaurir CPU | File Upload | Limite de tamanho (5MB), timeout de parsing |
| D3 | Envio massivo de e-mails para ingestão | Email Parser | Rate limit por remetente, queue depth limit |
| D4 | Criação massiva de pagamentos via API | Payments API | Rate limit + alertas de anomalia |
| D5 | Zip bomb em anexo | Attachment | Limite de tamanho descomprimido, timeout |

### 2.6 Elevation of Privilege (Escalada)

| ID | Ameaça | Ativo Afetado | Mitigação |
|----|--------|---------------|-----------|
| E1 | Usuário "Consulta" tenta aprovar pagamento | RBAC | Check de role em cada endpoint, server-side |
| E2 | JWT manipulation para alterar role | Auth | Role sempre buscada do banco, não do JWT |
| E3 | Acesso a rotas admin via URL direta | Routing | Middleware RBAC em todas rotas protegidas |
| E4 | Privilege escalation via email injection | Email | Sender validation, content sandboxing |
| E5 | Acesso a audit logs por não-admin | Audit API | Apenas Admin acessa logs completos |

---

## 3. ATTACK SURFACE ANALYSIS

### 3.1 Superfícies de Ataque Externas

| Superfície | Tipo | Risco | Controle |
|------------|------|-------|---------|
| `POST /api/auth/signin` | HTTP API | Alto | Rate limit 5/min, lockout, MFA |
| `POST /api/payments` | HTTP API | Alto | Auth + RBAC + validation + audit |
| `POST /api/email/ingest` | Webhook | Crítico | HMAC signature, sender validation |
| Upload de anexos | HTTP Form | Alto | MIME check, size limit, sandbox |
| IMAP Inbox | Email | Crítico | SPF/DKIM/DMARC, sender allowlist |
| Dashboard (GET) | HTTP | Médio | Auth + cache control |

### 3.2 Superfícies de Ataque Internas

| Superfície | Tipo | Risco | Controle |
|------------|------|-------|---------|
| PostgreSQL | DB | Crítico | Least privilege, TLS, no direct internet |
| Redis/BullMQ | Queue | Alto | Auth, bind localhost only |
| File Storage | FS/S3 | Alto | IAM roles, signed URLs, encryption |
| Environment Variables | Config | Crítico | Vault, no .env in repo |
| Admin Console | HTTP | Alto | IP allowlist + MFA |

---

## 4. RISK MATRIX

| Risco | Probabilidade | Impacto | Score | Prioridade |
|-------|--------------|---------|-------|-----------|
| SQL Injection | Baixa (Prisma ORM) | Crítico | Alto | P1 |
| Email Spoofing / Fraud | Média | Crítico | Alto | P1 |
| IDOR em pagamentos | Média | Alto | Alto | P1 |
| PDF malicioso / RCE | Baixa | Crítico | Alto | P1 |
| Credential Theft | Média | Alto | Alto | P1 |
| XSS em fields financeiros | Baixa (React) | Médio | Médio | P2 |
| Quebra de autenticação | Baixa (MFA) | Alto | Médio | P2 |
| Log injection | Média | Médio | Médio | P2 |
| DoS via upload | Baixa | Médio | Baixo | P3 |
| CSRF | Baixa (tokens) | Alto | Médio | P2 |

---

## 5. SECURITY REQUIREMENTS (OWASP ASVS 4.0)

### V1 — Architecture
- [x] Componentes isolados com interfaces bem definidas
- [x] Dados sensíveis nunca no frontend sem necessidade
- [x] Serviços com least privilege entre si

### V2 — Authentication
- [x] MFA obrigatório para todos os usuários
- [x] Senhas: bcrypt cost factor ≥ 12
- [x] Lockout após 5 tentativas falhas
- [x] Session timeout: 30min inatividade
- [x] Secure, HttpOnly, SameSite=Strict cookies

### V3 — Session Management
- [x] Session ID com 128+ bits de entropia
- [x] Regeneração de session após login
- [x] Invalidação total no logout
- [x] Concurrent session control

### V4 — Access Control
- [x] RBAC com 4 níveis: Admin, Financeiro, Aprovador, Consulta
- [x] Deny by default
- [x] Autorização verificada server-side em cada request
- [x] Auditoria de todas as tentativas de acesso negado

### V5 — Validation
- [x] Whitelist validation (não blacklist)
- [x] Validação de tipo, range, formato para todos os inputs
- [x] Rejeitação de caracteres de controle em campos de texto
- [x] Validação de MIME type por magic bytes (não só extensão)

### V12 — Files & Resources
- [x] Arquivos armazenados fora do webroot
- [x] Antimalware scan em uploads
- [x] Limite de tamanho rigoroso
- [x] Nomes de arquivo sanitizados

### V13 — API & Web Services
- [x] Rate limiting por endpoint
- [x] Autenticação em todos os endpoints
- [x] CORS restrito a origens conhecidas

### V14 — Configuration
- [x] CSP headers
- [x] HSTS com preloading
- [x] X-Frame-Options: DENY
- [x] Versão do framework nunca exposta

---

## 6. THIRD-PARTY RISK

| Componente | Risco | Mitigação |
|------------|-------|-----------|
| pdf-parse | RCE em PDF malicioso | Sandbox + timeout + size limit |
| imapflow | SSRF via IMAP redirect | Validate server host, TLS only |
| nodemailer | Header injection | Sanitizar todos os campos de e-mail |
| next-auth | Session vulnerabilities | Manter atualizado, revisar config |
| Redis | Data exposure | Autenticação, bind localhost, TLS |

---

## 7. COMPLIANCE CONSIDERATIONS

- **LGPD (Lei 13.709/2018)**: Dados de fornecedores são dados pessoais se PF
  - Minimização de dados
  - Prazo de retenção definido
  - Direito ao esquecimento (soft delete + purge schedule)
- **PCI-DSS**: Se houver dados de cartão no futuro — isolamento total
- **SOX/ITGC**: Trilha de auditoria para todas as transações financeiras
- **ISO 27001**: Controles de acesso, criptografia, incidentes

---

*Este documento deve ser revisado a cada mudança arquitetural significativa.*
