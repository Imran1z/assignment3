import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000'; // Set the base URL for axios


const TaskForm = () => {
    const [taskNumber, setTaskNumber] = useState('');
    const [timeEstimate, setTimeEstimate] = useState('');
    const [estimateNotes, setEstimateNotes] = useState('');
    const [actualHours, setActualHours] = useState('');
    const [notes, setNotes] = useState('');
    const [taskSubmittedSuccessfully, setTaskSubmittedSuccessfully] = useState(false);


    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);


    
  
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
    }, []);
  
    const completeTask = async (task) => {
      const totalHours = prompt('Enter total hours:');
      const finalNotes = prompt('Enter final notes:');
      if (totalHours && finalNotes) {
        try {
          await axios.post(`/api/tasks/${task._id}/complete`, { totalHours, finalNotes });
          // Update the task in the state to mark it as completed
          setTasks(tasks.map(t => t._id === task._id ? { ...t, completed: true } : t));
        } catch (error) {
          console.error('Error completing task:', error);
        }
      }
    };
    
    const editTask = (task) => {
      setSelectedTask(task);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        // Make a POST request to save the task in the database
        await axios.post('/api/tasks', {
          taskNumber,
          timeEstimate,
          estimateNotes,
          actualHours,
          notes
        });
        // Set the taskSubmittedSuccessfully state variable to true
        setTaskSubmittedSuccessfully(true);
        // Optionally, you can add a success message or redirect the user
      } catch (error) {
        console.error('Error saving task:', error);
        // Optionally, you can display an error message to the user
      }
    };
  
    useEffect(() => {
      // Clear form fields after successful submission
      if (taskSubmittedSuccessfully) {
        setTaskNumber('');
        setTimeEstimate('');
        setEstimateNotes('');
        setActualHours('');
        setNotes('');
        // Reset taskSubmittedSuccessfully to prepare for the next submission
        setTaskSubmittedSuccessfully(false);
      }
    }, []);

  return (
    <>

    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskNumber">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeEstimate">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estimateNotes">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="actualHours">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <ul className="space-y-4">
        {tasks.map(task => (
          <li key={task._id} className="p-4 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">{task.taskNumber}</div>
                <div className="text-sm text-gray-500">{task.timeEstimate} hours</div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => editTask(task)} // Set the selected task here
                  className="py-1 px-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                {!task.completed && (
                  <button
                    onClick={() => completeTask(task)}
                    className="py-1 px-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Complete Task
                  </button>
                )}
              </div>
            </div>
            {/* Conditionally render the TaskForm component */}
            {selectedTask && selectedTask._id === task._id && (
                
setSelectedTask(task)            )}
          </li>
        ))}
      </ul>
    </div>




    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <ul className="space-y-4">
        {tasks.map(task => (
          <li key={task._id} className="p-4 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">{task.taskNumber}</div>
                <div className="text-sm text-gray-500">{task.timeEstimate} hours</div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => editTask(task._id)}
                  className="py-1 px-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                {!task.completed && (
                  <button
                    onClick={() => completeTask(task._id)}
                    className="py-1 px-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default TaskForm;
