"use client";
import { Button } from "@/components/ui/Button";
import React from "react";
import { useFormStatus } from "react-dom";

interface Props {
  title: string;
  className?: string;
}

const FormButton = ({ title, className }: Props) => {
  const { pending } = useFormStatus();
  return (
    <>
      <Button className={className} disabled={pending} type="submit">
        {title}
      </Button>
    </>
  );
};

export default FormButton;
