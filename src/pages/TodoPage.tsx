
import { useEffect, useState, type ChangeEvent } from "react"
import { v4 as uuidv4 } from 'uuid';
import { CreateNewTodo } from "../components/CreateNewTodo";
import { TodoList } from "../components/TodoList";


export type TodoTypee = {id: string; name: string; isCompleted: boolean};
export const TodoPage = () => {
  const [todoList, setTodoList] = useState<TodoTypee[]>(()=>{
    const savedTodoList = JSON.parse(localStorage.getItem('todoList')?? '[]');
    if(savedTodoList?.length){
      return savedTodoList;
    }

    return [];
  });
  const [newTodoString, setNewTodoString] = useState('');

  const newToDoChange = (e: ChangeEvent<HTMLInputElement>) =>{
console.log({e})
setNewTodoString(e.target.value)
}

const onAddingBtnClick = () =>{
  const newTodoItem: TodoTypee = {
    id: uuidv4(),
    name: newTodoString,
    isCompleted: false
  }
  setTodoList([newTodoItem, ...todoList])
  setNewTodoString('');

}

const updateIsCompleted = (todoId: string) =>{
setTodoList((prevState)=>{
return prevState.map((todo)=>{
if(todo.id === todoId){
return {...todo, isCompleted : !todo.isCompleted}
}
return todo;
})
})
}

useEffect(()=>{
localStorage.setItem('todoList', JSON.stringify(todoList));
}, [todoList]);

console.log(newTodoString)



  return (
    <>
      <CreateNewTodo newTodoString= {newTodoString} newToDoChange = {newToDoChange} onAddingBtnClick = {onAddingBtnClick}/>
      <TodoList todoList = {todoList} updateIsCompleted = {updateIsCompleted}/>
    </>
  );
}

