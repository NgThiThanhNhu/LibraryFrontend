import { Button } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const Icon = ({isCompleted, updateIsCompleted, todoId}: {isCompleted: boolean; updateIsCompleted: (todoId: string) => void; todoId: string}) =>{
    return <div onClick={()=>updateIsCompleted(todoId)}>
        {
        isCompleted ? <CheckBoxIcon/> :  <CheckBoxOutlineBlankIcon/>
        }
        </div>

}

export const Todo = ({name, isCompleted, updateIsCompleted, todoId}: {name: string; isCompleted: boolean; updateIsCompleted: (todoId: string)=> void; todoId: string}) => {
  return (
     <Button style = {{justifyContent: 'space-between'}} fullWidth ={true} endIcon={<Icon todoId = {todoId} isCompleted = {isCompleted} updateIsCompleted = {updateIsCompleted}/>}>{name}</Button>
  )
}
