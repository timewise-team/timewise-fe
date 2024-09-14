import React from "react";

const OrganizationIdPage = () => {
  async function create(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;

    // await fetch(`/api/boards`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ title }),
    // });
  }

  return (
    <div>
      <form action={create}>
        <input
          id="title"
          name="title"
          required
          placeholder="Enter board title"
          className="border-black border p-1"
        />
      </form>
    </div>
  );
};

export default OrganizationIdPage;
