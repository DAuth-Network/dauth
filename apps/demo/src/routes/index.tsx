import { createBrowserRouter } from "react-router-dom"
import Sdk from "../pages/sdk";
import Dev from "../pages/stress";
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
        path: "/stress",
        element: <Dev />,
    },
    {
        path: "/redirect/twitter",
        element: <TwitterRedirect />
    }
]);
export default routers;