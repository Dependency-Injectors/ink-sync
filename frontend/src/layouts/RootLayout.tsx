import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className=" min-h-screen dark:text-gray-50">
      <div className="fixed inset-0 -z-10 bg-linear-to-bl from-gray-200 to-gray-300 dark:from-gray-950 dark:to-petrol-950" />

      <Outlet />
    </div>
  );
};
export default RootLayout;
