# Como subir a Fase 2 no GitHub

## 1. Criar repositório

Nome:

```text
mindlink-painel-demencia-brasil
```

Descrição:

```text
Protótipo técnico demonstrativo do painel analítico-preditivo de demência no Brasil.
```

## 2. Upload pelo navegador

1. Descompacte o ZIP.
2. Entre no repositório vazio.
3. Clique em **Add file > Upload files**.
4. Arraste todos os arquivos e pastas de dentro da pasta descompactada.
5. Commit:

```text
feat: publica prototipo tecnico mindlink fase 2
```

## 3. Ativar Pages

1. Settings
2. Pages
3. Build and deployment
4. Source: GitHub Actions
5. Aguarde a aba Actions ficar verde.

## 4. Erro comum: tela branca

Confira `vite.config.js`.

Se o repositório tiver outro nome, altere:

```js
base: '/mindlink-painel-demencia-brasil/',
```
