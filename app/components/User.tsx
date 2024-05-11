import { es } from "@lib/dictionaries";
import type { User } from "@lib/types";

export default function User({ user }: { user: User }) {
  const { mainTitle } = es;
  const { image_url, name } = user;
  return (
    <div className="w-full sm:w-1/2 sm:pl-0">
      <div className="flex flex-row justify-end sm:justify-center items-center text-left gap-12">
        <img
          src={image_url}
          alt="Imagen de perfil del usuario"
          className="block rounded-full size-20 xl:size-32 2xl:size-40"
        ></img>
        <h1 className="hidden sm:block text-palette-500 xl:text-7xl 2xl:text-8xl font-normal m-0 p-0">
          <p className="xl:text-6xl 2xl:text-7xl text-palette-100 font-thin">
            {mainTitle},
          </p>
          {name.split(" ")[0]}
        </h1>
      </div>
    </div>
  );
}