"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Table } from "@/components/table/table";

interface SearchForm {
  customerId: string;
}

export default function Home() {
  const { addCustomer } = useInvoice();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchForm>();

  const onSubmit = async (data: SearchForm) => {
    await addCustomer(data.customerId);
    reset();
  };

  return (
    <>
      <main className="flex w-full justify-center pt-4">
        <div className="container py-4 px-4 flex justify-between items-center flex-wrap max-md:justify-center ">
          <div className={`transition-all duration-500 ease-out ${showWelcome ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 max-md:text-3xl">
              Bienvenid@ a la app
            </h1>
            <p className="text-md text-gray-500 dark:text-gray-400 mt-2">
              Esta es la prueba técnica, ingresa el identificador del cliente para
              ver sus facturas (ejemplo: 123, 456, 789, 1011, 1213, 1415, 1617 o 1819).<br/>
              Luego haga clic sobre una card o el boton de billetera para pagar la factura. <br/>
              Use los filtros para ver las facturas que puedan interesarle. 
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col max-md:mt-8 transition-all duration-500 ease-out delay-100 ${showWelcome ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <div className="flex">
              <Input
                className="border-gray-500 w-[300px] mr-2"
                placeholder="ID del cliente"
                {...register("customerId", {
                  required: "El campo es obligatorio",
                  minLength: {
                    value: 2,
                    message: "Debe tener al menos 2 caracteres",
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: "Solo se permiten números",
                  },
                })}
              />
              <Button type="submit" className="px-8">
                Buscar
              </Button>
            </div>
            {errors.customerId && (
              <span className="text-sm text-red-500 mt-1">
                {errors.customerId.message}
              </span>
            )}
          </form>
        </div>
      </main>
      <Table />
    </>
  );
}
