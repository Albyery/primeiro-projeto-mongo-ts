import mongoose from "mongoose";

// Criação de função para criar conexão com mongodb
export async function connectDB(uri: string){
    await mongoose.connect(uri);
    console.log("MongoDB conectado com sucesso!");
}