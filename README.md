# 📄 DocReview

**DocReview** é uma plataforma que permite realizar o upload de documentos com imagens, extrair automaticamente os textos contidos neles via OCR, interpretar essas informações com inteligência artificial e ainda interagir com o conteúdo através de um chat baseado em IA.

🔗 Acesse a versão em produção: [https://doc-review-theta.vercel.app](https://doc-review-theta.vercel.app)

conta de testes:

```bash
teste123@gmail.com
teste123
```

---

## 🚀 Funcionalidades

- Upload de documentos com imagem
- Extração automática de texto via OCR
- Interpretação semântica com IA (LLM)
- Chat com IA sobre o conteúdo do documento
- Histórico de interações por documento

---

## 🧑‍💻 Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/rodrigoacm10/doc-review.git
```

---

### 2. Backend

```bash
cd back
```

#### ▶️ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz da pasta `/back` com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://docreview_owner:npg_BqcSPoft0I7T@ep-late-truth-ac5tgm3x-pooler.sa-east-1.aws.neon.tech/docreview?sslmode=require"
JWT_SECRET="algum_segredo_forte"
OPENAI_API_KEY="sk-proj-..." # chave disponível no Drive enviado ou substitua pela sua chave da OpenAI
FRONTEND_ORIGIN="http://localhost:5173" # ou a porta do seu front-end
```

#### ▶️ Instale as dependências e rode o servidor

```bash
npm install
npm run start:dev
```

---

### 3. Frontend

Abra um novo terminal:

```bash
cd front
```

#### ▶️ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz da pasta `/front` com o seguinte conteúdo:

```env
NEXT_PUBLIC_API_URL='http://localhost:3000' # ajuste se seu backend estiver rodando em outra porta
```

#### ▶️ Instale as dependências e rode o front

```bash
npm install
npm run dev
```

---

## ✅ Pronto!

Acesse [http://localhost:5173](http://localhost:5173) no seu navegador e aproveite o **DocReview** rodando localmente!

---

## 🛠 Tecnologias utilizadas

- **Frontend:** Next.js, React, TailwindCSS, ShadCN UI
- **Backend:** NestJS, Prisma, PostgreSQL, JWT
- **OCR e IA:** Tesseract OCR, OpenAI GPT
- **Outros:** React Query, Lucide Icons, Toasts com Sonner

---

## ✨ Desenvolvedor

Feito com 💻 por **Rodrigo Andrade**

[LinkedIn](https://www.linkedin.com/in/rodrigo-andrade-5420b2277/) · [GitHub](https://github.com/rodrigoacm10)
