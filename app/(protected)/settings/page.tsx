import { auth, signOut } from "@/auth";
import React from "react";

const SettingPage = async () => {
  const sesstion = await auth();
  return (
    <div>
      <h1>Setting Page</h1>
      <p>Session: {JSON.stringify(sesstion)}</p>

      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <button type="submit">Signout</button>
      </form>
    </div>
  );
};

export default SettingPage;
