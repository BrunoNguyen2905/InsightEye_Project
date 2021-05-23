import networkRoutes from "./scenes/network/routes";
import { IRoutes } from "./components/TabRoute/types/Routes";

const routes = {
  networkRoutes
};

type FinalRoute = typeof routes;
export type FinalRouteKey = keyof FinalRoute;

const finalRoutes = routes as { [key in FinalRouteKey]: IRoutes };

export default finalRoutes;
