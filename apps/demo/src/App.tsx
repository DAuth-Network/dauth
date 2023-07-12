import {RouterProvider } from "react-router-dom";
import routers from "./routes/index.tsx";

function App() {


  return (
    <div className="App p-10">
      <RouterProvider router={routers} />
    </div>
  );

}

export default App;

