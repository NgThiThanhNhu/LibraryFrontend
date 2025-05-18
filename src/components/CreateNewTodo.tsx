import { Button, TextField } from '@mui/material'
import  { type ChangeEvent } from 'react'


type Props ={
    newTodoString: string;
    newToDoChange: (e: ChangeEvent<HTMLInputElement>)=>void;
    onAddingBtnClick: ()=>void;
}
export const CreateNewTodo = ({
    newTodoString,
    newToDoChange,
    onAddingBtnClick
}: Props) => {
  return (
  
      <div>
        <TextField size="small" value ={newTodoString} onChange={newToDoChange}/>
        <Button variant="contained" onClick={onAddingBtnClick}>Thêm</Button>
      </div>
      
  )
}
