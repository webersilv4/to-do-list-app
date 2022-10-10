interface ITaskSchema {
    id?: string;
    userId: {
        type: string,
        required: true,
    },
    firstName: string;
    lastName: string;
    allTasks: [{
        date: string;  
        id?: string;
        tasks: [{
            title: string;
            description: string;
            hour: string;
            taskComplete: boolean;
        }]
    }]
}