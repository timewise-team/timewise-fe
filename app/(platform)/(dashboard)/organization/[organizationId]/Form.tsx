"use client";
import { create } from "@/actions/createBoard";
import React from "react";
import FormInput from "./FormInput";
import FormButton from "./FormButton";

const Form = () => {
  return (
    <form action={create}>
      <div className="flex flex-col space-y-2">
        <FormInput />
      </div>
      <FormButton title="Submit" />
    </form>
  );
};

export default Form;
