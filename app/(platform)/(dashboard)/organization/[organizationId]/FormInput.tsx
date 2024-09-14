"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormStatus } from "react-dom";

interface Props {
  error?: {
    title?: string[];
  };
}

const FormInput = ({ error }: Props) => {
  const { pending } = useFormStatus();
  return (
    <div>
      <Input
        id="title"
        name="title"
        required
        placeholder="Enter board title"
        disabled={pending}
      />
      {error?.title && <p>{error.title[0]}</p>}
    </div>
  );
};

export default FormInput;
