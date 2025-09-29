import app from "./app";
import { connectDB } from "./db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tacii_db';


async function conexao(){
    await connectDB(MONGO_URI);
    app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));
}


conexao().catch((err) => {
    console.log("Erro ao iniciar: ", err);
})
