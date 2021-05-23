import * as React from "react";
import Dashboard from "../../containers/layouts/Dashboard";
import DashboardNoDrawer from "../../containers/layouts/DashboardNoDrawer";
import Full from "../../containers/layouts/Full";
import IAuth from "../../types/Auth";
import FloatingVideoManagement from "../../containers/video/FloatingVideoManagement";
import RouteUri from "../../helpers/routeUri";
import paths from "../../paths";
import ConfirmDialog from "../Dialog/Confirm";
import { ILib } from "src/scenes/lib/types";
import SectionLoading from "../SectionLoading";
export interface IPersistentDrawerProps {
  auth: IAuth;
  uri: RouteUri;
  children: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
}

export interface IPersistentDrawerProps {
  auth: IAuth;
  uri: RouteUri;
  children: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
  currentLib: ILib | undefined;
  libActive: boolean;
  setActive: (status: boolean) => void;
}
interface IStates {
  isOpenActiveDialog: boolean;
}
class Layout extends React.Component<IPersistentDrawerProps, IStates> {
  public state = {
    isOpenActiveDialog: false
  };
  private closeConfirmInvite = (result: boolean) => {
    this.props.setActive(true);
    this.setState({
      isOpenActiveDialog: false
    });
  };
  public componentDidUpdate(prevProps: IPersistentDrawerProps) {
    if (
      (prevProps.currentLib &&
        this.props.currentLib &&
        prevProps.currentLib.id !== this.props.currentLib.id) ||
      (!prevProps.currentLib && this.props.currentLib)
    ) {
      if (
        !this.state.isOpenActiveDialog &&
        this.props.currentLib.active === false
      ) {
        this.setState({
          isOpenActiveDialog: true
        });
      }
    }
    if (!this.state.isOpenActiveDialog && this.props.libActive === false) {
      this.setState({
        isOpenActiveDialog: true
      });
    }
  }
  public render() {
    const { auth, children, uri } = this.props;
    if (!auth.isAuth || !auth.account) {
      return <Full>{children}</Full>;
    }

    if (uri.value.indexOf(paths.lib) === 0) {
      return (
        <div>
          <DashboardNoDrawer account={auth.account}>
            {children}
          </DashboardNoDrawer>
          <ConfirmDialog
            title="Active Library"
            isOpen={this.state.isOpenActiveDialog}
            content={
              <span>
                Your library is currently inactive. You could re-active your
                library from{" "}
                <a href="//shop.ins8.us/account/subscriptions" target="_blank">
                  here
                </a>{" "}
              </span>
            }
            onClose={this.closeConfirmInvite}
            isConfirm={true}
            confirmText="Close"
          />
        </div>
      );
    }

    return (
      <div>
        <FloatingVideoManagement />
        <Dashboard account={auth.account}>{children}</Dashboard>
        <ConfirmDialog
          title="Active Library"
          isOpen={this.state.isOpenActiveDialog}
          isConfirm={true}
          content={
            <span>
              Your library is currently inactive. You could re-active your
              library from{" "}
              <a href="//shop.ins8.us/account/subscriptions" target="_blank">
                here
              </a>{" "}
            </span>
          }
          onClose={this.closeConfirmInvite}
          confirmText="Close"
        />
      </div>
    );
  }
}
const LoadingLayout = ({ isLoading, ...props }: any) => (
  <div>
    {isLoading && (
      <div
        style={{
          position: "absolute",
          zIndex: 1000000,
          width: "100%"
        }}
      >
        <SectionLoading />
      </div>
    )}
    <Layout {...props} />
  </div>
);
export default LoadingLayout;
