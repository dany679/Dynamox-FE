"use client";
import { cn } from "@/lib/utils";

import { Heading } from "@/components/Heading";
import InputPassword from "@/components/inputs/password";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { formSchema } from "./constants";
interface IUser {
  name: string;
  email: string;
  password: string;
}

export default function UserRegisterForm() {
  const [hydrated, setHydrated] = useState(false);

  const router = useRouter();

  const onSubmitting = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await signIn<"credentials">("credentials", {
        ...values,
        callbackUrl: "/",
        redirect: true,
      });
      if (res?.ok) router.push("/");
    } catch (error) {
    } finally {
      form.reset();
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const { register, control } = form;
  const { isSubmitting, errors } = form.formState;
  useEffect(() => {
    // This forces a rerender, so the date is rendered
    // the second time but not the first
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  return (
    <div className={cn("flex flex-col w-full m-10 max-w-md gap-4")}>
      <Heading.title title="Login" description="Faça login ou crie sua conta" />
      <Box
      // sx={{
      //   "& > :not(style)": { m: 10, width: "50ch" },
      // }}
      >
        <form onSubmit={form.handleSubmit(onSubmitting)}>
          <Stack spacing={2} className="border-2 border-red-500/900  ">
            <TextField
              className="border-1 border-r-emerald-400"
              {...register("email", {
                required: "Email é obrigatorio",
              })}
              helperText={errors.email?.message}
              FormHelperTextProps={{ id: "email-helper-id" }}
              error={!!errors.email}
              label="Email"
              type="email"
              variant="outlined"
            />

            <InputPassword name="password" label="Senha" register={register} error={errors.password} />

            <Button type="submit" disabled={isSubmitting} variant="contained" className="col-span-12  w-full  mt-4  ">
              {isSubmitting ? (
                <Box sx={{ width: "100%", py: 1 }}>
                  <LinearProgress />
                </Box>
              ) : (
                " Enviar"
              )}
            </Button>
          </Stack>
        </form>
        <Stack direction="row" width={"100%"} justifyContent="flex-end" mt={2}>
          <Typography mr={1}>Ainda não possui conta?</Typography>
          <Link href="/registrar">
            {" "}
            <Typography color="blue">Registre-se</Typography>
          </Link>
        </Stack>
      </Box>
      <DevTool control={control} />
    </div>
  );
}
