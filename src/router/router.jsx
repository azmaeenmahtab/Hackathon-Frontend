import {
    createBrowserRouter
} from "react-router";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/home",
                element: <Home />
            },
            
            {
                element: <ProtectedRoute />, // only these routes are protected
                children: [
                    // { path: "/dashboard", element: <Dashboard /> },
                     
                ]
            }
        ]
    }
]);
