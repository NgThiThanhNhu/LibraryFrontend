
import type { TodoTypee } from "../pages/TodoPage";
import { Todo } from "../types/Todo"


export const TodoList = ({todoList, updateIsCompleted}: {todoList: TodoTypee[];
    updateIsCompleted: (todoId: string)=> void;
}) => {
  return (
    <div>
      {todoList.map((todo) =>{
        return <Todo todoId = {todo.id} key = {todo.id} name={todo.name} isCompleted = {todo.isCompleted} updateIsCompleted = {updateIsCompleted}/>;
        })}
       
    </div>
  );
};
