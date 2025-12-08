import { useState } from "react"

const AddTaskForm = ({addTask}) =>{

    const [userInput, setUserInput] = useState("")
    const [newDate, setNewDate] = useState("");

    const handleChange = (e) =>{
        setUserInput(e.target.value)
    }
    const handleDateChange = (e) => {
        setNewDate(e.target.value);
    }
    const submit = (e) =>{
        e.preventDefault()
        addTask({ text: userInput, date: newDate })
        setUserInput("")
        setNewDate("")
    }
    
    return (
        <form action ="" onSubmit={submit}>
            <input 
            type = "text" 
            placeholder = "feed my dog"
            value={userInput}
            onChange={handleChange}
            />
            <input 
                    type="date" 
                    value={newDate}
                    onChange={handleDateChange}
                />
            <input type="submit" value="add" />
        </form>
    )
}
export default AddTaskForm