import { Request, Response } from 'express';
import tasksSchema from '../../database/models/tasks.schema';

/* 
* Crinado Uma Nova Tarefa
*/
export const createTask = async (req: Request, res: Response) => {

    const { userId } = req.body;
    const { title, description, hour } = req.body.allTasks[0].tasks[0];
    const date = req.body.allTasks[0].date;

    await tasksSchema.findOne({ userId })
        .then(response=>{
            
            // Verifica Se Existe ao menos uma tarefa
            if (response === null)
                tasksSchema.create(req.body)
                    .then(()=> res.json({ success: 'Tarefa criada com sucesso' }))
                    .catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente' }));
            else
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
                                .then(() => res.json({ success: 'Tarefa criada com sucesso 2' }))
                                .catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente' }));

                    }).catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente' }));

        }).catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente' }));

};


/* 
* Listando Todas Tarefas
*/
export const listAllTasks = async (req: Request, res: Response) => {

    const { userId } = req.params;


    await tasksSchema.aggregate([ 
        {$match: { userId }}, {$unwind: '$allTasks'}, 
        { $sort: {'allTasks.date' : 1}},
        { $group: {_id: '$_id',
            allTasks: { $push: '$allTasks' }}}
    ])
        .then(response=> res.json(response))
        .catch(()=> res.status(400).json({ error: 'Algo deu errado tente novamente 3' }));
};

/* 
* Deletando Tarefa Expecifica
*/
export const deleteOneTask = async (req: Request, res: Response) => {

    /* 
    * userId: 'ID do usuario'
    * dateId: 'ID que identifica a data especifica'
    * elementId: 'ID que especifica a tarefa'
    */
    const { userId, dateId, taskId } = req.body;

    await tasksSchema.updateOne({ userId, 'allTasks._id': dateId }, 
        {
            $pull: { 'allTasks.$.tasks':  { _id: taskId } } 
        })
        .then(() => res.json({ success: 'Item deletado com sucesso' }))
        .catch(() => res.status(400).json({ error: 'Algo deu errado tente novamente' }));

};


/* 
* Deletando Tarefa Expecifica
*/
export const completeOneTask = async (req: Request, res: Response) => {

    /* 
    * userId: 'ID do usuario'
    * dateId: 'ID que identifica a data especifica'
    * elementId: 'ID que especifica a tarefa'
    */
    const { userId, taskId } = req.body.data;

    await tasksSchema.updateOne({ userId, 'allTasks.tasks._id': taskId }, 
        {
            $set: { 'allTasks.$.tasks.$[id].taskComplete': true }, 
        },{ arrayFilters: [{'id._id': taskId}] })
        .then(() => res.json({ success: 'Item alterado com sucesso' }))
        .catch(() => res.status(400).json({ error: 'Algo deu errado tente novamente' }));
};