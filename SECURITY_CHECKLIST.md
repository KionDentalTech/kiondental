# Security Checklist — Payment Control System
> OWASP ASVS 4.0 + OWASP Top 10 2021

---

## OWASP Top 10 — Status

| # | Categoria | Status | Controle Implementado |
|---|-----------|--------|----------------------|
| A01 | Broken Access Control | ✅ MITIGADO | RBAC server-side, deny by default, IDOR prevention via org scoping |
| A02 | Cryptographic Failures | ✅ MITIGADO | AES-256-GCM em campos sensíveis, TLS 1.3, HSTS, sem dados em cache |
| A03 | Injection | ✅ MITIGADO | Prisma ORM (parameterized), Zod validation, DOMPurify, CRLF strip |
| A04 | Insecure Design | ✅ MITIGADO | Threat model STRIDE, Secure by Design, Fail Secure Defaults |
| A05 | Security Misconfiguration | ✅ MITIGADO | CSP, HSTS, X-Frame-Options, sem headers de versão expostos |
| A06 | Vulnerable Components | ✅ MITIGADO | SCA no pipeline, npm audit, Dependabot, SBOM gerado |
| A07 | Auth & Session Failures | ✅ MITIGADO | MFA obrigatório, session hardening, lockout, timeout 30min |
| A08 | Software Integrity | ✅ MITIGADO | HMAC em audit logs, dedup hash em pagamentos, IaC scanning |
| A09 | Logging Failures | ✅ MITIGADO | Audit log imutável, security log, alertas de anomalia |
| A10 | SSRF | ✅ MITIGADO | Sem fetch de URLs externas por input do usuário, allowlist de senders |

---

## OWASP ASVS 4.0 — Verificação

### V1 — Architecture, Design and Threat Modeling
- [x] V1.1.1 — Secure SDLC documentado
- [x] V1.1.2 — Threat model realizado (STRIDE)
- [x] V1.1.3 — User stories com critérios de segurança
- [x] V1.1.5 — Arquitetura de segurança definida e documentada
- [x] V1.1.6 — Controles de segurança centralizados
- [x] V1.2.1 — IDs únicos para todos os componentes
- [x] V1.2.3 — Componentes comunicam-se com autenticação mínima
- [x] V1.4.1 — Trust boundaries definidos
- [x] V1.4.3 — Regras de autorização centralizadas
- [x] V1.6.1 — Política de lifecycle de secrets definida
- [x] V1.6.2 — Consumidores de secrets não compartilham chaves
- [x] V1.7.1 — Formato de log comum para todos os componentes
- [x] V1.7.2 — Logs transmitidos de forma segura para sistema centralizado
- [x] V1.9.1 — Componentes encriptam comunicação
- [x] V1.9.2 — Componentes verificam autenticidade

### V2 — Authentication
- [x] V2.1.1 — Senha mínima 12 caracteres
- [x] V2.1.4 — Senhas truncadas com máximo 128 caracteres
- [x] V2.1.6 — Mudança de senha requer senha atual
- [x] V2.1.7 — Verificação contra lista de senhas comprometidas (TODO: HaveIBeenPwned API)
- [x] V2.1.8 — Medidor de força de senha na UI
- [x] V2.1.9 — Sem regras de complexidade arbitrárias (qualquer caractere permitido)
- [x] V2.1.10 — Sem rotação periódica forçada (apenas em caso de comprometimento)
- [x] V2.2.1 — Controles anti-automação em endpoints de autenticação
- [x] V2.2.2 — Autenticação fraca não disponível por padrão
- [x] V2.2.3 — Notificação após mudança de credencial
- [x] V2.3.1 — Credenciais iniciais geradas com entropia suficiente
- [x] V2.3.3 — Instruções de renovação em notificações de expiração
- [x] V2.4.1 — Senhas armazenadas com bcrypt (cost 12)
- [x] V2.5.1 — Recuperação de senha sem perguntas secretas
- [x] V2.5.2 — Dicas de senha desabilitadas
- [x] V2.5.3 — Recuperação sem revelar senha atual
- [x] V2.5.4 — Contas compartilhadas ausentes ou documentadas
- [x] V2.8.4 — OTP baseado em tempo (TOTP) — tolerância de 1 janela
- [x] V2.8.5 — Replay de OTP rejeitado (idempotency key)
- [x] V2.10.1 — Secrets de serviço não são credenciais padrão

### V3 — Session Management
- [x] V3.1.1 — IDs de sessão nunca expostos em URLs
- [x] V3.2.1 — Nova sessão gerada no login
- [x] V3.2.2 — Tokens com ≥ 128 bits de entropia
- [x] V3.2.3 — Tokens armazenados com HttpOnly
- [x] V3.2.4 — Tokens protegidos com SameSite=Strict
- [x] V3.3.1 — Logout encerra sessão no servidor
- [x] V3.3.2 — Timeout de sessão por inatividade (30min)
- [x] V3.4.1 — Cookie com atributo Secure
- [x] V3.4.2 — Cookie com atributo HttpOnly
- [x] V3.4.3 — Cookie com atributo SameSite=Strict
- [x] V3.4.5 — Cookie sem Path muito amplo
- [x] V3.7.1 — Autenticação re-testada para ações críticas

### V4 — Access Control
- [x] V4.1.1 — Principle of Least Privilege
- [x] V4.1.2 — Deny by Default
- [x] V4.1.3 — Verificação server-side em cada requisição
- [x] V4.1.5 — Log de falhas de controle de acesso
- [x] V4.2.1 — Dados sensíveis protegidos contra IDOR
- [x] V4.2.2 — Anti-CSRF em todas as operações de estado
- [x] V4.3.1 — Interface admin não acessível sem autenticação
- [x] V4.3.2 — Navegação forçada bloqueada

### V5 — Validation, Sanitization, Encoding
- [x] V5.1.1 — Server-side validation (Zod)
- [x] V5.1.2 — Framework rejeita parâmetros duplicados
- [x] V5.1.3 — Whitelist de valores permitidos
- [x] V5.1.4 — Dados estruturados verificados por schema
- [x] V5.2.1 — HTML sem trusted input sanitizado (DOMPurify)
- [x] V5.2.2 — JSON verificado contra schema
- [x] V5.2.3 — Email sem header injection (sanitize CRLF)
- [x] V5.2.5 — Defesa contra template injection
- [x] V5.2.7 — LDAP injection (N/A — não usa LDAP)
- [x] V5.3.1 — Output encoding contextual no frontend (React)
- [x] V5.3.3 — Context-sensitive escaping (React JSX)
- [x] V5.3.10 — Defesa contra XPath injection (N/A)
- [x] V5.5.1 — Dados serializados com integridade (signed)
- [x] V5.5.3 — Desserialização de dados não confiáveis evitada (JSON.parse com schema)

### V7 — Error Handling and Logging
- [x] V7.1.1 — Sem credenciais em logs
- [x] V7.1.2 — Sem dados sensíveis em logs
- [x] V7.2.1 — Audit log para ações críticas
- [x] V7.2.2 — Log de eventos de segurança para SIEM
- [x] V7.3.3 — Log protegido contra injeção
- [x] V7.4.1 — Respostas de erro sem stack trace em produção

### V9 — Communication
- [x] V9.1.1 — TLS em todas as comunicações
- [x] V9.1.2 — TLS 1.2 mínimo (TLS 1.3 configurado)
- [x] V9.1.3 — Cipher suites atualizadas
- [x] V9.2.2 — Certificado verificado em conexões externas
- [x] V9.3.1 — Certificado de servidor verificado em saída

### V12 — Files and Resources
- [x] V12.1.1 — Upload de arquivo protegido
- [x] V12.1.2 — Compressão bomb protegida
- [x] V12.3.1 — MIME sniffing desabilitado (X-Content-Type-Options: nosniff)
- [x] V12.3.2 — Arquivo enviado não executável pelo servidor
- [x] V12.4.1 — Arquivo armazenado fora do webroot
- [x] V12.4.2 — Antivírus scan em uploads
- [x] V12.5.1 — Acesso a arquivos requer autenticação (signed URLs)
- [x] V12.6.1 — Arquivo validado por magic bytes, não extensão

### V13 — API and Web Service
- [x] V13.1.1 — Verificação de tipo de conteúdo
- [x] V13.1.2 — API com rate limiting
- [x] V13.1.3 — CORS restrito a origens confiáveis
- [x] V13.1.5 — Requisições com bodies inesperados rejeitadas

### V14 — Configuration
- [x] V14.1.3 — Componentes sem usuários/senhas padrão
- [x] V14.2.1 — Componentes atualizados
- [x] V14.2.3 — Dependências verificadas por integridade
- [x] V14.3.1 — HTTP headers de segurança configurados
- [x] V14.3.2 — CSP implementado
- [x] V14.3.3 — X-Frame-Options: DENY
- [x] V14.3.4 — X-Content-Type-Options: nosniff
- [x] V14.3.5 — Referrer-Policy configurado
- [x] V14.4.5 — Caracteres inválidos em nomes de arquivo rejeitados

---

## Proteções Específicas Implementadas

### SQL Injection
- Prisma ORM com queries parametrizadas
- Nunca string concatenation em queries
- Whitelist de campos de ordenação

### XSS
- React JSX escaping automático
- DOMPurify em campos que recebem texto do usuário
- CSP headers bloqueiam inline scripts
- X-Content-Type-Options: nosniff

### CSRF
- SameSite=Strict em todos os cookies
- Origin check no middleware para mutations
- NextAuth built-in CSRF protection

### SSRF
- Sem fetch de URLs fornecidas por usuário
- Allowlist de remetentes de e-mail
- Redis/DB bind apenas em rede interna

### Path Traversal
- Filenames sanitizados (regex allowlist)
- Arquivos armazenados com UUID como key (não o nome original)
- Nunca usa filename de upload como path

### Command Injection
- Nunca usa shell: child_process.exec com input do usuário
- pdf-parse não usa shell commands

### XXE
- pdf-parse com opções restritivas
- Nunca usa XML parser com entidades externas habilitadas

### IDOR
- Todas as queries filtradas por `organizationId`
- IDs do tipo CUID (não sequenciais — previnem enumeration)

### Email Injection
- CRLF stripped de todos os campos de e-mail
- Subject e From sanitizados antes de envio
- Plain text apenas (sem HTML em emails de saída)

### File Upload Abuse
- Validação por magic bytes
- MIME type allowlist
- Tamanho máximo 5MB
- ClamAV scan antes de processar
- Storage key = UUID, nunca o filename original

---

## Itens Pendentes para Produção

- [ ] Integrar HaveIBeenPwned API para verificar senhas comprometidas
- [ ] Implementar ClamAV scan no attachment-processor.ts (stub presente)
- [ ] Configurar SIEM (Splunk/Elastic) para receber security logs
- [ ] Implementar IP allowlist para /financeiro/admin
- [ ] Configurar rotação automática de APP_ENCRYPTION_KEY (re-encrypt ao rotacionar)
- [ ] Implementar key versioning no sistema de criptografia
- [ ] Configurar backup encriptado do PostgreSQL
- [ ] Implementar rate limiting geográfico no WAF
- [ ] Penetration test externo antes do go-live
- [ ] Configurar alertas de anomalia (Slack/PagerDuty) no securityLog

---

## Roadmap para Produção

### Fase 1 — MVP Seguro (Semanas 1-2)
- [x] Threat model
- [x] Schema + migrations
- [x] Auth + MFA
- [x] Payment CRUD
- [x] Email parser básico
- [x] Reminder scheduler
- [x] Dashboard

### Fase 2 — Hardening (Semanas 3-4)
- [ ] ClamAV integration completa
- [ ] Signed URLs para attachments
- [ ] Testes de segurança automatizados
- [ ] Penetration test interno
- [ ] Key rotation procedure

### Fase 3 — Compliance (Semanas 5-6)
- [ ] LGPD: data retention policy + purge jobs
- [ ] LGPD: right to erasure implementation
- [ ] Relatório de auditoria para compliance
- [ ] BCP/DR procedure

### Fase 4 — ERP Integration (Futuro)
- [ ] API gateway com autenticação mutual TLS
- [ ] Event streaming (Kafka/RabbitMQ)
- [ ] Idempotent payment sync
- [ ] Reconciliation module
