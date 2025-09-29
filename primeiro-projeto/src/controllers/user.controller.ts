import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import bcrypt from "bcrypt";

export async function createUser(req: Request, res: Response){
    try {
        /// { name: "Gustavo"   
        ///   email: "rf1482"
        //    password: "QueroFerias"
        //   }
        const { name, email, password } = req.body; 

        // verificar se existe o email no banco de dados
        const exists = await UserModel.findOne({ email })
        if (exists) return res.status(400).json({error: "E-mail já cadastrado"})
        
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await UserModel.create({ name, email, passwordHash });

        res.status(200).json({
            data: {id: user._id, name: name, email: email, createAt: user.createAt, updateAt: user.updateAt}
        })

    } catch(e){
        console.log("Ocorreu um erro: ", e)
        res.status(500).json({ error: "Erro ao criar usuário!" });
    }

}

export async function listUser(req: Request, res: Response) {
    const users = await UserModel.find({})
    // console.log(users)
    res.json({ data: users.map(obj => ({id: obj._id, name: obj.name, email: obj.email, createAt: obj.createAt, updateAt: obj.updateAt}) ) });
}

export async function updateUser(req: Request, res: Response){
    const { name, email, password } = req.body;
    const id = req.params.id;
    // { UPDATE
    //     "name": "Gustavo",
    //     "email": "",
    //     "password": ""
    // }
    // objeto que vamos armazenar as modificações
    const updates: any = {};
    // validação dos campos enviados por parâmetro
    if (email !== undefined) {
        updates.email = email;
    }
    if (name !== undefined){
        updates.name = name;
    }
    if (password !== undefined) {
        const passwordHash = await bcrypt.hash(password, 10)
        updates.password = passwordHash;
    }

    const user = await UserModel.findByIdAndUpdate(id, updates, {new: true});
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
    res.json({ data: {id: user._id, name: user.name, email: user.email, createAt: user.createAt, updateAt: user.updateAt} });
}

export async function deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
    res.json({ data: {id: user._id, name: user.name, email: user.email, createAt: user.createAt, updateAt: user.updateAt} });
}