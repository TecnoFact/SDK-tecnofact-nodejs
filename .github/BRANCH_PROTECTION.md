# Configuración de Protección de Ramas

## ⚠️ Estado Actual
- **Repositorio**: Público
- **Rama principal**: `main`
- **Protección**: ❌ NO CONFIGURADA

## 🔒 Configuración Recomendada para Branch Protection

### Configuración Mínima Requerida

Para proteger la rama `main` en un repositorio público, se recomienda:

#### 1. **Require Pull Request Reviews**
```
✅ Require a pull request before merging
✅ Require approvals: 1 (mínimo)
✅ Dismiss stale pull request approvals when new commits are pushed
✅ Require review from Code Owners (si tienes CODEOWNERS)
```

#### 2. **Require Status Checks**
```
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging

Status checks requeridos:
  - test (Node.js 20.x)
  - build
  - lint
```

#### 3. **Require Conversation Resolution**
```
✅ Require conversation resolution before merging
```

#### 4. **Require Signed Commits** (Opcional pero recomendado)
```
✅ Require signed commits
```

#### 5. **Include Administrators**
```
✅ Include administrators
   (Los administradores también deben seguir estas reglas)
```

#### 6. **Restrict Pushes**
```
✅ Restrict who can push to matching branches
   (Solo permitir a través de Pull Requests)
```

#### 7. **Allow Force Pushes**
```
❌ Do not allow force pushes
```

#### 8. **Allow Deletions**
```
❌ Do not allow deletions
```

## 🛠️ Cómo Configurar (Opción 1: GitHub UI)

1. Ve a: `https://github.com/TecnoFact/SDK-tecnofact-nodejs/settings/branches`
2. Click en "Add branch protection rule"
3. En "Branch name pattern" escribe: `main`
4. Configura las opciones según lo recomendado arriba
5. Click en "Create" o "Save changes"

## 🛠️ Cómo Configurar (Opción 2: GitHub CLI)

```bash
# Configurar protección básica
gh api repos/TecnoFact/SDK-tecnofact-nodejs/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["test (20.x)","build"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":1}' \
  --field restrictions=null \
  --field required_linear_history=false \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

## 🛠️ Cómo Configurar (Opción 3: Terraform)

```hcl
resource "github_branch_protection" "main" {
  repository_id = "SDK-tecnofact-nodejs"
  pattern       = "main"

  required_status_checks {
    strict   = true
    contexts = ["test (20.x)", "build"]
  }

  required_pull_request_reviews {
    dismiss_stale_reviews           = true
    require_code_owner_reviews      = false
    required_approving_review_count = 1
  }

  enforce_admins                  = true
  require_conversation_resolution = true
  require_signed_commits          = true
  
  allows_deletions    = false
  allows_force_pushes = false
}
```

## 📋 Configuración Adicional Recomendada

### CODEOWNERS File
Crear `.github/CODEOWNERS`:
```
# Propietarios del código
* @TecnoFact/sdk-maintainers

# Archivos críticos
/package.json @TecnoFact/sdk-admins
/.github/ @TecnoFact/sdk-admins
/src/config/ @TecnoFact/sdk-admins
```

### Rulesets (Nueva funcionalidad de GitHub)
Considera usar GitHub Rulesets para protección más granular:
- `Settings` → `Rules` → `Rulesets`
- Permite reglas más específicas por tipo de archivo o patrón

## 🔐 Seguridad Adicional

### 1. Secrets Scanning
```
✅ Habilitar en: Settings → Security → Code security and analysis
✅ Secret scanning
✅ Push protection
```

### 2. Dependabot
```
✅ Dependabot alerts
✅ Dependabot security updates
✅ Dependabot version updates
```

### 3. Code Scanning (CodeQL)
```
✅ Ya configurado en .github/workflows/codeql.yml
```

### 4. Private Vulnerability Reporting
```
✅ Habilitar en: Settings → Security → Private vulnerability reporting
```

## ⚡ Acción Inmediata Requerida

**CRÍTICO**: Configurar protección de rama `main` ANTES de hacer el repositorio completamente público o antes de la primera release.

### Comando Rápido (Configuración Básica)

```bash
gh api repos/TecnoFact/SDK-tecnofact-nodejs/branches/main/protection \
  --method PUT \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["test (20.x)", "build"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
EOF
```

## 📚 Referencias

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/getting-started/securing-your-repository)
