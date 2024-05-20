import React from 'react';
import Task from './Task';

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Task Manager</h1>
      <Task onSave={() => window.location.reload()} />
      {/* <TaskList /> */}
    </div>
  );
};

export default App;
