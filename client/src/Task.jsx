import React, { useEffect, useState } from "react";
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000'; // Set the base URL for axios

const Task = () => {
  const [taskNumber, setTaskNumber] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [estimateNotes, setEstimateNotes] = useState('');
  const [actualHours, setActualHours] = useState('');
  const [notes, setNotes] = useState('');
  const [error, seterror] = useState(false);
  const [Edit, setEdit] = useState(false)


  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [tasks]);

  const completeTask = async (taskId) => {
    const totalHours = prompt('Enter total hours:');
    const finalNotes = prompt('Enter final notes:');
    if (totalHours && finalNotes) {
      try {
        await axios.post(`/api/tasks/${taskId}/complete`, { totalHours, finalNotes });
        // Update the task in the state to mark it as completed
        setTasks(tasks.map(task => task._id === taskId ? { ...task, completed: true } : task));
      } catch (error) {
        console.error('Error completing task:', error);
      }
    }
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find(task => task._id === taskId);
    setTaskNumber(taskToEdit.taskNumber);
    setTimeEstimate(taskToEdit.timeEstimate);
    setEstimateNotes(taskToEdit.estimateNotes);
    setActualHours(taskToEdit.actualHours);
    setNotes(taskToEdit.notes);  };
  
  

    
  
    const normalizeTime = (time) => {
      if (isNaN(time) || time < 0) {
        throw new Error('Invalid time format. Please enter a non-negative number representing hours and minutes.');
      }
  
      const hours = Math.floor(time);
      let minutes = (time - hours) * 100;
  
      minutes = Math.round(minutes) % 60;
      minutes = minutes.toString().padStart(2, '0');

      console.log(`${hours}.${minutes}`)
  
      return `${hours}.${minutes}`;
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        seterror(false);
  
        // Validate actualHours format
        const isValidFormat = /^\d+(\.\d{1,2})?$/; // Regex pattern for a number with up to 2 decimal places
        if (!isValidFormat.test(actualHours)) {
          throw new Error('Invalid time format. Please enter time in hours with up to 2 decimal places.');
        }
  
        // Normalize the actualHours value
        const normalizedActualHours = normalizeTime(parseFloat(actualHours));
  
        // Check if task with the same ID exists in the tasks array
        const existingTask = tasks.find(task => task.taskNumber === taskNumber);
        if (existingTask) {
          // If task with the same ID exists, update it
          await axios.put(`/api/tasks/${existingTask._id}`, {
            taskNumber,
            timeEstimate,
            estimateNotes,
            actualHours: normalizedActualHours,
            notes
          });
        } else {
          // If task with the same ID doesn't exist, create a new task
          await axios.post('/api/tasks', {
            taskNumber,
            timeEstimate,
            estimateNotes,
            actualHours: normalizedActualHours,
            notes
          });
        }
  
        // Clear form fields after successful submission
        setTaskNumber('');
        setTimeEstimate('');
        setEstimateNotes('');
        setActualHours('');
        setNotes('');
        // Optionally, you can add a success message or redirect the user
      } catch (error) {
        console.error('Error saving task:', error);
        seterror(true);
        // Optionally, you can display an error message to the user
      }
    };
    
   
    
    

  return (
    <>
    <div className="max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="taskNumber"
          >
            Task Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="taskNumber"
            type="text"
            placeholder="L#####"
            value={taskNumber}
            onChange={(e) => setTaskNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="timeEstimate"
          >
            Time Estimate (hours)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="timeEstimate"
            type="number"
            placeholder="0.00"
            step="0.01"
            value={timeEstimate}
            onChange={(e) => setTimeEstimate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="estimateNotes"
          >
            Estimate Notes
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="estimateNotes"
            placeholder="Enter estimate notes..."
            value={estimateNotes}
            onChange={(e) => setEstimateNotes(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="actualHours"
          >
            Actual Hours (hours)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="actualHours"
            type="number"
            placeholder="0.00"
            step="0.01"
            value={actualHours}
            onChange={(e) => setActualHours(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="notes"
          >
            Notes
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="notes"
            placeholder="Enter notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
          onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
          Submit
          
          </button>
        </div>
      </form>
    </div>

    {error&&(
      <h1 className="text-red-600">Duplicate Task cannot be saved</h1>
    )}


    <div className="p-4">
  <h1 className="text-2xl font-bold mb-4">Task List</h1>
  <ul className="space-y-4">
    {tasks.map(task => (
      <li key={task._id} className="p-4 border rounded-md shadow-sm bg-white">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-semibold"><span className="text-lg text-black">Task No. : </span>{task.taskNumber}</div>
            <div className="text-sm text-gray-500"><span className="text-lg text-black" >Estimated Time : </span>{task.timeEstimate} hours</div>
            <div className="text-sm text-gray-500"><span className="text-lg text-black">Notes : </span> {task.notes}</div> {/* Added line for notes */}
          </div>
          <div className="space-x-2">
            {!task.completed && (
              <button
              onClick={() => { 
                editTask(task._id);
                setEdit(true);
              }}

                className="py-1 px-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
            )}
            <button
  onClick={() => completeTask(task._id)}
  className={`py-1 px-3 text-sm font-medium text-white rounded-md  ${
    task.completed ? 'bg-red-600 ' : 'bg-green-600'
  }`}
  disabled={task.completed} // Disable the button if task is completed
>
  {task.completed ? 'Completed' : 'Complete'}
</button>

          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

    </>





  );
};

export default Task;
