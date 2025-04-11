---  

# Medusa Documents (Arabic Support Fork)

A plugin for **Medusa.js** that generates PDF documents (e.g., invoices, packing slips) with **added Arabic language support**.

**Forked from:** [`@rsc-labs/medusa-documents-v2`](https://github.com/RSC-Labs/medusa-documents) (MIT Licensed)  
**Key Addition:** Full RTL (Right-to-Left) layout and Arabic translation for invoices.

---

## 📜 Supported Documents
| Name         | Status             | Arabic Support |
| ------------ | ------------------ | -------------- |
| Invoice      | ✅                 | ✅             |

---

## 🚀 Installation
1. Install the plugin via `package.json`:
```json
"dependencies": {
  "medusa-documents-arabic": "0.0.1"
}
```
Run `yarn install` or `npm install`.

2. **Required Fix** (Medusa Issue #11248):  
   Add to `medusa-config.js`:
```js
admin: {
  vite: {
    optimizeDeps: {
      include: ["@emotion/react", "react-table"]
    }
  }
}
```

4. Run migrations:
```bash
npx medusa db:migrate
```

## 🖼️ Screenshots
**Arabic Invoice Preview:**  
![Arabic Invoice Preview](https://github.com/specture48/medusa-documents-arabic/raw/main/docs/arabic-invoice.png)

---

## ❓ FAQ
**Q: Does this fork store generated documents?**  
A: No—like the original, documents are generated on-demand from the latest order data.

**Q: How to reset invoice numbering?**  
A: Use `Forced number` in `Settings > Invoice`.

---

## 📜 License
MIT (Original work © RSC Labs).  
**This fork retains all original license terms.**

---

## 💡 Contributing
- **Issues/PRs:** Welcome! Report bugs or suggest improvements [here](https://github.com/your-username/medusa-documents-arabic).
- **Want more languages?** Add translations via JSON files.

---

**⚠️ Note:** This is a community fork. For advanced features (e.g., auto-emailing invoices), consider the original [Pro Version](https://github.com/RSC-Labs/medusa-documents#pro-version).

