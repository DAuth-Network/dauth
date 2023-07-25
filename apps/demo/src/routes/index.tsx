import { createBrowserRouter } from "react-router-dom"
import Sdk from "../pages/sdk";
import { Home } from "../pages";
import TwitterRedirect from "../pages/TwitterRedirect";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/sdk",
        element: <Sdk />,
    },
    {
        path: "/redirect/twitter",
        element: <TwitterRedirect />
    }
]);
export default routers;