
const http = require("http");

const warehouses = [
    { Name: "Kho Hà N?i - C?u Gi?y", Address: "Khu c�ng nghi?p T? Li�m, C?u Gi?y, H� N?i", Capacity: 800000 },
    { Name: "Kho �� N?ng - H?i Ch�u", Address: "�u?ng 2/9, H?i Ch�u, �� N?ng", Capacity: 300000 },
    { Name: "Kho C?n Tho - Ninh Ki?u", Address: "KCN Tr� N�c, Ninh Ki?u, C?n Tho", Capacity: 200000 },
    { Name: "Kho �?ng Nai - Bi�n H�a", Address: "KCN Amata, Bi�n H�a, �?ng Nai", Capacity: 600000 }
];

async function seedWarehouses() {
    for (const w of warehouses) {
        const data = JSON.stringify(w);
        const options = {
            hostname: "localhost",
            port: 5005,
            path: "/api/Warehouse",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data)
            }
        };

        await new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                let responseData = "";
                res.on("data", chunk => responseData += chunk);
                res.on("end", () => {
                    console.log("Created " + w.Name + ": " + res.statusCode);
                    resolve();
                });
            });
            req.on("error", reject);
            req.write(data);
            req.end();
        });
    }
}

seedWarehouses().catch(console.error);

