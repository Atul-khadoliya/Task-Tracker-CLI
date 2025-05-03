const fs = require('fs') ;
const { parse } = require('path');
const { stringify } = require('querystring');
const filePath = "./task.json" ;


function initializeFile(){
    if(!fs.existsSync(filePath))
    fs.writeFileSync(filePath,'[]','utf8')
}

function readTasks() {
    initializeFile() ;
    const data = fs.readFileSync(filePath,'utf8') ;
    return JSON.parse(data) ;
}

function writeTasks(tasks) {
    fs.writeFileSync(filePath,JSON.stringify(tasks,null,2),'utf8')
}

function addTask(description){
    const tasks = readTasks() ;
    const id = tasks.length ? tasks[tasks.length-1].id+1: 1 ;
    const now = new Date().toISOString() ;

    tasks.push({
       id,
       description,
       createdAt : now,
       updatedAt :now 
    }) ;
    writeTasks(tasks) ;
    console.log("kr diya ji")
}

function updateTask(id,newDescription){
    const tasks = readTasks() ;
    const task = tasks.find(t=>t.id===id) ;
    if(!task) console.log('task does not exist') ;
    task.description = newDescription ;
    task.updatedAt = new Date().toISOString() ; 
    writeTasks(tasks) ;
    console.log("kr diya ji") ;
}
function deleteTask(id){
    let tasks = readTasks() ;
    const len = tasks.length ;
    tasks = tasks.filter(t=>t.id!=id) ;
    if(len===tasks.length) console.log('task not found the with id') ;

    writeTasks(tasks) ;
    console.log('deleted the task') ;
}
function markStatus(id,newStatus){
    const tasks = readTasks() ;
    const task = tasks.find(t=>t.id===id) ;
    if(!task) console.log('task does not exist') ;
    task.status = newStatus ;
    task.updatedAt = new Date().toISOString() ; 
    writeTasks(tasks) ;
    console.log("kr diya ji") ;
}

function listTasks(filter=null){
    let tasks = readTasks() ;
    tasks = tasks.filter(t=>t.status==filter) 
    if(tasks.length===0){
        console.log('no task with the current status') ;
        return ;
    }
    tasks.forEach(t => {
        console.log(`[${t.id}] (${t.status}) ${t.description}`);
    });
}

const [,,commnd,...arrgs] = process.argv ;
switch(commnd){
    case 'add' : 
    if(!arrgs[0]) return console.log("please provide the argument to add")
    addTask(arrgs.join(' ')) ;
    break ;

    case 'update':
    updateTask(parseInt(arrgs[0]),arrgs.slice(1).join(' '))
    break ;

    case 'delete' :
    deleteTask(parseInt(arrgs[0]))
    break ;

    case 'list' :
    listTasks(arrgs[0])
    break ;

    case 'mark-in-progress' :
    markStatus(parseInt(arrgs[0]),'in-progress')
    break ;

    case 'mark-done':
    markStatus(parseInt(arrgs[0]),'done')
    break ;

    default :
    console.log('Invalid command')
}