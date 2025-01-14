# 📄 Voda API - Dokumentace

## ⚙️ **Postup pro práci s API**

1. **Registrace firmy nebo zákazníka**
   - Firma/ se nejprve **zaregistruje** poté **přihlásí**.
   - Po přihlášení. může firma zaregistrovat zákazníka

2. **Po přihlášení dostane firma/zákazník  JWT token**
   - Tento token je potřeba **zasílat v hlavičce Authorization** při každém požadavku.
   - Formát: `Authorization: Bearer SEM_VLOZ_SVŮJ_TOKEN`

3. **Použití API endpointů**
   - Jednotlivé endpointy slouží pro správu zákazníků, měřidel a odečtů.
   - Commandy níže jsou na cmd ( ne powershell ) pomocí curl
   - HTML formulář (zatím né moc funkční) slouží k přidání/upravení  měřičů a odečtů


---

## 🔐 **Autentizační endpointy**

### ✅ **Registrace firmy**
```bash
curl -X POST https://sajmiho.lol/voda/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Firma\", \"email\":\"firma@firma.cz\", \"password\":\"vaseheslo\"}" --insecure
```

### 🔑 **Přihlášení firmy**
```bash
curl -X POST https://sajmiho.lol/voda/auth/login-firm -H "Content-Type: application/json" -d "{\"email\":\"firma@firma.cz\", \"password\":\"vaseheslo\"}" --insecure
```

### 🔑 **Přihlášení zákazníka**
```bash
curl -X POST https://sajmiho.lol/voda/auth/login-customer -H "Content-Type: application/json" -d "{\"email\":\"zakaznik@example.com\", \"password\":\"vaseheslo\"}" --insecure
```

### 🚪 **Odhlášení**
```bash
curl -X POST https://sajmiho.lol/voda/auth/logout -H "Authorization: Bearer SEM_VLOZ_SVŮJ_TOKEN" --insecure
```

---

## 👥 **Správa zákazníků (pouze firma)**

### ➕ **Vytvoření zákazníka**
```bash
curl -X POST https://sajmiho.lol/voda/firm/add-customer -H "Authorization: Bearer SEM_VLOZ_SVŮJ_TOKEN" -H "Content-Type: application/json" -d "{\"name\":\"Jan Novák\", \"email\":\"zakaznik@example.com\", \"address\":\"Ulice 123, Praha\"}" --insecure
```

### ❌ **Odstranění zákazníka**
```bash
curl -X DELETE https://sajmiho.lol/voda/firm/delete-customer -H "Authorization: Bearer SEM_VLOZ_SVŮJ_TOKEN" -H "Content-Type: application/json" -d "{\"email\":\"zakaznik@example.com\"}" --insecure
```

---

## 📟 **Správa měřidel a odečtů (pouze zákazník)**

### ➕ **Přidání měřidla**
```bash
curl -X POST https://sajmiho.lol/voda/customer/add-meter -H "Authorization: Bearer SEM_VLOZ_SVŮJ_TOKEN" -H "Content-Type: application/json" -d "{\"type\":\"water\", \"serial_number\":\"SK123456\"}" --insecure
```

### ✏️ **Úprava měřidla**
```bash
curl -X POST https://sajmiho.lol/voda/customer/edit-meter -H "Authorization: Bearer SEM_VLOZ_SVŮJ_TOKEN" -H "Content-Type: application/json" -d "{\"old_serial_number\":\"SK123456\", \"new_serial_number\":\"SK654321\", \"type\":\"warm\"}" --insecure
```

### ➕ **Přidání odečtu**
```bash
curl -X POST https://sajmiho.lol/voda/customer/add-reading -H "Authorization: Bearer SEM_VLOZ_SVŮJ_TOKEN" -H "Content-Type: application/json" -d "{\"serial_number\":\"SK123456\", \"value\":150.75, \"reading_date\":\"2024-01-15\"}" --insecure
```

### ✏️ **Úprava odečtu**
```bash
curl -X POST https://sajmiho.lol/voda/customer/edit-reading -H "Authorization: Bearer SEM_VLOZ_SVŮJ_TOKEN" -H "Content-Type: application/json" -d "{\"reading_id\":1, \"value\":200.00, \"reading_date\":\"2024-01-20\"}" --insecure
```

---

## 📥 **Stažení reportu**

### 📄 **Stažení reportu ve formátu CSV**
```bash
curl -X GET "https://sajmiho.lol/voda/report/download-report/1?format=csv" -H "Authorization: Bearer SEM_VLOZ_SVŮJ_TOKEN" --insecure
```

### 📄 **Stažení reportu ve formátu JSON**
```bash
curl -X GET "https://sajmiho.lol/voda/report/download-report/1?format=json" -H "Authorization: Bearer SEM_VLOZ_SVŮJ_TOKEN" --insecure
```

## TEST ÚČTY
### **ZÁKAZNÍK**
```bash
curl -X POST https://sajmiho.lol/voda/auth/login-customer -H "Content-Type: application/json" -d "{\"email\":\"jan.novak10@example.com\", \"password\":
\"78650c0b848629d1\"}" --insecure
```
### **FIRMA**
```bash
curl -X POST https://sajmiho.lol/voda/auth/login-firm -H "Content-Type: application/json" -d "{\"email\":\"firma@firma.cz\", \"password\":\"firma\"}" --insecure

```




🚀 **Voda API je připraveno pro použití!**

