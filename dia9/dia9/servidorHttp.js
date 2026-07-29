import http from "http";

const servidor = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Hola Mundo");
});

const PORT = 3000;

servidor.listen(PORT, () => {
    console.log(`Servidor HTTP ejecutándose en http://localhost:${PORT}`);
});