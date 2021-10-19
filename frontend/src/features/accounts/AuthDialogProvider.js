import * as React from "react";
import AuthDialog from "./AuthDialog";

const AuthDialogContext = React.createContext();

export default function AuthDialogProvider({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mode, setMode] = React.useState("login");

  const show = React.useCallback((mode) => {
    setIsOpen(true);
    setMode(mode ? mode : "login");
  }, []);

  const hide = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthDialogContext.Provider value={show}>
      {children}
      <AuthDialog isOpen={isOpen} mode={mode} show={show} hide={hide} />
    </AuthDialogContext.Provider>
  );
}

export const useAuthDialog = () => {
  const context = React.useContext(AuthDialogContext);
  if (context === undefined) {
    throw new Error("useAuthDialog must be used within an AuthDialogProvider");
  }
  return context;
};
