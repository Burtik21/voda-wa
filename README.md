
REGISTER FIRMA:
curl -X POST http://localhost:3000/voda/auth/register -H "Content-Type: application/json" -d "{"name":"Firma", "email":"firma@firma.cz", "password":"firma"}"

LOGIN FIRMA:
curl -X POST http://localhost:3000/voda/auth/login-firm -H "Content-Type: application/json" -d "{\"email\":\"firma@firma.cz\", \"password\":\"firma\"}"

LOGIN ZAKAZNIK:
curl -X POST http://localhost:3000/voda/auth/login-customer -H "Content-Type: application/json" -d "{\"email\":\"jan.novak10@example.com\", \"password\":
\"78650c0b848629d1\"}"

ODHLASENI:
curl -X POST http://localhost:3000/voda/auth/logout -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJqYW4ubm92YWsxMEBleGFtcGxlLmNvbSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTczNjc4ODg2OSwiZXhwIjoxNzM2NzkyNDY5fQ.epkLT48DG_pmkxjclhkkTICEhZsCsRT6BEcY8dR7Jsk"

ODSTRANENI ZAKAZNIKA:
curl -X DELETE http://localhost:3000/voda/firm/delete-customer -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmaXJtYUBmaXJtYS5jeiIsInJvbGUiOiJmaXJtIiwiaWF0IjoxNzM2Nzg4NjkyLCJleHAiOjE3MzY3OTIyOTJ9.kXagB4PUBLv7xJiGLE3aW5geJbWEJigE1MYwFd7Wq58" -H "Content-Type: application/json" -d "{\"email\":\"jan.novak20@example.com\"}"

VYTVORENI ZAKAZNIKA:
curl -X POST http://localhost:3000/voda/firm/add-customer -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmaXJtYUBmaXJtYS5jeiIsInJvbGUiOiJmaXJtIiwiaWF0IjoxNzM2Nzg4Mjc4LCJleHAiOjE3MzY3OTE4Nzh9.KpUUqrT8t4syvAaHO2CPe8s90cc1D3VmjfQ28CNsu7I" -H "Content-Type: application/json" -d "{\"name\":\"Jan Novák\", \"email\":\"jan.novak20@example.com\", \"address\":\"Ulice 123, Praha\"}"

PRIDANI MĚŘIČE:
curl -X POST http://localhost:3000/voda/customer/add-meter -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJqYW4ubm92YWsxMEBleGFtcGxlLmNvbSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTczNjc4ODg2OSwiZXhwIjoxNzM2NzkyNDY5fQ.epkLT48DG_pmkxjclhkkTICEhZsCsRT6BEcY8dR7Jsk" -H "Content-Type: application/json" -d "{\"property_id\":1, \"type\":\"water\", \"serial_number\":\"SK123456\"}"

PRIDANI ODECTU:
curl -X POST http://localhost:3000/voda/customer/add-reading -H "Authorization: Bearer TVŮJ_JWT_TOKEN" -H "Content-Type: application/json" -d "{\"meter_id\":1, \"value\":150.75, \"reading_date\":\"2024-01-15\"}"


STAHNUTI REPORTU:
curl -X GET "http://localhost:3000/voda/report/download-report/1?format=csv" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJqYW4ubm92YWsxMEBleGFtcGxlLmNvbSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTczNjc4NjM2NCwiZXhwIjoxNzM2Nzg5OTY0fQ.QRFYneoDbw0IgGG0ACuv2tp01rlhGqJRnI-ELQKfIuw"














