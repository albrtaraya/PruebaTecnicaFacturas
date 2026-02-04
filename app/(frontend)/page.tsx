import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex w-full justify-center pt-4">
      <div className="container py-4 px-4 flex justify-between items-center flex-wrap">
        <div className="">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 max-md:text-3xl">Bienvenid@ a la app</h1>
          <p className="text-md text-gray-500 dark:text-gray-300">Esta es la prueba técnica, ingresa el identificador del cliente para ver sus facturas (ejemplo: 12345)</p>
        </div>
        <div className="flex">
            <Input className="border-gray-500 w-[300px] mr-2"/>
            <Button className="px-8">Buscar</Button>
        </div>
      </div>
    </main>
  );
}
