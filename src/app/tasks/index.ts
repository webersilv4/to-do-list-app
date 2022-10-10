import { Request, Response } from 'express';
import tasksSchema from '../../database/models/tasks.schema';

/* 
* Crinado Uma Nova Tarefa
*/
export const createTask = async (req: Request, res: Response) => {

    const { userId, title, description, hour } = req.body;
    const date = req.body.allTasks[0].date;

    await tasksSchema.findOne({ userId })
        .then(response=>{
            
            // Verifica Se Existe ao menos uma tarefa
            if (response === null)
                tasksSchema.create(req.body)
                    .then(()=> res.json({ success: 'Tarefa criada com sucesso' }))
                    .catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente' }));

            //Verificando se existe uma tarefa com essa data, Caso não exista ele cria uma nova tarefa
            tasksSchema.findOne({ userId, 'allTasks.date': date })
                .then(response=>{ 
                    if (response !== null)
                        response?.allTasks.forEach((element) => {

                            const { id }: any = element; // Pegando Id da data expecifica
                
                            if (element.date === date) 
                                tasksSchema.updateOne({ userId, 'allTasks._id': id }, 
                                    {
                                        $push: {'allTasks.$.tasks': { 
                                            title, description, hour
                                        }}
                                    })
                                    .then(() => res.json({ success: 'Tarefa criada com sucesso' }))
                                    .catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente' }));
                        });
                    else
                        tasksSchema.updateOne({ userId }, { $push: { allTasks: req.body.allTasks }})
                            .then(() => res.json({ success: 'Tarefa criada com sucesso' }))
                            .catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente' }));

                }).catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente' }));

        }).catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente' }));

};


/* 
* Listando Todas Tarefas
*/
export const listAllTasks = async (req: Request, res: Response) => {

    const { userId } = req.params;

    // Exibe Todas tarefas do usuario
    await tasksSchema.findOne({ userId })
        .then(response=> res.json(response))
        .catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente' }));

};